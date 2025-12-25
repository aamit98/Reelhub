# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

1. **Sign up for free**: Go to https://www.mongodb.com/cloud/atlas
2. **Create a cluster**: Choose the free tier (M0)
3. **Create database user**: 
   - Go to Database Access
   - Add new user with username/password
4. **Whitelist IP**: 
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allows all IPs - for development)
5. **Get connection string**:
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/aora`

6. **Update .env file**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aora
   ```

## Option 2: Local MongoDB Installation

### Windows:
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. MongoDB will start automatically as a service
4. Use: `mongodb://localhost:27017/aora` in your .env

### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian):
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Verify Connection

After setting up, restart your backend:
```bash
cd backend
npm run dev
```

You should see: `✅ Connected to MongoDB`





