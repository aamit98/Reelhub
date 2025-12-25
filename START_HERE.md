# 🚀 START HERE - Get Your App Working

## The Problem Explained
- **Backend is crashing** because it can't connect to MongoDB (database)
- **No database = No app** - you need MongoDB to store users and videos

## ✅ Quick Fix (5 minutes)

### 1. Get FREE MongoDB Database (Cloud)
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up (FREE, no credit card)
3. Create FREE cluster (M0 Sandbox)
4. Create database user (username: `aora`, password: save it!)
5. Whitelist IP: Click "Allow Access from Anywhere"
6. Get connection string: Database → Connect → Connect your application

### 2. Create .env File
Create file: `backend/.env` with this content:

```
PORT=3000
MONGODB_URI=mongodb+srv://aora:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aora?retryWrites=true&w=majority
JWT_SECRET=my-secret-key-12345
NODE_ENV=development
```

**Replace:**
- `YOUR_PASSWORD` = password from step 1
- `cluster0.xxxxx` = your cluster name from MongoDB Atlas

### 3. Start Backend
```bash
cd backend
npm run dev
```

Should see: `✅ Connected to MongoDB`

### 4. Start Frontend
```bash
npm start
```

## 🎯 What is the Database?

**MongoDB** stores:
- ✅ Users (signup/login data)
- ✅ Videos (title, thumbnail, prompt, etc.)

**MongoDB Atlas** = Cloud version (FREE, no installation needed)

## 📱 Once Running

1. Sign up a new user
2. Create a video
3. View videos on home screen
4. Everything works! 🎉

## 🆘 Need Help?

See `backend/SETUP_NOW.md` for detailed step-by-step instructions.





