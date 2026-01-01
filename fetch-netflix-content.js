// ============================================
// Netflix Content Fetcher - TMDB API
// ============================================
// This script fetches Netflix original movies and TV shows using TMDB API
// and inserts them into your Supabase database

// TMDB API Configuration
const TMDB_API_KEY = '908f57e7e8743de6311dde2d8745549c';

// Supabase credentials (from config.js)
const SUPABASE_URL = 'https://bjliykebjfmeuiwmatbd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbGl5a2ViamZtZXVpd21hdGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI4MDIsImV4cCI6MjA4MjYwODgwMn0.xr9UehsyJVqm_XMeGBL97wLnLP8Ai9z8tVPvvx5xheQ';

// Configuration
const NETFLIX_PROVIDER_ID = 8; // Netflix's provider ID in TMDB
const START_YEAR = 2015; // Netflix originals started around 2013-2015
const END_YEAR = 2025;
const ITEMS_PER_YEAR = 50; // Top 50 items per year
const DELAY_BETWEEN_REQUESTS = 300; // milliseconds

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
    37: 'Western',
    // TV Genres
    10759: 'Action & Adventure',
    10762: 'Kids',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics'
};

// Sleep function for rate limiting
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch Netflix movies for a specific year
async function fetchNetflixMoviesByYear(year, page = 1) {
    const url = `https://api.themoviedb.org/3/discover/movie?` +
        `api_key=${TMDB_API_KEY}&` +
        `with_watch_providers=${NETFLIX_PROVIDER_ID}&` +
        `watch_region=US&` +
        `primary_release_year=${year}&` +
        `sort_by=popularity.desc&` +
        `page=${page}&` +
        `vote_count.gte=10`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error(`Error fetching Netflix movies for ${year}:`, error);
        return [];
    }
}

// Fetch Netflix TV shows for a specific year
async function fetchNetflixTVShowsByYear(year, page = 1) {
    const url = `https://api.themoviedb.org/3/discover/tv?` +
        `api_key=${TMDB_API_KEY}&` +
        `with_watch_providers=${NETFLIX_PROVIDER_ID}&` +
        `watch_region=US&` +
        `first_air_date_year=${year}&` +
        `sort_by=popularity.desc&` +
        `page=${page}&` +
        `vote_count.gte=10`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error(`Error fetching Netflix TV shows for ${year}:`, error);
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
        const director = data.crew?.find(person => person.job === 'Director')?.name || 'Unknown';
        const cast = data.cast?.slice(0, 5).map(person => person.name) || [];

        return { director, cast };
    } catch (error) {
        console.error(`Error fetching credits for movie ${movieId}:`, error);
        return { director: 'Unknown', cast: [] };
    }
}

// Get TV show credits (creator and cast)
async function getTVShowCredits(tvId) {
    const url = `https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${TMDB_API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) return { director: 'Unknown', cast: [] };

        const data = await response.json();

        // For TV shows, get the creator from the show details
        const detailsUrl = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${TMDB_API_KEY}`;
        const detailsResponse = await fetch(detailsUrl);
        const details = await detailsResponse.json();

        const director = details.created_by?.[0]?.name || 'Unknown';
        const cast = data.cast?.slice(0, 5).map(person => person.name) || [];

        return { director, cast };
    } catch (error) {
        console.error(`Error fetching credits for TV show ${tvId}:`, error);
        return { director: 'Unknown', cast: [] };
    }
}

// Convert TMDB movie to Cinema Muchatlu format
function convertMovieToFormat(tmdbMovie, director, cast) {
    const genres = tmdbMovie.genre_ids?.map(id => GENRE_MAP[id] || 'Other').filter(Boolean) || ['Drama'];

    return {
        title: tmdbMovie.title || tmdbMovie.original_title,
        year: parseInt(tmdbMovie.release_date?.substring(0, 4)) || new Date().getFullYear(),
        genres: genres,
        rating: Math.round(tmdbMovie.vote_average * 10) / 10,
        poster_url: tmdbMovie.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
            : null,
        description: tmdbMovie.overview || 'No description available.',
        director: director,
        movie_cast: cast,
        platform: 'Netflix',
        content_type: 'Movie'
    };
}

// Convert TMDB TV show to Cinema Muchatlu format
function convertTVShowToFormat(tmdbShow, creator, cast) {
    const genres = tmdbShow.genre_ids?.map(id => GENRE_MAP[id] || 'Other').filter(Boolean) || ['Drama'];

    return {
        title: tmdbShow.name || tmdbShow.original_name,
        year: parseInt(tmdbShow.first_air_date?.substring(0, 4)) || new Date().getFullYear(),
        genres: genres,
        rating: Math.round(tmdbShow.vote_average * 10) / 10,
        poster_url: tmdbShow.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdbShow.poster_path}`
            : null,
        description: tmdbShow.overview || 'No description available.',
        director: creator,
        movie_cast: cast,
        platform: 'Netflix',
        content_type: 'TV Show'
    };
}

// Insert content into Supabase
async function insertContentIntoSupabase(content) {
    if (!supabaseClient) {
        console.error('Supabase client not initialized!');
        return { success: false, error: 'Supabase not initialized' };
    }

    try {
        const { data, error } = await supabaseClient
            .from('movies')
            .insert(content)
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

// Main function to fetch and store Netflix content
async function fetchNetflixContent() {
    console.log('🎬 Starting Netflix Content Fetch...');
    console.log(`📅 Years: ${START_YEAR} to ${END_YEAR}`);
    console.log(`📊 ~${ITEMS_PER_YEAR} items per year`);
    console.log('');

    const allContent = [];
    let totalFetched = 0;
    const stats = { Movies: 0, TVShows: 0 };

    // Fetch Movies
    console.log('\n🎬 ========== NETFLIX MOVIES ==========');
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        console.log(`📆 Fetching ${year} Netflix movies...`);

        const movies = await fetchNetflixMoviesByYear(year);
        const topMovies = movies.slice(0, ITEMS_PER_YEAR);

        console.log(`   Found ${topMovies.length} movies`);

        for (const movie of topMovies) {
            await sleep(DELAY_BETWEEN_REQUESTS);

            const { director, cast } = await getMovieCredits(movie.id);
            const formattedMovie = convertMovieToFormat(movie, director, cast);

            allContent.push(formattedMovie);
            totalFetched++;
            stats.Movies++;

            console.log(`   ✓ ${formattedMovie.title} (${formattedMovie.year}) - ${formattedMovie.rating}⭐`);
        }
    }

    // Fetch TV Shows
    console.log('\n📺 ========== NETFLIX TV SHOWS ==========');
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        console.log(`📆 Fetching ${year} Netflix TV shows...`);

        const shows = await fetchNetflixTVShowsByYear(year);
        const topShows = shows.slice(0, ITEMS_PER_YEAR);

        console.log(`   Found ${topShows.length} TV shows`);

        for (const show of topShows) {
            await sleep(DELAY_BETWEEN_REQUESTS);

            const { director, cast } = await getTVShowCredits(show.id);
            const formattedShow = convertTVShowToFormat(show, director, cast);

            allContent.push(formattedShow);
            totalFetched++;
            stats.TVShows++;

            console.log(`   ✓ ${formattedShow.title} (${formattedShow.year}) - ${formattedShow.rating}⭐`);
        }
    }

    console.log('\n');
    console.log('📊 ========== SUMMARY ==========');
    console.log(`✅ Netflix Movies: ${stats.Movies}`);
    console.log(`✅ Netflix TV Shows: ${stats.TVShows}`);
    console.log(`✅ Total content fetched: ${totalFetched}`);
    console.log('');

    // Insert into Supabase
    console.log('💾 Inserting Netflix content into Supabase database...');
    const result = await insertContentIntoSupabase(allContent);

    if (result.success) {
        console.log(`✅ Successfully inserted ${result.count} Netflix items into database!`);
        console.log('');
        console.log('🎉 All done! Your Cinema Muchatlu now has Netflix content!');
        console.log(`   🎬 Movies: ${stats.Movies}`);
        console.log(`   📺 TV Shows: ${stats.TVShows}`);
    } else {
        console.error(`❌ Error inserting content: ${result.error}`);
        console.log('');
        console.log('📋 Content data (copy this to manually insert):');
        console.log(JSON.stringify(allContent, null, 2));
    }

    return allContent;
}

// Export for use in browser console
if (typeof window !== 'undefined') {
    window.fetchNetflixContent = fetchNetflixContent;
    console.log('✅ Netflix fetcher script loaded!');
    console.log('📝 Run fetchNetflixContent() to fetch Netflix movies and TV shows');
} else {
    module.exports = { fetchNetflixContent };
}
