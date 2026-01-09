const express = require('express');
const { body } = require('express-validator');
const { Comment, Note, User, Share, Notification } = require('../models');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { sanitizeHtml } = require('../utils/sanitize');

const router = express.Router();

// Get comments for a note
router.get('/note/:noteId', protect, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check access
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
    }

    const comments = await Comment.findAll({
      where: { noteId: req.params.noteId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'avatar'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post(
  '/',
  protect,
  [
    body('noteId').isUUID(),
    body('content').trim().notEmpty(),
  ],
  validate,
  async (req, res) => {
    try {
      const { noteId, content } = req.body;

      const note = await Note.findByPk(noteId);

      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      // Check access
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
      }

      const comment = await Comment.create({
        noteId,
        userId: req.user.id,
        content: sanitizeHtml(content),
      });

      const createdComment = await Comment.findByPk(comment.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'avatar'],
          },
        ],
      });

      // Create notification for note owner
      if (note.userId !== req.user.id) {
        await Notification.create({
          userId: note.userId,
          type: 'comment',
          message: `${req.user.username} commented on your note: ${note.title}`,
          relatedNoteId: noteId,
          fromUserId: req.user.id,
        });
      }

      res.status(201).json(createdComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete comment
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await comment.destroy();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
