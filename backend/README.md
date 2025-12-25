# Aora Backend API

A Node.js/Express backend with MongoDB for the Aora React Native app.

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A random secret key for JWT tokens
   - `PORT`: Server port (default: 3000)

3. **Start MongoDB:**
   - Make sure MongoDB is running locally, or
   - Use MongoDB Atlas (cloud) and update `MONGODB_URI`

4. **Run the server:**
   ```bash
   npm run dev  # Development mode with auto-reload
   # or
   npm start    # Production mode
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in user
- `GET /api/auth/me` - Get current user (requires auth)

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Create video (requires auth)

### Users
- `GET /api/users/:id` - Get user by ID (requires auth)

## Database Schema

### User
- `accountId` (String, unique, indexed)
- `username` (String, required, max 100)
- `email` (String, required, unique)
- `password` (String, hashed)
- `avatar` (String, URL)
- `createdAt`, `updatedAt` (auto-generated)

### Video
- `title` (String, required, max 2200)
- `thumbnail` (String, URL, required)
- `prompt` (String, required, max 5000)
- `video` (String, URL, required)
- `creator` (ObjectId, reference to User)
- `createdAt`, `updatedAt` (auto-generated)

## Development Notes

- For physical device testing, update `API_BASE_URL` in `lib/api.js` to use your computer's IP address instead of `localhost`
- Example: `http://192.168.1.100:3000/api`





