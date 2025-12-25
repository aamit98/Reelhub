import express from 'express';
import Video from '../models/Video.js';
import { authenticate } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all videos with optional search
router.get('/', async (req, res) => {
  try {
    const { query, creator } = req.query;
    let searchFilter = {};

    // If creator filter provided
    if (creator) {
      searchFilter.creator = creator;
    }

    // If search query provided, search in title and prompt
    if (query) {
      searchFilter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { prompt: { $regex: query, $options: 'i' } }
      ];
    }

    const videos = await Video.find(searchFilter)
      .populate('creator', 'username avatar accountId')
      .populate('likes', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(videos.map(video => ({
      $id: video._id.toString(),
      title: video.title,
      thumbnail: video.thumbnail,
      prompt: video.prompt,
      video: video.video,
      creator: {
        $id: video.creator._id.toString(),
        accountId: video.creator.accountId,
        username: video.creator.username,
        avatar: video.creator.avatar
      },
      likes: video.likes ? video.likes.map(like => ({
        $id: like._id.toString(),
        username: like.username,
        avatar: like.avatar
      })) : [],
      views: video.views || 0,
      $createdAt: video.createdAt,
      $updatedAt: video.updatedAt
    })));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create video
router.post('/', authenticate, [
  body('title').trim().isLength({ min: 1, max: 2200 }),
  body('thumbnail').notEmpty().withMessage('Thumbnail is required'),
  body('prompt').trim().isLength({ min: 1, max: 5000 }),
  body('video').notEmpty().withMessage('Video is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { title, thumbnail, prompt, video } = req.body;

    const newVideo = new Video({
      title,
      thumbnail,
      prompt,
      video,
      creator: req.user._id
    });

    await newVideo.save();
    await newVideo.populate('creator', 'username avatar accountId');

    res.status(201).json({
      $id: newVideo._id.toString(),
      title: newVideo.title,
      thumbnail: newVideo.thumbnail,
      prompt: newVideo.prompt,
      video: newVideo.video,
      creator: {
        $id: newVideo.creator._id.toString(),
        accountId: newVideo.creator.accountId,
        username: newVideo.creator.username,
        avatar: newVideo.creator.avatar
      },
      $createdAt: newVideo.createdAt,
      $updatedAt: newVideo.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('creator', 'username avatar accountId')
      .populate('likes', 'username avatar');

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.json({
      $id: video._id.toString(),
      title: video.title,
      thumbnail: video.thumbnail,
      prompt: video.prompt,
      video: video.video,
      creator: {
        $id: video.creator._id.toString(),
        accountId: video.creator.accountId,
        username: video.creator.username,
        avatar: video.creator.avatar
      },
      likes: video.likes.map(like => ({
        $id: like._id.toString(),
        username: like.username,
        avatar: like.avatar
      })),
      views: video.views || 0,
      $createdAt: video.createdAt,
      $updatedAt: video.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/Unlike a video
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const userId = req.user._id;
    const likeIndex = video.likes.findIndex(
      likeId => likeId.toString() === userId.toString()
    );

    if (likeIndex > -1) {
      // Unlike - remove from array
      video.likes.splice(likeIndex, 1);
    } else {
      // Like - add to array
      video.likes.push(userId);
    }

    await video.save();
    await video.populate('creator', 'username avatar accountId');
    await video.populate('likes', 'username avatar');

    res.json({
      $id: video._id.toString(),
      title: video.title,
      thumbnail: video.thumbnail,
      prompt: video.prompt,
      video: video.video,
      creator: {
        $id: video.creator._id.toString(),
        accountId: video.creator.accountId,
        username: video.creator.username,
        avatar: video.creator.avatar
      },
      likes: video.likes.map(like => ({
        $id: like._id.toString(),
        username: like.username,
        avatar: like.avatar
      })),
      views: video.views || 0,
      $createdAt: video.createdAt,
      $updatedAt: video.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like video' });
  }
});

// Check if user liked a video
router.get('/:id/like/check', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const userId = req.user._id;
    const liked = video.likes.some(
      likeId => likeId.toString() === userId.toString()
    );

    res.json({ liked });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check like status' });
  }
});

// Delete video (owner only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Check if user is the creator
    if (video.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this video' });
    }

    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// Get trending videos (sorted by likes and views)
router.get('/trending', async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('creator', 'username avatar accountId')
      .populate('likes', 'username avatar')
      .sort({ 
        // Sort by engagement score: (likes * 2 + views)
        createdAt: -1 
      });

    // Calculate engagement score and sort
    const videosWithScore = videos.map(video => ({
      video,
      score: (video.likes?.length || 0) * 2 + (video.views || 0)
    }));

    videosWithScore.sort((a, b) => b.score - a.score);

    const trending = videosWithScore.slice(0, 10).map(item => ({
      $id: item.video._id.toString(),
      title: item.video.title,
      thumbnail: item.video.thumbnail,
      prompt: item.video.prompt,
      video: item.video.video,
      creator: {
        $id: item.video.creator._id.toString(),
        accountId: item.video.creator.accountId,
        username: item.video.creator.username,
        avatar: item.video.creator.avatar
      },
      likes: item.video.likes.map(like => ({
        $id: like._id.toString(),
        username: like.username,
        avatar: like.avatar
      })),
      views: item.video.views || 0,
      $createdAt: item.video.createdAt,
      $updatedAt: item.video.updatedAt
    }));

    res.json(trending);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

