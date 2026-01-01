# Netflix Content Setup Guide

This guide will help you add Netflix original movies and TV shows to your Cinema Muchatlu database.

## Step 1: Update Database Schema

First, you need to add support for platform and content type tracking.

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `add-netflix-support.sql`
5. Click **Run** (or press Ctrl+Enter)

You should see a success message confirming the columns were added.

## Step 2: Load the Netflix Fetcher Script

1. Open `index.html` in your browser
2. Open the browser console (press F12, then click "Console" tab)
3. In the console, run:
   ```javascript
   // Load the Netflix fetcher script
   const script = document.createElement('script');
   script.src = 'fetch-netflix-content.js';
   document.head.appendChild(script);
   ```

## Step 3: Fetch Netflix Content

Once the script is loaded (you'll see "✅ Netflix fetcher script loaded!"), run:

```javascript
fetchNetflixContent()
```

This will:
- Fetch Netflix movies from 2015-2025
- Fetch Netflix TV shows from 2015-2025
- Get director/creator and cast information for each item
- Insert everything into your Supabase database

**Note:** This process will take approximately **30-60 minutes** due to API rate limiting. The console will show progress as it fetches each year's content.

## What You'll Get

- **~550 Netflix Movies** (50 per year × 11 years)
- **~550 Netflix TV Shows** (50 per year × 11 years)
- **Total: ~1,100 Netflix items**

Each item includes:
- Title
- Year
- Genres
- Rating
- Poster image
- Description
- Director/Creator
- Top 5 cast members
- Platform: "Netflix"
- Content Type: "Movie" or "TV Show"

## Step 4: Verify the Data

After the script completes, you should see:
```
✅ Successfully inserted [number] Netflix items into database!
🎉 All done! Your Cinema Muchatlu now has Netflix content!
   🎬 Movies: [number]
   📺 TV Shows: [number]
```

Reload your website to see the Netflix content!

## Optional: Filter by Platform

To add a Netflix filter to your UI, you can modify the filters section in `index.html` and `app.js` to include platform filtering.

## Troubleshooting

**Issue: "Supabase client not initialized"**
- Make sure you're running the script from a page that has loaded `config.js`
- Check that `window.supabaseClient` exists in the console

**Issue: RLS Policy Error**
- The script uses the anon key, which should work with the "Movies are viewable by everyone" policy
- If you get an error, you may need to temporarily disable RLS on the movies table or create an insert policy for anon users

**Issue: Script takes too long**
- This is normal! The script respects TMDB API rate limits (300ms between requests)
- You can reduce `ITEMS_PER_YEAR` in the script to fetch fewer items per year
- Don't close the browser tab while it's running

## Next Steps

Once you have Netflix content in your database, you can:
1. Add platform filters to the UI
2. Create a dedicated "Netflix Originals" section
3. Add badges to show which platform content is from
4. Fetch content from other streaming platforms (Disney+, Amazon Prime, etc.)

Enjoy your Netflix content! 🎬📺
