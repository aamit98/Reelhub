// Script to seed trending video data
// Run with: node backend/scripts/seedTrendingData.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from '../models/Video.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aora';

const sampleVideos = [
  {
    title: "Amazing AI Generated Landscape",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    prompt: "A breathtaking mountain landscape at sunset with vibrant colors",
    video: "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4",
    likes: [],
    views: 0
  },
  {
    title: "Epic Space Journey",
    thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
    prompt: "A journey through space showing planets and stars",
    video: "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4",
    likes: [],
    views: 0
  },
  {
    title: "Ocean Waves Meditation",
    thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
    prompt: "Calming ocean waves on a peaceful beach",
    video: "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4",
    likes: [],
    views: 0
  },
  {
    title: "City Lights at Night",
    thumbnail: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
    prompt: "A bustling city at night with neon lights",
    video: "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4",
    likes: [],
    views: 0
  },
  {
    title: "Forest Adventure",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    prompt: "A mystical forest with sunlight filtering through trees",
    video: "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4",
    likes: [],
    views: 0
  },
  {
    title: "Abstract Art Animation",
    thumbnail: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800",
    prompt: "Abstract colorful art animation with flowing patterns",
    video: "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4",
    likes: [],
    views: 0
  },
  {
    title: "Desert Mirage",
    thumbnail: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
    prompt: "A vast desert with mirages and sand dunes",
    video: "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4",
    likes: [],
    views: 0
  },
  {
    title: "Aurora Borealis",
    thumbnail: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800",
    prompt: "Northern lights dancing across the night sky",
    video: "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4",
    likes: [],
    views: 0
  }
];

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create a test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      testUser = new User({
        email: 'test@example.com',
        username: 'TestUser',
        accountId: 'test123',
        avatar: 'https://via.placeholder.com/100',
        password: 'hashedpassword' // In real app, this would be hashed
      });
      await testUser.save();
      console.log('✅ Created test user');
    }

    // Clear existing videos (optional - comment out if you want to keep existing)
    // await Video.deleteMany({});
    // console.log('✅ Cleared existing videos');

    // Create videos
    const createdVideos = [];
    for (const videoData of sampleVideos) {
      const video = new Video({
        ...videoData,
        creator: testUser._id
      });
      await video.save();
      createdVideos.push(video);
      console.log(`✅ Created video: ${video.title}`);
    }

    // Add some likes and views to make them trending
    const users = await User.find().limit(5);
    if (users.length > 0) {
      for (let i = 0; i < createdVideos.length; i++) {
        const video = createdVideos[i];
        // Add random likes
        const numLikes = Math.floor(Math.random() * users.length);
        video.likes = users.slice(0, numLikes).map(u => u._id);
        // Add random views
        video.views = Math.floor(Math.random() * 1000) + 10;
        await video.save();
        console.log(`✅ Updated video ${video.title} with ${numLikes} likes and ${video.views} views`);
      }
    }

    console.log('\n✅ Seeding completed!');
    console.log(`✅ Created ${createdVideos.length} videos`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedData();




