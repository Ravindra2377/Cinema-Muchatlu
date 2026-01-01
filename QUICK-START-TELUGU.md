# 🎬 Quick Start: Add Movies to Cinema Muchatlu

Get **3,900+ movies** in Telugu, Hindi & English (2000-2025) automatically!

---

## ⚡ 3 Simple Steps

### 1️⃣ Get TMDB API Key (2 minutes)

1. Go to: **https://www.themoviedb.org/signup**
2. Sign up (FREE, no credit card)
3. Go to: **https://www.themoviedb.org/settings/api**
4. Click **"Create"** → **"Developer"**
5. Fill form:
   - App Name: `Cinema Muchatlu`
   - URL: `http://localhost`
   - Summary: `Movie platform`
6. **Copy your API key**

### 2️⃣ Add API Key to Script

1. Open: `fetch-telugu-movies.js`
2. Line 8: Replace `YOUR_TMDB_API_KEY_HERE` with your key
3. Save

### 3️⃣ Run the Script

1. Open `index.html` in browser
2. Press **F12** (open console)
3. Paste this:
   ```javascript
   const script = document.createElement('script');
   script.src = 'fetch-telugu-movies.js';
   document.head.appendChild(script);
   ```
4. Press Enter, wait 2 seconds
5. Paste this:
   ```javascript
   fetchAllMovies();
   ```
6. Press Enter
7. **Wait 60-90 minutes** ⏳ (fetching 3,900 movies takes time!)

---

## 📊 What You'll Get

- 🎭 **~1,300 Telugu movies** (50 per year × 26 years)
- 🎭 **~1,300 Hindi movies** (50 per year × 26 years)
- 🎭 **~1,300 English movies** (50 per year × 26 years)
- **Total: ~3,900 movies!**

---

## ✅ Done!

You'll see:
```
📊 ========== SUMMARY ==========
✅ Telugu movies: 1300
✅ Hindi movies: 1300
✅ English movies: 1300
✅ Total movies fetched: 3900

✅ Successfully inserted 3900 movies into database!
🎉 All done!
```

---

## 🔍 Verify

1. Go to Supabase dashboard
2. **Table Editor** → **movies**
3. See 3,900+ movies in 3 languages! 🎬

---

## ⚙️ Customize

Want more/fewer movies per language?

Edit line 22 in `fetch-telugu-movies.js`:
```javascript
const MOVIES_PER_LANGUAGE_PER_YEAR = 50; // Change this number
```

Want different years?

Edit lines 17-18:
```javascript
const START_YEAR = 2000; // Change start year
const END_YEAR = 2025;   // Change end year
```

---

## 📚 Need More Help?

See full guide: **TELUGU-MOVIES-SETUP.md**

---

**That's it!** Your Cinema Muchatlu now has 3,900+ movies in Telugu, Hindi & English! 🚀
