# ReelHub Backend API

A Node.js/Express backend with MongoDB for the ReelHub React Native video sharing application.

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Uploads**: Multer

## 📋 Prerequisites

- Node.js v20 LTS or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/reelhub
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reelhub
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

**MongoDB Atlas Setup:**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Whitelist your IP address in Network Access
4. Get connection string and add to `.env`

### 3. Run the Server

```bash
npm run dev  # Development mode with auto-reload (requires nodemon)
# or
npm start    # Production mode
```

The server will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in existing user
- `GET /api/auth/me` - Get current authenticated user (requires auth token)

### Videos

- `GET /api/videos` - Get all videos
- `GET /api/videos/trending` - Get trending videos sorted by engagement
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Create new video (requires auth token)

### Comments

- `GET /api/comments/:videoId` - Get all comments for a video
- `POST /api/comments` - Create new comment (requires auth token)
- `DELETE /api/comments/:id` - Delete comment (requires auth token)

### Bookmarks

- `GET /api/bookmarks` - Get user's bookmarked videos (requires auth token)
- `POST /api/bookmarks/:videoId` - Add video to bookmarks (requires auth token)
- `DELETE /api/bookmarks/:videoId` - Remove video from bookmarks (requires auth token)

### Users

- `GET /api/users/:id` - Get user profile by ID (requires auth token)

## 🗄️ Database Schema

### User Model

```javascript
{
  accountId: String (unique, indexed),
  username: String (required, max 100),
  email: String (required, unique),
  password: String (hashed with bcrypt),
  avatar: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Video Model

```javascript
{
  title: String (required, max 2200),
  thumbnail: String (URL, required),
  prompt: String (required, max 5000),
  video: String (URL, required),
  creator: ObjectId (reference to User),
  views: Number (default: 0),
  likes: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model

```javascript
{
  content: String (required),
  video: ObjectId (reference to Video),
  creator: ObjectId (reference to User),
  likes: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Bookmark Model

```javascript
{
  user: ObjectId (reference to User),
  video: ObjectId (reference to Video),
  createdAt: Date
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens are issued upon successful sign-in and expire after 24 hours (default).

## 📁 Project Structure

```
backend/
├── models/          # MongoDB schemas (User, Video, Comment, Bookmark)
├── routes/          # API route handlers
├── middleware/      # Authentication middleware
├── utils/           # Utility functions
├── scripts/         # Seed and cleanup scripts
├── uploads/         # Uploaded video and image files
└── server.js        # Express server entry point
```

## 🧪 Scripts

```bash
npm run seed      # Seed database with sample videos
npm run cleanup   # Clean up test data
```

## 🔧 Development Notes

- For physical device testing, update `API_BASE_URL` in frontend's `lib/api.js` to use your computer's IP address instead of `localhost`
- Example: `http://192.168.1.100:3000/api`
- Uploaded files are stored in `backend/uploads/` directory
- Make sure to configure CORS properly for production deployments
