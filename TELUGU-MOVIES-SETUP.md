# 🎬 Telugu Movies Setup Guide - Cinema Muchatlu

Automatically populate your Cinema Muchatlu with **Telugu movies from 2000-2025** using TMDB API!

---

## 🎯 What This Does

- ✅ Fetches **top 20 Telugu movies per year** (2000-2025)
- ✅ Gets **~500 Telugu movies** automatically
- ✅ Includes: Title, Year, Rating, Genres, Director, Cast, Poster, Description
- ✅ Inserts directly into your Supabase database
- ✅ **100% FREE** - No cost

---

## 📋 Prerequisites

Before starting, make sure you have:
- ✅ Completed Supabase setup (from `SUPABASE-SETUP.md`)
- ✅ Your Supabase database is running
- ✅ A TMDB account (we'll create this now)

---

## Step 1: Get TMDB API Key (5 minutes)

### 1.1 Create TMDB Account

1. Go to: [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
2. Sign up with email (it's FREE)
3. Verify your email

### 1.2 Get API Key

1. Go to: [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Click **"Create"** under "Request an API Key"
3. Select **"Developer"**
4. Fill in the form:
   - **Application Name**: Cinema Muchatlu
   - **Application URL**: http://localhost (or your domain)
   - **Application Summary**: Movie community platform
5. Accept terms and click **"Submit"**
6. **Copy your API Key** (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

---

## Step 2: Configure the Fetcher Script

1. Open the file: `d:/OneDrive/Desktop/Movies/fetch-telugu-movies.js`
2. Find line 9:
   ```javascript
   const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE';
   ```
3. Replace `YOUR_TMDB_API_KEY_HERE` with your actual TMDB API key
4. Save the file

**Note:** The Supabase credentials are already filled in from your `config.js`

---

## Step 3: Run the Script

### Option A: Using Browser Console (Easiest)

1. Open `index.html` in your browser
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Load the script by running:
   ```javascript
   // Load the script
   const script = document.createElement('script');
   script.src = 'fetch-telugu-movies.js';
   document.head.appendChild(script);
   ```
5. Wait 2 seconds, then run:
   ```javascript
   fetchAllTeluguMovies();
   ```
6. **Wait 10-15 minutes** while it fetches all movies
7. You'll see progress in the console:
   ```
   📆 Fetching 2000 Telugu movies...
      Found 20 movies
      ✓ Kshana Kshanam (2000) - 8.2⭐
      ✓ Nuvve Kavali (2000) - 7.8⭐
      ...
   ```

### Option B: Using Node.js (Advanced)

If you have Node.js installed:

```bash
cd d:/OneDrive/Desktop/Movies
node fetch-telugu-movies.js
```

---

## Step 4: Verify Movies in Supabase

1. Go to your Supabase dashboard
2. Click **"Table Editor"** → **"movies"**
3. You should see **~500 Telugu movies**!
4. Check a few entries to verify data quality

---

## 🎨 Customization Options

### Change Year Range

Edit lines 12-13 in `fetch-telugu-movies.js`:

```javascript
const START_YEAR = 2000;  // Change start year
const END_YEAR = 2025;    // Change end year
```

### Change Movies Per Year

Edit line 14:

```javascript
const MOVIES_PER_YEAR = 20;  // Get top 20 per year (increase for more)
```

### Add More Languages

Want to add Tamil, Hindi, or other languages too?

Change line 48:

```javascript
`with_original_language=te&` // te=Telugu, ta=Tamil, hi=Hindi, ml=Malayalam
```

---

## 📊 What Data Gets Fetched

For each movie, you'll get:

| Field | Example | Source |
|-------|---------|--------|
| **Title** | "Baahubali: The Beginning" | TMDB |
| **Year** | 2015 | TMDB |
| **Genres** | ["Action", "Drama", "Fantasy"] | TMDB |
| **Rating** | 8.1 | TMDB (out of 10) |
| **Poster** | High-quality image URL | TMDB |
| **Description** | Full movie synopsis | TMDB |
| **Director** | "S.S. Rajamouli" | TMDB Credits |
| **Cast** | ["Prabhas", "Rana Daggubati", ...] | TMDB Credits (top 5) |

---

## ⏱️ How Long Does It Take?

- **~500 movies** (20 per year × 26 years)
- **~300ms per movie** (API rate limiting)
- **Total time: ~10-15 minutes**

The script includes automatic delays to respect TMDB's rate limits (40 requests per 10 seconds).

---

## 🔧 Troubleshooting

### Error: "Invalid API key"
- Double-check you copied the entire API key
- Make sure there are no extra spaces
- Verify your TMDB account is activated

### Error: "Supabase client not initialized"
- Make sure you're running the script in the browser with `index.html` open
- Check that `config.js` is loaded before `fetch-telugu-movies.js`

### Error: "Failed to insert into database"
- Verify your Supabase database schema is set up correctly
- Check that the `movies` table exists
- Make sure you're logged in as admin in Supabase

### Movies not showing up
- Refresh the Supabase Table Editor
- Check browser console for errors
- Verify the script completed successfully

---

## 🎯 After Fetching Movies

### Update Your Frontend

The movies are now in Supabase! Update `app.js` to fetch from database instead of using sample data.

Replace the `initMovies()` function:

```javascript
async function initMovies() {
    // Fetch movies from Supabase
    const { data: movies, error } = await supabaseClient
        .from('movies')
        .select('*')
        .order('year', { ascending: false });
    
    if (error) {
        console.error('Error fetching movies:', error);
        return;
    }
    
    allMovies = movies;
    renderMovies();
    renderTrendingMovies();
}
```

---

## 📝 Adding 2026+ Movies Manually

For movies from 2026 onwards, you can:

1. **Use the same script** - Just update `END_YEAR` to 2026, 2027, etc.
2. **Add via Supabase dashboard** - Insert rows manually in Table Editor
3. **Create an admin form** - Build a movie submission form in your app

---

## 🎬 Sample Output

After running the script, you'll have movies like:

```
✓ RRR (2022) - 8.0⭐
✓ Baahubali 2: The Conclusion (2017) - 8.2⭐
✓ Baahubali: The Beginning (2015) - 8.1⭐
✓ Eega (2012) - 7.5⭐
✓ Magadheera (2009) - 7.7⭐
✓ Pokiri (2006) - 7.9⭐
... and 490+ more!
```

---

## 🚀 Next Steps

1. ✅ Fetch Telugu movies (2000-2025)
2. ✅ Verify in Supabase
3. ✅ Update frontend to use Supabase data
4. ✅ Deploy to Vercel (see `VERCEL-DEPLOYMENT.md`)
5. ✅ Share with friends!

---

## 💡 Pro Tips

- **Run during off-peak hours** - TMDB API is faster at night
- **Save the output** - The script logs all movies to console
- **Backup your data** - Export from Supabase after fetching
- **Update regularly** - Run the script every few months to get new 2025 releases

---

**Ready to fill your Cinema Muchatlu with Telugu movies?** 🎬

Follow the steps above and you'll have hundreds of Telugu movies in ~15 minutes!
