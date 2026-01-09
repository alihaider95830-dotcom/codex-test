const express = require('express');
const { Tag } = require('../models');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all tags
router.get('/', protect, async (req, res) => {
  try {
    const tags = await Tag.findAll({
      order: [['name', 'ASC']],
    });

    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
