// ============================================
// Cinema Muchatlu - Game Engine REST API Routes
// ============================================

const express = require('express');
const router = express.Router();
const { Game, GameQuestion, GameSession, GameLeaderboard, UserEvent } = require('./models');
const { authMiddleware, optionalAuth } = require('./middleware');
const { processUserEvent } = require('./recommendationEngine');
const {
    startSoloGame,
    submitSoloAnswer
} = require('./gameEngine');

async function recordGameEvent({ userId, sessionId, eventType, targetType, targetId, metadata }) {
    try {
        await UserEvent.create({
            userId: userId || null,
            sessionId: sessionId || null,
            eventType,
            targetType: targetType || 'game',
            targetId: String(targetId || 'game'),
            metadata: metadata || {}
        });
        if (userId) {
            await processUserEvent(userId, eventType, targetType, targetId, metadata);
        }
    } catch (e) {
        console.warn('Game event recording notice:', e.message);
    }
}

// 1. Get available games
router.get('/', async (req, res) => {
    try {
        const games = await Game.find({ isActive: true }).lean();
        res.json(games);
    } catch (err) {
        console.error('Error fetching games:', err);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

// 2. Start a Solo Game
router.post('/solo/start', optionalAuth, async (req, res) => {
    try {
        const { gameType, difficulty, totalRounds, displayName, avatarUrl } = req.body;
        const userId = req.user ? req.user.id : null;
        const sessionId = req.headers['x-session-id'] || req.body.sessionId || null;
        const playerDisplayName = req.user ? (req.user.name || req.user.username) : (displayName || 'Guest Player');
        const playerAvatar = req.user ? (req.user.avatar || '') : (avatarUrl || '');

        const result = await startSoloGame({
            gameType,
            difficulty: difficulty || 'medium',
            totalRounds: totalRounds || 10,
            userId,
            sessionId,
            displayName: playerDisplayName,
            avatarUrl: playerAvatar
        });

        // Telemetry: game_start
        await recordGameEvent({
            userId,
            sessionId,
            eventType: 'game_start',
            targetType: 'game',
            targetId: gameType,
            metadata: {
                gameType,
                mode: 'SOLO',
                difficulty,
                totalRounds: result.totalRounds
            }
        });

        res.json(result);
    } catch (err) {
        console.error('Error starting solo game:', err);
        res.status(400).json({ error: err.message || 'Failed to start game' });
    }
});

// 3. Submit Answer for Solo Game
router.post('/solo/answer', optionalAuth, async (req, res) => {
    try {
        const { sessionId, selectedOption, timeTakenSeconds } = req.body;
        if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

        const userId = req.user ? req.user.id : null;
        const playerKey = userId ? String(userId) : (req.headers['x-session-id'] || req.body.playerKey || 'solo_player');

        const result = await submitSoloAnswer({
            sessionId,
            playerKey,
            selectedOption,
            timeTakenSeconds: parseFloat(timeTakenSeconds) || 0
        });

        // Telemetry: game_answer & game_answer_correct / game_answer_wrong
        const meta = result.metadata || {};
        try {
            // Base answer event
            await recordGameEvent({
                userId,
                sessionId: req.headers['x-session-id'],
                eventType: 'game_answer',
                targetType: 'game_question',
                targetId: sessionId,
                metadata: {
                    gameType: result.gameType || 'game',
                    isCorrect: result.isCorrect,
                    pointsEarned: result.pointsEarned,
                    movieId: meta.movieId,
                    actorId: meta.actorId,
                    songId: meta.songId
                }
            });

            // Specific outcome event with entity linkage to boost user recommendations!
            await recordGameEvent({
                userId,
                sessionId: req.headers['x-session-id'],
                eventType: result.isCorrect ? 'game_answer_correct' : 'game_answer_wrong',
                targetType: meta.movieId ? 'movie' : (meta.actorId ? 'actor' : (meta.songId ? 'song' : 'game')),
                targetId: meta.movieId || meta.actorId || meta.songId || sessionId,
                metadata: {
                    movieId: meta.movieId,
                    actorId: meta.actorId,
                    songId: meta.songId,
                    pointsEarned: result.pointsEarned,
                    currentStreak: result.currentStreak
                }
            });

            // If game is completed
            if (result.isComplete && result.finalResults) {
                await recordGameEvent({
                    userId,
                    sessionId: req.headers['x-session-id'],
                    eventType: 'game_complete',
                    targetType: 'game',
                    targetId: sessionId,
                    metadata: {
                        score: result.finalResults.score,
                        correctAnswers: result.finalResults.correctAnswers,
                        totalRounds: result.finalResults.totalRounds,
                        accuracy: result.finalResults.accuracy,
                        bestStreak: result.finalResults.bestStreak
                    }
                });
            }
        } catch (telemErr) {
            console.warn('Telemetry error on answer:', telemErr.message);
        }

        res.json(result);
    } catch (err) {
        console.error('Error submitting solo answer:', err);
        res.status(400).json({ error: err.message || 'Failed to submit answer' });
    }
});

// 4. Solo Rematch
router.post('/solo/rematch', optionalAuth, async (req, res) => {
    try {
        const { prevSessionId } = req.body;
        const prevSession = await GameSession.findById(prevSessionId);
        if (!prevSession) return res.status(404).json({ error: 'Previous session not found' });

        const userId = req.user ? req.user.id : null;
        const sessionId = req.headers['x-session-id'] || null;

        const result = await startSoloGame({
            gameType: prevSession.gameType,
            difficulty: prevSession.difficulty,
            totalRounds: prevSession.totalRounds,
            userId,
            sessionId,
            displayName: req.user ? (req.user.name || req.user.username) : 'Player',
            avatarUrl: req.user ? (req.user.avatar || '') : ''
        });

        // Telemetry: game_rematch
        try {
            await processUserEvent({
                userId,
                sessionId,
                eventType: 'game_rematch',
                targetType: 'game',
                targetId: prevSession.gameType
            });
        } catch (e) {}

        res.json(result);
    } catch (err) {
        console.error('Error in rematch:', err);
        res.status(400).json({ error: err.message || 'Failed to restart game' });
    }
});

// 5. Leaderboard (Daily, Weekly, All Time)
router.get('/leaderboard', async (req, res) => {
    try {
        const { timeframe = 'all', gameType } = req.query;
        const query = {};

        if (gameType && gameType !== 'all') {
            query.gameType = gameType;
        }

        const now = new Date();
        if (timeframe === 'daily') {
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            query.createdAt = { $gte: startOfDay };
        } else if (timeframe === 'weekly') {
            const startOfWeek = new Date(now.setDate(now.getDate() - 7));
            query.createdAt = { $gte: startOfWeek };
        }

        const leaders = await GameLeaderboard.find(query)
            .sort({ score: -1, accuracy: -1, createdAt: -1 })
            .limit(30)
            .lean();

        res.json(leaders);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

// ============================================
// ADMIN QUESTION MANAGEMENT
// ============================================

// Middleware to check admin role or admin key
function adminOnly(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    if (adminKey === 'muchatlu_admin' || adminKey === process.env.ADMIN_KEY) {
        return next();
    }
    return res.status(403).json({ error: 'Admin access required' });
}

// Get all questions (Admin)
router.get('/questions', optionalAuth, adminOnly, async (req, res) => {
    try {
        const { gameType, difficulty, search, page = 1, limit = 50 } = req.query;
        const query = {};
        if (gameType) query.gameType = gameType;
        if (difficulty) query.difficulty = difficulty;
        if (search) {
            query.$or = [
                { prompt: { $regex: search, $options: 'i' } },
                { correctAnswer: { $regex: search, $options: 'i' } }
            ];
        }

        const questions = await GameQuestion.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit, 10))
            .lean();

        const total = await GameQuestion.countDocuments(query);

        res.json({
            questions,
            total,
            page: parseInt(page, 10),
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error('Admin get questions error:', err);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// Create question (Admin)
router.post('/questions', optionalAuth, adminOnly, async (req, res) => {
    try {
        const {
            gameType,
            questionType,
            prompt,
            clues,
            mediaUrl,
            audioPreviewUrl,
            options,
            correctAnswer,
            explanation,
            difficulty,
            movieId,
            actorId,
            songId
        } = req.body;

        if (!options || options.length !== 4) {
            return res.status(400).json({ error: 'Options must contain exactly 4 choices' });
        }
        if (!options.includes(correctAnswer)) {
            return res.status(400).json({ error: 'correctAnswer must be one of the 4 options' });
        }

        const q = new GameQuestion({
            gameType,
            questionType: questionType || 'custom',
            prompt,
            clues: clues || [],
            mediaUrl: mediaUrl || '',
            audioPreviewUrl: audioPreviewUrl || '',
            options,
            correctAnswer,
            explanation: explanation || '',
            difficulty: difficulty || 'medium',
            movieId: movieId || '',
            actorId: actorId || '',
            songId: songId || '',
            isActive: true
        });

        await q.save();
        res.status(201).json(q);
    } catch (err) {
        console.error('Admin add question error:', err);
        res.status(400).json({ error: err.message || 'Failed to create question' });
    }
});

// Update question (Admin)
router.put('/questions/:id', optionalAuth, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await GameQuestion.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ error: 'Question not found' });
        res.json(updated);
    } catch (err) {
        console.error('Admin update question error:', err);
        res.status(400).json({ error: err.message || 'Failed to update question' });
    }
});

// Delete question (Admin)
router.delete('/questions/:id', optionalAuth, adminOnly, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await GameQuestion.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: 'Question not found' });
        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        console.error('Admin delete question error:', err);
        res.status(500).json({ error: 'Failed to delete question' });
    }
});

// Game Analytics (Admin)
router.get('/analytics', optionalAuth, adminOnly, async (req, res) => {
    try {
        const totalSessions = await GameSession.countDocuments();
        const completedSessions = await GameSession.countDocuments({ status: 'completed' });
        const abandonedSessions = await GameSession.countDocuments({ status: 'active', createdAt: { $lt: new Date(Date.now() - 3600000) } });
        
        const questionStats = await GameQuestion.aggregate([
            { $group: { _id: '$gameType', count: { $sum: 1 } } }
        ]);

        const leaders = await GameLeaderboard.aggregate([
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: '$score' },
                    avgAccuracy: { $avg: '$accuracy' },
                    totalGamesPlayed: { $sum: 1 }
                }
            }
        ]);

        res.json({
            totalSessions,
            completedSessions,
            abandonedSessions,
            questionStats,
            averages: leaders[0] || { avgScore: 0, avgAccuracy: 0, totalGamesPlayed: 0 }
        });
    } catch (err) {
        console.error('Admin game analytics error:', err);
        res.status(500).json({ error: 'Failed to fetch game analytics' });
    }
});

module.exports = router;
