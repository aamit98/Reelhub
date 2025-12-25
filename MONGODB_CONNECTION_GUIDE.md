# 🗄️ MongoDB Connection Guide - Step by Step

## 🎯 **Option 1: MongoDB Atlas (Cloud - Recommended & FREE)**

### Step 1: Create MongoDB Atlas Account
1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"** or **"Sign Up"**
3. Create your account (it's free!)

### Step 2: Create a Cluster
1. After signing in, click **"Build a Database"**
2. Choose **"FREE"** (M0 Sandbox) - it's free forever!
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to you
5. Click **"Create"**
6. Wait 3-5 minutes for cluster to be created

### Step 3: Create Database User
1. In the **"Security"** section, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter:
   - **Username**: `aora_user` (or any username you want)
   - **Password**: Create a strong password (save it!)
5. Click **"Add User"**

### Step 4: Whitelist Your IP Address
1. In **"Security"** section, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Add Current IP Address"** button
   - OR manually enter: `10.100.102.222`
4. Click **"Confirm"**
5. ⚠️ **Important**: Wait 1-2 minutes for changes to take effect

### Step 5: Get Your Connection String
1. Go back to **"Database"** section
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://aora_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Your .env File
1. Open `backend/.env` file
2. Replace the `MONGODB_URI` with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://aora_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aora?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   PORT=3000
   ```
3. **Replace**:
   - `YOUR_PASSWORD` with the password you created in Step 3
   - `cluster0.xxxxx` with your actual cluster name
   - Add `/aora` before the `?` to specify database name

### Step 7: Test Connection
1. Go to `backend` folder
2. Run: `npm start`
3. You should see:
   ```
   ✅ Connected to MongoDB
   🚀 Server running on http://localhost:3000
   ```

---

## 🏠 **Option 2: Local MongoDB (If You Prefer)**

### Step 1: Install MongoDB
1. Download: **https://www.mongodb.com/try/download/community**
2. Install MongoDB Community Server
3. During installation, check **"Install MongoDB as a Service"**

### Step 2: Start MongoDB Service
**Windows:**
- MongoDB should start automatically as a service
- Or open Services and start "MongoDB"

**Mac/Linux:**
```bash
brew services start mongodb-community
# or
sudo systemctl start mongod
```

### Step 3: Update .env File
1. Open `backend/.env`
2. Set:
   ```env
   MONGODB_URI=mongodb://localhost:27017/aora
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   ```

### Step 4: Test Connection
```bash
cd backend
npm start
```

---

## 🔍 **Troubleshooting**

### Error: "IP not whitelisted"
- ✅ Make sure you added your IP (`10.100.102.222`) to Network Access
- ✅ Wait 1-2 minutes after adding IP
- ✅ Try adding `0.0.0.0/0` (allows all IPs - for development only!)

### Error: "Authentication failed"
- ✅ Check username and password in connection string
- ✅ Make sure you replaced `<password>` with actual password
- ✅ Verify database user exists in Database Access

### Error: "Connection timeout"
- ✅ Check your internet connection
- ✅ Verify cluster is running (not paused)
- ✅ Check firewall settings

### Error: "Invalid connection string"
- ✅ Make sure connection string includes database name: `/aora`
- ✅ Check for typos in username/password
- ✅ Verify cluster name is correct

---

## 📝 **Quick Checklist**

- [ ] MongoDB Atlas account created
- [ ] Cluster created (FREE tier)
- [ ] Database user created
- [ ] IP address whitelisted (`10.100.102.222`)
- [ ] Connection string copied
- [ ] `.env` file updated with connection string
- [ ] Backend restarted
- [ ] See "✅ Connected to MongoDB" message

---

## 🎯 **Your Current IP Address**

**IP to whitelist**: `10.100.102.222`

---

## 💡 **Pro Tips**

1. **Save your password** - Write it down somewhere safe!
2. **Use environment variables** - Never commit `.env` to git
3. **Free tier is enough** - M0 Sandbox is perfect for development
4. **Multiple IPs** - If your IP changes, add the new one to whitelist
5. **Allow all IPs for dev** - Use `0.0.0.0/0` if you're testing from multiple locations

---

**Need Help?** Check `MONGODB_FIX.md` for more details!




