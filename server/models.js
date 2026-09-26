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
    eventType: { type: String, enum: ['feed_impression', 'post_open', 'movie_open', 'song_play', 'reaction', 'comment', 'reply', 'save', 'share', 'not_interested', 'poll_vote'], required: true },
    targetType: { type: String, enum: ['culturePost', 'movie', 'song', 'comment', 'discussion', 'reply'] },
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
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who triggered it
    actorName: { type: String, required: true },
    type: { type: String, enum: ['reply', 'reaction', 'mention'], required: true },
    discussionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion' },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

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

module.exports = { User, Movie, Watchlist, Comment, Discussion, Reply, Music, CulturePost, UserEvent, UserInterest, Notification };
