// ============================================
// Cinema Muchatlu - MongoDB Models (Mongoose)
// ============================================

const mongoose = require('mongoose');

// ============================================
// User Schema
// ============================================
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
        match: /^[a-zA-Z0-9_]+$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    reputation: {
        type: Number,
        default: 0
    },
    avatarUrl: String,
    bio: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// Movie Schema
// ============================================
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    genres: [String],
    rating: { type: Number, default: 0 },
    posterUrl: String,
    description: String,
    director: String,
    cast: [String],
    contentType: {
        type: String,
        enum: ['Movie', 'TV Show'],
        default: 'Movie'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// Watchlist Schema
// ============================================
const watchlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieId: {
        type: String,
        required: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

// ============================================
// Comment Schema
// ============================================
const commentSchema = new mongoose.Schema({
    movieId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: String,
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// Discussion Schema
// ============================================
const discussionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: String,
    title: { type: String, required: true },
    content: { type: String, required: true },
    media: { type: String }, // Optional image attachment
    category: {
        type: String,
        enum: ['Cinema', 'Memes', 'Celebrities', 'Trends', 'Music', 'Dialogues', 'General'],
        default: 'General'
    },
    
    // Relational Graph Mappings
    movieId: { type: String },
    actorId: { type: String },
    songId: { type: String },
    
    // Expressive Reactions
    reactions: {
        mass: { type: Number, default: 0 },
        lol: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        emotional: { type: Number, default: 0 },
        wtf: { type: Number, default: 0 },
        disagree: { type: Number, default: 0 }
    },
    
    repliesCount: { type: Number, default: 0 },
    status: { type: String, enum: ['ACTIVE', 'LOCKED', 'REMOVED'], default: 'ACTIVE' },
    
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// Reply Schema
// ============================================
const replySchema = new mongoose.Schema({
    discussionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: String,
    text: { type: String, required: true },
    
    reactions: {
        mass: { type: Number, default: 0 },
        lol: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        emotional: { type: Number, default: 0 },
        wtf: { type: Number, default: 0 },
        disagree: { type: Number, default: 0 }
    },
    
    status: { type: String, enum: ['ACTIVE', 'REMOVED'], default: 'ACTIVE' },
    
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// ============================================
// Music Schema
// ============================================
const musicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    movieLink: { type: String }, 
    thumbnailUrl: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    providerId: { type: String, unique: true, required: true },
    publishedAt: { type: Date, default: Date.now }
});

// ============================================
// CulturePost Schema (The Culture Graph)
// ============================================
const culturePostSchema = new mongoose.Schema({
    type: { type: String, enum: ['news', 'meme', 'poll', 'dialogue', 'opinion', 'trivia'], required: true },
    title: { type: String }, 
    content: { type: String },
    media: { type: String }, // Image/Video URL
    
    // Relational Graph Mappings
    movieId: { type: String }, // TMDB Movie ID
    actorId: { type: String }, // TMDB Actor/Person ID
    songId: { type: String },  // JioSaavn Track ID
    
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String, default: 'Anonymous' },
    
    // Expressive Telugu Pop-Culture Reactions
    reactions: {
        mass: { type: Number, default: 0 },       // 🔥 Mass
        lol: { type: Number, default: 0 },        // 😂 LOL
        love: { type: Number, default: 0 },       // ❤️ Love
        emotional: { type: Number, default: 0 },  // 😭 Emotional
        wtf: { type: Number, default: 0 },        // 🤯 WTF
        disagree: { type: Number, default: 0 }    // 👎 Disagree
    },
    
    commentsCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    
    pollOptions: [{ 
        text: String,
        votes: { type: Number, default: 0 }
    }],
    moderationStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED'], default: 'APPROVED' },
    createdAt: { type: Date, default: Date.now }
});

// ============================================
// UserEvent Schema (Recommendation Engine Telemetry)
// ============================================
const userEventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Nullable for anonymous tracking
    sessionId: { type: String }, // For anonymous users before registration
    experimentGroup: { type: String, enum: ['A', 'B', 'C'], default: 'A' }, // A/B testing cohort
    eventType: { 
        type: String, 
        enum: [
            'feed_impression', 'post_open', 'movie_open', 'song_play', 'reaction', 
            'comment', 'reply', 'save', 'share', 'not_interested', 'poll_vote',
            'game_open', 'game_start', 'game_answer', 'game_answer_correct', 
            'game_answer_wrong', 'game_complete', 'game_room_created', 
            'game_room_joined', 'game_room_left', 'game_rematch',
            'movie_watched', 'movie_liked', 'movie_rated',
            'review_created', 'movie_rewatched', 'watch_method_theatre', 'watch_method_ott'
        ], 
        required: true 
    },
    targetType: { 
        type: String, 
        enum: ['culturePost', 'movie', 'song', 'comment', 'discussion', 'reply', 'game', 'gameSession', 'gameQuestion', 'game_question', 'game_session'] 
    },
    targetId: { type: String },
    
    // For propagation (e.g., reacting to a post propagating to a movie)
    entityType: { type: String }, 
    entityId: { type: String },
    
    metadata: { type: mongoose.Schema.Types.Mixed }, // e.g. { reaction: "mass" }
    timestamp: { type: Date, default: Date.now }
});

// ============================================
// UserInterest Schema (Calculated Interest Vector)
// ============================================
const userInterestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    entities: {
        movies: { type: Map, of: Number, default: {} },
        actors: { type: Map, of: Number, default: {} },
        songs: { type: Map, of: Number, default: {} }
    },
    genres: { type: Map, of: Number, default: {} },
    contentTypes: { type: Map, of: Number, default: {} }, // meme, poll, etc.
    lastUpdated: { type: Date, default: Date.now }
});

// ============================================
// Notification Schema
// ============================================
const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Recipient
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Nullable for system
    actorName: { type: String, default: 'System' },
    type: { type: String, enum: ['reply', 'reaction', 'mention', 'reminder'], required: true },
    discussionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

// ============================================
// Reminder Schema
// ============================================
const reminderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: String, required: true }, // TMDB Movie ID
    movieTitle: { type: String, required: true },
    releaseDate: { type: String, required: true }, // YYYY-MM-DD
    isNotified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Reminder = mongoose.model('Reminder', reminderSchema);

// ============================================
// FilmLog Schema (Letterboxd-style logging)
// ============================================
const filmLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: String, required: true },
    watchedAt: { type: Date, default: Date.now },
    rating: { type: Number, min: 0.5, max: 5.0, default: null }, // half-star increments
    liked: { type: Boolean, default: false },
    review: { type: String, default: null },
    containsSpoilers: { type: Boolean, default: false },
    rewatch: { type: Boolean, default: false },
    tags: [{ type: String }],
    watchMethod: { type: String, enum: ['THEATRE', 'OTT', null], default: null },
    theatre: {
        name: { type: String },
        format: { type: String },
        language: { type: String }
    },
    ott: {
        provider: { type: String },
        language: { type: String }
    },
    visibility: { type: String, enum: ['PUBLIC', 'FRIENDS', 'PRIVATE'], default: 'PUBLIC' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
filmLogSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const FilmLog = mongoose.model('FilmLog', filmLogSchema);

// ============================================
// Export Models
// ============================================
const User = mongoose.model('User', userSchema);
const Movie = mongoose.model('Movie', movieSchema);
const Watchlist = mongoose.model('Watchlist', watchlistSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Discussion = mongoose.model('Discussion', discussionSchema);
const Reply = mongoose.model('Reply', replySchema);
const Music = mongoose.model('Music', musicSchema);
const CulturePost = mongoose.model('CulturePost', culturePostSchema);
const UserEvent = mongoose.model('UserEvent', userEventSchema);
const UserInterest = mongoose.model('UserInterest', userInterestSchema);
const Notification = mongoose.model('Notification', notificationSchema);

const { Game, GameQuestion, GameSession, GameLeaderboard } = require('./gameModels');

// ============================================
// JobRun Schema (Cron & Scheduled Tasks)
// ============================================
const jobRunSchema = new mongoose.Schema({
    runId: { type: String, required: true, unique: true }, // e.g., 'dailyPuzzle:2024-03-20'
    name: { type: String, required: true },
    status: { type: String, enum: ['running', 'success', 'failed'], default: 'running' },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
    result: { type: mongoose.Schema.Types.Mixed },
    error: { type: String }
});

const JobRun = mongoose.model('JobRun', jobRunSchema);

// ============================================
// DailyFeature Schema (Pre-generated daily content)
// ============================================
const dailyFeatureSchema = new mongoose.Schema({
    dateKey: { type: String, required: true }, // e.g., '2024-03-20'
    type: { type: String, enum: ['puzzle', 'song'], required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true }
});
dailyFeatureSchema.index({ dateKey: 1, type: 1 }, { unique: true });

const DailyFeature = mongoose.model('DailyFeature', dailyFeatureSchema);

// ============================================
// Universal Tracking Engine
// ============================================
const trackerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['MOVIE', 'SERIES', 'FUEL', 'VEHICLE', 'EMI', 'AUTO_PAY', 'BILLS', 'HEALTH', 'INSURANCE', 'INVESTMENT', 'WARRANTY', 'DOCUMENT', 'TRAVEL', 'FITNESS', 'HABIT', 'FOOD', 'HOME'],
        required: true 
    },
    name: { type: String, required: true },
    icon: { type: String, default: '📊' },
    color: { type: String, default: '#00e5ff' },
    status: { type: String, enum: ['ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED'], default: 'ACTIVE' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const trackerEntrySchema = new mongoose.Schema({
    trackerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tracker', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // Schema-less payload for the entry
    createdAt: { type: Date, default: Date.now }
});

const timelineEventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sourceType: { type: String, enum: ['TRACKER_ENTRY', 'MOVIE_LOG', 'SYSTEM_NOTIFICATION'], required: true },
    sourceId: { type: mongoose.Schema.Types.ObjectId }, // e.g. trackerEntryId or filmLogId
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String, default: '📌' },
    color: { type: String, default: '#fff' },
    date: { type: Date, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const Tracker = mongoose.model('Tracker', trackerSchema);
const TrackerEntry = mongoose.model('TrackerEntry', trackerEntrySchema);
const TimelineEvent = mongoose.model('TimelineEvent', timelineEventSchema);

module.exports = { 
    User, Movie, Watchlist, Comment, Discussion, Reply, Music, CulturePost, 
    UserEvent, UserInterest, Notification, JobRun, DailyFeature, Reminder, FilmLog,
    Game, GameQuestion, GameSession, GameLeaderboard,
    Tracker, TrackerEntry, TimelineEvent
};
