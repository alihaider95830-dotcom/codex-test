const express = require('express');
const { body, query } = require('express-validator');
const { Note, Tag, User, Share, Comment } = require('../models');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { sanitizeHtml } = require('../utils/sanitize');
const { Op } = require('sequelize');

const router = express.Router();

// Get all notes for current user
router.get('/', protect, async (req, res) => {
  try {
    const { search, tag, starred } = req.query;
    const where = { userId: req.user.id };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }

    if (starred === 'true') {
      where.starred = true;
    }

    const include = [{
      model: Tag,
      attributes: ['id', 'name', 'color'],
      through: { attributes: [] },
    }];

    if (tag) {
      include[0].where = { id: tag };
      include[0].required = true;
    }

    const notes = await Note.findAll({
      where,
      include,
      order: [['updatedAt', 'DESC']],
    });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shared notes
router.get('/shared', protect, async (req, res) => {
  try {
    const shares = await Share.findAll({
      where: { receiverId: req.user.id },
      include: [
        {
          model: Note,
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'avatar'],
            },
            {
              model: Tag,
              attributes: ['id', 'name', 'color'],
              through: { attributes: [] },
            },
          ],
        },
        {
          model: User,
          as: 'Sender',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(shares);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single note
router.get('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id, {
      include: [
        {
          model: Tag,
          attributes: ['id', 'name', 'color'],
          through: { attributes: [] },
        },
        {
          model: User,
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns the note or has access via share
    if (note.userId !== req.user.id) {
      const share = await Share.findOne({
        where: {
          noteId: note.id,
          receiverId: req.user.id,
        },
      });

      if (!share) {
        return res.status(403).json({ message: 'Access denied' });
      }

      note.dataValues.canEdit = share.canEdit;
    } else {
      note.dataValues.canEdit = true;
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create note
router.post(
  '/',
  protect,
  [
    body('title').trim().notEmpty().isLength({ max: 255 }),
    body('content').notEmpty(),
    body('isPrivate').optional().isBoolean(),
    body('color').optional().isString(),
    body('tags').optional().isArray(),
  ],
  validate,
  async (req, res) => {
    try {
      const { title, content, isPrivate, color, tags } = req.body;

      const note = await Note.create({
        title,
        content: sanitizeHtml(content),
        isPrivate: isPrivate !== undefined ? isPrivate : true,
        color: color || '#ffffff',
        userId: req.user.id,
      });

      if (tags && tags.length > 0) {
        const tagInstances = await Promise.all(
          tags.map(async (tagName) => {
            const [tag] = await Tag.findOrCreate({
              where: { name: tagName.trim() },
              defaults: { color: '#6366f1' },
            });
            return tag;
          })
        );
        await note.setTags(tagInstances);
      }

      const createdNote = await Note.findByPk(note.id, {
        include: [
          {
            model: Tag,
            attributes: ['id', 'name', 'color'],
            through: { attributes: [] },
          },
        ],
      });

      res.status(201).json(createdNote);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update note
router.put(
  '/:id',
  protect,
  [
    body('title').optional().trim().notEmpty().isLength({ max: 255 }),
    body('content').optional().notEmpty(),
    body('isPrivate').optional().isBoolean(),
    body('color').optional().isString(),
    body('starred').optional().isBoolean(),
    body('tags').optional().isArray(),
  ],
  validate,
  async (req, res) => {
    try {
      const note = await Note.findByPk(req.params.id);

      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      // Check permissions
      if (note.userId !== req.user.id) {
        const share = await Share.findOne({
          where: {
            noteId: note.id,
            receiverId: req.user.id,
            canEdit: true,
          },
        });

        if (!share) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }

      const { title, content, isPrivate, color, starred, tags } = req.body;
      const updates = {};

      if (title !== undefined) updates.title = title;
      if (content !== undefined) updates.content = sanitizeHtml(content);
      if (isPrivate !== undefined) updates.isPrivate = isPrivate;
      if (color !== undefined) updates.color = color;
      if (starred !== undefined) updates.starred = starred;

      await note.update(updates);

      if (tags !== undefined) {
        const tagInstances = await Promise.all(
          tags.map(async (tagName) => {
            const [tag] = await Tag.findOrCreate({
              where: { name: tagName.trim() },
              defaults: { color: '#6366f1' },
            });
            return tag;
          })
        );
        await note.setTags(tagInstances);
      }

      const updatedNote = await Note.findByPk(note.id, {
        include: [
          {
            model: Tag,
            attributes: ['id', 'name', 'color'],
            through: { attributes: [] },
          },
        ],
      });

      res.json(updatedNote);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete note
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await note.destroy();

    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
