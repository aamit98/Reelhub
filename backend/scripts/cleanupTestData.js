import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Video from '../models/Video.js';
import Bookmark from '../models/Bookmark.js';
import Comment from '../models/Comment.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aora';

async function cleanupTestData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`\n📊 Found ${users.length} users`);

    // Find all videos
    const videos = await Video.find({});
    console.log(`📊 Found ${videos.length} videos`);

    // Find all bookmarks
    const bookmarks = await Bookmark.find({});
    console.log(`📊 Found ${bookmarks.length} bookmarks`);

    // Find all comments
    const comments = await Comment.find({});
    console.log(`📊 Found ${comments.length} comments`);

    // Ask for confirmation
    console.log('\n⚠️  WARNING: This will delete ALL data from the database!');
    console.log('This includes:');
    console.log(`  - ${users.length} users`);
    console.log(`  - ${videos.length} videos`);
    console.log(`  - ${bookmarks.length} bookmarks`);
    console.log(`  - ${comments.length} comments`);
    
    // Delete all data
    await Comment.deleteMany({});
    console.log('✅ Deleted all comments');
    
    await Bookmark.deleteMany({});
    console.log('✅ Deleted all bookmarks');
    
    await Video.deleteMany({});
    console.log('✅ Deleted all videos');
    
    await User.deleteMany({});
    console.log('✅ Deleted all users');

    console.log('\n🎉 Database cleanup complete!');
    console.log('The database is now empty and ready for fresh data.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning up database:', error);
    process.exit(1);
  }
}

cleanupTestData();



