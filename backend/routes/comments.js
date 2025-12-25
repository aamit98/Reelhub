import express from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import Comment from '../models/Comment.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/comments/:videoId - Get all comments for a video
router.get('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find({ 
      video: new mongoose.Types.ObjectId(videoId) 
    })
    .populate('user', 'username avatar')
    .populate('likes', 'username avatar')
    .sort({ createdAt: -1 });

    res.json(comments.map(comment => ({
      $id: comment._id.toString(),
      text: comment.text,
      user: {
        $id: comment.user._id.toString(),
        username: comment.user.username,
        avatar: comment.user.avatar
      },
      likes: comment.likes.map(like => ({
        $id: like._id.toString(),
        username: like.username,
        avatar: like.avatar
      })),
      $createdAt: comment.createdAt
    })));

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/comments - Create a new comment
router.post('/', 
  authenticate,
  [
    body('text').trim().notEmpty().withMessage('Comment text is required'),
    body('video').notEmpty().withMessage('Video ID is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { text, video } = req.body;

      const comment = new Comment({
        text: text.trim(),
        video: new mongoose.Types.ObjectId(video),
        user: req.user._id,
        likes: []
      });

      await comment.save();
      await comment.populate('user', 'username avatar');
      await comment.populate('likes', 'username avatar');

      res.status(201).json({
        $id: comment._id.toString(),
        text: comment.text,
        user: {
          $id: comment.user._id.toString(),
          username: comment.user.username,
          avatar: comment.user.avatar
        },
        likes: [],
        $createdAt: comment.createdAt
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create comment' });
    }
  }
);

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// POST /api/comments/:id/like - Like/Unlike a comment
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const userId = req.user._id;
    const likeIndex = comment.likes.findIndex(
      likeId => likeId.toString() === userId.toString()
    );

    if (likeIndex > -1) {
      // Unlike - remove from array
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like - add to array
      comment.likes.push(userId);
    }

    await comment.save();
    await comment.populate('user', 'username avatar');
    await comment.populate('likes', 'username avatar');

    res.json({
      $id: comment._id.toString(),
      text: comment.text,
      user: {
        $id: comment.user._id.toString(),
        username: comment.user.username,
        avatar: comment.user.avatar
      },
      likes: comment.likes.map(like => ({
        $id: like._id.toString(),
        username: like.username,
        avatar: like.avatar
      })),
      $createdAt: comment.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like comment' });
  }
});

export default router;