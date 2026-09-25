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
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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
    timestamp: {
        type: Date,
        default: Date.now
    }
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

module.exports = { User, Movie, Watchlist, Comment, Discussion, Reply };
