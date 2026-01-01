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

let currentUser = null;
let allMovies = [];
let watchlist = [];
let comments = [];
let discussions = [];
let replies = [];
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

// ============================================
// Authentication Functions
// ============================================

function initAuth() {
    const savedUser = getFromStorage(STORAGE_KEYS.CURRENT_USER);
    if (savedUser) {
        currentUser = savedUser;
        updateUIForLoggedInUser();
    }
}

function signup(username, email, password) {
    let users = getFromStorage(STORAGE_KEYS.USERS) || [];

    // Check if email already exists
    if (users.find(u => u.email === email)) {
        alert('Email already registered!');
        return false;
    }

    // Check if username already exists
    if (users.find(u => u.username === username)) {
        alert('Username already taken!');
        return false;
    }

    // First user becomes admin
    const isAdmin = users.length === 0;

    const newUser = {
        id: generateId(),
        username,
        email,
        password, // In production, this should be hashed
        isAdmin,
        joinDate: Date.now(),
        reputation: 0,
        badges: [],
        avatar: null
    };

    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);

    // Auto login
    currentUser = newUser;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
    updateUIForLoggedInUser();
    closeAuthModal();

    if (isAdmin) {
        alert('Welcome! As the first user, you have been granted admin privileges.');
    }

    return true;
}

function login(email, password) {
    const users = getFromStorage(STORAGE_KEYS.USERS) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert('Invalid email or password!');
        return false;
    }

    currentUser = user;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
    updateUIForLoggedInUser();
    closeAuthModal();

    return true;
}

function logout() {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    updateUIForLoggedOutUser();
}

function updateUIForLoggedInUser() {
    document.getElementById('loginBtn').classList.add('hidden');
    document.getElementById('userProfile').classList.remove('hidden');
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userRole').textContent = currentUser.isAdmin ? 'Admin' : 'Member';
    document.getElementById('userInitial').textContent = getUserInitial(currentUser.username);

    // Show/hide start discussion button based on admin status
    const startDiscussionBtn = document.getElementById('startDiscussionBtn');
    if (currentUser.isAdmin) {
        startDiscussionBtn.classList.remove('hidden');
    } else {
        startDiscussionBtn.classList.add('hidden');
    }
}

function updateUIForLoggedOutUser() {
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('userProfile').classList.add('hidden');
    document.getElementById('startDiscussionBtn').classList.add('hidden');
}

// ============================================
// Movie Functions
// ============================================

async function fetchMoviesFromSupabase() {
    if (!window.supabaseClient) {
        console.log('Supabase client not available');
        return null;
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('movies')
            .select('*')
            .order('rating', { ascending: false });

        if (error) {
            console.error('Error fetching movies from Supabase:', error);
            return null;
        }

        if (!data || data.length === 0) {
            console.log('No movies found in Supabase');
            return null;
        }

        // Map Supabase columns to App model
        const mappedMovies = data.map(m => ({
            id: m.id,
            title: m.title,
            year: m.year,
            genre: m.genres || [],
            rating: m.rating,
            poster: m.poster_url,
            description: m.description,
            director: m.director,
            cast: m.movie_cast || [],
            content_type: m.content_type
        }));

        // Remove duplicates based on title and year (keep first occurrence)
        const seen = new Map();
        const uniqueMovies = [];

        mappedMovies.forEach(movie => {
            const key = `${movie.title.toLowerCase()}-${movie.year}`;
            if (!seen.has(key)) {
                seen.set(key, true);
                uniqueMovies.push(movie);
            }
        });

        console.log(`Fetched ${data.length} movies, ${uniqueMovies.length} unique after deduplication`);
        return uniqueMovies;
    } catch (err) {
        console.error('Exception fetching movies:', err);
        return null;
    }
}

async function initMovies() {
    // Try to load from Supabase first
    console.log('Initializing movies...');
    let movies = await fetchMoviesFromSupabase();

    if (movies) {
        console.log(`Loaded ${movies.length} movies from Supabase`);
        allMovies = movies;
        // Optionally update local storage cache
        saveToStorage(STORAGE_KEYS.MOVIES, allMovies);
    } else {
        // Fallback to storage or sample data
        console.log('Falling back to local storage/sample data');
        const savedMovies = getFromStorage(STORAGE_KEYS.MOVIES);
        allMovies = savedMovies || SAMPLE_MOVIES;

        if (!savedMovies) {
            saveToStorage(STORAGE_KEYS.MOVIES, allMovies);
        }
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

    // Apply search filter
    if (searchQuery) {
        filteredMovies = filteredMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
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

function renderTrendingMovies() {
    const trendingCarousel = document.getElementById('trendingCarousel');
    const trendingMovies = allMovies.sort((a, b) => b.rating - a.rating).slice(0, 10);

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

function showMovieDetail(movieId) {
    const movie = allMovies.find(m => m.id === movieId);
    if (!movie) return;

    const movieComments = comments.filter(c => c.movieId === movieId);

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="movie-detail-header">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-detail-poster">
            <div class="movie-detail-info">
                <h2 class="movie-detail-title">${movie.title}</h2>
                <div class="movie-detail-meta">
                    <span class="meta-item rating">⭐ ${movie.rating}</span>
                    <span class="meta-item">${movie.year}</span>
                    <span class="meta-item">${movie.director}</span>
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

    return movieComments.sort((a, b) => b.timestamp - a.timestamp).map(comment => `
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
                        onclick="toggleCommentLike('${comment.id}')"
                        ${!currentUser ? 'disabled' : ''}>
                    <svg viewBox="0 0 24 24" fill="${comment.likedBy.includes(currentUser?.id) ? 'currentColor' : 'none'}" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    ${comment.likes}
                </button>
                ${currentUser && (currentUser.id === comment.userId || currentUser.isAdmin) ? `
                    <button class="btn-delete" onclick="deleteComment('${comment.id}')">Delete</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function addComment(movieId) {
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

    const newComment = {
        id: generateId(),
        movieId,
        userId: currentUser.id,
        username: currentUser.username,
        text,
        likes: 0,
        likedBy: [],
        timestamp: Date.now()
    };

    comments.push(newComment);
    saveToStorage(STORAGE_KEYS.COMMENTS, comments);

    // Update reputation
    currentUser.reputation = calculateReputation(currentUser.id);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);

    // Refresh the movie detail
    showMovieDetail(movieId);
}

function toggleCommentLike(commentId) {
    if (!currentUser) return;

    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    const likedIndex = comment.likedBy.indexOf(currentUser.id);

    if (likedIndex > -1) {
        comment.likedBy.splice(likedIndex, 1);
        comment.likes--;
    } else {
        comment.likedBy.push(currentUser.id);
        comment.likes++;
    }

    saveToStorage(STORAGE_KEYS.COMMENTS, comments);

    // Refresh comments
    const movieComments = comments.filter(c => c.movieId === comment.movieId);
    document.getElementById('commentsList').innerHTML = renderComments(movieComments);
}

function deleteComment(commentId) {
    if (!currentUser) return;

    const commentIndex = comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;

    const comment = comments[commentIndex];

    // Check permissions
    if (currentUser.id !== comment.userId && !currentUser.isAdmin) {
        alert('You can only delete your own comments');
        return;
    }

    if (confirm('Are you sure you want to delete this comment?')) {
        comments.splice(commentIndex, 1);
        saveToStorage(STORAGE_KEYS.COMMENTS, comments);

        // Refresh comments
        const movieComments = comments.filter(c => c.movieId === comment.movieId);
        document.getElementById('commentsList').innerHTML = renderComments(movieComments);
    }
}

// ============================================
// Watchlist Functions
// ============================================

function initWatchlist() {
    watchlist = getFromStorage(STORAGE_KEYS.WATCHLIST) || [];
    renderWatchlist();
}

function isInWatchlist(movieId) {
    return watchlist.includes(movieId);
}

function toggleWatchlist(movieId) {
    const index = watchlist.indexOf(movieId);

    if (index > -1) {
        watchlist.splice(index, 1);
    } else {
        watchlist.push(movieId);
    }

    saveToStorage(STORAGE_KEYS.WATCHLIST, watchlist);
    renderWatchlist();
    renderMovies(currentFilter);

    // If movie modal is open, update the button
    const modalBody = document.getElementById('modalBody');
    if (modalBody.innerHTML) {
        const movie = allMovies.find(m => m.id === movieId);
        if (movie) {
            showMovieDetail(movieId);
        }
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

function initDiscussions() {
    const savedDiscussions = getFromStorage(STORAGE_KEYS.DISCUSSIONS);
    discussions = savedDiscussions || SAMPLE_DISCUSSIONS;

    if (!savedDiscussions) {
        saveToStorage(STORAGE_KEYS.DISCUSSIONS, discussions);
    }

    replies = getFromStorage(STORAGE_KEYS.REPLIES) || [];

    renderDiscussions();
}

function renderDiscussions() {
    const discussionsList = document.getElementById('discussionsList');

    if (discussions.length === 0) {
        discussionsList.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p>No discussions yet</p>
                <span>Start the conversation!</span>
            </div>
        `;
        return;
    }

    discussionsList.innerHTML = discussions.sort((a, b) => b.timestamp - a.timestamp).map(discussion => {
        const discussionReplies = replies.filter(r => r.discussionId === discussion.id);

        return `
            <div class="discussion-card">
                <div class="discussion-header">
                    <div class="discussion-author">
                        <div class="author-avatar">${getUserInitial(discussion.username)}</div>
                        <div class="author-info">
                            <h4>${discussion.username}</h4>
                            <span>${formatTimeAgo(discussion.timestamp)}</span>
                        </div>
                    </div>
                </div>
                <h3 class="discussion-title">${discussion.title}</h3>
                <p class="discussion-content">${discussion.content}</p>
                <div class="discussion-footer">
                    <button class="like-btn ${discussion.likedBy.includes(currentUser?.id) ? 'active' : ''}" 
                            onclick="toggleDiscussionLike('${discussion.id}')"
                            ${!currentUser ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" fill="${discussion.likedBy.includes(currentUser?.id) ? 'currentColor' : 'none'}" stroke="currentColor">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                        ${discussion.likes}
                    </button>
                    <div class="discussion-stat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        ${discussionReplies.length} replies
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleDiscussionLike(discussionId) {
    if (!currentUser) {
        alert('Please login to like discussions');
        return;
    }

    const discussion = discussions.find(d => d.id === discussionId);
    if (!discussion) return;

    const likedIndex = discussion.likedBy.indexOf(currentUser.id);

    if (likedIndex > -1) {
        discussion.likedBy.splice(likedIndex, 1);
        discussion.likes--;
    } else {
        discussion.likedBy.push(currentUser.id);
        discussion.likes++;
    }

    saveToStorage(STORAGE_KEYS.DISCUSSIONS, discussions);
    renderDiscussions();
}

function createDiscussion(title, content) {
    if (!currentUser || !currentUser.isAdmin) {
        alert('Only admins can create discussions');
        return;
    }

    const newDiscussion = {
        id: generateId(),
        userId: currentUser.id,
        username: currentUser.username,
        title,
        content,
        likes: 0,
        likedBy: [],
        replies: [],
        timestamp: Date.now()
    };

    discussions.push(newDiscussion);
    saveToStorage(STORAGE_KEYS.DISCUSSIONS, discussions);

    // Update reputation
    currentUser.reputation = calculateReputation(currentUser.id);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);

    renderDiscussions();
    closeDiscussionModal();
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
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const query = e.target.value;
        renderMovies(currentFilter, query);
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
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Start discussion button
    document.getElementById('startDiscussionBtn').addEventListener('click', openDiscussionModal);

    // Discussion form
    document.getElementById('discussionFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('discussionTitle').value;
        const content = document.getElementById('discussionContent').value;
        createDiscussion(title, content);
    });
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
    if (!currentUser || !currentUser.isAdmin) {
        alert('Only admins can create discussions');
        return;
    }
    document.getElementById('discussionModal').classList.add('active');
}

function closeDiscussionModal() {
    document.getElementById('discussionModal').classList.remove('active');
    document.getElementById('discussionFormElement').reset();
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
    initAuth();
    initMovies();
    initWatchlist();
    initDiscussions();
    initEventListeners();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
