import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true // This automatically adds createdAt and updatedAt
});

// Index for faster queries (find comments by video, sorted by newest)
commentSchema.index({ video: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
