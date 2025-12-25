# Quick MongoDB Connection Fix

## Your IP Addresses:
- **10.100.102.222** (Primary - use this one)
- 192.168.56.1 (Secondary)

## Steps to Fix:

### 1. Go to MongoDB Atlas
- Visit: https://cloud.mongodb.com/
- Sign in to your account

### 2. Navigate to Network Access
- Click on your cluster
- Go to **"Security"** → **"Network Access"** (left sidebar)

### 3. Add IP Address
Click **"Add IP Address"** and choose one:

**Option A - Allow All (Easiest for Development):**
- Click **"Allow Access from Anywhere"**
- Enter: `0.0.0.0/0`
- Click **"Confirm"**

**Option B - Specific IP (More Secure):**
- Click **"Add Current IP Address"** OR
- Manually enter: `10.100.102.222`
- Click **"Confirm"**

### 4. Wait & Restart
- Wait 1-2 minutes for changes to take effect
- Restart your backend server:
  ```bash
  cd backend
  npm start
  ```

## If Still Not Working:

1. **Check your .env file** in `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aora?retryWrites=true&w=majority
   ```
   Make sure:
   - Username and password are correct
   - Database name is `aora` (or your database name)
   - No extra spaces or quotes

2. **Verify your connection string**:
   - Go to Atlas → Database → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add database name: `...mongodb.net/aora?...`

3. **Check if cluster is running**:
   - In Atlas, make sure your cluster status shows "Running" (green)

## Alternative: Use Local MongoDB
If you prefer to use local MongoDB instead:
1. Download MongoDB Community: https://www.mongodb.com/try/download/community
2. Install it
3. Update `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/aora
   ```



