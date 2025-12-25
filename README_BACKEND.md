# Backend Setup Instructions

## Quick Start

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/aora
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=development
   ```

4. **Install MongoDB** (if not installed):
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - **Or use MongoDB Atlas** (cloud): Get free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

5. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

6. **Start the backend server:**
   ```bash
   npm run dev
   ```

7. **Update frontend API URL** (if testing on physical device):
   - Open `lib/api.js`
   - Change `localhost` to your computer's IP address
   - Example: `http://192.168.1.100:3000/api`

## Frontend Setup

1. **Install AsyncStorage:**
   ```bash
   npm install @react-native-async-storage/async-storage
   ```

2. **The app is already configured to use the new backend!**

## Testing

- Backend health check: `http://localhost:3000/api/health`
- Test signup: `POST http://localhost:3000/api/auth/signup`
- Test signin: `POST http://localhost:3000/api/auth/signin`





