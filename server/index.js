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

const { User, Movie, Watchlist, Comment, Discussion, Reply, Music, CulturePost, UserEvent, UserInterest } = require('./models');
const { authMiddleware, optionalAuth } = require('./middleware');

// Hash function for deterministic A/B assignment
function getExperimentGroup(identifier) {
    if (!identifier) return 'A'; // Default fallback
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
        hash = ((hash << 5) - hash) + identifier.charCodeAt(i);
        hash |= 0;
    }
    const groups = ['A', 'B', 'C'];
    return groups[Math.abs(hash) % 3];
}
const { processUserEvent } = require('./recommendationEngine');

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

// GET /api/movies/trending - Get trending movies (Multiple Pages for Doom Scrolling)
app.get('/api/movies/trending', async (req, res) => {
    try {
        // Fetch truly trending Telugu movies by filtering strictly to the year 2026
        const url1 = `${TMDB_API}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_original_language=te&sort_by=popularity.desc&primary_release_year=2026&page=1`;
        const url2 = `${TMDB_API}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_original_language=te&sort_by=popularity.desc&primary_release_year=2026&page=2`;
        const url3 = `${TMDB_API}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_original_language=te&sort_by=popularity.desc&primary_release_year=2026&page=3`;
        
        const [res1, res2, res3] = await Promise.all([
            axios.get(url1),
            axios.get(url2),
            axios.get(url3)
        ]);
        
        const allResults = [...res1.data.results, ...res2.data.results, ...res3.data.results];
        const mapped = allResults.map(mapTMDBMovie);
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
// GET /api/discussions
app.get('/api/discussions', async (req, res) => {
    try {
        const { category } = req.query;
        let query = { status: 'ACTIVE' };
        if (category) query.category = category;
        
        const discussions = await Discussion.find(query).sort({ timestamp: -1 }).limit(50).lean();
        res.json(discussions);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching discussions' });
    }
});

// POST /api/discussions
app.post('/api/discussions', authMiddleware, async (req, res) => {
    try {
        const { title, content, category, media, movieId, actorId, songId } = req.body;
        const discussion = await Discussion.create({
            userId: req.user.id,
            username: req.user.username,
            title, content, category: category || 'General',
            media, movieId, actorId, songId
        });
        res.status(201).json(discussion);
    } catch (err) {
        res.status(500).json({ error: 'Error creating discussion' });
    }
});

// GET /api/discussions/:id (Full thread)
app.get('/api/discussions/:id', async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id).lean();
        if (!discussion || discussion.status !== 'ACTIVE') return res.status(404).json({ error: 'Not found' });
        
        const replies = await Reply.find({ discussionId: discussion._id, status: 'ACTIVE' }).sort({ timestamp: 1 }).lean();
        res.json({ discussion, replies });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching discussion thread' });
    }
});

// POST /api/discussions/:id/replies
app.post('/api/discussions/:id/replies', authMiddleware, async (req, res) => {
    try {
        const discussionId = req.params.id;
        const discussion = await Discussion.findById(discussionId);
        if (!discussion || discussion.status !== 'ACTIVE') return res.status(404).json({ error: 'Not found or locked' });
        
        const reply = await Reply.create({
            discussionId,
            userId: req.user.id,
            username: req.user.username,
            text: req.body.text
        });
        
        discussion.repliesCount += 1;
        await discussion.save();
        
        // Notification
        if (discussion.userId.toString() !== req.user.id) {
            await Notification.create({
                userId: discussion.userId,
                actorId: req.user.id,
                actorName: req.user.username,
                type: 'reply',
                discussionId
            });
        }
        
        res.status(201).json(reply);
    } catch (err) {
        res.status(500).json({ error: 'Error adding reply' });
    }
});

// DELETE /api/discussions/:id
app.delete('/api/discussions/:id', authMiddleware, async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) return res.status(404).json({ error: 'Not found' });
        if (discussion.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        discussion.status = 'REMOVED';
        await discussion.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting discussion' });
    }
});

// DELETE /api/replies/:id
app.delete('/api/replies/:id', authMiddleware, async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);
        if (!reply) return res.status(404).json({ error: 'Not found' });
        if (reply.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        reply.status = 'REMOVED';
        await reply.save();
        await Discussion.findByIdAndUpdate(reply.discussionId, { $inc: { repliesCount: -1 } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting reply' });
    }
});

// GET /api/notifications
app.get('/api/notifications', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id }).sort({ timestamp: -1 }).limit(20).lean();
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching notifications' });
    }
});

// ============================================
// CULTURE GRAPH FEED ROUTES
// ============================================

app.get('/api/feed', optionalAuth, async (req, res) => {
    try {
        const identifier = req.user ? req.user.id : req.headers['x-session-id'];
        const group = getExperimentGroup(identifier);

        let userInterest = null;
        if (req.user) {
            userInterest = await UserInterest.findOne({ userId: req.user.id }).lean();
        }

        let posts = await CulturePost.find({ moderationStatus: 'APPROVED' }).sort({ createdAt: -1 }).limit(30).lean();
        
        // Seed if empty
        if (posts.length === 0) {
            const seedPosts = [
                { type: 'news', title: 'SSMB29 Title Reveal!', content: 'Rajamouli and Mahesh Babu\'s globe-trotting adventure finally gets a title. Will this cross the 2000 Crore mark at the box office?', likes: [], commentsCount: 1245 },
                { type: 'meme', content: 'Bro after watching the interval bang of Spirit', media: 'https://i.imgflip.com/4/8k0a3j.jpg', likes: [], commentsCount: 328 },
                { type: 'poll', title: 'Best Telugu Comedy Movie of all time?', pollOptions: [{text: 'Athadu'}, {text: 'Venky'}, {text: 'Nuvvu Naaku Nachav'}, {text: 'Jamba Lakidi Pamba'}], likes: [], commentsCount: 842 },
                { type: 'dialogue', content: 'Okkokkadini kadu sharekhan... vandha mandini okesari pampu!', title: 'Magadheera (2009)', likes: [], commentsCount: 123 },
                { type: 'opinion', title: 'Unpopular Opinion', content: 'Kalki 2898 AD Part 2 is the greatest cinematic achievement of this decade, completely surpassing Baahubali.', likes: [], commentsCount: 456 }
            ];
            await CulturePost.insertMany(seedPosts);
            posts = await CulturePost.find({ moderationStatus: 'APPROVED' }).sort({ createdAt: -1 }).limit(30).lean();
        }

        // Fetch a few trending movies to interleave
        const trendingUrl = `${TMDB_API}/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_original_language=te&sort_by=popularity.desc&primary_release_year=2026&page=1`;
        const movieRes = await axios.get(trendingUrl);
        const topMovies = movieRes.data.results.slice(0, 6).map(mapTMDBMovie);
        
        // Combine them into a feed
        const mixedFeed = [];
        posts.forEach(post => mixedFeed.push({ feedType: 'culture', data: post }));
        topMovies.forEach(movie => mixedFeed.push({ feedType: 'movie', data: movie }));
        
        // Add some cached music if available
        if (cachedMusic && cachedMusic.length > 0) {
            cachedMusic.slice(0, 4).forEach(song => mixedFeed.push({ feedType: 'music', data: song }));
        }
        
        // Calculate Feed Relevancy Score (The Algorithm)
        const now = new Date();
        const scoredFeed = mixedFeed.map(item => {
            let globalScore = 0;
            let personalScore = 0;
            
            let matchedEntities = [];
            let matchedContentType = null;
            
            if (item.feedType === 'culture') {
                const post = item.data;
                // Engagement score: sum of all expressive reactions + comments
                let reactionsCount = 0;
                if (post.reactions) {
                    reactionsCount = (post.reactions.mass || 0) + (post.reactions.lol || 0) + 
                                     (post.reactions.love || 0) + (post.reactions.wtf || 0) + 
                                     (post.reactions.emotional || 0);
                }
                const engagement = (reactionsCount * 2) + ((post.commentsCount || 0) * 3);
                
                // Freshness: exponential decay over days
                const postDate = new Date(post.createdAt || now);
                const daysOld = Math.max(0, (now - postDate) / (1000 * 60 * 60 * 24));
                const freshness = Math.max(0.1, 1 - (daysOld * 0.1));
                
                globalScore = (10 + engagement) * freshness;
                
                // Boost certain types to ensure a dynamic feed
                if (post.type === 'news') globalScore *= 1.2;
                if (post.type === 'poll') globalScore *= 1.15;
                if (post.type === 'meme') globalScore *= 1.05;

                // Personal Score calculation
                if (userInterest) {
                    const cTypeScore = userInterest.contentTypes?.[post.type] || 0;
                    if (cTypeScore > 0) matchedContentType = post.type;
                    
                    const mScore = post.movieId ? (userInterest.entities?.movies?.[post.movieId] || 0) : 0;
                    if (mScore > 0) matchedEntities.push(`Movie: ${post.movieId}`);
                    
                    const aScore = post.actorId ? (userInterest.entities?.actors?.[post.actorId] || 0) : 0;
                    if (aScore > 0) matchedEntities.push(`Actor: ${post.actorId}`);
                    
                    const sScore = post.songId ? (userInterest.entities?.songs?.[post.songId] || 0) : 0;
                    if (sScore > 0) matchedEntities.push(`Song: ${post.songId}`);
                    
                    personalScore = cTypeScore + mScore + aScore + sScore;
                }
                
            } else if (item.feedType === 'movie') {
                const movie = item.data;
                globalScore = (movie.popularity || 10) / 10;
                // Boost highly anticipated movies
                globalScore *= 1.3;

                if (userInterest) {
                    personalScore = userInterest.entities?.movies?.[movie.id] || 0;
                    if (personalScore > 0) matchedEntities.push(`Movie: ${movie.id}`);
                }
            } else if (item.feedType === 'music') {
                globalScore = 15; // Baseline high score for viral tracks
                
                if (userInterest) {
                    personalScore = userInterest.entities?.songs?.[item.data.id] || 0;
                    if (personalScore > 0) matchedEntities.push(`Song: ${item.data.id}`);
                }
            }
            
            // Configurable Weights by Experiment Group
            let pWeight = parseFloat(process.env.PERSONAL_WEIGHT || '0.40');
            let gWeight = parseFloat(process.env.GLOBAL_WEIGHT || '0.60');
            
            if (group === 'B') {
                pWeight = 0.50;
                gWeight = 0.50;
            } else if (group === 'C') {
                pWeight = 0.60;
                gWeight = 0.40;
            }

            // Blend Global and Personal Scores based on config
            const normalizedPersonal = personalScore > 0 ? (personalScore * 2) : 0;
            const blendedScore = (globalScore * gWeight) + (normalizedPersonal * pWeight);

            // Determine primary source for analytics
            let source = 'global';
            if (normalizedPersonal > (globalScore * gWeight)) {
                source = 'personalized';
            }

            // Add a small randomization jitter (0.8x to 1.2x) so the feed isn't perfectly static
            const jitter = 0.8 + (Math.random() * 0.4);
            const finalScore = blendedScore * jitter;
            
            const _debugInfo = {
                personalScore: personalScore.toFixed(2),
                globalScore: globalScore.toFixed(2),
                finalScore: finalScore.toFixed(2),
                source,
                matchedEntities,
                matchedContentType
            };
            
            return { ...item, score: finalScore, _source: source, _debugInfo };
        });
        
        // Sort initially by computed Relevancy Score (descending)
        let sortedFeed = scoredFeed.sort((a, b) => b.score - a.score);

        // ============================================
        // DIVERSITY RERANKER (Phase 4)
        // Max 2 consecutive entities, Max 3 consecutive types
        // ============================================
        const diverseFeed = [];
        let consecutiveEntityCount = 0;
        let lastEntity = null;
        let consecutiveTypeCount = 0;
        let lastType = null;
        
        while (sortedFeed.length > 0) {
            let selectedIdx = 0; // Default to highest scored item
            
            // Scan top 10 items for the first one that doesn't violate diversity rules
            for (let i = 0; i < Math.min(10, sortedFeed.length); i++) {
                const candidate = sortedFeed[i];
                
                // Extract entity for diversity check
                let entity = null;
                if (candidate.feedType === 'culture') {
                    entity = candidate.data.actorId || candidate.data.movieId || candidate.data.songId;
                } else if (candidate.feedType === 'movie' || candidate.feedType === 'music') {
                    entity = candidate.data.id;
                }
                
                // Extract type for diversity check
                let type = candidate.feedType === 'culture' ? candidate.data.type : candidate.feedType;
                
                const entityLimit = parseInt(process.env.ENTITY_CONSECUTIVE_LIMIT || '2');
                const typeLimit = parseInt(process.env.CONTENT_TYPE_CONSECUTIVE_LIMIT || '3');

                const violatesEntity = (entity && entity === lastEntity && consecutiveEntityCount >= entityLimit);
                const violatesType = (type === lastType && consecutiveTypeCount >= typeLimit);
                
                // If it passes the checks (or we have no better options in the scan window)
                if (!violatesEntity && !violatesType) {
                    selectedIdx = i;
                    break; // Found our best valid candidate
                }
            }
            
            // Pull the selected item from the array
            const [selectedItem] = sortedFeed.splice(selectedIdx, 1);
            diverseFeed.push(selectedItem);
            
            // Update trackers
            let selectedEntity = null;
            if (selectedItem.feedType === 'culture') {
                selectedEntity = selectedItem.data.actorId || selectedItem.data.movieId || selectedItem.data.songId;
            } else if (selectedItem.feedType === 'movie' || selectedItem.feedType === 'music') {
                selectedEntity = selectedItem.data.id;
            }
            let selectedType = selectedItem.feedType === 'culture' ? selectedItem.data.type : selectedItem.feedType;
            
            if (selectedEntity && selectedEntity === lastEntity) {
                consecutiveEntityCount++;
            } else {
                lastEntity = selectedEntity;
                consecutiveEntityCount = 1;
            }
            
            if (selectedType === lastType) {
                consecutiveTypeCount++;
            } else {
                lastType = selectedType;
                consecutiveTypeCount = 1;
            }
        }
        
        // ============================================
        // EXPLORATION BUCKET (Phase 4)
        // Inject dynamic percentage (default ~10%) from the bottom (unseen/unrelated) into the top feed
        // ============================================
        if (diverseFeed.length > 10) {
            let expPercent = parseFloat(process.env.EXPLORATION_PERCENT || '0.10');
            if (group === 'C') expPercent = 0.15;
            
            // Take the bottom % of items (lowest personal + global score)
            const explorationCandidates = diverseFeed.splice(-Math.floor(diverseFeed.length * expPercent));
            
            explorationCandidates.forEach(explorationItem => {
                // Force them into the upper feed (between positions 3 and 15) to guarantee they are seen
                // This tests the user's appetite for new entities/topics
                const insertIdx = Math.floor(Math.random() * 12) + 3;
                explorationItem._source = 'exploration';
                diverseFeed.splice(Math.min(insertIdx, diverseFeed.length), 0, explorationItem);
            });
        }
        
        const finalFeed = diverseFeed.map(item => {
            delete item.score; // Clean up payload
            return item;
        });
        
        res.json(finalFeed);
    } catch (err) {
        console.error('Error fetching feed:', err);
        res.status(500).json({ error: 'Error generating culture feed' });
    }
});

// ============================================
// MUSIC ROUTES (JIOSAAVN INTEGRATION)
// ============================================

let cachedMusic = [];
let lastMusicFetch = 0;

// GET /api/music - Get popular Telugu music live from local JioSaavn API
app.get('/api/music', async (req, res) => {
    try {
        const searchQuery = req.query.search || 'telugu+hit+songs';
        
        // Cache results for 1 hour to prevent excessive requests (only cache default hits, not search)
        if (!req.query.search && cachedMusic.length > 0 && (Date.now() - lastMusicFetch) < 3600000) {
            return res.json(cachedMusic);
        }

        // Search JioSaavn via local API instance
        const response = await axios.get(`http://localhost:3000/api/search/songs?query=${searchQuery}&limit=40`);
        
        // Handle different response structures for jiosaavn-api
        const songs = response.data.data?.results || response.data.results || [];
        
        cachedMusic = songs.map(song => {
            // Find highest resolution image
            let bestImage = '';
            if (Array.isArray(song.image)) {
                bestImage = song.image[song.image.length - 1]?.url || song.image[0]?.link || '';
            } else {
                bestImage = song.image;
            }

            // Find highest quality audio stream URL
            let bestMedia = '';
            const downloadUrls = song.downloadUrl || song.media_url;
            if (Array.isArray(downloadUrls)) {
                bestMedia = downloadUrls[downloadUrls.length - 1]?.url || downloadUrls[0]?.link || '';
            } else {
                bestMedia = downloadUrls;
            }
            
            return {
                title: song.name || song.title || song.song,
                artist: song.primaryArtists || song.primary_artists || 'Unknown Artist',
                thumbnailUrl: bestImage,
                mediaUrl: bestMedia,
                providerId: song.id
            };
        });
        
        lastMusicFetch = Date.now();
        res.json(cachedMusic);
    } catch (err) {
        console.error('Error fetching music from JioSaavn API:', err.message);
        
        // Fallback to static mock data if scraping fails
        const fallbackMusic = [
            {
                title: "Naa Roja Nuvve (From Kushi)",
                artist: "Hesham Abdul Wahab",
                thumbnailUrl: "https://c.saavncdn.com/712/Kushi-Telugu-2023-20230829141042-500x500.jpg",
                mediaUrl: "https://www.youtube.com/embed/bQd0Dk8Wz6M"
            },
            {
                title: "Srivalli (From Pushpa)",
                artist: "Sid Sriram, Devi Sri Prasad",
                thumbnailUrl: "https://c.saavncdn.com/188/Srivalli-From-Pushpa-The-Rise-Part-01-Telugu-2021-20211013110903-500x500.jpg",
                mediaUrl: "https://www.youtube.com/embed/hcMzwMrr1tE"
            }
        ];
        res.json(fallbackMusic);
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
// TELEMETRY & EVENTS ROUTE (Recommendation Engine v1)
// ============================================

// ============================================
// Memes API
// ============================================

// GET /api/memes
app.get('/api/memes', async (req, res) => {
    try {
        const memes = await CulturePost.find({ type: 'meme', moderationStatus: 'APPROVED' })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        res.json(memes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/memes/trending
app.get('/api/memes/trending', async (req, res) => {
    try {
        const memes = await CulturePost.find({ type: 'meme', moderationStatus: 'APPROVED' })
            .sort({ 'reactions.lol': -1, 'reactions.mass': -1, createdAt: -1 })
            .limit(50)
            .lean();
        res.json(memes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/memes
app.post('/api/memes', authMiddleware, async (req, res) => {
    try {
        const { content, media, movieId, actorId, songId, tags } = req.body;
        const meme = new CulturePost({
            type: 'meme',
            content,
            media,
            movieId,
            actorId,
            songId,
            tags,
            authorId: req.user.id,
            authorName: req.user.username || 'User',
            moderationStatus: 'PENDING'
        });
        await meme.save();
        res.status(201).json(meme);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/memes/pending (Admin)
app.get('/api/memes/pending', async (req, res) => {
    try {
        const memes = await CulturePost.find({ type: 'meme', moderationStatus: 'PENDING' })
            .sort({ createdAt: -1 })
            .lean();
        res.json(memes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/memes/:id/moderate (Admin)
app.post('/api/memes/:id/moderate', async (req, res) => {
    try {
        const { status } = req.body; // 'APPROVED' or 'REJECTED'
        const meme = await CulturePost.findByIdAndUpdate(req.params.id, { moderationStatus: status }, { new: true });
        res.json(meme);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/events', optionalAuth, async (req, res) => {
    try {
        const { eventType, targetType, targetId, entityType, entityId, metadata } = req.body;
        
        const identifier = req.user ? req.user.id : req.headers['x-session-id'];
        const group = getExperimentGroup(identifier);
        
        // 1. Log the event for the recommendation engine
        const event = new UserEvent({
            userId: req.user ? req.user.id : null,
            sessionId: req.headers['x-session-id'],
            experimentGroup: group,
            eventType, 
            targetType, 
            targetId, 
            entityType, 
            entityId, 
            metadata
        });
        await event.save();
        
        // 2. Process the event to update the User Interest Vector (Phase 2)
        if (req.user) {
            // Run asynchronously, no need to block the response
            processUserEvent(req.user.id, eventType, targetType, targetId, metadata);
        }
        
        // 3. If it's a reaction, update the actual model count
        if (eventType === 'reaction') {
            const reactionType = metadata?.reaction;
            if (reactionType) {
                const updatePath = `reactions.${reactionType}`;
                if (targetType === 'culturePost') {
                    await CulturePost.findByIdAndUpdate(targetId, { $inc: { [updatePath]: 1 } });
                } else if (targetType === 'discussion') {
                    await Discussion.findByIdAndUpdate(targetId, { $inc: { [updatePath]: 1 } });
                } else if (targetType === 'reply') {
                    await Reply.findByIdAndUpdate(targetId, { $inc: { [updatePath]: 1 } });
                }
            }
        }
        
        // 4. If it's a poll vote, update the actual CulturePost count
        if (eventType === 'poll_vote' && targetType === 'culturePost') {
            const optionIndex = metadata?.optionIndex;
            if (optionIndex !== undefined) {
                const updatePath = `pollOptions.${optionIndex}.votes`;
                await CulturePost.findByIdAndUpdate(targetId, {
                    $inc: { [updatePath]: 1 }
                });
            }
        }
        
        res.json({ success: true });
    } catch (err) {
        console.error('Error tracking event:', err);
        res.status(500).json({ error: 'Failed to track event' });
    }
});

// GET /api/recommendations/debug/:userId
app.get('/api/recommendations/debug/:userId', async (req, res) => {
    try {
        const interest = await UserInterest.findOne({ userId: req.params.userId }).lean();
        if (!interest) {
            return res.json({ message: 'No interest profile found for this user.' });
        }
        res.json(interest);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch debug interest profile' });
    }
});

// ============================================
// RECOMMENDATION ANALYTICS (Phase 5)
// ============================================
app.get('/api/analytics/recommendations', async (req, res) => {
    try {
        // Aggregate all telemetry events
        const events = await UserEvent.find().lean();
        
        const stats = {
            totalEvents: events.length,
            breakdown: {
                reactions: events.filter(e => e.eventType === 'reaction').length,
                impressions: events.filter(e => e.eventType === 'feed_impression').length,
                comments: events.filter(e => e.eventType === 'comment').length,
            },
            performanceBySource: {
                personalized: { impressions: 0, engagements: 0 },
                global: { impressions: 0, engagements: 0 },
                exploration: { impressions: 0, engagements: 0 }
            },
            performanceByGroup: {
                A: { impressions: 0, engagements: 0 },
                B: { impressions: 0, engagements: 0 },
                C: { impressions: 0, engagements: 0 }
            }
        };

        // Calculate CTR / Engagement by Source and Group
        events.forEach(e => {
            const source = e.metadata?.source || 'unknown';
            if (stats.performanceBySource[source]) {
                if (e.eventType === 'feed_impression') {
                    stats.performanceBySource[source].impressions++;
                } else if (['reaction', 'comment', 'share', 'save'].includes(e.eventType)) {
                    stats.performanceBySource[source].engagements++;
                }
            }
            
            const group = e.experimentGroup || 'A';
            if (stats.performanceByGroup[group]) {
                if (e.eventType === 'feed_impression') {
                    stats.performanceByGroup[group].impressions++;
                } else if (['reaction', 'comment', 'share', 'save'].includes(e.eventType)) {
                    stats.performanceByGroup[group].engagements++;
                }
            }
        });

        // Compute Rates
        Object.keys(stats.performanceBySource).forEach(source => {
            const data = stats.performanceBySource[source];
            data.engagementRate = data.impressions > 0 
                ? ((data.engagements / data.impressions) * 100).toFixed(2) + '%' 
                : '0%';
        });
        
        Object.keys(stats.performanceByGroup).forEach(group => {
            const data = stats.performanceByGroup[group];
            data.engagementRate = data.impressions > 0 
                ? ((data.engagements / data.impressions) * 100).toFixed(2) + '%' 
                : '0%';
        });

        res.json(stats);
    } catch (err) {
        console.error('Error fetching analytics:', err);
        res.status(500).json({ error: 'Failed to generate analytics report' });
    }
});

// ============================================
connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🎬 Cinema Muchatlu server running on http://localhost:${PORT}`);
        console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
});
