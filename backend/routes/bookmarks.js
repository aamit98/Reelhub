import express from 'express';
import Bookmark from '../models/Bookmark.js';
import Video from '../models/Video.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Helper function to transform video/thumbnail URLs to use request host
const transformUrl = (url, req) => {
  if (!url || typeof url !== 'string') return url;
  
  // If it's already a full URL with hardcoded IP, transform it
  // Otherwise, if it's a relative path starting with /uploads, make it absolute
  if (url.startsWith('/uploads/')) {
    const host = req.get("host");
    const protocol = req.protocol;
    return `${protocol}://${host}${url}`;
  }
  
  // If it's a full URL with a hardcoded IP (like 10.100.102.222), replace with request host
  const hardcodedIpMatch = url.match(/http:\/\/\d+\.\d+\.\d+\.\d+:\d+\/(uploads\/.+)/);
  if (hardcodedIpMatch) {
    const host = req.get("host");
    const protocol = req.protocol;
    return `${protocol}://${host}/${hardcodedIpMatch[1]}`;
  }
  
  // Return as-is for external URLs (YouTube, Vimeo, etc.)
  return url;
};

// Get all bookmarks for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'video',
        populate: {
          path: 'creator',
          select: 'username avatar accountId'
        }
      })
      .sort({ createdAt: -1 });

    const videos = bookmarks
      .filter(b => b.video) // Filter out deleted videos
      .map(bookmark => ({
        $id: bookmark.video._id.toString(),
        title: bookmark.video.title,
        thumbnail: transformUrl(bookmark.video.thumbnail, req),
        prompt: bookmark.video.prompt,
        video: transformUrl(bookmark.video.video, req),
        creator: {
          $id: bookmark.video.creator._id.toString(),
          accountId: bookmark.video.creator.accountId,
          username: bookmark.video.creator.username,
          avatar: bookmark.video.creator.avatar
        },
        $createdAt: bookmark.video.createdAt,
        $updatedAt: bookmark.video.updatedAt,
        bookmarked: true
      }));

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add bookmark
router.post('/:videoId', authenticate, async (req, res) => {
  try {
    const { videoId } = req.params;

    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      video: videoId
    });

    if (existingBookmark) {
      return res.status(400).json({ error: 'Video already bookmarked' });
    }

    // Create bookmark
    const bookmark = new Bookmark({
      user: req.user._id,
      video: videoId
    });

    await bookmark.save();

    res.status(201).json({ message: 'Video bookmarked', bookmarked: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove bookmark
router.delete('/:videoId', authenticate, async (req, res) => {
  try {
    const { videoId } = req.params;

    const bookmark = await Bookmark.findOneAndDelete({
      user: req.user._id,
      video: videoId
    });

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed', bookmarked: false });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if video is bookmarked
router.get('/check/:videoId', authenticate, async (req, res) => {
  try {
    const { videoId } = req.params;

    const bookmark = await Bookmark.findOne({
      user: req.user._id,
      video: videoId
    });

    res.json({ bookmarked: !!bookmark });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;


