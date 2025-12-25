# 🔧 Quick Fix: MongoDB Connection Error

## Problem
You're getting: "Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted."

## Solution: Whitelist Your IP Address

### Step 1: Go to MongoDB Atlas Network Access
1. Open: https://cloud.mongodb.com/
2. Sign in with your account
3. Click on your project/cluster
4. Click **"Network Access"** in the left sidebar

### Step 2: Add Your IP Address
1. Click **"Add IP Address"** button
2. For development, click **"Allow Access from Anywhere"** (this adds `0.0.0.0/0`)
   - **Note**: This is fine for development. For production, use specific IPs.
3. Click **"Confirm"**
4. Wait 1-2 minutes for the change to take effect

### Step 3: Verify Your .env File
Your `.env` file in the `backend` folder should look like this:

```
PORT=3000
MONGODB_URI=mongodb+srv://aamit_db_user:j5Ac2bDm7muxRvEE@cluster0.65l7jec.mongodb.net/aora?retryWrites=true&w=majority
JWT_SECRET=aora-secret-key-2024-change-in-production
NODE_ENV=development
```

✅ Your .env file looks correct!

### Step 4: Restart Your Backend
```bash
cd backend
npm start
```

You should now see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

## Alternative: Use Local MongoDB (If You Prefer)

If you don't want to use Atlas, you can install MongoDB locally:

### Windows:
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Update your `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/aora
   ```
4. MongoDB will start automatically as a Windows service

### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Then update `.env`:
```
MONGODB_URI=mongodb://localhost:27017/aora
```

---

**Most Common Issue**: Forgetting to whitelist IP in Atlas. The fix is usually just Step 2 above! 🎯
