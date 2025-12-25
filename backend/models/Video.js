import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2200
  },
  thumbnail: {
    type: String,
    required: true
  },
  prompt: {
    type: String,
    required: true,
    maxlength: 5000
  },
  video: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // This creates $createdAt and $updatedAt automatically
});

// Index for faster queries
videoSchema.index({ creator: 1, createdAt: -1 });

const Video = mongoose.model('Video', videoSchema);

export default Video;


