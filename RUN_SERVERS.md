# 🚀 Running Backend and Frontend

## ✅ **Current Status**

Both servers have been started in the background:
- **Backend**: Running on port 3000 (requires MongoDB)
- **Frontend**: Expo dev server starting

## 📋 **Backend Setup (Required)**

The backend needs MongoDB to run. You have two options:

### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Create `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aora
PORT=3000
JWT_SECRET=your-secret-key-here
```

### Option 2: Local MongoDB
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Create `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/aora
PORT=3000
JWT_SECRET=your-secret-key-here
```

## 🎯 **Starting Servers**

### Backend (Terminal 1):
```bash
cd backend
npm install  # If not already done
npm start
```

### Frontend (Terminal 2):
```bash
npm start
# Then press 'i' for iOS or 'a' for Android
```

## 🌐 **API Configuration**

Your frontend is configured to use:
- **API URL**: `http://10.100.102.222:3000/api`
- **Your IP**: `10.100.102.222` ✅ (matches current IP)

If your IP changes, update `lib/api.js`:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_NEW_IP:3000/api'
  : 'https://your-production-api.com/api';
```

## ✅ **Verify Backend is Running**

Check backend health:
```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{"status":"OK","message":"Aora API is running"}
```

## 📱 **Access Frontend**

1. Scan QR code with Expo Go app (iOS/Android)
2. Or press:
   - `i` for iOS Simulator
   - `a` for Android Emulator
   - `w` for Web

## 🔧 **Troubleshooting**

### Backend won't start:
- ✅ Check MongoDB is running/connected
- ✅ Check `.env` file exists in `backend/` folder
- ✅ Check port 3000 is not in use

### Frontend can't connect:
- ✅ Check backend is running on port 3000
- ✅ Verify IP address in `lib/api.js` matches your computer's IP
- ✅ Check firewall allows connections

### MongoDB Connection Error:
- ✅ Verify MongoDB URI in `.env`
- ✅ Check MongoDB service is running (if local)
- ✅ Check network connection (if Atlas)

## 📝 **Quick Commands**

**Start Backend:**
```bash
cd backend && npm start
```

**Start Frontend:**
```bash
npm start
```

**Check Backend Health:**
```bash
curl http://localhost:3000/api/health
```

**Find Your IP (Windows):**
```bash
ipconfig | findstr IPv4
```

---

**Status**: Both servers are starting! Make sure MongoDB is configured for the backend to fully start.




