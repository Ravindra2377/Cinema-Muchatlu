// ============================================
// Cinema Muchatlu - End-to-End Automated Game Test
// Tests Solo, Anti-Cheat, Socket.IO Multiplayer & Telemetry
// ============================================

const io = require('socket.io-client');
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/games';
const SOCKET_URL = 'http://localhost:5000/game';

async function runTests() {
    console.log('🚀 Starting Cinema Muchatlu Games Test Suite...\n');

    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
        if (condition) {
            console.log(`  ✅ PASS: ${message}`);
            passed++;
        } else {
            console.error(`  ❌ FAIL: ${message}`);
            failed++;
        }
    }

    // ============================================
    // TEST 1: Games List API
    // ============================================
    console.log('📋 Test 1: Fetch Available Games');
    try {
        const res = await axios.get(API_BASE);
        assert(Array.isArray(res.data) && res.data.length === 3, 'Returns all 3 games (Movie, Dialogue, Song)');
        const types = res.data.map(g => g.gameType);
        assert(types.includes('guess_movie') && types.includes('guess_dialogue') && types.includes('guess_song'), 'Contains guess_movie, guess_dialogue, and guess_song');
    } catch (e) {
        assert(false, `Fetch games failed: ${e.message}`);
    }

    // ============================================
    // TEST 2: Solo Game & Anti-Cheat Validation
    // ============================================
    console.log('\n🕹️ Test 2: Solo Game Play & Anti-Cheat Check');
    let soloSessionId = null;
    let firstRoundQuestion = null;
    try {
        const startRes = await axios.post(`${API_BASE}/solo/start`, {
            gameType: 'guess_movie',
            difficulty: 'easy',
            totalRounds: 5,
            displayName: 'TestPlayer_Panvi'
        });

        soloSessionId = startRes.data.sessionId;
        firstRoundQuestion = startRes.data.question;

        assert(Boolean(soloSessionId), 'Solo session created successfully');
        assert(startRes.data.totalRounds === 5, 'Session configured for 5 rounds');
        assert(firstRoundQuestion && firstRoundQuestion.options.length === 4, 'Received 4 multiple-choice options');
        assert(firstRoundQuestion.correctAnswer === undefined, 'ANTI-CHEAT: correctAnswer is NOT exposed to client');

        // Submit answer for Round 1
        const chosenOption = firstRoundQuestion.options[0];
        const ansRes = await axios.post(`${API_BASE}/solo/answer`, {
            sessionId: soloSessionId,
            playerKey: 'solo_player',
            selectedOption: chosenOption,
            timeTakenSeconds: 3.5
        });

        assert(typeof ansRes.data.isCorrect === 'boolean', 'Server validated answer correctness');
        assert(typeof ansRes.data.pointsEarned === 'number', 'Server calculated authoritative points');
        assert(ansRes.data.correctAnswer !== undefined, 'Correct answer revealed ONLY AFTER submission');
        assert(ansRes.data.totalScore >= 0, 'Total score tracked server-side');

    } catch (e) {
        assert(false, `Solo test failed: ${e.message}`);
    }

    // ============================================
    // TEST 3: Real-Time Socket.IO Multiplayer
    // ============================================
    console.log('\n👥 Test 3: Real-Time Socket.IO Multiplayer Match');
    await new Promise((resolve) => {
        let roomCode = null;
        let socketHost = null;
        let socketPlayer2 = null;

        socketHost = io(SOCKET_URL, { transports: ['websocket'] });

        socketHost.on('connect', () => {
            console.log('   🔗 Host connected to Socket.IO');

            // 1. Create Room
            socketHost.emit('create_room', {
                gameType: 'guess_movie',
                difficulty: 'medium',
                totalRounds: 5,
                displayName: 'Host_Kiran'
            }, (res) => {
                assert(res.success && res.roomCode.length === 5, `Room created with code "${res.roomCode}"`);
                roomCode = res.roomCode;

                // 2. Player 2 joins room
                socketPlayer2 = io(SOCKET_URL, { transports: ['websocket'] });
                socketPlayer2.on('connect', () => {
                    console.log('   🔗 Player 2 connected to Socket.IO');
                    socketPlayer2.emit('join_room', {
                        roomCode: roomCode,
                        displayName: 'Friend_Ravi'
                    }, (joinRes) => {
                        assert(joinRes.success, 'Player 2 successfully joined room');
                    });
                });

                // Listen for room update on host
                socketHost.on('room_updated', (updateData) => {
                    if (updateData.players && updateData.players.length === 2) {
                        assert(true, 'Both players synchronized in room lobby');

                        // 3. Host starts game
                        socketHost.emit('start_game', { roomCode }, (startRes) => {
                            assert(startRes.success, 'Host started the game');
                        });
                    }
                });

                // Listen for round started on both players
                let hostRoundReceived = false;
                let p2RoundReceived = false;

                const checkRounds = () => {
                    if (hostRoundReceived && p2RoundReceived) {
                        assert(true, 'Both players received synchronized round_started event');

                        // Both submit answers
                        socketHost.emit('submit_answer', {
                            roomCode,
                            selectedOption: 'Test Option',
                            timeTakenSeconds: 2.0
                        });

                        socketPlayer2.emit('submit_answer', {
                            roomCode,
                            selectedOption: 'Test Option',
                            timeTakenSeconds: 2.5
                        });
                    }
                };

                socketHost.on('round_started', (data) => {
                    assert(data.question.correctAnswer === undefined, 'MULTI-CHEAT: correctAnswer hidden in multiplayer');
                    hostRoundReceived = true;
                    checkRounds();
                });

                socketPlayer2.on('round_started', (data) => {
                    p2RoundReceived = true;
                    checkRounds();
                });

                // Round finished reveal
                socketHost.on('round_finished', (revealData) => {
                    assert(Boolean(revealData.correctAnswer), `Round finished: Correct answer revealed ("${revealData.correctAnswer}")`);
                    assert(revealData.players.length === 2, 'Authoritative scores emitted for both players');

                    socketHost.disconnect();
                    socketPlayer2.disconnect();
                    resolve();
                });
            });
        });
    });

    // ============================================
    // TEST 4: Leaderboard API
    // ============================================
    console.log('\n🏆 Test 4: Leaderboard & Telemetry Check');
    try {
        const lbRes = await axios.get(`${API_BASE}/leaderboard?timeframe=all`);
        assert(Array.isArray(lbRes.data), 'Leaderboard API returns records array');
        if (lbRes.data.length > 0) {
            const top = lbRes.data[0];
            assert(typeof top.score === 'number' && typeof top.accuracy === 'number', 'Leaderboard record contains score and accuracy');
        }
    } catch (e) {
        assert(false, `Leaderboard check failed: ${e.message}`);
    }

    // ============================================
    // TEST 5: Admin Question Management API
    // ============================================
    console.log('\n🛠️ Test 5: Admin Question Management Endpoints');
    try {
        const adminHeaders = { 'x-admin-key': 'muchatlu_admin' };

        // 1. Fetch questions
        const qListRes = await axios.get(`${API_BASE}/questions?limit=5`, { headers: adminHeaders });
        assert(Array.isArray(qListRes.data.questions), 'Admin can fetch question bank');
        assert(qListRes.data.total >= 90, `Question bank has ${qListRes.data.total} questions (exceeds target)`);

        // 2. Add question
        const newQRes = await axios.post(`${API_BASE}/questions`, {
            gameType: 'guess_movie',
            difficulty: 'easy',
            prompt: 'Test Automated Question: Who directed RRR?',
            clues: ['Rajamouli', 'Pan-India hit'],
            options: ['S.S. Rajamouli', 'Sukumar', 'Trivikram', 'Koratala Siva'],
            correctAnswer: 'S.S. Rajamouli',
            explanation: 'S.S. Rajamouli directed RRR.'
        }, { headers: adminHeaders });

        assert(Boolean(newQRes.data._id), 'Admin added new question successfully');

        // 3. Delete question
        const delRes = await axios.delete(`${API_BASE}/questions/${newQRes.data._id}`, { headers: adminHeaders });
        assert(delRes.status === 200, 'Admin deleted test question successfully');

        // 4. Analytics
        const analyticsRes = await axios.get(`${API_BASE}/analytics`, { headers: adminHeaders });
        assert(analyticsRes.data.totalSessions >= 1, 'Game analytics tracked total sessions');

    } catch (e) {
        assert(false, `Admin API test failed: ${e.message}`);
    }

    console.log(`\n============================================`);
    console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
    console.log(`============================================\n`);

    process.exit(failed > 0 ? 1 : 0);
}

runTests();
