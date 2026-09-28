// ============================================
// Cinema Muchatlu - Game Engine Models (Mongoose)
// ============================================

const mongoose = require('mongoose');

// ============================================
// Game Definition Schema
// ============================================
const gameSchema = new mongoose.Schema({
    gameType: {
        type: String,
        required: true,
        unique: true,
        enum: ['guess_movie', 'guess_dialogue', 'guess_song']
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: '🎮' },
    supportedModes: {
        type: [String],
        enum: ['SOLO', 'PRIVATE_MULTIPLAYER'],
        default: ['SOLO', 'PRIVATE_MULTIPLAYER']
    },
    defaultRounds: { type: Number, default: 10 },
    difficultyLevels: {
        type: [String],
        default: ['easy', 'medium', 'hard']
    },
    isActive: { type: Boolean, default: true }
});

// ============================================
// Game Question Schema
// ============================================
const gameQuestionSchema = new mongoose.Schema({
    gameType: {
        type: String,
        required: true,
        enum: ['guess_movie', 'guess_dialogue', 'guess_song'],
        index: true
    },
    questionType: {
        type: String,
        required: true
    },
    prompt: { type: String, required: true },
    clues: [String],
    mediaUrl: String,           // Poster or image URL
    audioPreviewUrl: String,    // Audio preview URL for song guessing
    options: {
        type: [String],
        required: true,
        validate: [arr => arr.length === 4, 'Must provide exactly 4 options']
    },
    correctAnswer: { type: String, required: true },
    explanation: String,
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
        index: true
    },
    movieId: String,
    actorId: String,
    songId: String,
    metadata: mongoose.Schema.Types.Mixed,
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// ============================================
// Game Session Schema
// ============================================
const playerSubSchema = new mongoose.Schema({
    userId: { type: String, default: null },
    sessionId: { type: String, default: null },
    socketId: { type: String, default: null },
    displayName: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    score: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    isHost: { type: Boolean, default: false },
    connected: { type: Boolean, default: true }
}, { _id: false });

const roundAnswerSubSchema = new mongoose.Schema({
    playerId: { type: String, required: true },
    selectedOption: { type: String, default: null },
    answeredAt: { type: Date, default: Date.now },
    timeTakenSeconds: { type: Number, default: 0 },
    isCorrect: { type: Boolean, default: false },
    pointsEarned: { type: Number, default: 0 }
}, { _id: false });

const roundSubSchema = new mongoose.Schema({
    roundIndex: { type: Number, required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'GameQuestion', required: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    answers: [roundAnswerSubSchema]
}, { _id: false });

const gameSessionSchema = new mongoose.Schema({
    gameType: {
        type: String,
        required: true,
        enum: ['guess_movie', 'guess_dialogue', 'guess_song']
    },
    mode: {
        type: String,
        enum: ['SOLO', 'PRIVATE_MULTIPLAYER'],
        required: true
    },
    roomCode: {
        type: String,
        sparse: true,
        uppercase: true,
        trim: true,
        index: true
    },
    hostPlayerKey: { type: String, required: true },
    status: {
        type: String,
        enum: ['waiting', 'active', 'round_ended', 'completed', 'abandoned'],
        default: 'waiting'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    totalRounds: { type: Number, default: 10 },
    currentRoundIndex: { type: Number, default: 0 },
    roundTimeLimit: { type: Number, default: 15 },
    roundStartedAt: { type: Date },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameQuestion' }],
    players: [playerSubSchema],
    rounds: [roundSubSchema],
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
}, { versionKey: false });

// ============================================
// Leaderboard Schema
// ============================================
const gameLeaderboardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    displayName: { type: String, required: true },
    avatarUrl: { type: String, default: '' },
    gameType: {
        type: String,
        required: true,
        enum: ['guess_movie', 'guess_dialogue', 'guess_song'],
        index: true
    },
    mode: {
        type: String,
        enum: ['SOLO', 'PRIVATE_MULTIPLAYER'],
        default: 'SOLO'
    },
    score: { type: Number, required: true },
    correctCount: { type: Number, default: 0 },
    totalRounds: { type: Number, default: 10 },
    accuracy: { type: Number, default: 0 }, // in percentage
    bestStreak: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, index: true }
});

// Compile models
const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);
const GameQuestion = mongoose.models.GameQuestion || mongoose.model('GameQuestion', gameQuestionSchema);
const GameSession = mongoose.models.GameSession || mongoose.model('GameSession', gameSessionSchema);
const GameLeaderboard = mongoose.models.GameLeaderboard || mongoose.model('GameLeaderboard', gameLeaderboardSchema);

module.exports = {
    Game,
    GameQuestion,
    GameSession,
    GameLeaderboard
};
