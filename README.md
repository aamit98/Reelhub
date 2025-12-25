# ReelHub

A React Native video sharing app built with Expo, featuring user authentication, video uploads, comments, bookmarks, and trending videos.

## 🚀 Features

- 📱 **Video Sharing**: Upload and share videos with the community
- 🔐 **Authentication**: Sign up, sign in, and secure user sessions
- 💬 **Comments System**: Add comments and like them
- 🔖 **Bookmarks**: Save your favorite videos
- 📈 **Trending**: Discover trending videos based on engagement
- 🔍 **Search**: Search videos by title or description
- 👤 **User Profiles**: Customizable user profiles with avatars
- 🎨 **Modern UI**: Built with NativeWind (Tailwind CSS for React Native)

## 🛠️ Tech Stack

### Frontend
- **React Native** (Expo SDK 54)
- **Expo Router** - File-based routing
- **NativeWind v4** - Tailwind CSS styling
- **React Query** - Data fetching and caching
- **expo-av** - Video playback
- **expo-image-picker** - Image/video selection

### Backend
- **Node.js + Express**
- **MongoDB** with Mongoose
- **JWT Authentication**
- **Multer** - File uploads

## 📋 Prerequisites

- Node.js v20 LTS (recommended) or v24
- MongoDB (local or MongoDB Atlas)
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

## 🔧 Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aamit98/Reelhub.git
cd Reelhub
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/reelhub
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/reelhub
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

**For MongoDB Atlas:**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Whitelist your IP address (Network Access)
4. Get connection string and add to `.env`

### 3. Start Backend Server

```bash
cd backend
npm start
```

Server runs on `http://localhost:3000`

### 4. Frontend Setup

```bash
# In root directory
npm install
```

Update `app.json` with your computer's IP address (for physical device testing):

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://YOUR_IP_ADDRESS:3000"
    }
  }
}
```

Find your IP:
- Windows: `ipconfig`
- Mac/Linux: `ifconfig`

### 5. Start Expo App

```bash
npm start
# or
npx expo start --clear
```

## 📱 Running on Device/Emulator

### iOS Simulator
- Press `i` in Expo terminal
- Or: `npx expo start --ios`

### Android Emulator
- Press `a` in Expo terminal
- Or: `npx expo start --android`

### Physical Device
1. Install Expo Go app on your phone
2. Scan QR code from terminal
3. Make sure phone and computer are on same WiFi

## 📁 Project Structure

```
reelhub/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Auth routes (sign-in, sign-up)
│   ├── (tabs)/            # Tab navigation (home, profile, etc.)
│   ├── video/[id].jsx     # Video detail page
│   └── search/            # Search functionality
├── backend/               # Express backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── uploads/          # Uploaded files
├── components/           # Reusable components
├── lib/                  # Utilities and API client
├── hooks/                # Custom React hooks
└── context/              # React Context providers
```

## 🔑 API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/trending` - Get trending videos
- `POST /api/videos` - Create video (auth required)
- `GET /api/videos/:id` - Get video by ID

### Comments
- `GET /api/comments/:videoId` - Get comments
- `POST /api/comments` - Create comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)

### Bookmarks
- `GET /api/bookmarks` - Get user bookmarks
- `POST /api/bookmarks/:videoId` - Add bookmark
- `DELETE /api/bookmarks/:videoId` - Remove bookmark

## 🎨 Styling

This project uses **NativeWind** (Tailwind CSS for React Native). Styles are written using Tailwind utility classes:

```jsx
<View className="flex-1 bg-primary justify-center items-center">
  <Text className="text-white text-xl font-bold">Hello ReelHub!</Text>
</View>
```

## 🐛 Troubleshooting

### Backend Connection Issues
- Check if backend is running on port 3000
- Verify MongoDB connection
- Check IP address in `app.json` matches your computer's IP

### Video Playback Issues
- Ensure video URLs are accessible HTTP/HTTPS links
- Check video format is supported (mp4, mov, avi, webm)
- Verify video URLs are properly formatted and accessible

### Metro Bundler Issues
- Clear cache: `npx expo start --clear`
- Delete `node_modules` and reinstall
- Check Node.js version (v20 LTS recommended)

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens

### Frontend (app.json)
- `extra.apiBaseUrl` - Backend API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Styled with [NativeWind](https://www.nativewind.dev/)
- Backend powered by [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/)

---

**Note:** Make sure to use Node.js v20 LTS for best compatibility with Expo and Metro bundler.
