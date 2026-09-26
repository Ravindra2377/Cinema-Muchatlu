// ============================================
// Cinema Muchatlu - Movie Community Platform
// ============================================

// ============================================
// Data Models & Storage
// ============================================

const STORAGE_KEYS = {
    USERS: 'cinema_muchatlu_users',
    CURRENT_USER: 'cinema_muchatlu_currentUser',
    MOVIES: 'cinema_muchatlu_movies',
    WATCHLIST: 'cinema_muchatlu_watchlist',
    COMMENTS: 'cinema_muchatlu_comments',
    DISCUSSIONS: 'cinema_muchatlu_discussions',
    REPLIES: 'cinema_muchatlu_replies'
};

// Sample Movie Database
const SAMPLE_MOVIES = [
    {
        id: '1',
        title: 'The Shawshank Redemption',
        year: 1994,
        genre: ['Drama'],
        rating: 9.3,
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        director: 'Frank Darabont',
        cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']
    },
    {
        id: '2',
        title: 'The Dark Knight',
        year: 2008,
        genre: ['Action', 'Drama'],
        rating: 9.0,
        poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
        director: 'Christopher Nolan',
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart']
    },
    {
        id: '3',
        title: 'Inception',
        year: 2010,
        genre: ['Sci-Fi', 'Action'],
        rating: 8.8,
        poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
        director: 'Christopher Nolan',
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page']
    },
    {
        id: '4',
        title: 'Pulp Fiction',
        year: 1994,
        genre: ['Drama', 'Thriller'],
        rating: 8.9,
        poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        director: 'Quentin Tarantino',
        cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson']
    },
    {
        id: '5',
        title: 'Interstellar',
        year: 2014,
        genre: ['Sci-Fi', 'Drama'],
        rating: 8.6,
        poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain']
    },
    {
        id: '6',
        title: 'The Matrix',
        year: 1999,
        genre: ['Sci-Fi', 'Action'],
        rating: 8.7,
        poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
        director: 'The Wachowskis',
        cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss']
    },
    {
        id: '7',
        title: 'Goodfellas',
        year: 1990,
        genre: ['Drama', 'Thriller'],
        rating: 8.7,
        poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
        description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife and his partners in crime.',
        director: 'Martin Scorsese',
        cast: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci']
    },
    {
        id: '8',
        title: 'Fight Club',
        year: 1999,
        genre: ['Drama', 'Thriller'],
        rating: 8.8,
        poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
        description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much more.',
        director: 'David Fincher',
        cast: ['Brad Pitt', 'Edward Norton', 'Helena Bonham Carter']
    },
    {
        id: '9',
        title: 'Forrest Gump',
        year: 1994,
        genre: ['Drama', 'Comedy'],
        rating: 8.8,
        poster: 'https://images.unsplash.com/photo-1574267432644-f610f5b17a3e?w=400&h=600&fit=crop',
        description: 'The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.',
        director: 'Robert Zemeckis',
        cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise']
    },
    {
        id: '10',
        title: 'The Godfather',
        year: 1972,
        genre: ['Drama', 'Thriller'],
        rating: 9.2,
        poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
        description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        director: 'Francis Ford Coppola',
        cast: ['Marlon Brando', 'Al Pacino', 'James Caan']
    },
    {
        id: '11',
        title: 'Gladiator',
        year: 2000,
        genre: ['Action', 'Drama'],
        rating: 8.5,
        poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
        director: 'Ridley Scott',
        cast: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen']
    },
    {
        id: '12',
        title: 'The Prestige',
        year: 2006,
        genre: ['Drama', 'Thriller'],
        rating: 8.5,
        poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
        description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have.',
        director: 'Christopher Nolan',
        cast: ['Christian Bale', 'Hugh Jackman', 'Scarlett Johansson']
    },
    {
        id: '13',
        title: 'The Departed',
        year: 2006,
        genre: ['Drama', 'Thriller'],
        rating: 8.5,
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in Boston.',
        director: 'Martin Scorsese',
        cast: ['Leonardo DiCaprio', 'Matt Damon', 'Jack Nicholson']
    },
    {
        id: '14',
        title: 'Whiplash',
        year: 2014,
        genre: ['Drama'],
        rating: 8.5,
        poster: 'https://images.unsplash.com/photo-1574267432644-f610f5b17a3e?w=400&h=600&fit=crop',
        description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor.',
        director: 'Damien Chazelle',
        cast: ['Miles Teller', 'J.K. Simmons', 'Melissa Benoist']
    },
    {
        id: '15',
        title: 'The Silence of the Lambs',
        year: 1991,
        genre: ['Thriller', 'Horror'],
        rating: 8.6,
        poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        description: 'A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to catch another serial killer.',
        director: 'Jonathan Demme',
        cast: ['Jodie Foster', 'Anthony Hopkins', 'Lawrence A. Bonney']
    },
    {
        id: '16',
        title: 'Saving Private Ryan',
        year: 1998,
        genre: ['Action', 'Drama'],
        rating: 8.6,
        poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
        description: 'Following the Normandy Landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed.',
        director: 'Steven Spielberg',
        cast: ['Tom Hanks', 'Matt Damon', 'Tom Sizemore']
    },
    {
        id: '17',
        title: 'Se7en',
        year: 1995,
        genre: ['Thriller', 'Horror'],
        rating: 8.6,
        poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        description: 'Two detectives hunt a serial killer who uses the seven deadly sins as his motives.',
        director: 'David Fincher',
        cast: ['Morgan Freeman', 'Brad Pitt', 'Kevin Spacey']
    },
    {
        id: '18',
        title: 'The Green Mile',
        year: 1999,
        genre: ['Drama'],
        rating: 8.6,
        poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop',
        description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape, yet who has a mysterious gift.',
        director: 'Frank Darabont',
        cast: ['Tom Hanks', 'Michael Clarke Duncan', 'David Morse']
    },
    {
        id: '19',
        title: 'The Usual Suspects',
        year: 1995,
        genre: ['Thriller', 'Drama'],
        rating: 8.5,
        poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
        description: 'A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which began when five criminals met.',
        director: 'Bryan Singer',
        cast: ['Kevin Spacey', 'Gabriel Byrne', 'Chazz Palminteri']
    },
    {
        id: '20',
        title: 'The Lion King',
        year: 1994,
        genre: ['Drama', 'Comedy'],
        rating: 8.5,
        poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
        director: 'Roger Allers, Rob Minkoff',
        cast: ['Matthew Broderick', 'Jeremy Irons', 'James Earl Jones']
    }
];

// Sample Discussions
const SAMPLE_DISCUSSIONS = [
    {
        id: 'd1',
        userId: 'admin',
        username: 'MuchatluAdmin',
        title: 'What makes a perfect movie ending?',
        content: 'I\'ve been thinking about what makes a movie ending truly memorable. Is it the twist, the emotional payoff, or something else entirely? What are your thoughts?',
        likes: 15,
        likedBy: [],
        replies: [],
        timestamp: Date.now() - 86400000 * 2
    },
    {
        id: 'd2',
        userId: 'admin',
        username: 'MuchatluAdmin',
        title: 'Christopher Nolan\'s best work?',
        content: 'Nolan has given us so many masterpieces - Inception, The Dark Knight, Interstellar, The Prestige. Which one do you think is his magnum opus and why?',
        likes: 23,
        likedBy: [],
        replies: [],
        timestamp: Date.now() - 86400000 * 5
    },
    {
        id: 'd3',
        userId: 'admin',
        username: 'MuchatluAdmin',
        title: 'Underrated movies that deserve more love',
        content: 'Let\'s talk about those hidden gems that didn\'t get the recognition they deserved. What are some underrated movies you think everyone should watch?',
        likes: 18,
        likedBy: [],
        replies: [],
        timestamp: Date.now() - 86400000 * 7
    }
];



// ============================================
// State Management
// ============================================

// currentUser is now declared in auth.js
let allMovies = [];
let watchlist = [];
let comments = [];
let discussions = [];
let replies = [];
let musicTracks = [];
let feedItems = [];
let currentFilter = 'all';
let currentContentType = 'all';

// ============================================
// Utility Functions
// ============================================

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
}

function getUserInitial(username) {
    return username ? username.charAt(0).toUpperCase() : 'U';
}

function calculateReputation(userId) {
    let reputation = 0;

    // Points for comments
    const userComments = comments.filter(c => c.userId === userId);
    reputation += userComments.length * 5;

    // Points for likes received on comments
    userComments.forEach(comment => {
        reputation += comment.likes * 2;
    });

    // Points for discussions
    const userDiscussions = discussions.filter(d => d.userId === userId);
    reputation += userDiscussions.length * 10;

    // Points for likes received on discussions
    userDiscussions.forEach(discussion => {
        reputation += discussion.likes * 2;
    });

    // Points for replies
    const userReplies = replies.filter(r => r.userId === userId);
    reputation += userReplies.length * 3;

    return reputation;
}

function getBadges(reputation) {
    const badges = [];
    if (reputation >= 1000) badges.push('gold');
    if (reputation >= 500) badges.push('silver');
    if (reputation >= 100) badges.push('bronze');
    return badges;
}



function updateHeroStats() {
    // Hero stats section removed - function kept as no-op for any remaining calls
}

// ============================================
// Authentication Functions
// ============================================
// NOTE: Authentication is now handled by auth.js using Supabase Auth
// Old localStorage-based auth functions have been removed to prevent conflicts

// ============================================
// Movie Functions
// ============================================

async function fetchMoviesFromAPI(searchQuery = '') {
    try {
        const url = searchQuery ? `/movies?search=${encodeURIComponent(searchQuery)}` : '/movies';
        const movies = await apiFetch(url);
        if (!movies || movies.length === 0) {
            console.log('No movies found in database');
            return null;
        }
        console.log(`Fetched ${movies.length} movies from API`);
        return movies;
    } catch (err) {
        console.error('Error fetching movies from API:', err);
        return null;
    }
}

async function initMovies() {
    // Load from API
    console.log('Initializing movies...');
    let movies = await fetchMoviesFromAPI();

    if (movies) {
        console.log(`Loaded ${movies.length} movies from MongoDB`);
        allMovies = movies;
    } else {
        // Fallback to sample data if API fails
        console.log('API unavailable, falling back to sample data');
        allMovies = SAMPLE_MOVIES;
    }

    renderMovies();
    renderTrendingMovies();
}

function renderMovies(filter = 'all', searchQuery = '') {
    const moviesGrid = document.getElementById('moviesGrid');
    let filteredMovies = allMovies;

    // Apply content type filter
    if (currentContentType !== 'all') {
        filteredMovies = filteredMovies.filter(movie =>
            (movie.content_type || 'Movie') === currentContentType
        );
    }

    // Apply genre filter
    if (filter !== 'all') {
        filteredMovies = filteredMovies.filter(movie => movie.genre.includes(filter));
    }

    moviesGrid.innerHTML = filteredMovies.map(movie => `
        <div class="movie-card" data-movie-id="${movie.id}">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <button class="watchlist-btn ${isInWatchlist(movie.id) ? 'active' : ''}" data-movie-id="${movie.id}">
                <svg viewBox="0 0 24 24" fill="${isInWatchlist(movie.id) ? 'currentColor' : 'none'}" stroke="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-rating">⭐ ${movie.rating}</span>
                    <span>${movie.year}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.watchlist-btn')) {
                const movieId = card.dataset.movieId;
                showMovieDetail(movieId);
            }
        });
    });

    // Add watchlist button listeners
    document.querySelectorAll('.watchlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const movieId = btn.dataset.movieId;
            toggleWatchlist(movieId);
        });
    });
}

async function renderTrendingMovies() {
    const trendingCarousel = document.getElementById('trendingCarousel');
    let trendingMovies = [];
    
    try {
        trendingMovies = await apiFetch('/movies/trending');
        // Add fetched trending movies to allMovies so the modal click works
        trendingMovies.forEach(tm => {
            if (!allMovies.find(m => m.id === tm.id)) {
                allMovies.push(tm);
            }
        });
    } catch (err) {
        console.error('Failed to fetch trending movies from API', err);
        // Fallback to highest rated if API fails
        trendingMovies = allMovies.sort((a, b) => b.rating - a.rating).slice(0, 40);
    }

    trendingCarousel.innerHTML = trendingMovies.map(movie => `
        <div class="trending-card movie-card" data-movie-id="${movie.id}">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-rating">⭐ ${movie.rating}</span>
                    <span>${movie.year}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.trending-card').forEach(card => {
        card.addEventListener('click', () => {
            const movieId = card.dataset.movieId;
            showMovieDetail(movieId);
        });
    });
}

// ============================================
// Feed & Telemetry Functions
// ============================================

async function trackEvent(eventType, targetType, targetId, entityType = null, entityId = null, metadata = {}) {
    try {
        const token = localStorage.getItem('token');
        let sessionId = localStorage.getItem('sessionId');
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('sessionId', sessionId);
        }
        const headers = { 
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        await fetch('/api/events', {
            method: 'POST',
            headers,
            body: JSON.stringify({ eventType, targetType, targetId, entityType, entityId, metadata })
        });
    } catch (err) {
        console.error('Error tracking event:', err);
    }
}

// Intersection Observer for true Feed Impressions
const feedObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const postId = el.getAttribute('data-post-id');
            const source = el.getAttribute('data-source');
            
            if (postId) {
                trackEvent('feed_impression', 'culturePost', postId, null, null, { source });
                observer.unobserve(el); // Only track impression once per page load
            }
        }
    });
}, { threshold: 0.5 }); // Require 50% of card to be visible

async function handleReaction(postId, reactionType, buttonElement) {
    // Optimistic UI update
    const textNode = buttonElement.childNodes[buttonElement.childNodes.length - 1];
    const currentText = textNode.textContent || "";
    const currentCount = parseInt(currentText.replace(/[^0-9]/g, '')) || 0;
    textNode.textContent = currentText.replace(/[0-9]+/, currentCount + 1);
    if (!currentText.match(/[0-9]+/)) {
        textNode.textContent = ` ${currentCount + 1}`;
    }
    
    // Prevent multiple clicks easily
    buttonElement.style.pointerEvents = 'none';
    buttonElement.style.opacity = '0.7';

    // Analytics: Find source of this post (exploration, personalized, global)
    let source = 'global';
    const feedItem = feedItems.find(i => i.feedType === 'culture' && i.data._id === postId);
    if (feedItem && feedItem._source) {
        source = feedItem._source;
    }

    // Track the event which also updates the backend DB
    await trackEvent('reaction', 'culturePost', postId, null, null, { reaction: reactionType, source });
}

async function handlePollVote(postId, optionIndex, buttonElement) {
    // Optimistic UI update
    buttonElement.style.background = '#34c759';
    buttonElement.style.borderColor = '#34c759';
    
    // Disable all siblings
    const parent = buttonElement.parentElement;
    Array.from(parent.children).forEach(child => {
        child.style.pointerEvents = 'none';
        if (child !== buttonElement) child.style.opacity = '0.5';
    });

    let source = 'global';
    const feedItem = feedItems.find(i => i.feedType === 'culture' && i.data._id === postId);
    if (feedItem && feedItem._source) {
        source = feedItem._source;
    }

    await trackEvent('poll_vote', 'culturePost', postId, null, null, { optionIndex, source });
}

async function initFeed() {
    try {
        feedItems = await apiFetch('/feed');
        renderFeed();
    } catch (err) {
        console.error('Error fetching feed:', err);
    }
}

function renderFeed() {
    const feedContainer = document.getElementById('feedContainer');
    if (!feedContainer) return;
    
    feedContainer.innerHTML = feedItems.map(item => {
        if (item.feedType === 'culture') {
            const post = item.data;
            const source = item._source || 'global';
            const debug = item._debugInfo || {};
            
            const debugHtml = (currentUser && currentUser.isAdmin) ? `
                <details style="margin-top: 1rem;">
                    <summary style="cursor: pointer; color: #888; font-size: 0.8rem; user-select: none;">ℹ️ Admin Debug: Why am I seeing this?</summary>
                    <div style="margin-top: 0.5rem; padding: 1rem; background: #000; border-radius: 8px; font-size: 0.8rem; border: 1px solid #333;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #aaa;">Personal Score</span> <span style="color: #34c759;">+${debug.personalScore || 0}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #aaa;">Global Score</span> <span style="color: #007aff;">+${debug.globalScore || 0}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; border-top: 1px solid #333; padding-top: 0.5rem;">
                            <span style="color: #aaa;">Final Score</span> <strong style="color: #fff;">${debug.finalScore || 0}</strong>
                        </div>
                        ${debug.matchedEntities && debug.matchedEntities.length > 0 ? `<div style="margin-top: 0.5rem; color: #888;">Matches: ${debug.matchedEntities.join(', ')}</div>` : ''}
                    </div>
                </details>
            ` : '';
            
            if (post.type === 'news') {
                return `<div class="feed-card" data-post-id="${post._id}" data-source="${source}" style="background: var(--bg-card); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color);">
                    <div style="color: var(--primary-color); font-size: 0.8rem; font-weight: bold; margin-bottom: 0.5rem; text-transform: uppercase;">🔥 Trending News</div>
                    <h3 style="margin-bottom: 0.5rem; font-size: 1.2rem;">${post.title}</h3>
                    <p style="color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">${post.content}</p>
                    <div style="display: flex; gap: 1rem; color: #888; font-size: 0.9rem;">
                        <span style="cursor:pointer;" onclick="handleReaction('${post._id}', 'mass', this)">🔥 <span>${post.reactions?.mass || 0}</span></span>
                        <span style="cursor:pointer;" onclick="handleReaction('${post._id}', 'love', this)">❤️ <span>${post.reactions?.love || 0}</span></span>
                        <span style="cursor:pointer;" onclick="handleReaction('${post._id}', 'wtf', this)">🤯 <span>${post.reactions?.wtf || 0}</span></span>
                        <span>💬 ${post.commentsCount} Muchatlu</span>
                    </div>
                    ${debugHtml}
                </div>`;
            } else if (post.type === 'meme') {
                return `<div class="feed-card" data-post-id="${post._id}" data-source="${source}" style="background: var(--bg-card); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color);">
                    <div style="color: #34c759; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.5rem; text-transform: uppercase;">😂 Meme</div>
                    <p style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.1rem;">${post.content}</p>
                    <img src="${post.media}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;" />
                    <div style="display: flex; gap: 1rem; color: #888; font-size: 0.9rem;">
                        <span style="cursor:pointer;" onclick="handleReaction('${post._id}', 'lol', this)">😂 <span>${post.reactions?.lol || 0}</span> LOL</span>
                        <span style="cursor:pointer;" onclick="handleReaction('${post._id}', 'mass', this)">🔥 <span>${post.reactions?.mass || 0}</span></span>
                        <span>💬 ${post.commentsCount} Muchatlu</span>
                    </div>
                    ${debugHtml}
                </div>`;
            } else if (post.type === 'poll') {
                return `<div class="feed-card" data-post-id="${post._id}" data-source="${source}" style="background: var(--bg-card); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color);">
                    <div style="color: #007aff; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.5rem; text-transform: uppercase;">📊 Poll</div>
                    <h3 style="margin-bottom: 1rem; font-size: 1.2rem;">${post.title}</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                        ${post.pollOptions.map((opt, index) => `<button style="background: #2a2a2a; color: white; border: 1px solid var(--border-color); padding: 0.75rem; border-radius: 8px; text-align: left; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#333'" onmouseout="this.style.background='#2a2a2a'" onclick="handlePollVote('${post._id}', ${index}, this)">${opt.text}</button>`).join('')}
                    </div>
                    <div style="display: flex; gap: 1rem; color: #888; font-size: 0.9rem;">
                        <span>💬 ${post.commentsCount} Muchatlu</span>
                    </div>
                    ${debugHtml}
                </div>`;
            } else if (post.type === 'dialogue') {
                return `<div class="feed-card" data-post-id="${post._id}" data-source="${source}" style="background: var(--bg-card); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); border-left: 4px solid #ff9500;">
                    <div style="color: #ff9500; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.5rem; text-transform: uppercase;">🗣️ Iconic Dialogue</div>
                    <p style="font-size: 1.3rem; font-style: italic; margin-bottom: 0.5rem; line-height: 1.4;">"${post.content}"</p>
                    <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1rem; font-weight: 500;">— ${post.title}</p>
                    <div style="display: flex; gap: 1rem; color: #888; font-size: 0.9rem;">
                        <span style="cursor:pointer;" onclick="handleReaction('${post._id}', 'mass', this)">🔥 <span>${post.reactions?.mass || 0}</span> Mass</span>
                        <span style="cursor:pointer;" onclick="handleReaction('${post._id}', 'love', this)">❤️ <span>${post.reactions?.love || 0}</span></span>
                        <span>💬 ${post.commentsCount}</span>
                    </div>
                    ${debugHtml}
                </div>`;
            } else if (post.type === 'opinion') {
                return `<div class="feed-card" data-post-id="${post._id}" data-source="${source}" style="background: var(--bg-card); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color);">
                    <div style="color: #af52de; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.5rem; text-transform: uppercase;">🤔 Hot Take</div>
                    <h3 style="margin-bottom: 0.5rem; font-size: 1.2rem;">${post.title}</h3>
                    <p style="color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">${post.content}</p>
                    <div style="display: flex; gap: 1rem; color: #888; font-size: 0.9rem;">
                        <span style="cursor:pointer;" onclick="handleReaction('${post._id}', 'disagree', this)">👎 <span>${post.reactions?.disagree || 0}</span> Disagree</span>
                        <span style="cursor:pointer;" onclick="handleReaction('${post._id}', 'wtf', this)">🤯 <span>${post.reactions?.wtf || 0}</span></span>
                        <span>💬 ${post.commentsCount}</span>
                    </div>
                    ${debugHtml}
                </div>`;
            }
        } else if (item.feedType === 'movie') {
            const movie = item.data;
            const source = item._source || 'global';
            const debug = item._debugInfo || {};
            
            const debugHtml = (currentUser && currentUser.isAdmin) ? `
                <details style="margin-top: 1rem; width: 100%;">
                    <summary style="cursor: pointer; color: #888; font-size: 0.8rem; user-select: none;">ℹ️ Admin Debug: Why am I seeing this?</summary>
                    <div style="margin-top: 0.5rem; padding: 1rem; background: #000; border-radius: 8px; font-size: 0.8rem; border: 1px solid #333;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #aaa;">Personal Score</span> <span style="color: #34c759;">+${debug.personalScore || 0}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #aaa;">Global Score</span> <span style="color: #007aff;">+${debug.globalScore || 0}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; border-top: 1px solid #333; padding-top: 0.5rem;">
                            <span style="color: #aaa;">Final Score</span> <strong style="color: #fff;">${debug.finalScore || 0}</strong>
                        </div>
                        ${debug.matchedEntities && debug.matchedEntities.length > 0 ? `<div style="margin-top: 0.5rem; color: #888;">Matches: ${debug.matchedEntities.join(', ')}</div>` : ''}
                    </div>
                </details>
            ` : '';
            
            return `<div class="feed-card" data-post-id="${movie.id}" data-source="${source}" style="background: var(--bg-card); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); display: flex; flex-direction: column; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.5)';" onmouseout="this.style.transform='none'; this.style.boxShadow='none';" onclick="showMovieDetail('${movie.id}')">
                <div style="display: flex; gap: 1rem;">
                    <img src="${movie.poster}" style="width: 100px; height: 150px; object-fit: cover; border-radius: 8px;" />
                    <div style="display: flex; flex-direction: column; justify-content: center; padding: 0.5rem 0;">
                        <div style="color: var(--primary-color); font-size: 0.8rem; font-weight: bold; margin-bottom: 0.25rem; text-transform: uppercase;">🎬 Trending Movie</div>
                        <h3 style="margin-bottom: 0.5rem; font-size: 1.1rem; line-height: 1.3;">${movie.title}</h3>
                        <div style="color: #666; font-size: 0.9rem; margin-top: auto; display: flex; align-items: center; gap: 0.5rem;">
                            <span>⭐ ${movie.rating || 'N/A'}</span>
                            <span>• ${movie.year || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                ${debugHtml}
            </div>`;

        } else if (item.feedType === 'music') {
            const track = item.data;
            const source = item._source || 'global';
            const debug = item._debugInfo || {};
            
            const debugHtml = (currentUser && currentUser.isAdmin) ? `
                <details style="margin-top: 1rem; width: 100%;">
                    <summary style="cursor: pointer; color: #888; font-size: 0.8rem; user-select: none;">ℹ️ Admin Debug: Why am I seeing this?</summary>
                    <div style="margin-top: 0.5rem; padding: 1rem; background: #000; border-radius: 8px; font-size: 0.8rem; border: 1px solid #333;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #aaa;">Personal Score</span> <span style="color: #34c759;">+${debug.personalScore || 0}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #aaa;">Global Score</span> <span style="color: #007aff;">+${debug.globalScore || 0}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; border-top: 1px solid #333; padding-top: 0.5rem;">
                            <span style="color: #aaa;">Final Score</span> <strong style="color: #fff;">${debug.finalScore || 0}</strong>
                        </div>
                        ${debug.matchedEntities && debug.matchedEntities.length > 0 ? `<div style="margin-top: 0.5rem; color: #888;">Matches: ${debug.matchedEntities.join(', ')}</div>` : ''}
                    </div>
                </details>
            ` : '';
            
            return `<div class="feed-card" data-post-id="${track.id}" data-source="${source}" style="background: var(--bg-card); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color);">
                <div style="color: #34c759; font-size: 0.8rem; font-weight: bold; margin-bottom: 0.75rem; text-transform: uppercase;">🎵 Viral Track</div>
                <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                    <img src="${track.thumbnailUrl}" style="width: 70px; height: 70px; border-radius: 8px; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.3);" />
                    <div>
                        <h3 style="margin-bottom: 0.25rem; font-size: 1.1rem; line-height: 1.3;">${track.title}</h3>
                        <p style="color: var(--text-secondary); font-size: 0.85rem;">${track.artist}</p>
                    </div>
                </div>
                <audio controls preload="none" style="width: 100%; height: 36px; border-radius: 20px;">
                    <source src="${track.mediaUrl}" type="audio/mp4">
                </audio>
                ${debugHtml}
            </div>`;
        }
        return '';
    }).join('');

    // Attach IntersectionObserver to track true impressions
    document.querySelectorAll('.feed-card').forEach(card => {
        feedObserver.observe(card);
    });
}

// ============================================
// Music Functions
// ============================================

async function initMusic() {
    try {
        musicTracks = await apiFetch('/music');
    } catch (err) {
        console.error('Error fetching music:', err);
        musicTracks = [];
    }
    renderMusic();
}

function renderMusic() {
    const musicGrid = document.getElementById('musicGrid');
    if (!musicGrid) return;
    
    if (musicTracks.length === 0) {
        musicGrid.innerHTML = '<p style="padding: 2rem; color: var(--text-secondary);">No trending music available at the moment.</p>';
        return;
    }
    
    musicGrid.innerHTML = musicTracks.map(track => `
        <div class="movie-card" style="display: flex; flex-direction: column;">
            <div style="position: relative; width: 100%; padding-top: 100%; border-radius: var(--radius-md) var(--radius-md) 0 0; overflow: hidden; background: #111;">
                <img src="${track.thumbnailUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" alt="${track.title}">
            </div>
            <div class="movie-info" style="padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h3 class="movie-title" style="font-size: 1rem; margin-bottom: 0.5rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${track.title}</h3>
                    <div class="movie-meta" style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1rem;">
                        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">🎵 ${track.artist}</span>
                    </div>
                </div>
                <audio controls preload="none" style="width: 100%; height: 36px; border-radius: 20px;">
                    <source src="${track.mediaUrl}" type="audio/mp4">
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    `).join('');
}

async function showMovieDetail(movieId) {
    const movie = allMovies.find(m => m.id === movieId);
    if (!movie) return;

    let movieComments = [];
    try {
        movieComments = await apiFetch(`/comments/${movieId}`);
    } catch (err) {
        console.error('Error fetching comments:', err);
    }

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="movie-detail-header">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-detail-poster">
            <div class="movie-detail-info">
                <h2 class="movie-detail-title">${movie.title}</h2>
                <div class="movie-detail-meta">
                    <span class="meta-item rating">⭐ ${movie.rating}</span>
                    <span class="meta-item">${movie.year}</span>
                </div>
                <div class="genre-tags">
                    ${movie.genre.map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
                <p class="movie-description">${movie.description}</p>
                <button class="btn-primary" onclick="toggleWatchlist('${movie.id}')">
                    ${isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
            </div>
        </div>
        <div class="movie-detail-section">
            <h3>Cast</h3>
            <p class="cast-list">${movie.cast.join(', ')}</p>
        </div>
        <div class="comments-section">
            <div class="comments-header">
                <h3>Comments (${movieComments.length})</h3>
            </div>
            ${currentUser ? `
                <div class="comment-form">
                    <textarea class="comment-input" id="commentInput" placeholder="Share your thoughts about this movie..."></textarea>
                    <div class="comment-actions">
                        <button class="btn-primary" onclick="addComment('${movieId}')">Post Comment</button>
                    </div>
                </div>
            ` : `
                <p style="color: var(--text-secondary); text-align: center; padding: 2rem;">
                    Please <a href="#" onclick="openAuthModal()" style="color: var(--primary);">login</a> to comment
                </p>
            `}
            <div class="comments-list" id="commentsList">
                ${renderComments(movieComments)}
            </div>
        </div>
    `;

    document.getElementById('movieModal').classList.add('active');
}

function renderComments(movieComments) {
    if (movieComments.length === 0) {
        return '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No comments yet. Be the first to share your thoughts!</p>';
    }

    return movieComments.map(comment => `
        <div class="comment">
            <div class="comment-header">
                <div class="comment-author">
                    <div class="comment-avatar">${getUserInitial(comment.username)}</div>
                    <div class="comment-author-info">
                        <h5>${comment.username}</h5>
                        <span>${formatTimeAgo(comment.timestamp)}</span>
                    </div>
                </div>
            </div>
            <p class="comment-text">${comment.text}</p>
            <div class="comment-footer">
                <button class="like-btn ${comment.likedBy.includes(currentUser?.id) ? 'active' : ''}" 
                        onclick="toggleCommentLike('${comment.id}', '${comment.movieId}')"
                        ${!currentUser ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" fill="${comment.likedBy.includes(currentUser?.id) ? 'currentColor' : 'none'}" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    ${comment.likes}
                </button>
                ${currentUser && (currentUser.id === comment.userId || currentUser.isAdmin) ? `
                    <button class="btn-delete" onclick="deleteComment('${comment.id}', '${comment.movieId}')">Delete</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

async function addComment(movieId) {
    if (!currentUser) {
        alert('Please login to comment');
        return;
    }

    const commentInput = document.getElementById('commentInput');
    const text = commentInput.value.trim();

    if (!text) {
        alert('Please enter a comment');
        return;
    }

    try {
        await apiFetch(`/comments/${movieId}`, {
            method: 'POST',
            body: JSON.stringify({ text })
        });
        showMovieDetail(movieId);
    } catch (err) {
        alert(err.message || 'Error adding comment');
    }
}

async function toggleCommentLike(commentId, movieId) {
    if (!currentUser) return;

    try {
        await apiFetch(`/comments/${commentId}/like`, { method: 'POST' });
        showMovieDetail(movieId);
    } catch (err) {
        console.error('Error toggling like:', err);
    }
}

async function deleteComment(commentId, movieId) {
    if (!currentUser) return;

    if (confirm('Are you sure you want to delete this comment?')) {
        try {
            await apiFetch(`/comments/${commentId}`, { method: 'DELETE' });
            showMovieDetail(movieId);
        } catch (err) {
            alert(err.message || 'Error deleting comment');
        }
    }
}

// ============================================
// Watchlist Functions
// ============================================

async function initWatchlist() {
    if (!currentUser) {
        watchlist = [];
        renderWatchlist();
        return;
    }
    
    try {
        watchlist = await apiFetch('/watchlist');
    } catch (err) {
        console.error('Error fetching watchlist:', err);
        watchlist = [];
    }
    renderWatchlist();
}

function isInWatchlist(movieId) {
    return watchlist.includes(movieId);
}

async function toggleWatchlist(movieId) {
    if (!currentUser) {
        alert('Please login to use the watchlist');
        return;
    }

    try {
        const result = await apiFetch(`/watchlist/${movieId}`, { method: 'POST' });
        
        if (result.action === 'added') {
            watchlist.push(movieId);
        } else {
            const index = watchlist.indexOf(movieId);
            if (index > -1) watchlist.splice(index, 1);
        }

        renderWatchlist();
        renderMovies(currentFilter);

        // If movie modal is open, update the button
        const modalBody = document.getElementById('modalBody');
        if (modalBody.innerHTML && modalBody.innerHTML.includes(movieId)) {
            showMovieDetail(movieId);
        }
    } catch (err) {
        alert(err.message || 'Error updating watchlist');
    }
}

function renderWatchlist() {
    const watchlistGrid = document.getElementById('watchlistGrid');
    const watchlistMovies = allMovies.filter(m => watchlist.includes(m.id));

    if (watchlistMovies.length === 0) {
        watchlistGrid.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <p>Your watchlist is empty</p>
                <span>Add movies to watch them later</span>
            </div>
        `;
        return;
    }

    watchlistGrid.innerHTML = watchlistMovies.map(movie => `
        <div class="movie-card" data-movie-id="${movie.id}">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <button class="watchlist-btn active" data-movie-id="${movie.id}">
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-rating">⭐ ${movie.rating}</span>
                    <span>${movie.year}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('#watchlistGrid .movie-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.watchlist-btn')) {
                const movieId = card.dataset.movieId;
                showMovieDetail(movieId);
            }
        });
    });

    // Add watchlist button listeners
    document.querySelectorAll('#watchlistGrid .watchlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const movieId = btn.dataset.movieId;
            toggleWatchlist(movieId);
        });
    });
}

// ============================================
// Discussion Functions
// ============================================

let currentDiscussionCategory = 'Trending';
let activeDiscussionId = null;

async function initDiscussions() {
    try {
        const categoryQuery = currentDiscussionCategory && currentDiscussionCategory !== 'Trending' && currentDiscussionCategory !== 'Latest' && currentDiscussionCategory !== 'Popular' ? `?category=${currentDiscussionCategory}` : '';
        discussions = await apiFetch(`/discussions${categoryQuery}`);
    } catch (err) {
        console.error('Error fetching discussions:', err);
        discussions = [];
    }
    renderDiscussions();
}

function renderDiscussions() {
    document.getElementById('discussionDetailContainer').style.display = 'none';
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.style.display = 'flex';
    
    if (discussions.length === 0) {
        feedContainer.innerHTML = `
            <div style="text-align: center; padding: 4rem; color: #888;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🗣️</div>
                <h3 style="color: white; margin-bottom: 0.5rem;">No Discussions found</h3>
                <p>Be the first to start a conversation about ${currentDiscussionCategory}!</p>
            </div>
        `;
        return;
    }

    feedContainer.innerHTML = discussions.map(discussion => `
        <div class="feed-card" style="background: var(--bg-card); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color); cursor: pointer;" onclick="viewDiscussion('${discussion._id}')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                <div>
                    <span style="background: #333; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; color: #aaa; margin-bottom: 0.5rem; display: inline-block;">
                        ${discussion.category}
                    </span>
                    <h3 style="font-size: 1.2rem; color: white; margin-bottom: 0.5rem;">${discussion.title}</h3>
                    <div style="color: #888; font-size: 0.9rem;">
                        👤 ${discussion.username} &middot; ${formatTimeAgo(new Date(discussion.timestamp).getTime())}
                    </div>
                </div>
                ${currentUser && currentUser.id === discussion.userId ? `
                    <button onclick="event.stopPropagation(); deleteDiscussion('${discussion._id}')" style="background: transparent; border: none; color: #ff3b30; cursor: pointer;" title="Delete">🗑️</button>
                ` : ''}
            </div>
            
            <p style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1rem; line-height: 1.5;">${discussion.content.length > 200 ? discussion.content.substring(0, 200) + '...' : discussion.content}</p>
            
            ${discussion.media ? `<img src="${discussion.media}" style="max-width: 100%; border-radius: 8px; margin-bottom: 1rem; max-height: 300px; object-fit: cover;" />` : ''}
            
            <div style="display: flex; gap: 1.5rem; color: #888; font-size: 0.9rem; align-items: center; border-top: 1px solid #333; padding-top: 1rem;">
                <span>🔥 ${discussion.reactions?.mass || 0}</span>
                <span>😂 ${discussion.reactions?.lol || 0}</span>
                <span>❤️ ${discussion.reactions?.love || 0}</span>
                <span style="margin-left: auto; color: #007aff;">💬 ${discussion.repliesCount || 0} replies</span>
            </div>
        </div>
    `).join('');
}

async function viewDiscussion(id) {
    activeDiscussionId = id;
    try {
        const { discussion, replies } = await apiFetch(`/discussions/${id}`);
        renderDiscussionDetail(discussion, replies);
    } catch (err) {
        console.error('Error fetching discussion thread:', err);
    }
}

function renderDiscussionDetail(discussion, replies) {
    document.getElementById('feedContainer').style.display = 'none';
    const detailContainer = document.getElementById('discussionDetailContainer');
    detailContainer.style.display = 'block';
    
    let entitiesHtml = '';
    if (discussion.movieId || discussion.actorId) {
        entitiesHtml = `<div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
            ${discussion.movieId ? `<span style="background: #111; border: 1px solid #333; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; color: #aaa;">🎬 ${discussion.movieId}</span>` : ''}
            ${discussion.actorId ? `<span style="background: #111; border: 1px solid #333; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; color: #aaa;">🌟 ${discussion.actorId}</span>` : ''}
        </div>`;
    }
    
    detailContainer.innerHTML = `
        <button onclick="backToDiscussions()" style="background: none; border: none; color: #888; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
            <span>←</span> Back to Muchatlu
        </button>
        
        <div style="background: var(--bg-card); padding: 2rem; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 1.5rem;">
            <span style="background: #333; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; color: #aaa; margin-bottom: 1rem; display: inline-block;">
                ${discussion.category}
            </span>
            <h2 style="font-size: 1.8rem; margin-bottom: 1rem;">${discussion.title}</h2>
            <div style="color: #888; font-size: 0.9rem; margin-bottom: 1.5rem;">
                👤 ${discussion.username} &middot; ${formatTimeAgo(new Date(discussion.timestamp).getTime())}
            </div>
            
            <div style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 1.5rem;">
                ${discussion.content.replace(/\\n/g, '<br/>')}
            </div>
            
            ${discussion.media ? `<img src="${discussion.media}" style="max-width: 100%; border-radius: 8px; margin-bottom: 1.5rem;" />` : ''}
            
            ${entitiesHtml}
            
            <div style="display: flex; gap: 1rem; color: #888; font-size: 0.9rem; align-items: center; border-top: 1px solid #333; padding-top: 1.5rem; margin-top: 1.5rem;">
                <span style="cursor:pointer; padding: 0.5rem; border-radius: 8px; background: #222;" onclick="handleDiscussionReaction('${discussion._id}', 'mass', this)">🔥 <span style="font-weight:bold; color:white;">${discussion.reactions?.mass || 0}</span></span>
                <span style="cursor:pointer; padding: 0.5rem; border-radius: 8px; background: #222;" onclick="handleDiscussionReaction('${discussion._id}', 'lol', this)">😂 <span style="font-weight:bold; color:white;">${discussion.reactions?.lol || 0}</span></span>
                <span style="cursor:pointer; padding: 0.5rem; border-radius: 8px; background: #222;" onclick="handleDiscussionReaction('${discussion._id}', 'love', this)">❤️ <span style="font-weight:bold; color:white;">${discussion.reactions?.love || 0}</span></span>
            </div>
        </div>
        
        <h3 style="margin-bottom: 1rem; color: #ccc;">💬 ${replies.length} Replies</h3>
        
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
            ${replies.map(reply => `
                <div style="background: #111; padding: 1.5rem; border-radius: 8px; border: 1px solid #222;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span style="font-weight: bold; color: #aaa;">👤 ${reply.username}</span>
                        <span style="color: #666; font-size: 0.8rem;">${formatTimeAgo(new Date(reply.timestamp).getTime())}</span>
                    </div>
                    <p style="margin-bottom: 1rem; line-height: 1.5;">${reply.text}</p>
                    <div style="display: flex; gap: 1rem; font-size: 0.8rem;">
                        <span style="cursor:pointer;" onclick="handleReplyReaction('${reply._id}', 'mass', this)">🔥 <span style="color:white;">${reply.reactions?.mass || 0}</span></span>
                        <span style="cursor:pointer;" onclick="handleReplyReaction('${reply._id}', 'lol', this)">😂 <span style="color:white;">${reply.reactions?.lol || 0}</span></span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <form onsubmit="handleReplySubmit(event)" style="display: flex; gap: 1rem; position: sticky; bottom: 20px; background: var(--bg-color); padding: 1rem; border-radius: 12px; border: 1px solid #333; box-shadow: 0 -4px 12px rgba(0,0,0,0.5);">
            <input type="text" id="replyInput" required placeholder="Write a reply..." style="flex: 1; padding: 0.75rem; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; color: white;">
            <button type="submit" style="background: var(--primary-color); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: bold; cursor: pointer;">Send</button>
        </form>
    `;
}

function backToDiscussions() {
    activeDiscussionId = null;
    document.getElementById('discussionDetailContainer').style.display = 'none';
    document.getElementById('feedContainer').style.display = 'flex';
}

async function handleDiscussionReaction(discussionId, type, btnElement) {
    if (!currentUser) return openAuthModal();
    const countSpan = btnElement.querySelector('span');
    countSpan.textContent = parseInt(countSpan.textContent) + 1;
    btnElement.style.pointerEvents = 'none';
    btnElement.style.opacity = '0.7';
    await trackEvent('reaction', 'discussion', discussionId, null, null, { reaction: type });
}

async function handleReplyReaction(replyId, type, btnElement) {
    if (!currentUser) return openAuthModal();
    const countSpan = btnElement.querySelector('span');
    countSpan.textContent = parseInt(countSpan.textContent) + 1;
    btnElement.style.pointerEvents = 'none';
    btnElement.style.opacity = '0.7';
    await trackEvent('reaction', 'reply', replyId, null, null, { reaction: type });
}

async function handleReplySubmit(e) {
    e.preventDefault();
    if (!currentUser) return openAuthModal();
    if (!activeDiscussionId) return;
    
    const text = document.getElementById('replyInput').value;
    try {
        await apiFetch(`/discussions/${activeDiscussionId}/replies`, {
            method: 'POST',
            body: JSON.stringify({ text })
        });
        viewDiscussion(activeDiscussionId); // Refresh thread
    } catch (err) {
        alert('Error adding reply: ' + err.message);
    }
}

async function createDiscussion(data) {
    if (!currentUser) return openAuthModal();

    try {
        await apiFetch('/discussions', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        await initDiscussions(); 
        document.getElementById('discussionModal').style.display = 'none';
        document.getElementById('discussionForm').reset();
    } catch (err) {
        alert(err.message || 'Error creating discussion');
    }
}

async function deleteDiscussion(id) {
    if (!confirm('Delete this discussion?')) return;
    try {
        await apiFetch(`/discussions/${id}`, { method: 'DELETE' });
        initDiscussions();
    } catch (err) {
        alert('Error deleting discussion: ' + err.message);
    }
}

// ============================================
// UI Event Handlers
// ============================================

function initEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            showSection(section);
        });
    });

    // Search
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const query = e.target.value;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const activeSection = document.querySelector('.nav-link.active')?.dataset.section || 'home';
            
            if (activeSection === 'home') {
                if (query.trim() === '') {
                    allMovies = await fetchMoviesFromAPI();
                } else {
                    const results = await fetchMoviesFromAPI(query);
                    if (results) allMovies = results;
                }
                renderMovies(currentFilter);
            } else if (activeSection === 'music') {
                if (query.trim() === '') {
                    musicTracks = await apiFetch('/music');
                } else {
                    musicTracks = await apiFetch(`/music?search=${encodeURIComponent(query)}`);
                }
                renderMusic();
            }
        }, 500); 
    });



    // Content Type Tabs
    document.querySelectorAll('.content-type-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.content-type-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentContentType = tab.dataset.contentType;
            renderMovies(currentFilter);
        });
    });

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderMovies(currentFilter);
        });
    });

    // Modals
    document.getElementById('modalClose').addEventListener('click', closeMovieModal);
    document.getElementById('modalOverlay').addEventListener('click', closeMovieModal);

    document.getElementById('authModalClose').addEventListener('click', closeAuthModal);
    document.getElementById('authModalOverlay').addEventListener('click', closeAuthModal);

    document.getElementById('discussionModalClose').addEventListener('click', closeDiscussionModal);
    document.getElementById('discussionModalOverlay').addEventListener('click', closeDiscussionModal);

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tabName}Form`).classList.add('active');
        });
    });

    // Auth forms
    document.getElementById('loginFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        login(email, password);
    });

    document.getElementById('signupFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        signup(username, email, password);
    });

    // Login button
    document.getElementById('loginBtn').addEventListener('click', openAuthModal);

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', () => { if (window.authFunctions && window.authFunctions.signOut) window.authFunctions.signOut(); });

    // Start discussion button
    document.getElementById('startDiscussionBtn').addEventListener('click', openDiscussionModal);

    // Filters
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDiscussionCategory = btn.dataset.category;
            initDiscussions(); // Fetch newly filtered list
            backToDiscussions(); // If in detail view, go back
        });
    });

    // Discussion form
    const discussionForm = document.getElementById('discussionForm');
    if (discussionForm) {
        discussionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createDiscussion({
                title: document.getElementById('discussionTitle').value,
                category: document.getElementById('discussionCategory').value,
                content: document.getElementById('discussionContent').value,
                media: document.getElementById('discussionMedia') ? document.getElementById('discussionMedia').value : undefined,
                movieId: document.getElementById('discussionMovieId') ? document.getElementById('discussionMovieId').value : undefined,
                actorId: document.getElementById('discussionActorId') ? document.getElementById('discussionActorId').value : undefined
            });
        });
    }
}


function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });
}

function openAuthModal() {
    document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

// Make functions globally accessible for auth.js
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;


function openDiscussionModal() {
    if (!currentUser) {
        openAuthModal();
        return;
    }
    document.getElementById('discussionModal').style.display = 'flex';
}

function closeDiscussionModal() {
    document.getElementById('discussionModal').style.display = 'none';
    const form = document.getElementById('discussionForm');
    if (form) form.reset();
}

function closeMovieModal() {
    document.getElementById('movieModal').classList.remove('active');
}

// ============================================
// Initialization
// ============================================

function init() {
    // Load data from storage
    comments = getFromStorage(STORAGE_KEYS.COMMENTS) || [];

    // Initialize components
    // initAuth(); // Disabled - using Supabase Auth from auth.js
    if (window.authFunctions && window.authFunctions.initAuth) {
        window.authFunctions.initAuth();
    }
    // initFeed(); // Disabled for MVP Discussion testing
    initMovies();
    initMusic();
    initWatchlist();
    initDiscussions();
    initMemes();

    initEventListeners();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// Memes Section Logic
// ============================================

function initMemes() {
    loadMemes('latest');
}

async function loadMemes(type) {
    // Update pills
    const section = document.getElementById('memes');
    if (section) {
        section.querySelectorAll('.pill-menu .pill').forEach(btn => {
            btn.classList.remove('active');
            if (btn.innerText.toLowerCase().includes(type.toLowerCase()) || 
                (type === 'latest' && btn.innerText.includes('Latest'))) {
                btn.classList.add('active');
            }
        });
    }

    try {
        let endpoint = '/memes';
        if (type === 'trending') endpoint = '/memes/trending';
        
        let memes = await apiFetch(endpoint);
        
        // Client side filter for specific reactions if needed
        if (['mass', 'love', 'wtf'].includes(type)) {
            memes = memes.filter(m => m.reactions && m.reactions[type] > 0)
                         .sort((a, b) => b.reactions[type] - a.reactions[type]);
        }
        
        renderMemes(memes);
    } catch (err) {
        console.error('Error loading memes:', err);
    }
}

function renderMemes(memes) {
    const grid = document.getElementById('memesGrid');
    if (!grid) return;
    
    if (memes.length === 0) {
        grid.innerHTML = '<div style="color: #888; grid-column: 1/-1; text-align: center; padding: 2rem;">No memes found for this category.</div>';
        return;
    }
    
    grid.innerHTML = memes.map(meme => `
        <div class="feed-card" style="background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color); overflow: hidden;">
            <img src="${meme.media}" style="width: 100%; height: auto; object-fit: cover; display: block;" />
            <div style="padding: 1.5rem;">
                <p style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.1rem; line-height: 1.4;">${meme.content}</p>
                
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                    ${meme.movieId ? `<span style="background: #2a2a2a; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; color: #aaa;">🎬 TMDB: ${meme.movieId}</span>` : ''}
                    ${meme.actorId ? `<span style="background: #2a2a2a; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; color: #aaa;">🌟 Actor: ${meme.actorId}</span>` : ''}
                    ${meme.tags && meme.tags.length > 0 ? meme.tags.map(t => `<span style="color: #007aff; font-size: 0.8rem;">#${t.trim()}</span>`).join(' ') : ''}
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <div style="display: flex; gap: 1rem; color: #888; font-size: 0.9rem;">
                        <span style="cursor:pointer;" onclick="handleReaction('${meme._id}', 'lol', this)">😂 <span>${meme.reactions?.lol || 0}</span></span>
                        <span style="cursor:pointer;" onclick="handleReaction('${meme._id}', 'mass', this)">🔥 <span>${meme.reactions?.mass || 0}</span></span>
                        <span style="cursor:pointer;" onclick="handleReaction('${meme._id}', 'love', this)">❤️ <span>${meme.reactions?.love || 0}</span></span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showCreateMemeModal() {
    document.getElementById('memeModal').style.display = 'flex';
}

function closeMemeModal() {
    document.getElementById('memeModal').style.display = 'none';
    document.getElementById('memeForm').reset();
}

async function handleMemeSubmit(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert("Please login to create a meme!");
        closeMemeModal();
        openAuthModal();
        return;
    }
    
    const media = document.getElementById('memeImage').value;
    const content = document.getElementById('memeCaption').value;
    const movieId = document.getElementById('memeMovieId').value;
    const actorId = document.getElementById('memeActorId').value;
    const tagsInput = document.getElementById('memeTags').value;
    
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    
    try {
        const res = await apiFetch('/memes', {
            method: 'POST',
            body: JSON.stringify({ content, media, movieId, actorId, tags })
        });
        
        alert('Meme submitted successfully! It is pending approval.');
        closeMemeModal();
        loadMemes('latest'); 
    } catch (err) {
        console.error(err);
        alert('Server error while submitting meme. ' + err.message);
    }
}
