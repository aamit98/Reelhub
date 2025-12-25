# Quick Start Guide

## ✅ Fixed Issues

1. **Frontend dependency installed**: `@react-native-async-storage/async-storage` ✅
2. **Backend MongoDB connection**: Need to set up MongoDB

## 🚀 Setup Steps

### 1. Frontend (Already Fixed)
```bash
npm install  # Already done ✅
npm start    # Ready to run
```

### 2. Backend - MongoDB Setup

**Option A: MongoDB Atlas (Easiest - Free Cloud Database)**

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account → Create free cluster (M0)
3. Create database user (Database Access)
4. Whitelist IP: `0.0.0.0/0` (Network Access)
5. Get connection string (Database → Connect → Connect your application)
6. Create `backend/.env` file:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aora
   JWT_SECRET=your-random-secret-key-here
   NODE_ENV=development
   ```
   Replace `username`, `password`, and `cluster` with your Atlas details

**Option B: Local MongoDB**

1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Create `backend/.env` file:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/aora
   JWT_SECRET=your-random-secret-key-here
   NODE_ENV=development
   ```

### 3. Start Backend
```bash
cd backend
npm install
npm run dev
```

You should see: `✅ Connected to MongoDB`

### 4. Start Frontend
```bash
npm start
```

## 🔧 For Physical Device Testing

Update `lib/api.js` line 3:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_COMPUTER_IP:3000/api'  // Replace with your IP
  : 'https://your-production-api.com/api';
```

Find your IP:
- Windows: `ipconfig` → IPv4 Address
- Mac/Linux: `ifconfig` or `ip addr`

## ✅ Verify Everything Works

1. Backend health: http://localhost:3000/api/health
2. Frontend: Scan QR code with Expo Go
3. Sign up a new user
4. Create a video
5. View videos on home screen

## 🆘 Troubleshooting

**MongoDB connection fails:**
- Check if MongoDB is running (local)
- Verify connection string in `.env`
- Check firewall/network settings

**Frontend can't connect to backend:**
- Make sure backend is running on port 3000
- For physical device: Use computer's IP, not localhost
- Check both are on same network





