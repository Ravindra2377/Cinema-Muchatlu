// ============================================
// Cinema Muchatlu - Game Engine Client (game.js)
// Reusable Telugu Pop-Culture Game Hub
// Supports Solo and Real-Time Private Multiplayer
// ============================================

(function () {
    'use strict';

    // Game Client State
    const gameState = {
        games: [],
        selectedGame: null,
        selectedMode: 'SOLO',
        selectedDifficulty: 'medium',
        selectedRounds: 10,
        selectedMaxPlayers: 4,
        activeSession: null,
        currentRound: 1,
        totalRounds: 10,
        currentScore: 0,
        currentStreak: 0,
        isAnswerLocked: false,
        timerInterval: null,
        timeRemaining: 15,
        roundStartTime: 0,
        socket: null,
        isHost: false,
        roomCode: null,
        audioElement: null
    };

    // DOM Elements Cache
    let elements = {};

    function initDOMElements() {
        elements = {
            gameCardsContainer: document.getElementById('gameCardsContainer'),
            gameHubSelectionTab: document.getElementById('gameHubSelectionTab'),
            gameHubJoinTab: document.getElementById('gameHubJoinTab'),
            gameHubLeaderboardTab: document.getElementById('gameHubLeaderboardTab'),
            gameLeaderboardList: document.getElementById('gameLeaderboardList'),
            gameSetupModal: document.getElementById('gameSetupModal'),
            closeSetupModalBtn: document.getElementById('closeSetupModalBtn'),
            setupGameIcon: document.getElementById('setupGameIcon'),
            setupGameTitle: document.getElementById('setupGameTitle'),
            setupGameDesc: document.getElementById('setupGameDesc'),
            setupModeGroup: document.getElementById('setupModeGroup'),
            setupDifficultyGroup: document.getElementById('setupDifficultyGroup'),
            setupRoundsGroup: document.getElementById('setupRoundsGroup'),
            confirmStartGameBtn: document.getElementById('confirmStartGameBtn'),
            
            // Multiplayer tab (Host & Join)
            mpTabJoin: document.getElementById('mpTabJoin'),
            mpTabHost: document.getElementById('mpTabHost'),
            mpViewJoin: document.getElementById('mpViewJoin'),
            mpViewHost: document.getElementById('mpViewHost'),
            joinRoomCodeInput: document.getElementById('joinRoomCodeInput'),
            submitJoinRoomBtn: document.getElementById('submitJoinRoomBtn'),
            generateRoomCodeBtn: document.getElementById('generateRoomCodeBtn'),
            switchToHostLink: document.getElementById('switchToHostLink'),
            switchToJoinLink: document.getElementById('switchToJoinLink'),
            hostGamePicker: document.getElementById('hostGamePicker'),
            hostRoundsPicker: document.getElementById('hostRoundsPicker'),
            hostMembersPicker: document.getElementById('hostMembersPicker'),
            hostMembersBadge: document.getElementById('hostMembersBadge'),
            setupMembersSection: document.getElementById('setupMembersSection'),
            setupMembersBadge: document.getElementById('setupMembersBadge'),
            setupMembersGroup: document.getElementById('setupMembersGroup'),
            joinRoomError: document.getElementById('joinRoomError'),

            // Lobby
            multiplayerLobbyScreen: document.getElementById('multiplayerLobbyScreen'),
            lobbyGameTypeTag: document.getElementById('lobbyGameTypeTag'),
            lobbyDifficultyTag: document.getElementById('lobbyDifficultyTag'),
            lobbyRoundsTag: document.getElementById('lobbyRoundsTag'),
            lobbyMaxPlayersTag: document.getElementById('lobbyMaxPlayersTag'),
            lobbyRoomCode: document.getElementById('lobbyRoomCode'),
            copyRoomCodeBtn: document.getElementById('copyRoomCodeBtn'),
            lobbyPlayerCount: document.getElementById('lobbyPlayerCount'),
            lobbyPlayersGrid: document.getElementById('lobbyPlayersGrid'),
            leaveLobbyBtn: document.getElementById('leaveLobbyBtn'),
            hostStartGameBtn: document.getElementById('hostStartGameBtn'),
            waitingForHostNotice: document.getElementById('waitingForHostNotice'),

            // Arena
            activeQuestionScreen: document.getElementById('activeQuestionScreen'),
            arenaGameBadge: document.getElementById('arenaGameBadge'),
            arenaRoundProgress: document.getElementById('arenaRoundProgress'),
            arenaScore: document.getElementById('arenaScore'),
            arenaStreak: document.getElementById('arenaStreak'),
            arenaTimerBar: document.getElementById('arenaTimerBar'),
            arenaTimerLabel: document.getElementById('arenaTimerLabel'),
            arenaQuestionType: document.getElementById('arenaQuestionType'),
            arenaPrompt: document.getElementById('arenaPrompt'),
            arenaCluesContainer: document.getElementById('arenaCluesContainer'),
            arenaAudioBox: document.getElementById('arenaAudioBox'),
            arenaAudioPlayBtn: document.getElementById('arenaAudioPlayBtn'),
            arenaAudioPlayer: document.getElementById('arenaAudioPlayer'),
            arenaMediaBox: document.getElementById('arenaMediaBox'),
            arenaMediaImg: document.getElementById('arenaMediaImg'),
            arenaOptionsGrid: document.getElementById('arenaOptionsGrid'),
            arenaFeedbackBanner: document.getElementById('arenaFeedbackBanner'),
            feedbackIcon: document.getElementById('feedbackIcon'),
            feedbackTitle: document.getElementById('feedbackTitle'),
            feedbackExplanation: document.getElementById('feedbackExplanation'),
            feedbackPoints: document.getElementById('feedbackPoints'),
            arenaMpWaiting: document.getElementById('arenaMpWaiting'),
            mpAnsweredCount: document.getElementById('mpAnsweredCount'),
            mpTotalPlayers: document.getElementById('mpTotalPlayers'),

            // Results
            gameResultsScreen: document.getElementById('gameResultsScreen'),
            resultsGameSubtitle: document.getElementById('resultsGameSubtitle'),
            matchPodiumContainer: document.getElementById('matchPodiumContainer'),
            resFinalScore: document.getElementById('resFinalScore'),
            resAccuracy: document.getElementById('resAccuracy'),
            resBestStreak: document.getElementById('resBestStreak'),
            resRematchBtn: document.getElementById('resRematchBtn'),
            resNewGameBtn: document.getElementById('resNewGameBtn'),
            resDiscussBtn: document.getElementById('resDiscussBtn')
        };
    }

    // ============================================
    // API Helper
    // ============================================
    async function gameApiFetch(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/games${endpoint}`, {
            ...options,
            headers
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'API Request failed');
        }
        return data;
    }

    // ============================================
    // Socket.IO Initialization
    // ============================================
    function initSocket() {
        if (gameState.socket) return;
        if (typeof io !== 'function') {
            console.warn('Socket.IO client library not loaded yet');
            return;
        }

        gameState.socket = io('/game', {
            transports: ['websocket', 'polling']
        });

        gameState.socket.on('connect', () => {
            console.log('🎮 Connected to Multiplayer Game Server');
        });

        // Room state updated
        gameState.socket.on('room_updated', (data) => {
            updateLobbyUI(data);
        });

        // Host transferred
        gameState.socket.on('host_transferred', (data) => {
            if (gameState.socket && data.newHostId === gameState.socket.id) {
                gameState.isHost = true;
                if (elements.hostStartGameBtn) elements.hostStartGameBtn.style.display = 'block';
                if (elements.waitingForHostNotice) elements.waitingForHostNotice.style.display = 'none';
                alert('You are now the room host!');
            }
        });

        // Player left
        gameState.socket.on('player_left', (data) => {
            updateLobbyPlayersList(data.remainingPlayers || []);
        });

        // Round Started
        gameState.socket.on('round_started', (data) => {
            renderMultiplayerRound(data);
        });

        // A player submitted their answer
        gameState.socket.on('player_answered', (data) => {
            if (elements.mpAnsweredCount && elements.mpTotalPlayers) {
                elements.mpAnsweredCount.textContent = data.answeredCount;
                elements.mpTotalPlayers.textContent = data.totalConnected;
            }
        });

        // Round finished (Answers revealed)
        gameState.socket.on('round_finished', (data) => {
            showMultiplayerRoundReveal(data);
        });

        // Game Finished
        gameState.socket.on('game_finished', (data) => {
            showMultiplayerFinalResults(data);
        });

        // Rematch started
        gameState.socket.on('rematch_started', (data) => {
            gameState.currentScore = 0;
            gameState.currentStreak = 0;
            gameState.totalRounds = data.totalRounds || 10;
        });
    }

    // ============================================
    // Initialization & Game Hub Setup
    // ============================================
    async function initGamesHub() {
        initDOMElements();
        bindGlobalEvents();
        await loadGamesList();
        loadLeaderboard('all');
    }

    // Bind UI Tab & Navigation Events
    function bindGlobalEvents() {
        // Tab switching
        document.querySelectorAll('.seg-btn, .game-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.seg-btn, .game-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const tab = btn.dataset.tab;
                if (elements.gameHubSelectionTab) elements.gameHubSelectionTab.classList.toggle('active', tab === 'games');
                if (elements.gameHubJoinTab) elements.gameHubJoinTab.classList.toggle('active', tab === 'multiplayer');
                if (elements.gameHubLeaderboardTab) elements.gameHubLeaderboardTab.classList.toggle('active', tab === 'leaderboard');

                hideAllGameScreens();
                if (tab === 'leaderboard') loadLeaderboard('all');
            });
        });

        // Leaderboard timeframe filters
        document.querySelectorAll('.lb-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lb-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                loadLeaderboard(btn.dataset.timeframe);
            });
        });

        // Setup modal close (close button + backdrop tap)
        if (elements.closeSetupModalBtn) {
            elements.closeSetupModalBtn.addEventListener('click', () => {
                elements.gameSetupModal.style.display = 'none';
            });
        }
        const setupModalBackdrop = document.getElementById('setupModalBackdrop');
        if (setupModalBackdrop) {
            setupModalBackdrop.addEventListener('click', () => {
                elements.gameSetupModal.style.display = 'none';
            });
        }

        // Setup Mode buttons
        if (elements.setupModeGroup) {
            elements.setupModeGroup.querySelectorAll('.setup-toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    elements.setupModeGroup.querySelectorAll('.setup-toggle-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    gameState.selectedMode = btn.dataset.mode;
                    if (elements.setupMembersSection) {
                        elements.setupMembersSection.style.display = gameState.selectedMode === 'PRIVATE_MULTIPLAYER' ? 'block' : 'none';
                    }
                });
            });
        }

        // Setup Members / Capacity buttons
        if (elements.setupMembersGroup) {
            elements.setupMembersGroup.querySelectorAll('.setup-toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    elements.setupMembersGroup.querySelectorAll('.setup-toggle-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const members = parseInt(btn.dataset.members, 10) || 4;
                    gameState.selectedMaxPlayers = members;
                    if (elements.setupMembersBadge) {
                        elements.setupMembersBadge.textContent = `${members} Players`;
                    }
                });
            });
        }

        // Setup Difficulty buttons
        if (elements.setupDifficultyGroup) {
            elements.setupDifficultyGroup.querySelectorAll('.setup-toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    elements.setupDifficultyGroup.querySelectorAll('.setup-toggle-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    gameState.selectedDifficulty = btn.dataset.diff;
                });
            });
        }

        // Setup Rounds buttons
        if (elements.setupRoundsGroup) {
            elements.setupRoundsGroup.querySelectorAll('.setup-toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    elements.setupRoundsGroup.querySelectorAll('.setup-toggle-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    gameState.selectedRounds = parseInt(btn.dataset.rounds, 10);
                });
            });
        }

        // Confirm Start Game button
        if (elements.confirmStartGameBtn) {
            elements.confirmStartGameBtn.addEventListener('click', onConfirmStartGame);
        }

        // Multiplayer mode tab switcher (Join vs Host)
        const switchMpSubView = (view) => {
            if (elements.mpTabJoin) elements.mpTabJoin.classList.toggle('active', view === 'join');
            if (elements.mpTabHost) elements.mpTabHost.classList.toggle('active', view === 'host');
            if (elements.mpViewJoin) elements.mpViewJoin.style.display = view === 'join' ? 'block' : 'none';
            if (elements.mpViewHost) elements.mpViewHost.style.display = view === 'host' ? 'block' : 'none';
            if (elements.joinRoomError) elements.joinRoomError.style.display = 'none';
        };

        if (elements.mpTabJoin) elements.mpTabJoin.addEventListener('click', () => switchMpSubView('join'));
        if (elements.mpTabHost) elements.mpTabHost.addEventListener('click', () => switchMpSubView('host'));
        if (elements.switchToHostLink) elements.switchToHostLink.addEventListener('click', () => switchMpSubView('host'));
        if (elements.switchToJoinLink) elements.switchToJoinLink.addEventListener('click', () => switchMpSubView('join'));

        // Join room button & input handlers
        if (elements.submitJoinRoomBtn) {
            elements.submitJoinRoomBtn.addEventListener('click', onJoinRoomSubmit);
        }

        if (elements.joinRoomCodeInput) {
            elements.joinRoomCodeInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    onJoinRoomSubmit();
                }
            });
            elements.joinRoomCodeInput.addEventListener('input', (e) => {
                const val = (e.target.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
                e.target.value = val;
            });
        }

        // Host Mode: Game Selection Chips
        let hostSelectedGameType = 'guess_movie';
        let hostSelectedRounds = 10;
        let hostSelectedMembers = 4;

        if (elements.hostGamePicker) {
            elements.hostGamePicker.querySelectorAll('.host-game-chip').forEach(chip => {
                chip.addEventListener('click', () => {
                    elements.hostGamePicker.querySelectorAll('.host-game-chip').forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    hostSelectedGameType = chip.dataset.game || 'guess_movie';
                });
            });
        }

        // Host Mode: Rounds Selection Chips
        if (elements.hostRoundsPicker) {
            elements.hostRoundsPicker.querySelectorAll('.host-round-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    elements.hostRoundsPicker.querySelectorAll('.host-round-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    hostSelectedRounds = parseInt(btn.dataset.rounds, 10) || 10;
                });
            });
        }

        // Host Mode: Members Capacity Chips (2 to 10 players)
        if (elements.hostMembersPicker) {
            elements.hostMembersPicker.querySelectorAll('.host-member-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    elements.hostMembersPicker.querySelectorAll('.host-member-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    hostSelectedMembers = parseInt(btn.dataset.members, 10) || 4;
                    gameState.selectedMaxPlayers = hostSelectedMembers;
                    if (elements.hostMembersBadge) {
                        elements.hostMembersBadge.textContent = `${hostSelectedMembers} Players`;
                    }
                });
            });
        }

        // Host Mode: Generate Room Code Button
        if (elements.generateRoomCodeBtn) {
            elements.generateRoomCodeBtn.addEventListener('click', async () => {
                const targetGame = gameState.games.find(g => g.gameType === hostSelectedGameType) || gameState.games[0] || {
                    gameType: hostSelectedGameType,
                    title: hostSelectedGameType === 'guess_movie' ? 'Guess the Movie' : (hostSelectedGameType === 'guess_dialogue' ? 'Guess the Dialogue' : 'Guess the Song'),
                    icon: hostSelectedGameType === 'guess_movie' ? '🎬' : (hostSelectedGameType === 'guess_dialogue' ? '🗣️' : '🎵')
                };

                gameState.selectedGame = targetGame;
                gameState.selectedDifficulty = 'medium';
                gameState.selectedRounds = hostSelectedRounds;
                gameState.selectedMaxPlayers = hostSelectedMembers;
                gameState.selectedMode = 'PRIVATE_MULTIPLAYER';

                elements.generateRoomCodeBtn.disabled = true;
                elements.generateRoomCodeBtn.innerHTML = '<span>⏳ Generating Room Code...</span>';
                try {
                    await createMultiplayerRoom();
                } catch (err) {
                    console.error('Error creating room:', err);
                    alert('Failed to generate room code: ' + (err.message || 'Server error'));
                } finally {
                    if (elements.generateRoomCodeBtn) {
                        elements.generateRoomCodeBtn.disabled = false;
                        elements.generateRoomCodeBtn.innerHTML = '<span>✨ Generate Room Code</span>';
                    }
                }
            });
        }

        // Copy room code
        if (elements.copyRoomCodeBtn) {
            elements.copyRoomCodeBtn.addEventListener('click', () => {
                if (gameState.roomCode) {
                    navigator.clipboard.writeText(gameState.roomCode);
                    elements.copyRoomCodeBtn.textContent = '✅ Copied!';
                    setTimeout(() => { elements.copyRoomCodeBtn.textContent = '📋 Copy Code'; }, 2000);
                }
            });
        }

        // Host start game button
        if (elements.hostStartGameBtn) {
            elements.hostStartGameBtn.addEventListener('click', () => {
                if (gameState.socket && gameState.roomCode) {
                    elements.hostStartGameBtn.disabled = true;
                    gameState.socket.emit('start_game', { roomCode: gameState.roomCode }, (res) => {
                        elements.hostStartGameBtn.disabled = false;
                        if (res && res.error) alert(res.error);
                    });
                }
            });
        }

        // Leave lobby
        if (elements.leaveLobbyBtn) {
            elements.leaveLobbyBtn.addEventListener('click', () => {
                hideAllGameScreens();
                if (elements.gameHubSelectionTab) elements.gameHubSelectionTab.style.display = 'block';
                if (gameState.socket) {
                    gameState.socket.disconnect();
                    gameState.socket = null;
                }
            });
        }

        // Audio Preview Play Button in arena
        if (elements.arenaAudioPlayBtn && elements.arenaAudioPlayer) {
            elements.arenaAudioPlayBtn.addEventListener('click', () => {
                // Pause other audio players in the app
                document.querySelectorAll('.music-audio-player').forEach(p => p.pause());

                if (elements.arenaAudioPlayer.paused) {
                    elements.arenaAudioPlayer.play().catch(e => console.warn('Audio play error:', e));
                    elements.arenaAudioPlayBtn.textContent = '⏸ Pause Preview';
                } else {
                    elements.arenaAudioPlayer.pause();
                    elements.arenaAudioPlayBtn.textContent = '▶ Play Preview';
                }
            });
        }

        // Results screen actions
        if (elements.resRematchBtn) {
            elements.resRematchBtn.addEventListener('click', onRematchClick);
        }
        if (elements.resNewGameBtn) {
            elements.resNewGameBtn.addEventListener('click', () => {
                hideAllGameScreens();
                if (elements.gameHubSelectionTab) elements.gameHubSelectionTab.style.display = 'block';
            });
        }
        if (elements.resDiscussBtn) {
            elements.resDiscussBtn.addEventListener('click', () => {
                const gameTitle = gameState.selectedGame ? gameState.selectedGame.title : 'Telugu Cinema Quiz';
                discussGameOnMuchatlu(gameTitle, gameState.currentScore, gameState.currentStreak, gameState.totalRounds);
            });
        }

        // Desktop Keyboard Shortcuts (Keys 1-4 or A-D for options, Esc for modal)
        window.addEventListener('keydown', (e) => {
            const tag = (e.target && e.target.tagName ? e.target.tagName : '').toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

            if (e.key === 'Escape') {
                if (elements.gameSetupModal && elements.gameSetupModal.style.display !== 'none') {
                    elements.gameSetupModal.style.display = 'none';
                }
                return;
            }

            if (elements.activeQuestionScreen && elements.activeQuestionScreen.style.display !== 'none' && !gameState.isAnswerLocked) {
                const key = (e.key || '').toUpperCase();
                let optionIndex = -1;

                if (key === '1' || key === 'A') optionIndex = 0;
                else if (key === '2' || key === 'B') optionIndex = 1;
                else if (key === '3' || key === 'C') optionIndex = 2;
                else if (key === '4' || key === 'D') optionIndex = 3;

                if (optionIndex !== -1 && elements.arenaOptionsGrid) {
                    const buttons = elements.arenaOptionsGrid.querySelectorAll('.option-btn');
                    if (buttons[optionIndex]) {
                        buttons[optionIndex].click();
                    }
                }
            }
        });
    }

    // ============================================
    // Load Available Games
    // ============================================
    async function loadGamesList() {
        try {
            const games = await gameApiFetch('/');
            gameState.games = games;
            renderGameCards(games);
        } catch (err) {
            console.error('Failed to load games:', err);
            if (elements.gameCardsContainer) {
                elements.gameCardsContainer.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #ff5555;">
                        <p>Unable to load games. Make sure the server is running.</p>
                        <button class="btn-primary" onclick="initGamesHub()" style="margin-top: 1rem;">🔄 Retry</button>
                    </div>
                `;
            }
        }
    }

    function renderGameCards(games) {
        if (!elements.gameCardsContainer) return;

        const themeMap = {
            'guess_movie': 'theme-movie',
            'guess_dialogue': 'theme-dialogue',
            'guess_song': 'theme-song'
        };

        const countMap = {
            'guess_movie': '30+ Questions',
            'guess_dialogue': '25+ Dialogues',
            'guess_song': '25+ Tracks'
        };

        elements.gameCardsContainer.innerHTML = games.map(game => {
            const theme = themeMap[game.gameType] || 'theme-movie';
            const count = countMap[game.gameType] || `${game.defaultRounds || 10} Rounds`;

            return `
                <div class="arcade-game-card ${theme}" data-game-type="${game.gameType}">
                    <div class="card-top">
                        <div class="card-icon-frame">${game.icon || '🎮'}</div>
                        <div class="card-headings">
                            <div class="card-title-row">
                                <h3 class="card-title">${escapeHtml(game.title)}</h3>
                                <span class="card-count-pill">${count}</span>
                            </div>
                            <p class="card-tagline">${escapeHtml(game.description)}</p>
                        </div>
                    </div>
                    <div class="card-actions-row">
                        <button class="btn-arcade-play" onclick="window.gameEngine.openSetup('${game.gameType}', 'SOLO')">
                            <span>▶ Play Solo</span>
                        </button>
                        <button class="btn-arcade-friends" onclick="window.gameEngine.openSetup('${game.gameType}', 'PRIVATE_MULTIPLAYER')">
                            <span>👥 With Friends</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Open Setup Modal for a Game
    function openSetup(gameType, mode = 'SOLO') {
        const game = gameState.games.find(g => g.gameType === gameType);
        if (!game) return;

        gameState.selectedGame = game;
        gameState.selectedMode = mode;

        if (elements.setupGameIcon) elements.setupGameIcon.textContent = game.icon || '🎮';
        if (elements.setupGameTitle) elements.setupGameTitle.textContent = game.title;
        if (elements.setupGameDesc) elements.setupGameDesc.textContent = game.description;

        // Sync mode buttons
        if (elements.setupModeGroup) {
            elements.setupModeGroup.querySelectorAll('.setup-toggle-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });
        }

        // Toggle members section visibility based on mode
        if (elements.setupMembersSection) {
            elements.setupMembersSection.style.display = mode === 'PRIVATE_MULTIPLAYER' ? 'block' : 'none';
        }

        if (elements.gameSetupModal) {
            elements.gameSetupModal.style.display = 'flex';
        }
    }

    window.startDailyPuzzle = async function() {
        try {
            const res = await gameApiFetch('/puzzle/daily');
            gameState.selectedGame = { icon: '🧩', title: 'Daily Telugu Puzzle', gameType: 'daily_puzzle' };
            gameState.activeSession = { sessionId: 'daily', questionId: res.puzzle.id, date: res.date };
            gameState.currentRound = 1;
            gameState.totalRounds = 1;
            gameState.currentScore = 0;
            gameState.currentStreak = 0;
            
            hideAllGameScreens();
            if (elements.activeQuestionScreen) elements.activeQuestionScreen.style.display = 'block';

            renderSoloQuestion(res.puzzle);
        } catch (err) {
            console.error('Error starting daily puzzle:', err);
            alert('Daily puzzle unavailable right now.');
        }
    };

    // ============================================
    // Start Game Confirm Handler
    // ============================================
    async function onConfirmStartGame() {
        if (elements.gameSetupModal) elements.gameSetupModal.style.display = 'none';

        if (gameState.selectedMode === 'SOLO') {
            await startSoloMatch();
        } else {
            await createMultiplayerRoom();
        }
    }

    // ============================================
    // SOLO MATCH FLOW
    // ============================================
    async function startSoloMatch() {
        try {
            const user = window.currentUser || (window.authFunctions ? window.authFunctions.getCurrentUser() : null);
            const res = await gameApiFetch('/solo/start', {
                method: 'POST',
                body: JSON.stringify({
                    gameType: gameState.selectedGame.gameType,
                    difficulty: gameState.selectedDifficulty,
                    totalRounds: gameState.selectedRounds,
                    displayName: user ? (user.name || user.username) : 'Panvi'
                })
            });

            gameState.activeSession = res;
            gameState.currentRound = res.currentRound;
            gameState.totalRounds = res.totalRounds;
            gameState.currentScore = 0;
            gameState.currentStreak = 0;

            hideAllGameScreens();
            if (elements.activeQuestionScreen) elements.activeQuestionScreen.style.display = 'block';

            renderSoloQuestion(res.question);
        } catch (err) {
            console.error('Error starting solo game:', err);
            alert('Failed to start solo game: ' + err.message);
        }
    }

    function renderSoloQuestion(question) {
        if (!question) return;

        gameState.isAnswerLocked = false;
        gameState.roundStartTime = Date.now();
        if (elements.arenaFeedbackBanner) elements.arenaFeedbackBanner.style.display = 'none';
        if (elements.arenaMpWaiting) elements.arenaMpWaiting.style.display = 'none';

        // Update headers
        if (elements.arenaGameBadge) elements.arenaGameBadge.textContent = `${gameState.selectedGame.icon || '🎬'} ${gameState.selectedGame.title}`;
        if (elements.arenaRoundProgress) elements.arenaRoundProgress.textContent = `Round ${gameState.currentRound}/${gameState.totalRounds}`;
        if (elements.arenaScore) elements.arenaScore.textContent = gameState.currentScore;
        if (elements.arenaStreak) elements.arenaStreak.textContent = gameState.currentStreak;

        // Prompt & Type
        if (elements.arenaQuestionType) {
            elements.arenaQuestionType.textContent = (question.questionType || 'Quiz').replace(/_/g, ' ').toUpperCase();
        }
        if (elements.arenaPrompt) elements.arenaPrompt.textContent = question.prompt;

        // Render Clues
        if (elements.arenaCluesContainer) {
            if (question.clues && question.clues.length > 0) {
                elements.arenaCluesContainer.style.display = 'flex';
                elements.arenaCluesContainer.innerHTML = question.clues.map(c => `
                    <div class="clue-chip">${c}</div>
                `).join('');
            } else {
                elements.arenaCluesContainer.style.display = 'none';
            }
        }

        // Handle Audio Clue for "Guess the Song"
        if (elements.arenaAudioBox && elements.arenaAudioPlayer) {
            if (question.audioPreviewUrl) {
                elements.arenaAudioBox.style.display = 'flex';
                elements.arenaAudioPlayer.src = question.audioPreviewUrl;
                elements.arenaAudioPlayer.currentTime = 0;
                // Auto play preview excerpt
                elements.arenaAudioPlayer.play().then(() => {
                    if (elements.arenaAudioPlayBtn) elements.arenaAudioPlayBtn.textContent = '⏸ Pause Preview';
                }).catch(() => {
                    if (elements.arenaAudioPlayBtn) elements.arenaAudioPlayBtn.textContent = '▶ Play Preview';
                });
            } else {
                elements.arenaAudioBox.style.display = 'none';
                elements.arenaAudioPlayer.pause();
                elements.arenaAudioPlayer.src = '';
            }
        }

        // Handle Media / Poster Clue
        if (elements.arenaMediaBox && elements.arenaMediaImg) {
            if (question.mediaUrl) {
                elements.arenaMediaBox.style.display = 'block';
                elements.arenaMediaImg.src = question.mediaUrl;
            } else {
                elements.arenaMediaBox.style.display = 'none';
            }
        }

        // Render 4 Options
        renderOptions(question.options, onSoloOptionClick);

        // Start 15s Timer
        startAuthoritativeTimer(question.timeLimit || 15, onSoloTimerExpired);
    }

    function renderOptions(options, clickHandler) {
        if (!elements.arenaOptionsGrid) return;
        const letters = ['A', 'B', 'C', 'D'];
        elements.arenaOptionsGrid.innerHTML = options.map((opt, idx) => `
            <button class="option-btn" data-option="${escapeHtml(opt)}">
                <span class="option-letter">${letters[idx]}</span>
                <span class="option-text">${escapeHtml(opt)}</span>
            </button>
        `).join('');

        elements.arenaOptionsGrid.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (gameState.isAnswerLocked) return;
                clickHandler(btn.dataset.option, btn);
            });
        });
    }

    async function onSoloOptionClick(selectedOption, clickedBtn) {
        if (gameState.isAnswerLocked) return;
        gameState.isAnswerLocked = true;
        stopTimer();

        // Pause audio if playing
        if (elements.arenaAudioPlayer) elements.arenaAudioPlayer.pause();

        clickedBtn.classList.add('selected');

        const timeTakenSeconds = (Date.now() - gameState.roundStartTime) / 1000;

        try {
            let res;
            if (gameState.selectedGame.gameType === 'daily_puzzle') {
                res = await gameApiFetch('/puzzle/daily/answer', {
                    method: 'POST',
                    body: JSON.stringify({
                        questionId: gameState.activeSession.questionId,
                        answer: selectedOption
                    })
                });
                res.totalScore = res.isCorrect ? 100 : 0;
                res.currentStreak = res.isCorrect ? 1 : 0;
                res.isComplete = true;
                res.finalResults = { score: res.totalScore, totalRounds: 1, message: res.isCorrect ? 'Awesome! 🟩' : 'Oops! 🟥', date: gameState.activeSession.date };
            } else {
                res = await gameApiFetch('/solo/answer', {
                    method: 'POST',
                    body: JSON.stringify({
                        sessionId: gameState.activeSession.sessionId,
                        selectedOption,
                        timeTakenSeconds
                    })
                });
            }

            // Reveal answer on buttons
            elements.arenaOptionsGrid.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.dataset.option === res.correctAnswer) {
                    btn.classList.add('correct');
                } else if (btn.dataset.option === selectedOption && !res.isCorrect) {
                    btn.classList.add('wrong');
                }
            });

            // Update local state
            gameState.currentScore = res.totalScore;
            gameState.currentStreak = res.currentStreak;
            if (elements.arenaScore) elements.arenaScore.textContent = res.totalScore;
            if (elements.arenaStreak) elements.arenaStreak.textContent = res.currentStreak;

            // Show Feedback Banner
            showFeedbackBanner(res.isCorrect, res.pointsEarned, res.speedBonus, res.streakBonus, res.explanation);

            // Wait 2.5 seconds then advance
            setTimeout(() => {
                if (res.isComplete) {
                    if (gameState.selectedGame.gameType === 'daily_puzzle') {
                        showDailyPuzzleResults(res.finalResults);
                    } else {
                        showSoloFinalResults(res.finalResults);
                    }
                } else {
                    gameState.currentRound++;
                    renderSoloQuestion(res.nextQuestion);
                }
            }, 2500);
        } catch (err) {
            console.error('Error submitting answer:', err);
            alert('Submission error: ' + err.message);
        }
    }

    function onSoloTimerExpired() {
        if (gameState.isAnswerLocked) return;
        // Auto-submit empty choice on timeout
        onSoloOptionClick('', { classList: { add: () => {} } });
    }

    function showFeedbackBanner(isCorrect, points, speedBonus, streakBonus, explanation) {
        if (!elements.arenaFeedbackBanner) return;

        elements.arenaFeedbackBanner.style.display = 'flex';
        elements.arenaFeedbackBanner.className = `answer-feedback-banner ${isCorrect ? 'correct' : 'wrong'}`;

        if (elements.feedbackIcon) elements.feedbackIcon.textContent = isCorrect ? '🎉' : '❌';
        if (elements.feedbackTitle) elements.feedbackTitle.textContent = isCorrect ? 'Superb! Correct Answer' : 'Oops! Wrong Answer';
        if (elements.feedbackExplanation) elements.feedbackExplanation.textContent = explanation || '';

        let pointsText = '';
        if (isCorrect) {
            pointsText = `+${points} pts`;
            if (speedBonus > 0) pointsText += ` (⚡ +${speedBonus})`;
            if (streakBonus > 0) pointsText += ` (🔥 +${streakBonus})`;
        } else {
            pointsText = '+0 pts';
        }
        if (elements.feedbackPoints) elements.feedbackPoints.textContent = pointsText;
    }

    function showDailyPuzzleResults(results) {
        hideAllGameScreens();
        if (elements.gameFinalResultsModal) elements.gameFinalResultsModal.style.display = 'block';

        const finalScore = document.getElementById('finalScore');
        if (finalScore) finalScore.textContent = results.score > 0 ? "Correct!" : "Wrong!";

        const summaryText = document.getElementById('finalSummaryText');
        if (summaryText) summaryText.innerHTML = `You played the daily puzzle for ${results.date}.<br>${results.message}`;
        
        // Hide rematch button, show share button
        const rematchBtn = document.getElementById('rematchBtn');
        if (rematchBtn) rematchBtn.style.display = 'none';

        const returnHubBtn = document.getElementById('returnHubBtn');
        
        const existingShareBtn = document.getElementById('sharePuzzleBtn');
        if (!existingShareBtn && returnHubBtn) {
            const shareBtn = document.createElement('button');
            shareBtn.id = 'sharePuzzleBtn';
            shareBtn.className = 'btn-primary';
            shareBtn.textContent = 'Share to WhatsApp 📱';
            shareBtn.onclick = () => {
                const grid = results.score > 0 ? '🟩🟩🟩🟩' : '🟥🟥🟥🟥';
                const text = `TRIBE Daily Puzzle (${results.date})\\nResult: ${grid}\\nPlay at: ${window.location.href}`;
                navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard! Ready to paste in WhatsApp.'));
            };
            returnHubBtn.parentNode.insertBefore(shareBtn, returnHubBtn);
        }
    }

    function showSoloFinalResults(results) {
        hideAllGameScreens();
        if (elements.gameResultsScreen) elements.gameResultsScreen.style.display = 'block';

        if (elements.resultsGameSubtitle) {
            elements.resultsGameSubtitle.textContent = `${gameState.selectedGame.title} (Solo Match)`;
        }

        if (elements.resFinalScore) elements.resFinalScore.textContent = results.score;
        if (elements.resAccuracy) elements.resAccuracy.textContent = `${results.accuracy}%`;
        if (elements.resBestStreak) elements.resBestStreak.textContent = results.bestStreak;

        // Render Solo Podium
        if (elements.matchPodiumContainer) {
            elements.matchPodiumContainer.innerHTML = `
                <div class="podium-card gold">
                    <div class="podium-badge">🥇 1st Place</div>
                    <div class="podium-name">${results.displayName || 'You'}</div>
                    <div class="podium-score">${results.score} pts</div>
                    <div class="podium-meta">${results.correctAnswers} / ${results.totalRounds} Correct</div>
                </div>
            `;
        }
    }

    async function onRematchClick() {
        if (gameState.selectedMode === 'SOLO') {
            if (gameState.activeSession && gameState.activeSession.sessionId) {
                try {
                    const res = await gameApiFetch('/solo/rematch', {
                        method: 'POST',
                        body: JSON.stringify({ prevSessionId: gameState.activeSession.sessionId })
                    });
                    gameState.activeSession = res;
                    gameState.currentRound = res.currentRound;
                    gameState.totalRounds = res.totalRounds;
                    gameState.currentScore = 0;
                    gameState.currentStreak = 0;

                    hideAllGameScreens();
                    if (elements.activeQuestionScreen) elements.activeQuestionScreen.style.display = 'block';
                    renderSoloQuestion(res.question);
                } catch (e) {
                    startSoloMatch();
                }
            } else {
                startSoloMatch();
            }
        } else {
            if (gameState.socket && gameState.roomCode) {
                gameState.socket.emit('rematch', { roomCode: gameState.roomCode });
            }
        }
    }

    // ============================================
    // MULTIPLAYER MATCH FLOW (Socket.IO)
    // ============================================
    async function createMultiplayerRoom() {
        initSocket();
        const user = window.currentUser || (window.authFunctions ? window.authFunctions.getCurrentUser() : null);

        gameState.socket.emit('create_room', {
            gameType: gameState.selectedGame.gameType,
            difficulty: gameState.selectedDifficulty,
            totalRounds: gameState.selectedRounds,
            maxPlayers: gameState.selectedMaxPlayers || 10,
            displayName: user ? (user.name || user.username) : 'Host Player',
            avatarUrl: user ? (user.avatar || '') : '',
            userId: user ? user.id : null
        }, (res) => {
            if (res && res.error) {
                alert(res.error);
                return;
            }
            gameState.isHost = true;
            gameState.roomCode = res.roomCode;
            gameState.totalRounds = res.session.totalRounds;
            gameState.selectedMaxPlayers = res.session.maxPlayers || gameState.selectedMaxPlayers || 10;

            showLobbyScreen(res.session);
        });
    }

    function onJoinRoomSubmit() {
        const code = (elements.joinRoomCodeInput?.value || '').trim().toUpperCase();
        if (!code || code.length < 4) {
            showJoinError('Please enter a valid 5-character room code.');
            return;
        }

        initSocket();
        const user = window.currentUser || (window.authFunctions ? window.authFunctions.getCurrentUser() : null);

        gameState.socket.emit('join_room', {
            roomCode: code,
            displayName: user ? (user.name || user.username) : 'Friend Player',
            avatarUrl: user ? (user.avatar || '') : '',
            userId: user ? user.id : null
        }, (res) => {
            if (res && res.error) {
                showJoinError(res.error);
                return;
            }
            gameState.isHost = false;
            gameState.roomCode = res.session.roomCode;
            gameState.selectedGame = gameState.games.find(g => g.gameType === res.session.gameType) || { title: 'Multiplayer Match', icon: '🎮' };
            gameState.totalRounds = res.session.totalRounds;
            gameState.selectedMaxPlayers = res.session.maxPlayers || 10;

            showLobbyScreen(res.session);
        });
    }

    function showJoinError(msg) {
        if (elements.joinRoomError) {
            elements.joinRoomError.textContent = msg;
            elements.joinRoomError.style.display = 'block';
            setTimeout(() => { elements.joinRoomError.style.display = 'none'; }, 4000);
        }
    }

    function showLobbyScreen(session) {
        hideAllGameScreens();
        if (elements.multiplayerLobbyScreen) elements.multiplayerLobbyScreen.style.display = 'block';

        const maxPlayers = session.maxPlayers || gameState.selectedMaxPlayers || 10;
        gameState.selectedMaxPlayers = maxPlayers;

        if (elements.lobbyGameTypeTag) elements.lobbyGameTypeTag.textContent = `${gameState.selectedGame?.icon || '🎮'} ${gameState.selectedGame?.title || session.gameType}`;
        if (elements.lobbyDifficultyTag) elements.lobbyDifficultyTag.textContent = (session.difficulty || 'medium').toUpperCase();
        if (elements.lobbyRoundsTag) elements.lobbyRoundsTag.textContent = `${session.totalRounds} Rounds`;
        if (elements.lobbyMaxPlayersTag) elements.lobbyMaxPlayersTag.textContent = `👥 Max ${maxPlayers}`;
        if (elements.lobbyRoomCode) elements.lobbyRoomCode.textContent = session.roomCode;

        updateLobbyPlayersList(session.players || [], maxPlayers);

        if (gameState.isHost) {
            if (elements.hostStartGameBtn) elements.hostStartGameBtn.style.display = 'block';
            if (elements.waitingForHostNotice) elements.waitingForHostNotice.style.display = 'none';
        } else {
            if (elements.hostStartGameBtn) elements.hostStartGameBtn.style.display = 'none';
            if (elements.waitingForHostNotice) elements.waitingForHostNotice.style.display = 'flex';
        }
    }

    function updateLobbyUI(data) {
        if (elements.lobbyRoomCode) elements.lobbyRoomCode.textContent = data.roomCode;
        const maxPlayers = data.maxPlayers || gameState.selectedMaxPlayers || 10;
        gameState.selectedMaxPlayers = maxPlayers;
        if (elements.lobbyMaxPlayersTag) elements.lobbyMaxPlayersTag.textContent = `👥 Max ${maxPlayers}`;
        updateLobbyPlayersList(data.players || [], maxPlayers);
    }

    function updateLobbyPlayersList(players, maxPlayers = gameState.selectedMaxPlayers || 10) {
        const connectedPlayers = (players || []).filter(p => p.connected);
        if (elements.lobbyPlayerCount) elements.lobbyPlayerCount.textContent = `${connectedPlayers.length} / ${maxPlayers}`;

        if (elements.lobbyPlayersGrid) {
            elements.lobbyPlayersGrid.innerHTML = connectedPlayers.map(p => `
                <div class="lobby-player-chip">
                    <span class="status-indicator-green"></span>
                    <span class="player-name">${escapeHtml(p.displayName)} ${p.isHost ? '👑 (Host)' : ''}</span>
                </div>
            `).join('');
        }
    }

    // Multiplayer Round Started
    function renderMultiplayerRound(data) {
        hideAllGameScreens();
        if (elements.activeQuestionScreen) elements.activeQuestionScreen.style.display = 'block';

        gameState.currentRound = data.currentRound;
        gameState.totalRounds = data.totalRounds;
        gameState.isAnswerLocked = false;
        gameState.roundStartTime = Date.now();

        if (elements.arenaFeedbackBanner) elements.arenaFeedbackBanner.style.display = 'none';
        if (elements.arenaMpWaiting) elements.arenaMpWaiting.style.display = 'none';

        if (elements.arenaGameBadge) elements.arenaGameBadge.textContent = `${gameState.selectedGame?.icon || '🎮'} ${gameState.selectedGame?.title || 'Multiplayer'}`;
        if (elements.arenaRoundProgress) elements.arenaRoundProgress.textContent = `Round ${data.currentRound}/${data.totalRounds}`;
        if (elements.arenaScore) elements.arenaScore.textContent = gameState.currentScore;
        if (elements.arenaStreak) elements.arenaStreak.textContent = gameState.currentStreak;

        const q = data.question;
        if (!q) return;

        if (elements.arenaQuestionType) elements.arenaQuestionType.textContent = (q.questionType || 'Question').replace(/_/g, ' ').toUpperCase();
        if (elements.arenaPrompt) elements.arenaPrompt.textContent = q.prompt;

        // Clues
        if (elements.arenaCluesContainer) {
            if (q.clues && q.clues.length > 0) {
                elements.arenaCluesContainer.style.display = 'flex';
                elements.arenaCluesContainer.innerHTML = q.clues.map(c => `<div class="clue-chip">${c}</div>`).join('');
            } else {
                elements.arenaCluesContainer.style.display = 'none';
            }
        }

        // Audio preview
        if (elements.arenaAudioBox && elements.arenaAudioPlayer) {
            if (q.audioPreviewUrl) {
                elements.arenaAudioBox.style.display = 'flex';
                elements.arenaAudioPlayer.src = q.audioPreviewUrl;
                elements.arenaAudioPlayer.currentTime = 0;
                elements.arenaAudioPlayer.play().catch(() => {});
            } else {
                elements.arenaAudioBox.style.display = 'none';
            }
        }

        // Media
        if (elements.arenaMediaBox && elements.arenaMediaImg) {
            if (q.mediaUrl) {
                elements.arenaMediaBox.style.display = 'block';
                elements.arenaMediaImg.src = q.mediaUrl;
            } else {
                elements.arenaMediaBox.style.display = 'none';
            }
        }

        renderOptions(q.options, onMultiplayerOptionClick);
        startAuthoritativeTimer(data.timeLimit || 15, () => {
            if (!gameState.isAnswerLocked) onMultiplayerOptionClick('', { classList: { add: () => {} } });
        });
    }

    function onMultiplayerOptionClick(selectedOption, clickedBtn) {
        if (gameState.isAnswerLocked) return;
        gameState.isAnswerLocked = true;
        stopTimer();

        if (elements.arenaAudioPlayer) elements.arenaAudioPlayer.pause();
        clickedBtn.classList.add('selected');

        const timeTakenSeconds = (Date.now() - gameState.roundStartTime) / 1000;

        // Show waiting for other players state
        if (elements.arenaMpWaiting) elements.arenaMpWaiting.style.display = 'flex';

        gameState.socket.emit('submit_answer', {
            roomCode: gameState.roomCode,
            selectedOption,
            timeTakenSeconds
        }, (res) => {
            if (res && res.error) {
                console.warn('Multiplayer answer submission warning:', res.error);
            }
        });
    }

    function showMultiplayerRoundReveal(data) {
        stopTimer();
        if (elements.arenaMpWaiting) elements.arenaMpWaiting.style.display = 'none';

        // Highlight options
        elements.arenaOptionsGrid.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.dataset.option === data.correctAnswer) {
                btn.classList.add('correct');
            } else if (btn.classList.contains('selected')) {
                btn.classList.add('wrong');
            }
        });

        // Find my score
        const myResult = data.players.find(p => p.socketId === gameState.socket.id);
        if (myResult) {
            gameState.currentScore = myResult.score;
            gameState.currentStreak = myResult.currentStreak;
            if (elements.arenaScore) elements.arenaScore.textContent = myResult.score;
            if (elements.arenaStreak) elements.arenaStreak.textContent = myResult.currentStreak;
            showFeedbackBanner(myResult.isCorrect, myResult.pointsEarned, 0, 0, data.explanation);
        }
    }

    function showMultiplayerFinalResults(data) {
        hideAllGameScreens();
        if (elements.gameResultsScreen) elements.gameResultsScreen.style.display = 'block';

        if (elements.resultsGameSubtitle) {
            elements.resultsGameSubtitle.textContent = `Room ${data.roomCode} Final Standings`;
        }

        const myEntry = data.podium.find(p => p.displayName === (window.currentUser?.username || 'You')) || data.podium[0];
        if (myEntry) {
            if (elements.resFinalScore) elements.resFinalScore.textContent = myEntry.score;
            if (elements.resAccuracy) elements.resAccuracy.textContent = `${myEntry.accuracy}%`;
            if (elements.resBestStreak) elements.resBestStreak.textContent = myEntry.bestStreak;
        }

        // Render Multiplayer Podium
        if (elements.matchPodiumContainer) {
            const medals = ['🥇', '🥈', '🥉'];
            elements.matchPodiumContainer.innerHTML = data.podium.map((p, idx) => `
                <div class="podium-card ${idx === 0 ? 'gold' : (idx === 1 ? 'silver' : 'bronze')}">
                    <div class="podium-badge">${medals[idx] || `#${p.rank}`}</div>
                    <div class="podium-name">${escapeHtml(p.displayName)}</div>
                    <div class="podium-score">${p.score} pts</div>
                    <div class="podium-meta">${p.correctAnswers} / ${data.totalRounds} Correct (${p.accuracy}%)</div>
                </div>
            `).join('');
        }
    }

    // ============================================
    // Timer Engine (Countdown & Bar)
    // ============================================
    function startAuthoritativeTimer(durationSeconds, timeoutCallback) {
        stopTimer();
        gameState.timeRemaining = durationSeconds;

        if (elements.arenaTimerBar) elements.arenaTimerBar.style.width = '100%';
        if (elements.arenaTimerLabel) elements.arenaTimerLabel.textContent = `⏱️ ${durationSeconds}s`;

        const start = Date.now();
        const totalMs = durationSeconds * 1000;

        gameState.timerInterval = setInterval(() => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(0, totalMs - elapsed);
            const remainingSec = Math.ceil(remaining / 1000);
            const ratio = (remaining / totalMs) * 100;

            if (elements.arenaTimerBar) elements.arenaTimerBar.style.width = `${ratio}%`;
            if (elements.arenaTimerLabel) elements.arenaTimerLabel.textContent = `⏱️ ${remainingSec}s`;

            if (remaining <= 0) {
                stopTimer();
                if (timeoutCallback) timeoutCallback();
            }
        }, 100);
    }

    function stopTimer() {
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
            gameState.timerInterval = null;
        }
    }

    // ============================================
    // Leaderboard Screen
    // ============================================
    async function loadLeaderboard(timeframe = 'all') {
        if (!elements.gameLeaderboardList) return;
        elements.gameLeaderboardList.innerHTML = '<div class="lb-loading">Loading top players...</div>';

        try {
            const leaders = await gameApiFetch(`/leaderboard?timeframe=${timeframe}`);
            if (!leaders || leaders.length === 0) {
                elements.gameLeaderboardList.innerHTML = '<div class="lb-empty">No games recorded yet. Be the first to play! 🍿</div>';
                return;
            }

            elements.gameLeaderboardList.innerHTML = leaders.map((item, idx) => {
                const rankBadge = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
                const gameName = item.gameType === 'guess_movie' ? '🎬 Movie' : (item.gameType === 'guess_dialogue' ? '🗣️ Dialogue' : '🎵 Song');
                return `
                    <div class="leaderboard-item">
                        <div class="lb-rank">${rankBadge}</div>
                        <div class="lb-player-info">
                            <span class="lb-player-name">${escapeHtml(item.displayName || 'Cinema Lover')}</span>
                            <span class="lb-player-tag">${gameName} • ${item.mode} • 🔥 ${item.bestStreak || 0} streak</span>
                        </div>
                        <div class="lb-player-score">
                            <div class="score-num">${item.score} pts</div>
                            <div class="score-acc">${item.accuracy || 0}% acc</div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (err) {
            console.error('Error loading leaderboard:', err);
            elements.gameLeaderboardList.innerHTML = '<div class="lb-empty">Failed to load leaderboard.</div>';
        }
    }

    // ============================================
    // Muchatlu Discussion Integration
    // ============================================
    function discussGameOnMuchatlu(gameTitle, score, bestStreak, totalRounds) {
        if (typeof window.showSection === 'function') {
            window.showSection('discussions');
        }
        if (typeof window.openDiscussionModal === 'function') {
            window.openDiscussionModal();
            const titleInput = document.getElementById('discussionTitle');
            const contentInput = document.getElementById('discussionContent');
            const categoryInput = document.getElementById('discussionCategory');

            if (titleInput) titleInput.value = `Just played ${gameTitle} on TRIBE! 🎮🔥`;
            if (contentInput) {
                contentInput.value = `Scored ${score} points with a ${bestStreak}-streak in ${gameTitle}! 🎬 Think you know Telugu cinema better? Challenge accepted! 🍿`;
            }
            if (categoryInput) categoryInput.value = 'general';
        }
    }

    // UI Helper: Hide all game screens to switch between modes
    function hideAllGameScreens() {
        stopTimer();
        if (elements.arenaAudioPlayer) elements.arenaAudioPlayer.pause();
        if (elements.multiplayerLobbyScreen) elements.multiplayerLobbyScreen.style.display = 'none';
        if (elements.activeQuestionScreen) elements.activeQuestionScreen.style.display = 'none';
        if (elements.gameResultsScreen) elements.gameResultsScreen.style.display = 'none';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Expose Global Controller
    window.gameEngine = {
        init: initGamesHub,
        openSetup: openSetup,
        discussGameOnMuchatlu: discussGameOnMuchatlu
    };

    // Auto-init on DOMContentLoaded or immediate if loaded later
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGamesHub);
    } else {
        initGamesHub();
    }

})();
