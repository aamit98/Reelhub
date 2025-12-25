import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateAvatar } from '../utils/generateAvatar.js';
import { authenticate } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Sign Up
router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('username').trim().isLength({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password, username } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate avatar
    const avatar = generateAvatar(username);

    // Create user
    const accountId = crypto.randomUUID();
    const user = new User({
      accountId,
      email,
      password,
      username,
      avatar
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (password is automatically excluded)
    res.status(201).json({
      token,
      user: {
        $id: user._id.toString(),
        accountId: user.accountId,
        email: user.email,
        name: user.username,
        username: user.username,
        avatar: user.avatar,
        $createdAt: user.createdAt,
        $updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Sign In
router.post('/signin', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        $id: user._id.toString(),
        accountId: user.accountId,
        email: user.email,
        name: user.username,
        username: user.username,
        avatar: user.avatar,
        $createdAt: user.createdAt,
        $updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Current User
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      $id: user._id.toString(),
      accountId: user.accountId,
      email: user.email,
      name: user.username,
      username: user.username,
      avatar: user.avatar,
      $createdAt: user.createdAt,
      $updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

