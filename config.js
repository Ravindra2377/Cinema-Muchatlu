// ============================================
// Cinema Muchatlu - Supabase Configuration
// ============================================

// IMPORTANT: Replace these values with your actual Supabase credentials
// Get them from: https://app.supabase.com/project/_/settings/api

const SUPABASE_URL = 'https://bjliykebjfmeuiwmatbd.supabase.co'; // e.g., 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbGl5a2ViamZtZXVpd21hdGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI4MDIsImV4cCI6MjA4MjYwODgwMn0.xr9UehsyJVqm_XMeGBL97wLnLP8Ai9z8tVPvvx5xheQ'; // Your anon/public key

// Initialize Supabase client
let supabaseClient;

// Check if Supabase library is loaded
if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized successfully');
    console.log('📡 Connected to:', SUPABASE_URL);
} else {
    console.error('❌ Supabase library not loaded. Make sure to include the Supabase CDN script in your HTML.');
}

// Export for use in other files (use supabaseClient, not supabase)
window.supabaseClient = supabaseClient;
