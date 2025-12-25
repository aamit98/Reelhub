import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      $id: user._id.toString(),
      accountId: user.accountId,
      email: user.email,
      name: user.username,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio || '',
      $createdAt: user.createdAt,
      $updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/:id', 
  authenticate,
  [
    body('username').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Username must be between 1 and 100 characters'),
    body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
    body('avatar').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const User = (await import('../models/User.js')).default;
      const { id } = req.params;
      
      // Check if user is updating their own profile
      if (id !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to update this profile' });
      }

      const updateData = {};
      if (req.body.username) updateData.username = req.body.username.trim();
      if (req.body.bio !== undefined) updateData.bio = req.body.bio.trim();
      if (req.body.avatar !== undefined) updateData.avatar = req.body.avatar.trim();

      const user = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        $id: user._id.toString(),
        accountId: user.accountId,
        email: user.email,
        name: user.username,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio || '',
        $createdAt: user.createdAt,
        $updatedAt: user.updatedAt
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;


