const express = require('express');
const { body } = require('express-validator');
const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 30 }).isAlphanumeric(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const existingUser = await User.findOne({
        where: {
          [require('sequelize').Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        username,
        email,
        password,
      });

      const token = generateToken(user.id);

      res.status(201).json({
        user: user.toJSON(),
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user.id);

      res.json({
        user: user.toJSON(),
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json(req.user.toJSON());
});

// Update user profile
router.put(
  '/profile',
  protect,
  [
    body('username').optional().trim().isLength({ min: 3, max: 30 }).isAlphanumeric(),
    body('email').optional().isEmail().normalizeEmail(),
    body('theme').optional().isIn(['light', 'dark']),
  ],
  validate,
  async (req, res) => {
    try {
      const { username, email, theme, avatar } = req.body;
      const updates = {};

      if (username && username !== req.user.username) {
        const existing = await User.findOne({ where: { username } });
        if (existing) {
          return res.status(400).json({ message: 'Username already taken' });
        }
        updates.username = username;
      }

      if (email && email !== req.user.email) {
        const existing = await User.findOne({ where: { email } });
        if (existing) {
          return res.status(400).json({ message: 'Email already taken' });
        }
        updates.email = email;
      }

      if (theme) updates.theme = theme;
      if (avatar !== undefined) updates.avatar = avatar;

      await req.user.update(updates);

      res.json(req.user.toJSON());
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get all users (friends list)
router.get('/users', protect, async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        id: {
          [require('sequelize').Op.ne]: req.user.id,
        },
      },
      attributes: ['id', 'username', 'email', 'avatar', 'createdAt'],
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
