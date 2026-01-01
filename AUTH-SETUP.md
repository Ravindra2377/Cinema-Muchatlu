# 🔐 Production Authentication Setup Guide

This guide will help you set up production-grade email/password authentication for Cinema Muchatlu using Supabase.

## Step 1: Set Up Supabase Database Schema (5 minutes)

### Run the SQL Schema

1. **Open Supabase Dashboard**
   - Go to [https://supabase.com](https://supabase.com)
   - Navigate to your Cinema Muchatlu project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Schema**
   - Open the file `auth-schema.sql` from your project
   - Copy all the SQL code
   - Paste it into the Supabase SQL Editor
   - Click "Run" button

4. **Verify Setup**
   - Go to "Table Editor" in the left sidebar
   - You should see a new `profiles` table
   - Check that it has columns: `id`, `username`, `avatar_url`, `bio`, `is_admin`, `reputation`, `created_at`, `updated_at`

---

## Step 2: Configure Email Authentication (2 minutes)

### Enable Email Provider

1. **Go to Supabase Dashboard**
   - Navigate to "Authentication" → "Providers"

2. **Enable Email Provider**
   - Find "Email" in the list
   - Make sure it's enabled (it should be by default)
   - Toggle "Confirm email" to ON (recommended for production)

3. **Configure Site URL**
   - Go to "Project Settings" → "Authentication"
   - Set "Site URL" to: `https://cinema-muchatlu.vercel.app`
   - Add redirect URLs:
     - `https://cinema-muchatlu.vercel.app`
     - `http://localhost:5500` (for local testing with Live Server)
     - `file:///` (for local file testing)

4. **Customize Email Templates (Optional)**
   - Go to "Authentication" → "Email Templates"
   - Customize the email templates if desired:
     - **Confirm signup**: Sent when users register
     - **Reset password**: Sent when users request password reset
     - **Magic link**: For passwordless login (optional)

---

## Step 3: Test Authentication Locally

### Before Deploying

1. **Open your local Cinema Muchatlu**
   - Navigate to `d:/OneDrive/Desktop/Movies`
   - Open `index.html` in your browser (or use Live Server)

2. **Test Signup**
   - Click "Login" button in the header
   - Switch to "Sign Up" tab
   - Enter username, email, and password
   - Click "Sign Up"
   - Check your email for verification link (if email confirmation is enabled)

3. **Verify Email (if enabled)**
   - Click the link in the verification email
   - You should be redirected back to the site

4. **Test Login**
   - After verifying email, try logging in
   - Enter email and password
   - Click "Login"
   - You should see your profile avatar in the header

5. **Test Password Reset**
   - Click "Forgot password?" link
   - Enter your email
   - Check your email for reset link
   - Click the link and set a new password

6. **Test Logout**
   - Click on your profile avatar
   - Click "Logout"
   - You should be logged out

---

## Step 4: Deploy to Vercel

### Update Live Site

1. **Deploy Updated Code**
   ```bash
   cd d:/OneDrive/Desktop/Movies
   vercel --prod
   ```

2. **Test on Live Site**
   - Visit https://cinema-muchatlu.vercel.app
   - Test all authentication flows:
     - Email signup
     - Email verification
     - Email login
     - Password reset
     - Logout

---

## Troubleshooting

### "Email not confirmed" error
- Check your email inbox for the confirmation link
- Check spam folder
- Resend confirmation email from Supabase dashboard
- Or disable email confirmation in Supabase settings (not recommended for production)

### "Invalid login credentials" error
- Make sure you've confirmed your email (if email confirmation is enabled)
- Check that you're using the correct email/password
- Try resetting your password

### First user not becoming admin
- Check the `profiles` table in Supabase
- The `is_admin` column should be `true` for the first user
- If not, manually update: `UPDATE profiles SET is_admin = true WHERE id = 'YOUR_USER_ID'`

### Password reset email not received
- Check spam folder
- Verify email provider is enabled in Supabase
- Check Supabase logs for email delivery errors
- Make sure Site URL is configured correctly

---

## Security Notes

✅ **Passwords are securely hashed** by Supabase  
✅ **Email verification** prevents fake accounts (if enabled)  
✅ **Row Level Security** protects user data  
✅ **HTTPS enforced** on Vercel  
✅ **Session tokens** are managed securely  

---

## Next Steps

After authentication is working:
1. Test creating discussions as a logged-in user
2. Test adding movies to watchlist
3. Verify admin features work
4. Consider adding profile picture upload
5. Consider adding 2FA for extra security

---

## Support

If you encounter any issues:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors (F12)
3. Verify the SQL schema ran successfully
4. Make sure Site URL is configured correctly
