// ============================================
// Cinema Muchatlu - Express + MongoDB Server
// ============================================

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const axios = require('axios');

const { User, Movie, Watchlist, Comment, Discussion, Reply } = require('./models');
const { authMiddleware, optionalAuth } = require('./middleware');

const TMDB_API = 'https://api.tmdb.org/3';

const TMDB_GENRES = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
};

function mapTMDBMovie(m) {
    return {
        id: m.id.toString(),
        title: m.title,
        year: m.release_date ? parseInt(m.release_date.split('-')[0]) : null,
        genre: (m.genre_ids || []).map(id => TMDB_GENRES[id]).filter(Boolean), 
        rating: Math.round(m.vote_average * 10) / 10,
        poster: m.poster_path ? 'https://image.tmdb.org/t/p/w500' + m.poster_path : 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        description: m.overview || 'No description available.',
        cast: [],
        content_type: 'Movie'
    };
}

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// Middleware
// ============================================
app.use(cors());
app.use(express.json());

// Serve frontend static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

// ============================================
// MongoDB Connection
// ============================================
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
}

// ============================================
// AUTH ROUTES
// ============================================

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate username
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            return res.status(400).json({
                error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
            });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email: email.toLowerCase() }]
        });
        if (existingUser) {
            const field = existingUser.username === username ? 'Username' : 'Email';
            return res.status(400).json({ error: `${field} already taken` });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if this is the first user (make them admin)
        const userCount = await User.countDocuments();
        const isAdmin = userCount === 0;

        // Create user
        const user = new User({
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            isAdmin
        });
        await user.save();

        res.status(201).json({
            message: 'Signup successful! Please login with your credentials.',
            isAdmin
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'An error occurred during signup' });
    }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, username: user.username, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                reputation: user.reputation,
                avatar: user.avatarUrl,
                bio: user.bio
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

// GET /api/auth/me - Get current user profile
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            reputation: user.reputation,
            avatar: user.avatarUrl,
            bio: user.bio
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ============================================
// MOVIE ROUTES
// ============================================

// GET /api/movies - Get all movies (from TMDB)
app.get('/api/movies', async (req, res) => {
    try {
        const { search } = req.query;
        let results = [];
        
        if (search) {
            // Fetch 2 pages of search results to give them lots of global IMDb movies
            const urls = [1, 2].map(page => 
                `${TMDB_API}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(search)}&page=${page}`
            );
            const responses = await Promise.all(urls.map(url => axios.get(url)));
            results = responses.flatMap(r => r.data.results);
        } else {
            // Fetch first 4 pages (80 movies) of Telugu movies from 1960 to 2026
            const urls = [1, 2, 3, 4].map(page => 
                `${TMDB_API}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_original_language=te&primary_release_date.gte=1960-01-01&primary_release_date.lte=2026-12-31&sort_by=popularity.desc&page=${page}`
            );
            
            const responses = await Promise.all(urls.map(url => axios.get(url)));
            results = responses.flatMap(r => r.data.results);
        }
        
        const mapped = results.map(mapTMDBMovie);
        res.json(mapped);
    } catch (err) {
        console.error('Error fetching movies from TMDB:', err);
        res.status(500).json({ error: 'Error fetching movies' });
    }
});

// GET /api/movies/trending - Get top 10 trending movies
app.get('/api/movies/trending', async (req, res) => {
    try {
        const url = `${TMDB_API}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_original_language=te&sort_by=vote_average.desc&vote_count.gte=100&page=1`;
        const response = await axios.get(url);
        const mapped = response.data.results.slice(0, 10).map(mapTMDBMovie);
        res.json(mapped);
    } catch (err) {
        console.error('Error fetching trending from TMDB:', err);
        res.status(500).json({ error: 'Error fetching trending movies' });
    }
});

// GET /api/movies/:id - Get a single movie
app.get('/api/movies/:id', async (req, res) => {
    try {
        const url = `${TMDB_API}/movie/${req.params.id}?api_key=${process.env.TMDB_API_KEY}`;
        const response = await axios.get(url);
        res.json(mapTMDBMovie(response.data));
    } catch (err) {
        res.status(500).json({ error: 'Error fetching movie details' });
    }
});

// ============================================
// WATCHLIST ROUTES
// ============================================

// GET /api/watchlist - Get user's watchlist
app.get('/api/watchlist', authMiddleware, async (req, res) => {
    try {
        const items = await Watchlist.find({ userId: req.user.id });
        const movieIds = items.map(w => w.movieId);
        res.json(movieIds);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching watchlist' });
    }
});

// POST /api/watchlist/:movieId - Add/remove from watchlist (toggle)
app.post('/api/watchlist/:movieId', authMiddleware, async (req, res) => {
    try {
        const { movieId } = req.params;
        const existing = await Watchlist.findOne({ userId: req.user.id, movieId });

        if (existing) {
            await Watchlist.deleteOne({ _id: existing._id });
            res.json({ action: 'removed', movieId });
        } else {
            await Watchlist.create({ userId: req.user.id, movieId });
            res.json({ action: 'added', movieId });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error updating watchlist' });
    }
});

// ============================================
// COMMENT ROUTES
// ============================================

// GET /api/comments/:movieId - Get comments for a movie
app.get('/api/comments/:movieId', async (req, res) => {
    try {
        const comments = await Comment.find({ movieId: req.params.movieId })
            .sort({ timestamp: -1 });
        res.json(comments.map(c => ({
            id: c._id,
            movieId: c.movieId,
            userId: c.userId,
            username: c.username,
            text: c.text,
            likes: c.likes,
            likedBy: c.likedBy,
            timestamp: c.timestamp.getTime()
        })));
    } catch (err) {
        res.status(500).json({ error: 'Error fetching comments' });
    }
});

// POST /api/comments/:movieId - Add a comment
app.post('/api/comments/:movieId', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.create({
            movieId: req.params.movieId,
            userId: req.user.id,
            username: req.user.username,
            text: req.body.text
        });
        res.status(201).json({
            id: comment._id,
            movieId: comment.movieId,
            userId: comment.userId,
            username: comment.username,
            text: comment.text,
            likes: comment.likes,
            likedBy: comment.likedBy,
            timestamp: comment.timestamp.getTime()
        });
    } catch (err) {
        res.status(500).json({ error: 'Error adding comment' });
    }
});

// POST /api/comments/:commentId/like - Toggle like on a comment
app.post('/api/comments/:commentId/like', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        const userId = req.user.id;
        const likedIndex = comment.likedBy.indexOf(userId);

        if (likedIndex > -1) {
            comment.likedBy.splice(likedIndex, 1);
            comment.likes = Math.max(0, comment.likes - 1);
        } else {
            comment.likedBy.push(userId);
            comment.likes += 1;
        }

        await comment.save();
        res.json({ likes: comment.likes, likedBy: comment.likedBy });
    } catch (err) {
        res.status(500).json({ error: 'Error toggling like' });
    }
});

// DELETE /api/comments/:commentId - Delete a comment
app.delete('/api/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        // Only comment owner or admin can delete
        if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Comment.deleteOne({ _id: comment._id });
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting comment' });
    }
});

// ============================================
// DISCUSSION ROUTES
// ============================================

// GET /api/discussions - Get all discussions
app.get('/api/discussions', async (req, res) => {
    try {
        const allDiscussions = await Discussion.find().sort({ timestamp: -1 });
        const result = [];

        for (const d of allDiscussions) {
            const replyCount = await Reply.countDocuments({ discussionId: d._id });
            result.push({
                id: d._id,
                userId: d.userId,
                username: d.username,
                title: d.title,
                content: d.content,
                category: d.category || 'General',
                likes: d.likes,
                likedBy: d.likedBy,
                replyCount,
                timestamp: d.timestamp.getTime()
            });
        }

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching discussions' });
    }
});

// POST /api/discussions - Create a discussion
app.post('/api/discussions', authMiddleware, async (req, res) => {
    try {
        const discussion = await Discussion.create({
            userId: req.user.id,
            username: req.user.username,
            title: req.body.title,
            content: req.body.content,
            category: req.body.category || 'General'
        });

        res.status(201).json({
            id: discussion._id,
            userId: discussion.userId,
            username: discussion.username,
            title: discussion.title,
            content: discussion.content,
            category: discussion.category,
            likes: 0,
            likedBy: [],
            replyCount: 0,
            timestamp: discussion.timestamp.getTime()
        });
    } catch (err) {
        res.status(500).json({ error: 'Error creating discussion' });
    }
});

// POST /api/discussions/:discussionId/like - Toggle like
app.post('/api/discussions/:discussionId/like', authMiddleware, async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.discussionId);
        if (!discussion) return res.status(404).json({ error: 'Discussion not found' });

        const userId = req.user.id;
        const likedIndex = discussion.likedBy.indexOf(userId);

        if (likedIndex > -1) {
            discussion.likedBy.splice(likedIndex, 1);
            discussion.likes = Math.max(0, discussion.likes - 1);
        } else {
            discussion.likedBy.push(userId);
            discussion.likes += 1;
        }

        await discussion.save();
        res.json({ likes: discussion.likes, likedBy: discussion.likedBy });
    } catch (err) {
        res.status(500).json({ error: 'Error toggling like' });
    }
});

// GET /api/discussions/:discussionId/replies - Get replies
app.get('/api/discussions/:discussionId/replies', async (req, res) => {
    try {
        const replies = await Reply.find({ discussionId: req.params.discussionId })
            .sort({ timestamp: 1 });
        res.json(replies.map(r => ({
            id: r._id,
            discussionId: r.discussionId,
            userId: r.userId,
            username: r.username,
            text: r.text,
            timestamp: r.timestamp.getTime()
        })));
    } catch (err) {
        res.status(500).json({ error: 'Error fetching replies' });
    }
});

// POST /api/discussions/:discussionId/replies - Add a reply
app.post('/api/discussions/:discussionId/replies', authMiddleware, async (req, res) => {
    try {
        const reply = await Reply.create({
            discussionId: req.params.discussionId,
            userId: req.user.id,
            username: req.user.username,
            text: req.body.text
        });
        res.status(201).json({
            id: reply._id,
            discussionId: reply.discussionId,
            userId: reply.userId,
            username: reply.username,
            text: reply.text,
            timestamp: reply.timestamp.getTime()
        });
    } catch (err) {
        res.status(500).json({ error: 'Error adding reply' });
    }
});

// ============================================
// Catch-all: serve frontend
// ============================================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ============================================
// Start Server
// ============================================
connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🎬 Cinema Muchatlu server running on http://localhost:${PORT}`);
        console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
});
