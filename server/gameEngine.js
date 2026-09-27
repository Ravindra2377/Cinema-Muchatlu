// ============================================
// Cinema Muchatlu - Reusable Game Engine
// Server-Authoritative Logic & Anti-Cheat
// ============================================

const { Game, GameQuestion, GameSession, GameLeaderboard, Movie, Music } = require('./models');

// Scoring Configuration
const SCORING = {
    BASE_CORRECT: 100,
    MAX_SPEED_BONUS: 50,
    STREAK_BONUS: 25, // Bonus points when streak >= 3
    DEFAULT_ROUND_TIME: 15 // Seconds
};

// Generates short 5-character room code (e.g. "K7P42")
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid 0, O, 1, I
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Sanitize question before sending to clients (NEVER expose correctAnswer!)
function sanitizeQuestion(q) {
    if (!q) return null;
    return {
        _id: q._id,
        gameType: q.gameType,
        questionType: q.questionType,
        prompt: q.prompt,
        clues: q.clues || [],
        mediaUrl: q.mediaUrl || null,
        audioPreviewUrl: q.audioPreviewUrl || null,
        options: q.options || [],
        difficulty: q.difficulty || 'medium',
        movieId: q.movieId || null,
        actorId: q.actorId || null,
        songId: q.songId || null,
        timeLimit: SCORING.DEFAULT_ROUND_TIME
    };
}

// Calculate server-authoritative score
function calculateScore(isCorrect, timeTakenSeconds, timeLimit = SCORING.DEFAULT_ROUND_TIME, currentStreak = 0) {
    if (!isCorrect) return { points: 0, speedBonus: 0, streakBonus: 0 };

    const safeTime = Math.min(Math.max(0, timeTakenSeconds), timeLimit);
    const timeRemaining = timeLimit - safeTime;
    const speedRatio = Math.max(0, timeRemaining / timeLimit);
    const speedBonus = Math.round(speedRatio * SCORING.MAX_SPEED_BONUS);
    const streakBonus = currentStreak >= 3 ? SCORING.STREAK_BONUS : 0;
    const points = SCORING.BASE_CORRECT + speedBonus + streakBonus;

    return { points, speedBonus, streakBonus };
}

// Start a Solo Game Session
async function startSoloGame({ gameType, difficulty = 'medium', totalRounds = 10, userId = null, sessionId = null, displayName = 'Guest Player', avatarUrl = '' }) {
    totalRounds = parseInt(totalRounds, 10) || 10;
    if (![5, 10, 15].includes(totalRounds)) totalRounds = 10;

    // Fetch random active questions for this gameType and difficulty
    let questions = await GameQuestion.aggregate([
        { $match: { gameType, difficulty, isActive: true } },
        { $sample: { size: totalRounds } }
    ]);

    // If not enough questions in exact difficulty, fallback to any difficulty for this gameType
    if (questions.length < totalRounds) {
        const fallback = await GameQuestion.aggregate([
            { $match: { gameType, isActive: true } },
            { $sample: { size: totalRounds } }
        ]);
        if (fallback.length > questions.length) {
            questions = fallback;
        }
    }

    if (questions.length === 0) {
        throw new Error(`No questions available yet for game "${gameType}". Run seed script.`);
    }

    const questionIds = questions.map(q => q._id);
    const playerKey = userId ? String(userId) : (sessionId || 'solo_player');

    const session = new GameSession({
        gameType,
        mode: 'SOLO',
        roomCode: null,
        hostPlayerKey: playerKey,
        status: 'active',
        difficulty,
        totalRounds: questions.length,
        currentRoundIndex: 0,
        roundTimeLimit: SCORING.DEFAULT_ROUND_TIME,
        roundStartedAt: new Date(),
        questions: questionIds,
        players: [{
            userId: userId ? String(userId) : null,
            sessionId: sessionId || null,
            displayName: displayName || 'Player',
            avatarUrl: avatarUrl || '',
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            isHost: true,
            connected: true
        }],
        rounds: [{
            roundIndex: 0,
            questionId: questionIds[0],
            startedAt: new Date(),
            answers: []
        }]
    });

    await session.save();

    return {
        sessionId: session._id,
        gameType: session.gameType,
        mode: session.mode,
        totalRounds: session.totalRounds,
        currentRound: 1,
        timeLimit: session.roundTimeLimit,
        question: sanitizeQuestion(questions[0])
    };
}

// Submit Answer for Solo Session
async function submitSoloAnswer({ sessionId, playerKey, selectedOption, timeTakenSeconds = 0 }) {
    const session = await GameSession.findById(sessionId).populate('questions');
    if (!session) throw new Error('Game session not found');
    if (session.status !== 'active') throw new Error('Game session is not active');

    const currentIdx = session.currentRoundIndex;
    const currentQuestion = session.questions[currentIdx];
    if (!currentQuestion) throw new Error('Invalid round question');

    const player = session.players.find(p => (p.userId && p.userId === playerKey) || p.sessionId === playerKey || p.isHost);
    if (!player) throw new Error('Player not found in session');

    // Anti-cheat: Check if player already answered this round
    const currentRound = session.rounds.find(r => r.roundIndex === currentIdx);
    if (currentRound && currentRound.answers.some(a => a.playerId === playerKey)) {
        throw new Error('Answer already submitted for this round');
    }

    const isCorrect = String(selectedOption || '').trim().toLowerCase() === String(currentQuestion.correctAnswer || '').trim().toLowerCase();
    
    // Streak calculations
    if (isCorrect) {
        player.currentStreak = (player.currentStreak || 0) + 1;
        if (player.currentStreak > (player.bestStreak || 0)) {
            player.bestStreak = player.currentStreak;
        }
        player.correctAnswers = (player.correctAnswers || 0) + 1;
    } else {
        player.currentStreak = 0;
        player.wrongAnswers = (player.wrongAnswers || 0) + 1;
    }

    const { points, speedBonus, streakBonus } = calculateScore(isCorrect, timeTakenSeconds, session.roundTimeLimit, player.currentStreak);
    player.score = (player.score || 0) + points;

    // Record round answer
    if (currentRound) {
        currentRound.endedAt = new Date();
        currentRound.answers.push({
            playerId: playerKey,
            selectedOption,
            answeredAt: new Date(),
            timeTakenSeconds,
            isCorrect,
            pointsEarned: points
        });
    }

    const isComplete = currentIdx + 1 >= session.totalRounds;
    let nextQuestion = null;

    if (!isComplete) {
        session.currentRoundIndex = currentIdx + 1;
        session.roundStartedAt = new Date();
        session.rounds.push({
            roundIndex: currentIdx + 1,
            questionId: session.questions[currentIdx + 1]._id,
            startedAt: new Date(),
            answers: []
        });
        nextQuestion = sanitizeQuestion(session.questions[currentIdx + 1]);
    } else {
        session.status = 'completed';
        session.completedAt = new Date();

        // Save to Leaderboard
        try {
            const accuracy = session.totalRounds > 0 ? Math.round((player.correctAnswers / session.totalRounds) * 100) : 0;
            await GameLeaderboard.create({
                userId: player.userId || null,
                displayName: player.displayName,
                avatarUrl: player.avatarUrl,
                gameType: session.gameType,
                mode: session.mode,
                score: player.score,
                correctCount: player.correctAnswers,
                totalRounds: session.totalRounds,
                accuracy,
                bestStreak: player.bestStreak
            });
        } catch (lbErr) {
            console.warn('Leaderboard save warning:', lbErr.message);
        }
    }

    await session.save();

    return {
        isCorrect,
        correctAnswer: currentQuestion.correctAnswer,
        explanation: currentQuestion.explanation || '',
        pointsEarned: points,
        speedBonus,
        streakBonus,
        currentStreak: player.currentStreak,
        totalScore: player.score,
        isComplete,
        currentRound: currentIdx + 1,
        totalRounds: session.totalRounds,
        nextQuestion,
        finalResults: isComplete ? {
            score: player.score,
            correctAnswers: player.correctAnswers,
            totalRounds: session.totalRounds,
            accuracy: Math.round((player.correctAnswers / session.totalRounds) * 100),
            bestStreak: player.bestStreak,
            gameType: session.gameType
        } : null,
        metadata: {
            movieId: currentQuestion.movieId,
            actorId: currentQuestion.actorId,
            songId: currentQuestion.songId
        }
    };
}

module.exports = {
    SCORING,
    generateRoomCode,
    sanitizeQuestion,
    calculateScore,
    startSoloGame,
    submitSoloAnswer
};
