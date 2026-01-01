// ============================================
// Telugu Movies Data Fetcher - TMDB API
// ============================================
// This script fetches Telugu movies from 2000-2025 using TMDB API
// and inserts them into your Supabase database

// STEP 1: Get your TMDB API key from: https://www.themoviedb.org/settings/api
const TMDB_API_KEY = '908f57e7e8743de6311dde2d8745549c';

// STEP 2: Your Supabase credentials (from config.js)
const SUPABASE_URL = 'https://bjliykebjfmeuiwmatbd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbGl5a2ViamZtZXVpd21hdGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI4MDIsImV4cCI6MjA4MjYwODgwMn0.xr9UehsyJVqm_XMeGBL97wLnLP8Ai9z8tVPvvx5xheQ';

// Configuration
const LANGUAGES = [
    { code: 'te', name: 'Telugu' },
    { code: 'hi', name: 'Hindi' },
    { code: 'en', name: 'English' }
];
const START_YEAR = 2000;
const END_YEAR = 2025;
const MOVIES_PER_LANGUAGE_PER_YEAR = 50; // Top 50 movies per language per year
const DELAY_BETWEEN_REQUESTS = 300; // milliseconds (to respect API rate limits)

// Initialize Supabase client
let supabaseClient;
if (typeof window !== 'undefined' && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Genre mapping (TMDB genre IDs to names)
const GENRE_MAP = {
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

// Sleep function for rate limiting
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch movies for a specific language and year
async function fetchMoviesByLanguageAndYear(languageCode, year, page = 1) {
    const url = `https://api.themoviedb.org/3/discover/movie?` +
        `api_key=${TMDB_API_KEY}&` +
        `with_original_language=${languageCode}&` + // Language code (te/hi/en)
        `primary_release_year=${year}&` +
        `sort_by=popularity.desc&` +
        `page=${page}&` +
        `vote_count.gte=10`; // Only movies with at least 10 votes

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error(`Error fetching ${languageCode} movies for ${year}:`, error);
        return [];
    }
}

// Get movie credits (director and cast)
async function getMovieCredits(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) return { director: 'Unknown', cast: [] };

        const data = await response.json();

        // Get director
        const director = data.crew?.find(person => person.job === 'Director')?.name || 'Unknown';

        // Get top 5 cast members
        const cast = data.cast?.slice(0, 5).map(person => person.name) || [];

        return { director, cast };
    } catch (error) {
        console.error(`Error fetching credits for movie ${movieId}:`, error);
        return { director: 'Unknown', cast: [] };
    }
}

// Convert TMDB movie to Cinema Muchatlu format
function convertToMovieFormat(tmdbMovie, director, cast) {
    // Map genre IDs to genre names
    const genres = tmdbMovie.genre_ids?.map(id => GENRE_MAP[id] || 'Other').filter(Boolean) || ['Drama'];

    return {
        title: tmdbMovie.title || tmdbMovie.original_title,
        year: parseInt(tmdbMovie.release_date?.substring(0, 4)) || new Date().getFullYear(),
        genres: genres,
        rating: Math.round(tmdbMovie.vote_average * 10) / 10, // Round to 1 decimal
        poster_url: tmdbMovie.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
            : null,
        description: tmdbMovie.overview || 'No description available.',
        director: director,
        movie_cast: cast
    };
}

// Insert movies into Supabase
async function insertMoviesIntoSupabase(movies) {
    if (!supabaseClient) {
        console.error('Supabase client not initialized!');
        return { success: false, error: 'Supabase not initialized' };
    }

    try {
        const { data, error } = await supabaseClient
            .from('movies')
            .insert(movies)
            .select();

        if (error) {
            console.error('Supabase insert error:', error);
            return { success: false, error: error.message };
        }

        return { success: true, count: data?.length || 0 };
    } catch (error) {
        console.error('Error inserting into Supabase:', error);
        return { success: false, error: error.message };
    }
}

// Main function to fetch and store movies from all languages
async function fetchAllMovies() {
    console.log('🎬 Starting Multi-Language Movies Data Fetch...');
    console.log(`🌍 Languages: Telugu, Hindi, English`);
    console.log(`📅 Years: ${START_YEAR} to ${END_YEAR}`);
    console.log(`📊 ~${MOVIES_PER_LANGUAGE_PER_YEAR} movies per language per year`);
    console.log('');

    const allMovies = [];
    let totalFetched = 0;
    const stats = { Telugu: 0, Hindi: 0, English: 0 };

    // Loop through each language
    for (const language of LANGUAGES) {
        console.log(`\n🎭 ========== ${language.name.toUpperCase()} MOVIES ==========`);

        // Loop through each year
        for (let year = START_YEAR; year <= END_YEAR; year++) {
            console.log(`📆 Fetching ${year} ${language.name} movies...`);

            const movies = await fetchMoviesByLanguageAndYear(language.code, year);
            const topMovies = movies.slice(0, MOVIES_PER_LANGUAGE_PER_YEAR);

            console.log(`   Found ${topMovies.length} movies`);

            // Fetch credits for each movie
            for (const movie of topMovies) {
                await sleep(DELAY_BETWEEN_REQUESTS); // Rate limiting

                const { director, cast } = await getMovieCredits(movie.id);
                const formattedMovie = convertToMovieFormat(movie, director, cast);

                allMovies.push(formattedMovie);
                totalFetched++;
                stats[language.name]++;

                console.log(`   ✓ ${formattedMovie.title} (${formattedMovie.year}) - ${formattedMovie.rating}⭐`);
            }
        }
    }

    console.log('\n');
    console.log('📊 ========== SUMMARY ==========');
    console.log(`✅ Telugu movies: ${stats.Telugu}`);
    console.log(`✅ Hindi movies: ${stats.Hindi}`);
    console.log(`✅ English movies: ${stats.English}`);
    console.log(`✅ Total movies fetched: ${totalFetched}`);
    console.log('');

    // Insert into Supabase
    console.log('💾 Inserting movies into Supabase database...');
    const result = await insertMoviesIntoSupabase(allMovies);

    if (result.success) {
        console.log(`✅ Successfully inserted ${result.count} movies into database!`);
        console.log('');
        console.log('🎉 All done! Your Cinema Muchatlu now has movies from 2000-2025!');
        console.log(`   🎭 Telugu: ${stats.Telugu} movies`);
        console.log(`   🎭 Hindi: ${stats.Hindi} movies`);
        console.log(`   🎭 English: ${stats.English} movies`);
    } else {
        console.error(`❌ Error inserting movies: ${result.error}`);
        console.log('');
        console.log('📋 Movies data (copy this to manually insert):');
        console.log(JSON.stringify(allMovies, null, 2));
    }

    return allMovies;
}

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
    window.fetchAllMovies = fetchAllMovies;
    window.fetchAllTeluguMovies = fetchAllMovies; // Keep old name for compatibility
    console.log('✅ Script loaded!');
    console.log('📝 Run fetchAllMovies() to fetch Telugu, Hindi & English movies (2000-2025)');
} else {
    module.exports = { fetchAllMovies };
}
