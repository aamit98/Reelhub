import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Video from '../models/Video.js';
import Bookmark from '../models/Bookmark.js';
import Comment from '../models/Comment.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reelhub';

// Demo user credentials for easy login during demo
const DEMO_USERS = [
  {
    accountId: 'demo-user-1',
    username: 'AlexCreator',
    email: 'alex@demo.com',
    password: 'demo123',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Creator&background=FF9C01&color=fff&size=200',
    bio: 'Creative video enthusiast sharing amazing content! 🎬'
  },
  {
    accountId: 'demo-user-2',
    username: 'TechVideos',
    email: 'tech@demo.com',
    password: 'demo123',
    avatar: 'https://ui-avatars.com/api/?name=Tech+Videos&background=6366f1&color=fff&size=200',
    bio: 'Tech reviews and tutorials 🚀'
  },
  {
    accountId: 'demo-user-3',
    username: 'NatureLover',
    email: 'nature@demo.com',
    password: 'demo123',
    avatar: 'https://ui-avatars.com/api/?name=Nature+Lover&background=10b981&color=fff&size=200',
    bio: 'Exploring the beauty of nature 🌿'
  }
];

// Sample videos - Note: You'll need to upload actual videos for these to work
// These are placeholder URLs that should be replaced with your actual uploaded videos
const DEMO_VIDEOS = [
  {
    title: "Amazing Sunset Over Mountains",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", // Replace with actual video
    prompt: "A breathtaking sunset over majestic mountains with vibrant orange and pink skies reflecting on a serene lake below.",
    views: 1523,
    likes: []
  },
  {
    title: "City Lights at Night",
    thumbnail: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800",
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
    prompt: "A mesmerizing timelapse of a bustling city at night with neon lights, busy streets, and illuminated skyscrapers creating a vibrant urban landscape.",
    views: 892,
    likes: []
  },
  {
    title: "Ocean Waves Meditation",
    thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4",
    prompt: "Calming ocean waves gently crashing on a pristine beach at sunrise, with seagulls flying overhead and soft golden light creating a peaceful atmosphere.",
    views: 2105,
    likes: []
  },
  {
    title: "Mountain Adventure Journey",
    thumbnail: "https://images.unsplash.com/photo-1464822759844-d150ad6bfa46?w=800",
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    prompt: "An epic journey through towering mountain peaks covered in snow, with hikers traversing challenging trails and capturing stunning panoramic views.",
    views: 634,
    likes: []
  },
  {
    title: "Forest Walk in Spring",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
    prompt: "A peaceful walk through a lush green forest in springtime, with sunlight filtering through leaves, wildflowers blooming, and birds chirping in the background.",
    views: 1247,
    likes: []
  },
  {
    title: "Abstract Art Animation",
    thumbnail: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
    video: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4",
    prompt: "Colorful abstract shapes and patterns flowing and transforming in a mesmerizing animation, creating a dynamic visual experience with smooth transitions.",
    views: 1856,
    likes: []
  }
];

async function resetDemo() {
  try {
    console.log('🔄 Starting demo reset...\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear all existing data
    console.log('🧹 Cleaning up existing data...');
    await Comment.deleteMany({});
    console.log('  ✅ Deleted all comments');
    
    await Bookmark.deleteMany({});
    console.log('  ✅ Deleted all bookmarks');
    
    await Video.deleteMany({});
    console.log('  ✅ Deleted all videos');
    
    await User.deleteMany({});
    console.log('  ✅ Deleted all users\n');

    // Create demo users
    console.log('👥 Creating demo users...');
    const createdUsers = [];
    for (const userData of DEMO_USERS) {
      // User model will hash password automatically via pre-save hook
      const user = new User({
        ...userData
      });
      await user.save();
      createdUsers.push(user);
      console.log(`  ✅ Created user: ${user.username} (${user.email} / ${userData.password})`);
    }
    console.log('');

    // Create demo videos
    console.log('🎬 Creating demo videos...');
    const videosPerUser = Math.ceil(DEMO_VIDEOS.length / DEMO_USERS.length);
    
    for (let i = 0; i < DEMO_VIDEOS.length; i++) {
      const videoData = DEMO_VIDEOS[i];
      const creator = createdUsers[Math.floor(i / videosPerUser) % createdUsers.length];
      
      // Add some likes from other users to make it look more realistic
      const otherUsers = createdUsers.filter(u => u._id.toString() !== creator._id.toString());
      const numLikes = Math.floor(Math.random() * otherUsers.length);
      const likes = otherUsers.slice(0, numLikes).map(u => u._id);
      
      const video = new Video({
        ...videoData,
        creator: creator._id,
        likes: likes
      });
      
      await video.save();
      console.log(`  ✅ Created video: "${video.title}" by ${creator.username} (${numLikes} likes, ${video.views} views)`);
    }
    console.log('');

    // Create some sample comments
    console.log('💬 Creating sample comments...');
    const videos = await Video.find().populate('creator');
    for (const video of videos) {
      const commentUsers = createdUsers.filter(u => u._id.toString() !== video.creator._id.toString());
      if (commentUsers.length > 0 && Math.random() > 0.3) {
        const commentUser = commentUsers[Math.floor(Math.random() * commentUsers.length)];
        const comments = [
          "Amazing video! 🎉",
          "Love this content!",
          "Great work!",
          "This is so inspiring! ✨",
          "Beautiful! Keep it up!"
        ];
        const comment = new Comment({
          text: comments[Math.floor(Math.random() * comments.length)],
          video: video._id,
          user: commentUser._id
        });
        await comment.save();
        console.log(`  ✅ Added comment to "${video.title}"`);
      }
    }
    console.log('');

    console.log('🎉 Demo reset complete!\n');
    console.log('📝 Demo User Credentials:');
    DEMO_USERS.forEach(user => {
      console.log(`   Email: ${user.email} | Password: ${user.password}`);
    });
    console.log('\n💡 Note: Video URLs in seed data are placeholders.');
    console.log('   Upload your own videos through the app for best demo experience!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting demo:', error);
    process.exit(1);
  }
}

resetDemo();

