# 🎬 Add Sample Videos to Your App

## Quick Setup

### Step 1: Install Dependencies (if not already)
```bash
npm install
cd backend
npm install
```

### Step 2: Make Sure Backend is Running
```bash
cd backend
npm run dev
```

You should see: `✅ Connected to MongoDB`

### Step 3: Seed Sample Videos
In a **NEW terminal window** (keep backend running):
```bash
cd backend
npm run seed
```

You should see:
```
✅ Connected to MongoDB
✅ Created demo user (or ✅ Demo user already exists)
✅ Seeded 8 sample videos
```

### Step 4: Check Your App!
- Open your app
- Go to Home screen
- You should see 8 awesome sample videos! 🎉

## What Gets Created:

1. **Demo User**: `demo@aora.com` (if doesn't exist)
2. **8 Sample Videos**:
   - Get inspired to code
   - How AI Shapes Coding Future
   - Dalmatian's journey through Italy
   - Meet small AI friends
   - Find inspiration in Every Line
   - Japan's Blossoming temple
   - A Glimpse into Tomorrow's VR World
   - A World where Ideas Grow Big

## 🎯 Now Your App Has:

✅ Beautiful video feed on home screen
✅ Videos you can bookmark
✅ Videos you can watch
✅ Full functionality to test everything!

## 🔄 Run Seed Again?

The script checks if videos exist, so it won't create duplicates. To reset:
1. Delete videos from MongoDB Atlas dashboard
2. Run `npm run seed` again





