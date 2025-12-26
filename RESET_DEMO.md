# Reset Demo Data Guide

This guide shows you how to reset your ReelHub app with clean demo data for recording/demos.

## Quick Reset (Recommended)

To reset the database and populate it with demo data:

```bash
cd backend
npm run reset-demo
```

This will:
- ✅ Delete all existing users, videos, comments, and bookmarks
- ✅ Create 3 demo users with login credentials
- ✅ Create 6 sample videos with views and likes
- ✅ Add sample comments to videos

## Demo User Credentials

After running the reset script, you can login with any of these accounts:

| Email | Password | Username |
|-------|----------|----------|
| `alex@demo.com` | `demo123` | AlexCreator |
| `tech@demo.com` | `demo123` | TechVideos |
| `nature@demo.com` | `demo123` | NatureLover |

## What Gets Created

### Users
- 3 demo users with avatars and bios
- All passwords are: `demo123`

### Videos
- 6 sample videos with:
  - Titles and descriptions
  - Thumbnail images (from Unsplash)
  - Video URLs (placeholder - you'll need to upload real videos)
  - View counts
  - Likes from other users

### Comments
- Sample comments on videos to make them look more realistic

## Important Notes

⚠️ **Video URLs are placeholders!**
- The seed data includes placeholder video URLs
- For the best demo experience, upload your own videos through the app
- Videos uploaded through the app will use your server's URL automatically

## Other Commands

### Clean Database Only (No Seed Data)
```bash
cd backend
npm run cleanup
```

### Seed Videos Only (Without cleanup)
```bash
cd backend
npm run seed
```

## Customizing Demo Data

To customize the demo data, edit `backend/scripts/resetDemo.js`:
- Modify `DEMO_USERS` array to change user data
- Modify `DEMO_VIDEOS` array to change video data
- Adjust views, likes, and comments as needed

## After Reset

1. Start your backend server: `cd backend && npm start`
2. Start your Expo app: `npm start`
3. Login with any demo account (e.g., `alex@demo.com` / `demo123`)
4. Start recording your demo! 🎬

