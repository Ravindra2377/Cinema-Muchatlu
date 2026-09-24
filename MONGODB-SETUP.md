# 🎬 Cinema Muchatlu - MongoDB Setup Guide

## Architecture

```
Cinema-Muchatlu/
├── index.html          # Frontend (served by Express)
├── styles.css          # Styling
├── app.js              # Frontend app logic
├── config.js           # API client (replaces Supabase config)
├── auth.js             # Auth logic (JWT-based)
├── auth-ui.js          # Auth UI handlers
└── server/
    ├── package.json    # Backend dependencies
    ├── index.js        # Express server + API routes
    ├── models.js       # Mongoose schemas
    ├── middleware.js    # JWT auth middleware
    ├── seed.js         # Database seeder
    ├── .env            # Your secrets (create this!)
    └── .env.example    # Template
```

## 🚀 Setup Steps

### Step 1: Create MongoDB Atlas Account (Free)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign up / Login
3. Create a **Free Shared Cluster** (M0)
4. Set a database user with username & password
5. Add your IP to the **Network Access** whitelist (or use `0.0.0.0/0` for development)
6. Click **Connect → Drivers** and copy the connection string

### Step 2: Configure the `.env` File

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and paste your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/cinema-muchatlu?retryWrites=true&w=majority
JWT_SECRET=pick_a_long_random_secret_string_here
PORT=5000
```

### Step 3: Seed the Database

```bash
cd server
node seed.js
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing movies and discussions
🎬 Inserted 20 sample movies
💬 Inserted 3 sample discussions
✅ Seed complete!
```

### Step 4: Start the Server

```bash
cd server
npm start
```

You should see:
```
✅ Connected to MongoDB Atlas
🎬 Cinema Muchatlu server running on http://localhost:5000
📡 API available at http://localhost:5000/api
```

### Step 5: Open in Browser

- **This machine**: http://localhost:5000
- **Other devices** (same Wi-Fi): http://YOUR_IP:5000

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |
| GET | `/api/movies` | No | List all movies (supports `?genre=`, `?search=`, `?contentType=`) |
| GET | `/api/movies/trending` | No | Top 10 movies by rating |
| GET | `/api/movies/:id` | No | Single movie detail |
| GET | `/api/watchlist` | Yes | User's watchlist |
| POST | `/api/watchlist/:movieId` | Yes | Toggle movie in watchlist |
| GET | `/api/comments/:movieId` | No | Comments for a movie |
| POST | `/api/comments/:movieId` | Yes | Add comment |
| POST | `/api/comments/:commentId/like` | Yes | Toggle like |
| DELETE | `/api/comments/:commentId` | Yes | Delete comment |
| GET | `/api/discussions` | No | All discussions |
| POST | `/api/discussions` | Yes (Admin) | Create discussion |
| POST | `/api/discussions/:id/like` | Yes | Toggle like |
| GET | `/api/discussions/:id/replies` | No | Get replies |
| POST | `/api/discussions/:id/replies` | Yes | Add reply |

---

## Notes

- The **first user to sign up** automatically becomes an admin
- JWT tokens expire after 7 days
- The Express server serves the frontend files as static assets
