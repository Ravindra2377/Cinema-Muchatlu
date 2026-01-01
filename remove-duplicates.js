// ============================================
// Remove Duplicate Movies from Supabase
// ============================================
// This script removes duplicate entries from the movies table
// Duplicates are identified by matching title and year

const SUPABASE_URL = 'https://bjliykebjfmeuiwmatbd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbGl5a2ViamZtZXVpd21hdGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI4MDIsImV4cCI6MjA4MjYwODgwMn0.xr9UehsyJVqm_XMeGBL97wLnLP8Ai9z8tVPvvx5xheQ';

// Import Supabase (for Node.js)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

async function removeDuplicates() {
    console.log('🔍 Starting duplicate removal process...\n');

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    try {
        // Fetch all movies
        console.log('📥 Fetching all movies from database...');
        const { data: movies, error: fetchError } = await supabase
            .from('movies')
            .select('*')
            .order('created_at', { ascending: true }); // Keep the oldest entry

        if (fetchError) {
            console.error('❌ Error fetching movies:', fetchError);
            return;
        }

        console.log(`✅ Found ${movies.length} total entries\n`);

        // Find duplicates
        const seen = new Map(); // Map of "title-year" -> first movie entry
        const duplicates = [];

        movies.forEach(movie => {
            const key = `${movie.title.toLowerCase()}-${movie.year}`;

            if (seen.has(key)) {
                // This is a duplicate
                duplicates.push(movie);
            } else {
                // First occurrence, keep it
                seen.set(key, movie);
            }
        });

        console.log(`🔍 Found ${duplicates.length} duplicate entries\n`);

        if (duplicates.length === 0) {
            console.log('✅ No duplicates found! Database is clean.');
            return;
        }

        // Display duplicates
        console.log('📋 Duplicate entries to be removed:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        duplicates.forEach((movie, index) => {
            console.log(`${index + 1}. "${movie.title}" (${movie.year}) - ${movie.content_type || 'Movie'}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        // Remove duplicates
        console.log('🗑️  Removing duplicates...');
        let removedCount = 0;
        let errorCount = 0;

        for (const duplicate of duplicates) {
            const { error: deleteError } = await supabase
                .from('movies')
                .delete()
                .eq('id', duplicate.id);

            if (deleteError) {
                console.error(`❌ Error deleting "${duplicate.title}":`, deleteError.message);
                errorCount++;
            } else {
                removedCount++;
            }
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 SUMMARY');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`✅ Successfully removed: ${removedCount} duplicates`);
        if (errorCount > 0) {
            console.log(`❌ Failed to remove: ${errorCount} entries`);
        }
        console.log(`📦 Remaining unique entries: ${movies.length - removedCount}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        console.log('🎉 Duplicate removal complete!');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

// Run the script
removeDuplicates();
