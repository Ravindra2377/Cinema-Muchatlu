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




// ============================================
// State Management
// ============================================

// Get currentUser from auth.js
Object.defineProperty(window, 'currentUser', {
    get: function() {
        return window.authFunctions ? window.authFunctions.getCurrentUser() : null;
    }
});
let allMovies = [];
let watchlist = [];
let reminders = [];
let comments = [];
let musicTracks = [];
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
    renderTrendingSongs();
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
                    <span>${movie.content_type === 'Upcoming' && movie.release_date ? movie.release_date : movie.year}</span>
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

async function renderTrendingSongs() {
    const trendingMusicCarousel = document.getElementById('trendingMusicCarousel');
    if (!trendingMusicCarousel) return;

    if (!musicTracks || musicTracks.length === 0) {
        try {
            musicTracks = await apiFetch('/music');
        } catch (err) {
            console.error('Failed to fetch trending music:', err);
            musicTracks = [];
        }
    }

    if (!musicTracks || musicTracks.length === 0) {
        trendingMusicCarousel.innerHTML = '<p style="color: var(--text-secondary); padding: 1.5rem;">No trending songs available at the moment.</p>';
        return;
    }

    trendingMusicCarousel.innerHTML = musicTracks.slice(0, 15).map(track => `
        <div class="trending-music-card">
            <div style="position: relative; width: 100%; padding-top: 100%; background: #111; overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
                <img src="${track.thumbnailUrl}" alt="${track.title}" style="position: absolute; top:0; left:0; width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/500x500/1e293b/ffffff?text=Telugu+Music'">
                <span style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.75); color: #ffd700; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 12px; backdrop-filter: blur(4px);">🔥 Top Song</span>
            </div>
            <div style="padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;">
                <div style="margin-bottom: 0.75rem;">
                    <h4 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 600; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;" title="${track.title}">${track.title}</h4>
                    <p style="margin: 0; font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">🎵 ${track.artist}</p>
                </div>
                <audio controls src="${track.mediaUrl}" preload="none" class="music-audio-player" style="width: 100%; height: 32px; border-radius: 16px;">
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    `).join('');

    // Ensure audio mutual exclusion across all active players
    document.querySelectorAll('.music-audio-player').forEach(player => {
        player.addEventListener('play', (e) => {
            document.querySelectorAll('.music-audio-player').forEach(other => {
                if (other !== e.target && !other.paused) {
                    other.pause();
                }
            });
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


// ============================================
// Music Functions
// ============================================

async function initMusic(force = false) {
    if (musicTracks.length > 0 && !force) {
        renderMusic();
        renderTrendingSongs();
        return;
    }
    const musicGrid = document.getElementById('musicGrid');
    if (musicGrid) {
        musicGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
                <div style="margin: 0 auto 1.5rem; width: 44px; height: 44px; border: 3px solid rgba(229,9,20,0.2); border-top-color: #e50914; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
                <p style="font-size: 1rem; font-weight: 500;">Loading Telugu hits...</p>
            </div>
        `;
    }
    try {
        musicTracks = await apiFetch('/music');
    } catch (err) {
        console.error('Error fetching music:', err);
        musicTracks = [];
    }
    renderMusic();
    renderTrendingSongs();
    renderDailySong();
}

async function renderDailySong() {
    const dailySongCard = document.getElementById('dailySongCard');
    if (!dailySongCard) return;

    try {
        const res = await apiFetch('/music/daily');
        if (!res || !res.song) return;

        const song = res.song;
        dailySongCard.innerHTML = `
            <div style="background: linear-gradient(135deg, rgba(229, 9, 20, 0.8) 0%, rgba(131, 0, 0, 0.9) 100%), url('${song.thumbnailUrl}') center/cover; border-radius: 12px; padding: 2rem; position: relative; overflow: hidden; color: white; display: flex; align-items: center; gap: 2rem; box-shadow: 0 4px 15px rgba(229, 9, 20, 0.2);">
                <img src="${song.thumbnailUrl}" alt="${song.title}" style="width: 120px; height: 120px; border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.4); z-index: 1; object-fit: cover;">
                <div style="z-index: 1; flex: 1;">
                    <span style="background: rgba(255,255,255,0.2); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 0.5rem; display: inline-block;">🎵 Song of the Day</span>
                    <h3 style="margin: 0 0 0.5rem 0; font-size: 1.8rem; line-height: 1.2;">${song.title}</h3>
                    <p style="margin: 0 0 1.5rem 0; font-size: 1rem; opacity: 0.9;">${song.artist}</p>
                    
                    <audio controls src="${song.mediaUrl}" preload="none" style="width: 100%; max-width: 400px; height: 36px; border-radius: 20px; display: block;">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Error fetching daily song:', err);
    }
}

function renderMusic() {
    const musicGrid = document.getElementById('musicGrid');
    const musicTrendingCarousel = document.getElementById('musicTrendingCarousel');
    if (!musicGrid) return;
    
    if (!musicTracks || musicTracks.length === 0) {
        musicGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
                <p style="font-size: 1.1rem; margin-bottom: 1rem;">No trending music available at the moment.</p>
                <button onclick="initMusic(true)" class="btn btn-primary" style="padding: 0.5rem 1.25rem;">🔄 Retry</button>
            </div>
        `;
        if (musicTrendingCarousel) {
            musicTrendingCarousel.innerHTML = '';
        }
        return;
    }

    // Render Trending Songs Carousel at top of Music screen
    if (musicTrendingCarousel) {
        musicTrendingCarousel.innerHTML = musicTracks.slice(0, 10).map(track => `
            <div class="trending-music-card">
                <div style="position: relative; width: 100%; padding-top: 100%; background: #111; overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
                    <img src="${track.thumbnailUrl}" alt="${track.title}" style="position: absolute; top:0; left:0; width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://via.placeholder.com/500x500/1e293b/ffffff?text=Telugu+Music'">
                    <span style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.75); color: #ffd700; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 12px; backdrop-filter: blur(4px);">🔥 Trending</span>
                </div>
                <div style="padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; flex-grow: 1;">
                    <div style="margin-bottom: 0.75rem;">
                        <h4 style="margin: 0 0 0.35rem 0; font-size: 0.95rem; font-weight: 600; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;" title="${track.title}">${track.title}</h4>
                        <p style="margin: 0; font-size: 0.8rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">🎵 ${track.artist}</p>
                    </div>
                    <audio controls src="${track.mediaUrl}" preload="none" class="music-audio-player" style="width: 100%; height: 32px; border-radius: 16px;">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </div>
        `).join('');
    }
    
    // Render full tracks grid
    musicGrid.innerHTML = musicTracks.map(track => `
        <div class="movie-card" style="display: flex; flex-direction: column;">
            <div style="position: relative; width: 100%; padding-top: 100%; border-radius: var(--radius-md) var(--radius-md) 0 0; overflow: hidden; background: #111;">
                <img src="${track.thumbnailUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" alt="${track.title}" onerror="this.src='https://via.placeholder.com/500x500/1e293b/ffffff?text=Telugu+Music'">
            </div>
            <div class="movie-info" style="padding: 1rem; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h3 class="movie-title" style="font-size: 1rem; margin-bottom: 0.5rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${track.title}</h3>
                    <div class="movie-meta" style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1rem;">
                        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">🎵 ${track.artist}</span>
                    </div>
                </div>
                <audio controls src="${track.mediaUrl}" preload="none" class="music-audio-player" style="width: 100%; height: 36px; border-radius: 20px;">
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>
    `).join('');

    // Ensure only one audio element plays at a time across all active players
    document.querySelectorAll('.music-audio-player').forEach(player => {
        player.addEventListener('play', (e) => {
            document.querySelectorAll('.music-audio-player').forEach(other => {
                if (other !== e.target && !other.paused) {
                    other.pause();
                }
            });
        });
    });
}

async function showMovieDetail(movieId) {
    const movie = allMovies.find(m => String(m.id) === String(movieId));
    if (!movie) return;

    let watchProviders = null;
    let movieLogs = [];
    let userLog = null;
    let cmStats = null;

    try {
        const [providersRes, logsRes, statsRes] = await Promise.all([
            apiFetch(`/movies/${movieId}/providers`).catch(() => null),
            apiFetch(`/films/${movieId}/logs`).catch(() => []),
            apiFetch(`/films/${movieId}/stats`).catch(() => null)
        ]);
        watchProviders = providersRes || null;
        movieLogs = logsRes || [];
        cmStats = statsRes || { count: 0, average: null, distribution: {1:0,2:0,3:0,4:0,5:0} };
        
        if (currentUser) {
            userLog = movieLogs.find(l => l.userId && l.userId._id === currentUser.id);
        }
    } catch (err) {
        console.error('Error fetching movie details:', err);
    }

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="movie-detail-header">
            <img src="${movie.poster}" alt="${movie.title}" class="movie-detail-poster">
            <div class="movie-detail-info">
                <h2 class="movie-detail-title">${movie.title}</h2>
                <div class="movie-detail-meta">
                    <span class="meta-item rating">TMDB: ⭐ ${movie.rating}</span>
                    ${cmStats && cmStats.count > 0 ? `<span class="meta-item rating" style="color:#00e5ff;">CM: ⭐ ${cmStats.average} (${cmStats.count} logs)</span>` : ''}
                    <span class="meta-item">${movie.content_type === 'Upcoming' && movie.release_date ? movie.release_date : movie.year}</span>
                </div>
                <div class="genre-tags">
                    ${movie.genre.map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
                <p class="movie-description">${movie.description}</p>
                
                <!-- Action Bar (Letterboxd Style) -->
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap; align-items: center; background: rgba(255,255,255,0.05); padding: 0.75rem; border-radius: 8px;">
                    <button onclick="toggleLogWatched('${movie.id}', ${userLog ? true : false})" style="background: ${userLog ? '#00e5ff' : 'transparent'}; color: ${userLog ? '#000' : '#fff'}; border: 1px solid ${userLog ? '#00e5ff' : '#444'}; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: bold;">
                        👁 ${userLog ? 'Watched' : 'Watched'}
                    </button>
                    
                    <button onclick="toggleWatchlist('${movie.id}')" style="background: ${isInWatchlist(movie.id) ? '#34c759' : 'transparent'}; color: ${isInWatchlist(movie.id) ? '#000' : '#fff'}; border: 1px solid ${isInWatchlist(movie.id) ? '#34c759' : '#444'}; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: bold;">
                        🔖 ${isInWatchlist(movie.id) ? 'Watchlist' : 'Watchlist'}
                    </button>
                    
                    <button onclick="toggleLogLike('${movie.id}', ${userLog && userLog.liked ? true : false})" style="background: ${userLog && userLog.liked ? 'rgba(255, 45, 85, 0.1)' : 'transparent'}; border: 1px solid ${userLog && userLog.liked ? '#ff2d55' : '#444'}; padding: 0.5rem; border-radius: 4px; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">
                        ${userLog && userLog.liked ? '❤️' : '🤍'}
                    </button>

                    <button onclick="openLogModal('${movie.id}')" style="background: transparent; border: 1px solid #444; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 0.25rem; font-weight: bold;">
                        <span style="color: #00e5ff;">⭐ ${userLog && userLog.rating ? userLog.rating : 'Rate'}</span>
                    </button>

                    <button onclick="openLogModal('${movie.id}')" style="background: #2a2a2a; color: #fff; border: 1px solid #444; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: bold; margin-left: auto;">
                        📝 Log / Review
                    </button>
                </div>
                
                ${movie.content_type === 'Upcoming' ? `
                    <div style="margin-top: 1rem;">
                        <button class="btn-secondary" onclick="toggleReminder('${movie.id}')" style="background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.5rem 1rem; border-radius: 8px; font-weight: 500; cursor: pointer;">
                            ${reminders.includes(movie.id) ? '✅ Reminder Set' : '🔔 Remind Me'}
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
        ${watchProviders && (watchProviders.flatrate || watchProviders.rent || watchProviders.buy) ? `
        <div class="movie-detail-section providers-section">
            <h3 style="margin-bottom: 0.5rem; font-size: 1.1rem;">Where to Watch</h3>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                ${['flatrate', 'rent', 'buy'].map(type => {
                    if (!watchProviders[type]) return '';
                    let displayType = type === 'flatrate' ? 'Stream' : type;
                    return watchProviders[type].map(p => `
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
                            <img src="https://image.tmdb.org/t/p/w92${p.logo_path}" alt="${p.provider_name}" title="${p.provider_name} (${type})" style="width: 40px; height: 40px; border-radius: 8px;">
                            <span style="font-size: 0.7rem; color: var(--text-secondary); text-transform: capitalize;">${displayType}</span>
                        </div>
                    `).join('');
                }).join('')}
            </div>
        </div>
        ` : ''}
        <div class="movie-detail-section">
            <h3>Cast</h3>
            <p class="cast-list">${movie.cast.join(', ')}</p>
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
        reminders = [];
        renderWatchlist();
        return;
    }
    
    try {
        const [wl, rem] = await Promise.all([
            apiFetch('/watchlist').catch(() => []),
            apiFetch('/reminders').catch(() => [])
        ]);
        watchlist = wl;
        reminders = rem;
    } catch (err) {
        console.error('Error fetching watchlist/reminders:', err);
        watchlist = [];
        reminders = [];
    }
    renderWatchlist();
}

function isInWatchlist(movieId) {
    return watchlist.includes(movieId);
}

async function toggleReminder(movieId) {
    if (!currentUser) {
        alert('Please login to set release reminders');
        return;
    }
    try {
        const movie = allMovies.find(m => String(m.id) === String(movieId));
        const result = await apiFetch(`/reminders/${movieId}`, { 
            method: 'POST',
            body: JSON.stringify({ 
                title: movie ? movie.title : 'Unknown Title',
                releaseDate: movie ? movie.release_date : null
            })
        });
        
        if (result.action === 'added') {
            reminders.push(movieId);
            alert('Reminder set for this release! You will be notified when it drops.');
        } else {
            const index = reminders.indexOf(movieId);
            if (index > -1) reminders.splice(index, 1);
        }
        
        // Re-render modal if open
        const modal = document.getElementById('movieModal');
        if (modal.style.display === 'flex') {
            showMovieDetail(movieId);
        }
    } catch (err) {
        alert(err.message || 'Error updating reminder');
    }
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
        tab.addEventListener('click', async () => {
            document.querySelectorAll('.content-type-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentContentType = tab.dataset.contentType;
            
            if (currentContentType === 'Upcoming') {
                try {
                    const upcomingMovies = await apiFetch('/movies/upcoming');
                    // Add them to allMovies if not already there so they can be filtered/displayed
                    upcomingMovies.forEach(um => {
                        um.content_type = 'Upcoming';
                        const existing = allMovies.find(m => m.id === um.id);
                        if (!existing) {
                            allMovies.push(um);
                        } else {
                            existing.content_type = 'Upcoming';
                            existing.release_date = um.release_date;
                        }
                    });
                } catch (e) {
                    console.error('Error fetching upcoming movies:', e);
                }
            }
            
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


}


function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });

    if (sectionId === 'music') {
        if (!musicTracks || musicTracks.length === 0) {
            initMusic();
        }
    } else if (sectionId === 'trending') {
        renderTrendingMovies();
        renderTrendingSongs();
    } else if (sectionId === 'watchlist') {
        if (currentUser) {
            loadProfileAndDiary();
            loadTrackers();
        }
    }
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



function closeMovieModal() {
    document.getElementById('movieModal').classList.remove('active');
}

// ============================================
// Film Logging (Letterboxd Style)
// ============================================

async function toggleLogWatched(movieId, currentlyWatched) {
    if (!currentUser) return openAuthModal();
    if (currentlyWatched) {
        // Find user log and delete it if it only has watch status?
        // Let's keep it simple: redirect to log modal if they want to edit.
        openLogModal(movieId);
    } else {
        try {
            await apiFetch(`/films/${movieId}/log`, {
                method: 'POST',
                body: JSON.stringify({ watchedAt: new Date() })
            });
            showMovieDetail(movieId);
        } catch (err) {
            console.error(err);
        }
    }
}

async function toggleLogLike(movieId, currentlyLiked) {
    if (!currentUser) return openAuthModal();
    try {
        await apiFetch(`/films/${movieId}/like`, {
            method: 'POST',
            body: JSON.stringify({ liked: !currentlyLiked })
        });
        showMovieDetail(movieId);
    } catch (err) {
        console.error(err);
    }
}

async function openLogModal(movieId) {
    if (!currentUser) return openAuthModal();
    const movie = allMovies.find(m => String(m.id) === String(movieId));
    if (!movie) return;

    let userLog = null;
    try {
        const logs = await apiFetch(`/films/${movieId}/logs`);
        if (logs) {
            userLog = logs.find(l => l.userId && l.userId._id === currentUser.id);
        }
    } catch (err) {
        console.error(err);
    }

    document.getElementById('logMovieId').value = movieId;
    document.getElementById('logModalTitle').innerText = `I watched... ${movie.title}`;
    
    // Set defaults
    document.getElementById('logDate').value = userLog && userLog.watchedAt ? new Date(userLog.watchedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    document.getElementById('logRating').value = userLog && userLog.rating ? userLog.rating : 0;
    renderLogStars(userLog && userLog.rating ? userLog.rating : 0);
    
    document.getElementById('logLiked').value = userLog && userLog.liked ? 'true' : 'false';
    document.getElementById('logLikeBtn').style.color = userLog && userLog.liked ? '#ff2d55' : '#555';
    
    document.getElementById('logReview').value = userLog && userLog.review ? userLog.review : '';
    document.getElementById('logSpoilers').checked = userLog && userLog.containsSpoilers ? true : false;
    document.getElementById('logRewatch').checked = userLog && userLog.rewatch ? true : false;
    document.getElementById('logTags').value = userLog && userLog.tags ? userLog.tags.join(', ') : '';

    // Watch Method
    const watchMethod = userLog && userLog.watchMethod ? userLog.watchMethod : 'NONE';
    document.querySelector(`input[name="logWatchMethod"][value="${watchMethod}"]`).checked = true;
    
    if (watchMethod === 'THEATRE') {
        document.getElementById('logTheatreOptions').style.display = 'flex';
        document.getElementById('logOTTOptions').style.display = 'none';
        if (userLog && userLog.theatre) {
            document.getElementById('logTheatreName').value = userLog.theatre.name || '';
            document.getElementById('logTheatreFormat').value = userLog.theatre.format || '';
            document.getElementById('logTheatreLanguage').value = userLog.theatre.language || '';
        }
    } else if (watchMethod === 'OTT') {
        document.getElementById('logTheatreOptions').style.display = 'none';
        document.getElementById('logOTTOptions').style.display = 'flex';
        if (userLog && userLog.ott) {
            document.getElementById('logOTTProvider').value = userLog.ott.provider || '';
        }
    } else {
        document.getElementById('logTheatreOptions').style.display = 'none';
        document.getElementById('logOTTOptions').style.display = 'none';
    }

    document.getElementById('logModal').style.display = 'flex';
}

function renderLogStars(rating) {
    const starsContainer = document.getElementById('logRatingStars');
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            html += `<span data-val="${i}" class="star full">★</span>`;
        } else if (rating === i - 0.5) {
            html += `<span data-val="${i}" class="star half" style="position:relative;display:inline-block;">
                        <span style="color:#555;">★</span>
                        <span style="color:#00e5ff;position:absolute;left:0;top:0;width:50%;overflow:hidden;">★</span>
                     </span>`;
        } else {
            html += `<span data-val="${i}" class="star empty" style="color:#555;">★</span>`;
        }
    }
    starsContainer.innerHTML = html;
    starsContainer.style.color = '#00e5ff';
}

document.getElementById('logRatingStars')?.addEventListener('click', (e) => {
    const starNode = e.target.closest('.star');
    if (!starNode) return;
    const val = parseInt(starNode.getAttribute('data-val'));
    const rect = starNode.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    const rating = isHalf ? val - 0.5 : val;
    document.getElementById('logRating').value = rating;
    renderLogStars(rating);
});

document.getElementById('logLikeBtn')?.addEventListener('click', () => {
    const likedInput = document.getElementById('logLiked');
    const isLiked = likedInput.value === 'true';
    likedInput.value = isLiked ? 'false' : 'true';
    document.getElementById('logLikeBtn').style.color = !isLiked ? '#ff2d55' : '#555';
});

document.querySelectorAll('input[name="logWatchMethod"]')?.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'THEATRE') {
            document.getElementById('logTheatreOptions').style.display = 'flex';
            document.getElementById('logOTTOptions').style.display = 'none';
        } else if (val === 'OTT') {
            document.getElementById('logTheatreOptions').style.display = 'none';
            document.getElementById('logOTTOptions').style.display = 'flex';
        } else {
            document.getElementById('logTheatreOptions').style.display = 'none';
            document.getElementById('logOTTOptions').style.display = 'none';
        }
    });
});

document.getElementById('logForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const movieId = document.getElementById('logMovieId').value;
    const rating = parseFloat(document.getElementById('logRating').value) || null;
    const liked = document.getElementById('logLiked').value === 'true';
    const review = document.getElementById('logReview').value.trim() || null;
    const containsSpoilers = document.getElementById('logSpoilers').checked;
    const rewatch = document.getElementById('logRewatch').checked;
    const tags = document.getElementById('logTags').value.split(',').map(t => t.trim()).filter(Boolean);
    const watchedAt = document.getElementById('logDate').value;
    
    const watchMethodRadio = document.querySelector('input[name="logWatchMethod"]:checked');
    const watchMethod = watchMethodRadio ? watchMethodRadio.value : null;
    
    const theatre = watchMethod === 'THEATRE' ? {
        name: document.getElementById('logTheatreName').value.trim() || null,
        format: document.getElementById('logTheatreFormat').value || null,
        language: document.getElementById('logTheatreLanguage').value || null
    } : null;
    
    const ott = watchMethod === 'OTT' ? {
        provider: document.getElementById('logOTTProvider').value || null
    } : null;

    const payload = {
        rating, liked, review, containsSpoilers, rewatch, tags, watchMethod, theatre, ott, watchedAt
    };

    try {
        await apiFetch(`/films/${movieId}/log`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        document.getElementById('logModal').style.display = 'none';
        showMovieDetail(movieId);
    } catch (err) {
        console.error('Error saving log:', err);
    }
});


// ============================================
// Initialization
// ============================================

async function loadProfileAndDiary() {
    if (!currentUser) return;

    try {
        const [diaryLogs, watchedData, timelineEvents] = await Promise.all([
            apiFetch('/users/me/diary'),
            apiFetch('/users/me/watched'),
            apiFetch('/timeline').catch(() => [])
        ]);
        
        const logs = diaryLogs || [];
        const uniqueMovies = watchedData.uniqueMovies || [];

        // Calculate Stats
        const totalWatched = uniqueMovies.length;
        const totalReviews = logs.filter(l => l.review).length;
        const totalRatings = logs.filter(l => l.rating).length;
        const totalLikes = logs.filter(l => l.liked).length;
        const totalRewatches = logs.filter(l => l.rewatch).length;
        
        const theatreCount = logs.filter(l => l.watchMethod === 'THEATRE').length;
        const ottCount = logs.filter(l => l.watchMethod === 'OTT').length;

        const sumRatings = logs.filter(l => l.rating).reduce((sum, l) => sum + l.rating, 0);
        const avgRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : '0.0';

        // Render Stats
        document.getElementById('profileStatsContainer').style.display = 'block';
        document.getElementById('profileStatsGrid').innerHTML = `
            <div style="background: #111; padding: 1rem; border-radius: 8px; border: 1px solid #333; flex: 1; min-width: 100px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #fff;">🎬 ${totalWatched}</div>
                <div style="font-size: 0.8rem; color: #888; text-transform: uppercase;">Watched</div>
            </div>
            <div style="background: #111; padding: 1rem; border-radius: 8px; border: 1px solid #333; flex: 1; min-width: 100px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #00e5ff;">⭐ ${avgRating}</div>
                <div style="font-size: 0.8rem; color: #888; text-transform: uppercase;">Average</div>
            </div>
            <div style="background: #111; padding: 1rem; border-radius: 8px; border: 1px solid #333; flex: 1; min-width: 100px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #ff2d55;">❤️ ${totalLikes}</div>
                <div style="font-size: 0.8rem; color: #888; text-transform: uppercase;">Likes</div>
            </div>
            <div style="background: #111; padding: 1rem; border-radius: 8px; border: 1px solid #333; flex: 1; min-width: 100px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #34c759;">📝 ${totalReviews}</div>
                <div style="font-size: 0.8rem; color: #888; text-transform: uppercase;">Reviews</div>
            </div>
            <div style="background: #111; padding: 1rem; border-radius: 8px; border: 1px solid #333; flex: 1; min-width: 100px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #ff9500;">🎟️ ${theatreCount}</div>
                <div style="font-size: 0.8rem; color: #888; text-transform: uppercase;">Theatre</div>
            </div>
            <div style="background: #111; padding: 1rem; border-radius: 8px; border: 1px solid #333; flex: 1; min-width: 100px; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #af52de;">📺 ${ottCount}</div>
                <div style="font-size: 0.8rem; color: #888; text-transform: uppercase;">OTT</div>
            </div>
        `;

        // Render Universal Timeline
        if (timelineEvents && timelineEvents.length > 0) {
            document.getElementById('universalTimelineContainer').innerHTML = `
                <h2 class="section-title">📅 My Timeline</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${timelineEvents.map(event => `
                        <div style="background: #111; padding: 1rem; border-radius: 8px; border: 1px solid #333; display: flex; align-items: center; gap: 1rem;">
                            <div style="font-size: 1.5rem; background: rgba(255,255,255,0.05); padding: 0.5rem; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">${event.icon}</div>
                            <div style="flex: 1;">
                                <h3 style="margin: 0; font-size: 1rem; color: ${event.color || '#fff'};">${event.title}</h3>
                                ${event.description ? `<p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #888;">${event.description}</p>` : ''}
                            </div>
                            <div style="color: #666; font-size: 0.8rem;">
                                ${new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Render Diary
        document.getElementById('cinemaDiaryContainer').style.display = 'block';
        if (logs.length === 0) {
            document.getElementById('cinemaDiaryList').innerHTML = '<p style="color: #888;">You haven\'t logged any movies yet.</p>';
        } else {
            document.getElementById('cinemaDiaryList').innerHTML = logs.map(log => {
                const movie = allMovies.find(m => String(m.id) === String(log.movieId));
                const movieTitle = movie ? movie.title : 'Unknown Movie';
                const dateStr = new Date(log.watchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                let locationBadge = '';
                if (log.watchMethod === 'THEATRE') locationBadge = `<span style="background: rgba(255,149,0,0.2); color: #ff9500; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">🎬 Theatre${log.theatre && log.theatre.name ? ` - ${log.theatre.name}` : ''}</span>`;
                if (log.watchMethod === 'OTT') locationBadge = `<span style="background: rgba(175,82,222,0.2); color: #af52de; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem;">📺 OTT${log.ott && log.ott.provider ? ` - ${log.ott.provider}` : ''}</span>`;

                return `
                    <div style="background: var(--bg-card); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); display: flex; gap: 1rem; cursor: pointer;" onclick="showMovieDetail('${log.movieId}')">
                        <div style="min-width: 60px; color: #888; font-size: 0.9rem;">
                            ${dateStr}
                        </div>
                        <div style="flex: 1;">
                            <h3 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${movieTitle} ${log.rewatch ? '<span style="color:#888;" title="Rewatch">🔄</span>' : ''}</h3>
                            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
                                ${log.rating ? `<span style="color: #00e5ff; font-weight: bold;">⭐ ${log.rating}</span>` : ''}
                                ${log.liked ? `<span style="color: #ff2d55;">❤️</span>` : ''}
                                ${locationBadge}
                            </div>
                            ${log.review ? `<p style="color: #ccc; font-size: 0.9rem; line-height: 1.4; ${log.containsSpoilers ? 'filter: blur(4px); cursor: pointer;' : ''}" ${log.containsSpoilers ? 'onclick="event.stopPropagation(); this.style.filter=\'none\';"' : ''}>${log.containsSpoilers ? '[SPOILERS] ' : ''}${log.review}</p>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }

    } catch (err) {
        console.error('Error loading profile and diary:', err);
    }
}

let userTrackers = [];

async function loadTrackers() {
    try {
        const trackers = await apiFetch('/trackers');
        if (!trackers) return;
        userTrackers = trackers;
        
        const grid = document.getElementById('userTrackersGrid');
        
        const addBtnHTML = `
            <div onclick="openAddTrackerModal()" style="border: 2px dashed var(--border-color); border-radius: 12px; display: flex; align-items: center; justify-content: center; min-height: 120px; cursor: pointer; color: var(--text-secondary); transition: all 0.2s;" onmouseover="this.style.borderColor='var(--primary)'; this.style.color='var(--primary)';" onmouseout="this.style.borderColor='var(--border-color)'; this.style.color='var(--text-secondary)';">
                <div style="text-align: center;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 0.5rem;">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <div>Add Tracker</div>
                </div>
            </div>
        `;

        const trackersHTML = trackers.map((tracker, index) => `
            <div style="background: #111; border: 1px solid #333; border-radius: 12px; padding: 1.25rem; cursor: pointer; transition: transform 0.2s;" onclick="openTrackerDetail(${index})">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                    <span style="font-size: 1.2rem; background: rgba(255,255,255,0.05); padding: 0.25rem; border-radius: 8px;">${tracker.icon}</span>
                    <h3 style="margin: 0; font-size: 1rem; color: ${tracker.color || '#fff'};">${tracker.name}</h3>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #888;">
                    <span>Type: ${tracker.type.replace('_', ' ')}</span>
                    <span style="color: var(--primary);">Active</span>
                </div>
            </div>
        `).join('');

        grid.innerHTML = trackersHTML + addBtnHTML;
    } catch (err) {
        console.error('Error loading trackers:', err);
    }
}

function openAddTrackerModal() {
    document.getElementById('addTrackerModal').style.display = 'flex';
}

document.getElementById('addTrackerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('trackerType').value;
    const name = document.getElementById('trackerName').value;
    const icon = document.getElementById('trackerIcon').value;
    const color = document.getElementById('trackerColor').value;

    try {
        const result = await apiFetch('/trackers', {
            method: 'POST',
            body: JSON.stringify({ type, name, icon, color, metadata: {} })
        });
        if (result && !result.error) {
            document.getElementById('addTrackerModal').style.display = 'none';
            document.getElementById('addTrackerForm').reset();
            loadTrackers(); // Refresh trackers
        }
    } catch (err) {
        console.error('Error creating tracker', err);
        alert('Failed to create tracker');
    }
});

let currentActiveTracker = null;

async function openTrackerDetail(index) {
    const tracker = userTrackers[index];
    currentActiveTracker = tracker;

    // Set Header
    document.getElementById('trackerDetailIcon').innerText = tracker.icon;
    document.getElementById('trackerDetailName').innerText = tracker.name;
    document.getElementById('trackerDetailType').innerText = tracker.type.replace(/_/g, ' ');
    
    // Reset Form Container
    document.getElementById('trackerEntryFormContainer').style.display = 'none';

    // Generate Dynamic Fields based on Type
    const dynamicFields = document.getElementById('dynamicEntryFields');
    if (tracker.type === 'FUEL') {
        dynamicFields.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Litres</label><input type="number" step="0.1" id="fuelLitres" required style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
                <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Price/Litre</label><input type="number" step="0.1" id="fuelPrice" required style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Odometer</label><input type="number" id="fuelOdo" required style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
                <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Station</label><input type="text" id="fuelStation" placeholder="e.g. Shell" style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
            </div>
        `;
    } else if (tracker.type === 'VEHICLE') {
        dynamicFields.innerHTML = `
            <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Service Type</label><input type="text" id="serviceType" placeholder="e.g. Oil Change" required style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Odometer</label><input type="number" id="serviceOdo" required style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
                <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Cost</label><input type="number" id="serviceCost" required style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
            </div>
        `;
    } else if (tracker.type === 'SERIES') {
        dynamicFields.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Season</label><input type="number" id="seriesSeason" value="1" required style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
                <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Episode</label><input type="number" id="seriesEpisode" required style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
            </div>
            <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Review / Notes</label><input type="text" id="seriesNotes" style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
        `;
    } else {
        dynamicFields.innerHTML = `
            <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Note / Description</label><input type="text" id="genericNote" required style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
            <div><label style="color:#ccc;display:block;margin-bottom:0.25rem;">Amount / Value (Optional)</label><input type="number" id="genericValue" style="width:100%;padding:0.75rem;background:#2a2a2a;border:1px solid #444;border-radius:8px;color:white;"></div>
        `;
    }

    // Bind Add Button to show form
    document.getElementById('addEntryBtn').onclick = () => {
        document.getElementById('trackerEntryFormContainer').style.display = 'block';
    };

    // Load Entries
    await loadTrackerEntries(tracker._id);

    document.getElementById('trackerDetailModal').style.display = 'flex';
}

async function loadTrackerEntries(trackerId) {
    const timelineEl = document.getElementById('trackerDetailTimeline');
    timelineEl.innerHTML = '<div style="color: #888;">Loading...</div>';
    
    try {
        const entries = await apiFetch('/trackers/' + trackerId + '/entries');
        if (!entries || entries.length === 0) {
            timelineEl.innerHTML = '<div style="color: #888;">No entries yet. Click Add Entry to start tracking!</div>';
            return;
        }

        timelineEl.innerHTML = entries.map(entry => {
            const dateStr = new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            let details = '';
            if (entry.metadata.litres) details = '<b>' + entry.metadata.litres + 'L</b> @ ₹' + entry.metadata.price + '/L (Odo: ' + entry.metadata.odo + ')';
            else if (entry.metadata.season) details = 'Season ' + entry.metadata.season + ', Ep ' + entry.metadata.episode + (entry.metadata.notes ? ' - ' + entry.metadata.notes : '');
            else if (entry.metadata.serviceType) details = entry.metadata.serviceType + ' - ₹' + entry.metadata.cost + ' (Odo: ' + entry.metadata.odo + ')';
            else if (entry.metadata.note) details = entry.metadata.note + (entry.metadata.value ? ' - ₹' + entry.metadata.value : '');
            else details = JSON.stringify(entry.metadata);

            return `
                <div style="background: #1a1a1a; padding: 1rem; border-radius: 8px; border: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                    <div>${details}</div>
                    <div style="color: #666; font-size: 0.8rem;">${dateStr}</div>
                </div>
            `;
        }).join('');
    } catch (err) {
        timelineEl.innerHTML = '<div style="color: red;">Error loading entries</div>';
    }
}

document.getElementById('trackerEntryForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentActiveTracker) return;

    let metadata = {};
    if (currentActiveTracker.type === 'FUEL') {
        metadata = {
            litres: document.getElementById('fuelLitres').value,
            price: document.getElementById('fuelPrice').value,
            odo: document.getElementById('fuelOdo').value,
            station: document.getElementById('fuelStation').value
        };
    } else if (currentActiveTracker.type === 'VEHICLE') {
        metadata = {
            serviceType: document.getElementById('serviceType').value,
            odo: document.getElementById('serviceOdo').value,
            cost: document.getElementById('serviceCost').value
        };
    } else if (currentActiveTracker.type === 'SERIES') {
        metadata = {
            season: document.getElementById('seriesSeason').value,
            episode: document.getElementById('seriesEpisode').value,
            notes: document.getElementById('seriesNotes').value
        };
    } else {
        metadata = {
            note: document.getElementById('genericNote').value,
            value: document.getElementById('genericValue').value
        };
    }

    try {
        await apiFetch('/trackers/' + currentActiveTracker._id + '/entries', {
            method: 'POST',
            body: JSON.stringify({ metadata })
        });
        document.getElementById('trackerEntryForm').reset();
        document.getElementById('trackerEntryFormContainer').style.display = 'none';
        loadTrackerEntries(currentActiveTracker._id);
        
        // Also refresh universal timeline behind
        loadProfileAndDiary();
    } catch (err) {
        console.error('Error saving entry', err);
        alert('Failed to save entry');
    }
});

function init() {
    // Load data from storage
    comments = getFromStorage(STORAGE_KEYS.COMMENTS) || [];

    // Initialize components
    // initAuth(); // Disabled - using Supabase Auth from auth.js
    if (window.authFunctions && window.authFunctions.initAuth) {
        window.authFunctions.initAuth();
    }

    initMovies();
    initMusic();
    initWatchlist();
    // initDiscussions(); // Disabled to prefer Culture Graph Feed


    initEventListeners();
    showSection('trending');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


