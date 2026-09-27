// ============================================
// Cinema Muchatlu - Real-Time Multiplayer Socket.IO
// Authoritative Game Server with Rooms, Timers & Anti-Cheat
// ============================================

const { GameQuestion, GameSession, GameLeaderboard } = require('./models');
const { generateRoomCode, sanitizeQuestion, calculateScore, SCORING } = require('./gameEngine');
const { processUserEvent } = require('./recommendationEngine');

// In-memory room timers to manage authoritative countdowns per room
const activeTimers = new Map();

function gameSocket(io) {
    const gameNamespace = io.of('/game');

    gameNamespace.on('connection', (socket) => {
        console.log(`🎮 Game Socket connected: ${socket.id}`);

        // Helper: Leave current room
        const leaveCurrentRooms = () => {
            const rooms = Array.from(socket.rooms);
            rooms.forEach(room => {
                if (room !== socket.id) {
                    socket.leave(room);
                }
            });
        };

        // 1. CREATE ROOM
        socket.on('create_room', async (data, callback) => {
            try {
                const { gameType, difficulty = 'medium', totalRounds = 10, displayName = 'Host Player', avatarUrl = '', userId = null } = data;

                let roundsCount = parseInt(totalRounds, 10) || 10;
                if (![5, 10, 15].includes(roundsCount)) roundsCount = 10;

                // Pick questions
                let questions = await GameQuestion.aggregate([
                    { $match: { gameType, difficulty, isActive: true } },
                    { $sample: { size: roundsCount } }
                ]);

                if (questions.length < roundsCount) {
                    const fallback = await GameQuestion.aggregate([
                        { $match: { gameType, isActive: true } },
                        { $sample: { size: roundsCount } }
                    ]);
                    if (fallback.length > questions.length) {
                        questions = fallback;
                    }
                }

                if (questions.length === 0) {
                    return callback && callback({ error: 'No questions available for this game type.' });
                }

                const roomCode = generateRoomCode();
                leaveCurrentRooms();
                socket.join(roomCode);

                const session = new GameSession({
                    gameType,
                    mode: 'PRIVATE_MULTIPLAYER',
                    roomCode,
                    hostPlayerKey: socket.id,
                    status: 'waiting',
                    difficulty,
                    totalRounds: questions.length,
                    currentRoundIndex: 0,
                    roundTimeLimit: SCORING.DEFAULT_ROUND_TIME,
                    questions: questions.map(q => q._id),
                    players: [{
                        userId: userId || null,
                        sessionId: socket.id,
                        socketId: socket.id,
                        displayName: displayName || 'Host',
                        avatarUrl: avatarUrl || '',
                        score: 0,
                        correctAnswers: 0,
                        wrongAnswers: 0,
                        currentStreak: 0,
                        bestStreak: 0,
                        isHost: true,
                        connected: true
                    }],
                    rounds: []
                });

                await session.save();

                // Telemetry
                try {
                    await processUserEvent({
                        userId,
                        sessionId: socket.id,
                        eventType: 'game_room_created',
                        targetType: 'game',
                        targetId: roomCode,
                        metadata: { gameType, roomCode, difficulty, totalRounds: questions.length }
                    });
                } catch (e) {}

                if (callback) {
                    callback({
                        success: true,
                        roomCode,
                        session: {
                            id: session._id,
                            gameType: session.gameType,
                            roomCode: session.roomCode,
                            difficulty: session.difficulty,
                            totalRounds: session.totalRounds,
                            status: session.status,
                            players: session.players
                        }
                    });
                }
            } catch (err) {
                console.error('Error creating room:', err);
                if (callback) callback({ error: 'Failed to create room: ' + err.message });
            }
        });

        // 2. JOIN ROOM
        socket.on('join_room', async (data, callback) => {
            try {
                const { roomCode, displayName = 'Player', avatarUrl = '', userId = null } = data;
                const cleanCode = (roomCode || '').trim().toUpperCase();

                const session = await GameSession.findOne({ roomCode: cleanCode, status: { $in: ['waiting', 'active'] } });
                if (!session) {
                    return callback && callback({ error: 'Room not found or game already finished.' });
                }

                if (session.status === 'active') {
                    return callback && callback({ error: 'Game is already in progress. Wait for next match!' });
                }

                leaveCurrentRooms();
                socket.join(cleanCode);

                // Check if player already exists in session
                let player = session.players.find(p => (userId && p.userId === userId) || p.sessionId === socket.id);
                if (!player) {
                    player = {
                        userId: userId || null,
                        sessionId: socket.id,
                        socketId: socket.id,
                        displayName: displayName || `Player ${session.players.length + 1}`,
                        avatarUrl: avatarUrl || '',
                        score: 0,
                        correctAnswers: 0,
                        wrongAnswers: 0,
                        currentStreak: 0,
                        bestStreak: 0,
                        isHost: false,
                        connected: true
                    };
                    session.players.push(player);
                } else {
                    player.connected = true;
                    player.socketId = socket.id;
                    player.displayName = displayName || player.displayName;
                }

                await session.save();

                // Telemetry
                try {
                    await processUserEvent({
                        userId,
                        sessionId: socket.id,
                        eventType: 'game_room_joined',
                        targetType: 'game',
                        targetId: cleanCode,
                        metadata: { roomCode: cleanCode, gameType: session.gameType }
                    });
                } catch (e) {}

                // Broadcast updated player list to room
                gameNamespace.to(cleanCode).emit('room_updated', {
                    roomCode: cleanCode,
                    status: session.status,
                    players: session.players,
                    hostSocketId: session.players.find(p => p.isHost)?.socketId
                });

                if (callback) {
                    callback({
                        success: true,
                        session: {
                            id: session._id,
                            gameType: session.gameType,
                            roomCode: session.roomCode,
                            difficulty: session.difficulty,
                            totalRounds: session.totalRounds,
                            status: session.status,
                            players: session.players
                        }
                    });
                }
            } catch (err) {
                console.error('Error joining room:', err);
                if (callback) callback({ error: 'Failed to join room: ' + err.message });
            }
        });

        // 3. START GAME (Host Only)
        socket.on('start_game', async (data, callback) => {
            try {
                const { roomCode } = data;
                const session = await GameSession.findOne({ roomCode, status: 'waiting' }).populate('questions');
                if (!session) return callback && callback({ error: 'Active waiting room not found' });

                const hostPlayer = session.players.find(p => p.socketId === socket.id && p.isHost);
                if (!hostPlayer) return callback && callback({ error: 'Only the host can start the game' });

                session.status = 'active';
                session.currentRoundIndex = 0;
                session.roundStartedAt = new Date();
                session.rounds = [{
                    roundIndex: 0,
                    questionId: session.questions[0]._id,
                    startedAt: new Date(),
                    answers: []
                }];

                await session.save();

                if (callback) callback({ success: true });

                // Launch Round 1
                startMultiplayerRound(session, 0);
            } catch (err) {
                console.error('Error starting game:', err);
                if (callback) callback({ error: 'Failed to start game: ' + err.message });
            }
        });

        // 4. SUBMIT ANSWER
        socket.on('submit_answer', async (data, callback) => {
            try {
                const { roomCode, selectedOption, timeTakenSeconds } = data;
                const session = await GameSession.findOne({ roomCode, status: 'active' }).populate('questions');
                if (!session) return callback && callback({ error: 'Session not active' });

                const currentIdx = session.currentRoundIndex;
                const currentQuestion = session.questions[currentIdx];
                if (!currentQuestion) return callback && callback({ error: 'Invalid round' });

                const player = session.players.find(p => p.socketId === socket.id);
                if (!player) return callback && callback({ error: 'Player not recognized' });

                const currentRound = session.rounds.find(r => r.roundIndex === currentIdx);
                if (!currentRound) return callback && callback({ error: 'Round not found' });

                // Anti-cheat: prevent duplicate submission
                if (currentRound.answers.some(a => a.playerId === socket.id)) {
                    return callback && callback({ error: 'Answer already submitted for this round' });
                }

                const isCorrect = String(selectedOption || '').trim().toLowerCase() === String(currentQuestion.correctAnswer || '').trim().toLowerCase();

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

                currentRound.answers.push({
                    playerId: socket.id,
                    selectedOption,
                    answeredAt: new Date(),
                    timeTakenSeconds: parseFloat(timeTakenSeconds) || 0,
                    isCorrect,
                    pointsEarned: points
                });

                await session.save();

                if (callback) {
                    callback({
                        success: true,
                        isCorrect,
                        pointsEarned: points,
                        speedBonus,
                        streakBonus,
                        totalScore: player.score
                    });
                }

                // Notify room that this player answered (without revealing their choice to prevent copying)
                gameNamespace.to(roomCode).emit('player_answered', {
                    playerId: socket.id,
                    displayName: player.displayName,
                    answeredCount: currentRound.answers.length,
                    totalConnected: session.players.filter(p => p.connected).length
                });

                // If all connected players have submitted, finish round immediately without waiting for timer
                const connectedCount = session.players.filter(p => p.connected).length;
                if (currentRound.answers.length >= connectedCount) {
                    clearRoomTimer(roomCode);
                    finishMultiplayerRound(session, currentIdx);
                }
            } catch (err) {
                console.error('Error submitting multiplayer answer:', err);
                if (callback) callback({ error: 'Failed to submit answer: ' + err.message });
            }
        });

        // 5. REMATCH
        socket.on('rematch', async (data, callback) => {
            try {
                const { roomCode } = data;
                const session = await GameSession.findOne({ roomCode }).populate('questions');
                if (!session) return callback && callback({ error: 'Session not found' });

                // Reset scores and streaks for rematch
                session.players.forEach(p => {
                    p.score = 0;
                    p.correctAnswers = 0;
                    p.wrongAnswers = 0;
                    p.currentStreak = 0;
                });

                // Pick fresh set of questions
                const freshQuestions = await GameQuestion.aggregate([
                    { $match: { gameType: session.gameType, difficulty: session.difficulty, isActive: true } },
                    { $sample: { size: session.totalRounds } }
                ]);

                if (freshQuestions.length > 0) {
                    session.questions = freshQuestions.map(q => q._id);
                }

                session.status = 'active';
                session.currentRoundIndex = 0;
                session.roundStartedAt = new Date();
                session.rounds = [{
                    roundIndex: 0,
                    questionId: session.questions[0],
                    startedAt: new Date(),
                    answers: []
                }];

                await session.save();

                if (callback) callback({ success: true });

                gameNamespace.to(roomCode).emit('rematch_started', {
                    roomCode,
                    totalRounds: session.totalRounds
                });

                startMultiplayerRound(session, 0);
            } catch (err) {
                console.error('Rematch error:', err);
                if (callback) callback({ error: 'Failed to rematch: ' + err.message });
            }
        });

        // 6. DISCONNECT
        socket.on('disconnecting', async () => {
            const rooms = Array.from(socket.rooms);
            for (const roomCode of rooms) {
                if (roomCode !== socket.id) {
                    try {
                        const session = await GameSession.findOne({ roomCode });
                        if (session) {
                            const player = session.players.find(p => p.socketId === socket.id);
                            if (player) {
                                player.connected = false;

                                // Host Transfer if host leaves
                                if (player.isHost) {
                                    player.isHost = false;
                                    const nextHost = session.players.find(p => p.connected && p.socketId !== socket.id);
                                    if (nextHost) {
                                        nextHost.isHost = true;
                                        gameNamespace.to(roomCode).emit('host_transferred', {
                                            newHostId: nextHost.socketId,
                                            newHostName: nextHost.displayName
                                        });
                                    }
                                }

                                await session.save();

                                gameNamespace.to(roomCode).emit('player_left', {
                                    playerId: socket.id,
                                    displayName: player.displayName,
                                    remainingPlayers: session.players.filter(p => p.connected)
                                });
                            }
                        }
                    } catch (e) {
                        console.error('Disconnect handling error:', e);
                    }
                }
            }
        });
    });

    // ============================================
    // Round Management Functions
    // ============================================

    function clearRoomTimer(roomCode) {
        if (activeTimers.has(roomCode)) {
            clearTimeout(activeTimers.get(roomCode));
            activeTimers.delete(roomCode);
        }
    }

    async function startMultiplayerRound(session, roundIdx) {
        try {
            const roomCode = session.roomCode;
            clearRoomTimer(roomCode);

            // Populate current question
            const populatedSession = await GameSession.findById(session._id).populate('questions');
            if (!populatedSession) return;

            const question = populatedSession.questions[roundIdx];
            if (!question) {
                return finishMultiplayerGame(populatedSession);
            }

            const timeLimit = populatedSession.roundTimeLimit || SCORING.DEFAULT_ROUND_TIME;

            // Broadcast round started with sanitized question
            gameNamespace.to(roomCode).emit('round_started', {
                roundIndex: roundIdx,
                currentRound: roundIdx + 1,
                totalRounds: populatedSession.totalRounds,
                timeLimit,
                question: sanitizeQuestion(question)
            });

            // Set authoritative timer
            const timer = setTimeout(() => {
                finishMultiplayerRound(populatedSession, roundIdx);
            }, (timeLimit + 1) * 1000); // 1 extra second grace period for network latency

            activeTimers.set(roomCode, timer);
        } catch (err) {
            console.error('Error starting round:', err);
        }
    }

    async function finishMultiplayerRound(session, roundIdx) {
        try {
            const roomCode = session.roomCode;
            clearRoomTimer(roomCode);

            const populatedSession = await GameSession.findById(session._id).populate('questions');
            if (!populatedSession) return;

            const question = populatedSession.questions[roundIdx];
            const round = populatedSession.rounds.find(r => r.roundIndex === roundIdx);

            const results = {
                roundIndex: roundIdx,
                currentRound: roundIdx + 1,
                correctAnswer: question ? question.correctAnswer : '',
                explanation: question ? (question.explanation || '') : '',
                players: populatedSession.players.map(p => {
                    const ans = round ? round.answers.find(a => a.playerId === p.socketId) : null;
                    return {
                        socketId: p.socketId,
                        displayName: p.displayName,
                        avatarUrl: p.avatarUrl,
                        score: p.score,
                        selectedOption: ans ? ans.selectedOption : null,
                        isCorrect: ans ? ans.isCorrect : false,
                        pointsEarned: ans ? ans.pointsEarned : 0,
                        currentStreak: p.currentStreak
                    };
                }).sort((a, b) => b.score - a.score)
            };

            // Broadcast round finished
            gameNamespace.to(roomCode).emit('round_finished', results);

            // Check if game is complete
            if (roundIdx + 1 >= populatedSession.totalRounds) {
                setTimeout(() => {
                    finishMultiplayerGame(populatedSession);
                }, 4000);
            } else {
                // Advance to next round after 4 second reveal pause
                setTimeout(async () => {
                    try {
                        const fresh = await GameSession.findById(session._id);
                        fresh.currentRoundIndex = roundIdx + 1;
                        fresh.roundStartedAt = new Date();
                        fresh.rounds.push({
                            roundIndex: roundIdx + 1,
                            questionId: fresh.questions[roundIdx + 1],
                            startedAt: new Date(),
                            answers: []
                        });
                        await fresh.save();
                        startMultiplayerRound(fresh, roundIdx + 1);
                    } catch (e) {
                        console.error('Error advancing round:', e);
                    }
                }, 4000);
            }
        } catch (err) {
            console.error('Error finishing round:', err);
        }
    }

    async function finishMultiplayerGame(session) {
        try {
            const roomCode = session.roomCode;
            clearRoomTimer(roomCode);

            const fresh = await GameSession.findById(session._id);
            if (!fresh) return;

            fresh.status = 'completed';
            fresh.completedAt = new Date();
            await fresh.save();

            // Sorted players leaderboard
            const sortedPlayers = [...fresh.players].sort((a, b) => b.score - a.score);

            // Record into GameLeaderboard
            for (const p of sortedPlayers) {
                try {
                    const accuracy = fresh.totalRounds > 0 ? Math.round((p.correctAnswers / fresh.totalRounds) * 100) : 0;
                    await GameLeaderboard.create({
                        userId: p.userId || null,
                        displayName: p.displayName,
                        avatarUrl: p.avatarUrl,
                        gameType: fresh.gameType,
                        mode: fresh.mode,
                        score: p.score,
                        correctCount: p.correctAnswers,
                        totalRounds: fresh.totalRounds,
                        accuracy,
                        bestStreak: p.bestStreak
                    });
                } catch (lbErr) {}
            }

            // Emit final game results
            gameNamespace.to(roomCode).emit('game_finished', {
                roomCode,
                gameType: fresh.gameType,
                totalRounds: fresh.totalRounds,
                podium: sortedPlayers.map((p, idx) => ({
                    rank: idx + 1,
                    displayName: p.displayName,
                    avatarUrl: p.avatarUrl,
                    score: p.score,
                    correctAnswers: p.correctAnswers,
                    bestStreak: p.bestStreak,
                    accuracy: fresh.totalRounds > 0 ? Math.round((p.correctAnswers / fresh.totalRounds) * 100) : 0
                }))
            });
        } catch (err) {
            console.error('Error finishing multiplayer game:', err);
        }
    }
}

module.exports = gameSocket;
