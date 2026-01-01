# 🎬 Cinema Muchatlu - Supabase Setup Guide

Follow these steps to set up your Supabase backend for Cinema Muchatlu.

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with:
   - GitHub (recommended)
   - Google
   - Email

**No credit card required!** ✅

---

## Step 2: Create New Project

1. After signing in, click **"New Project"**
2. Fill in the details:
   - **Name**: `cinema-muchatlu`
   - **Database Password**: Create a strong password (save it somewhere safe!)
   - **Region**: Choose closest to your location (e.g., `Southeast Asia (Singapore)` for India)
   - **Pricing Plan**: Select **"Free"**

3. Click **"Create new project"**
4. Wait 2-3 minutes for setup to complete ⏳

---

## Step 3: Get Your API Credentials

1. In your Supabase dashboard, click on **"Settings"** (gear icon in sidebar)
2. Click **"API"** in the settings menu
3. You'll see two important values:

   **Project URL** (looks like):
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key** (looks like):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
   ```

4. **Copy both values** - you'll need them in the next step!

---

## Step 4: Configure Your Frontend

1. Open the file: `d:/OneDrive/Desktop/Movies/config.js`
2. Replace the placeholder values:

   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';  // ← Paste your Project URL here
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';  // ← Paste your anon key here
   ```

3. Save the file

---

## Step 5: Run Database Schema

1. In Supabase dashboard, click **"SQL Editor"** in the sidebar
2. Click **"New query"**
3. Open the file: `d:/OneDrive/Desktop/Movies/supabase-schema.sql`
4. **Copy ALL the contents** of that file
5. **Paste** into the Supabase SQL Editor
6. Click **"Run"** (or press `Ctrl+Enter`)
7. You should see: ✅ **"Success. No rows returned"**

This creates all your database tables, security policies, and triggers!

---

## Step 6: Verify Database Setup

1. Click **"Table Editor"** in the sidebar
2. You should see these tables:
   - ✅ users
   - ✅ movies
   - ✅ watchlists
   - ✅ comments
   - ✅ comment_likes
   - ✅ discussions
   - ✅ discussion_likes
   - ✅ replies

If you see all 8 tables, you're good to go! 🎉

---

## Step 7: Insert Sample Movies (Optional)

The database is empty right now. You have two options:

### Option A: Use the migration script (preserves your current data)
- Run the migration script to copy your localStorage movies to Supabase

### Option B: Start fresh
- Movies will be added as you use the app
- Or manually insert sample movies via SQL

---

## Step 8: Test Your Setup

1. Open `index.html` in your browser
2. Open browser console (F12)
3. You should see: `✅ Supabase client initialized`
4. Try signing up with a new account
5. The first user automatically becomes an admin!

---

## 🎉 You're Done!

Your Cinema Muchatlu is now connected to Supabase with:
- ✅ PostgreSQL database
- ✅ User authentication
- ✅ Real-time features
- ✅ Secure data storage

---

## 🆘 Troubleshooting

**Problem**: "Supabase library not loaded"
- **Solution**: Make sure you've added the Supabase CDN script to your HTML (already done in the updated index.html)

**Problem**: "Invalid API key"
- **Solution**: Double-check that you copied the correct anon key from Supabase dashboard

**Problem**: "Failed to create table"
- **Solution**: Make sure you ran the ENTIRE schema.sql file, not just part of it

**Problem**: Can't sign up
- **Solution**: Check browser console for errors. Make sure your Supabase URL and key are correct in config.js

---

## 📚 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Dashboard](https://app.supabase.com)
- [JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)

---

**Need help?** Check the browser console (F12) for error messages!
