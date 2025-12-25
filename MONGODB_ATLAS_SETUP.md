# MongoDB Atlas Setup - Step by Step

## 🎯 Quick Setup (5 minutes)

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/GitHub/Email (FREE)

### Step 2: Create Free Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS, Google, Azure - doesn't matter)
4. Choose a region closest to you
5. Click "Create"

### Step 3: Create Database User
1. Go to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `aora` (or any username)
5. Password: Click "Autogenerate Secure Password" OR create your own
6. **SAVE THE PASSWORD** - you'll need it!
7. Database User Privileges: **Read and write to any database**
8. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - OR add your specific IP
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to **Database** (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### Step 6: Update .env File
1. Open `backend/.env`
2. Replace the connection string:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aora?retryWrites=true&w=majority
   ```
   - Replace `YOUR_USERNAME` with your database username
   - Replace `YOUR_PASSWORD` with your database password
   - Replace `cluster0.xxxxx` with your actual cluster name
   - Keep `/aora` at the end (database name)

### Step 7: Test Connection
1. Restart backend: `cd backend && npm run dev`
2. Should see: `✅ Connected to MongoDB`
3. If you see errors, check:
   - Username/password are correct
   - IP is whitelisted
   - Connection string is correct

## ✅ Example .env File

```
PORT=3000
MONGODB_URI=mongodb+srv://aora:MyPassword123@cluster0.abc123.mongodb.net/aora?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-12345
NODE_ENV=development
```

## 🆘 Common Issues

**"Authentication failed"**
- Check username/password in connection string
- Make sure special characters in password are URL-encoded

**"IP not whitelisted"**
- Go to Network Access → Add IP → Allow from anywhere

**"Connection timeout"**
- Check your internet connection
- Verify the connection string is correct





