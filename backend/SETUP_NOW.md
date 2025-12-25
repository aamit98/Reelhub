# 🚀 QUICK SETUP - Get Your App Working in 5 Minutes

## The Problem
Your backend is crashing because it can't connect to MongoDB. You need a database!

## The Solution: MongoDB Atlas (FREE Cloud Database)

### Step 1: Create MongoDB Atlas Account (2 minutes)
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up (FREE - no credit card needed)
3. Verify your email

### Step 2: Create Free Cluster (1 minute)
1. Click **"Build a Database"**
2. Choose **FREE** (M0 Sandbox) - it's free forever
3. Click **"Create"** (don't change any settings)

### Step 3: Create Database User (1 minute)
1. Click **"Database Access"** (left menu)
2. Click **"Add New Database User"**
3. Username: `aora`
4. Password: Click **"Autogenerate Secure Password"** 
   - **COPY THIS PASSWORD** - you'll need it!
5. Click **"Add User"**

### Step 4: Allow Network Access (30 seconds)
1. Click **"Network Access"** (left menu)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### Step 5: Get Connection String (1 minute)
1. Click **"Database"** (left menu)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
   - Looks like: `mongodb+srv://aora:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Create .env File
1. In `backend` folder, create a file named `.env`
2. Copy this content (replace with YOUR connection string):

```
PORT=3000
MONGODB_URI=mongodb+srv://aora:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/aora?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-12345-change-this
NODE_ENV=development
```

**Important:**
- Replace `YOUR_PASSWORD_HERE` with the password from Step 3
- Replace `cluster0.xxxxx` with your actual cluster name
- Keep `/aora` at the end (database name)

### Step 7: Start Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

### Step 8: Start Frontend
```bash
npm start
```

## ✅ What is the Database?

**MongoDB** is a NoSQL database that stores your:
- Users (email, username, password, avatar)
- Videos (title, thumbnail, prompt, video URL, creator)

**MongoDB Atlas** is the cloud version - you don't need to install anything, it runs in the cloud for FREE.

## 🎯 Once Everything is Running

1. **Backend**: Should show `✅ Connected to MongoDB`
2. **Frontend**: Should connect to backend (no more network errors)
3. **Test**: Sign up a new user → Create a video → View on home screen

## 🆘 Still Having Issues?

- Check `.env` file exists in `backend/` folder
- Verify connection string is correct (no typos)
- Make sure IP is whitelisted in MongoDB Atlas
- Check backend terminal for specific error messages





