const express = require('express');
const { body } = require('express-validator');
const { Share, Note, User, Notification } = require('../models');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

// Share a note
router.post(
  '/',
  protect,
  [
    body('noteId').isUUID(),
    body('receiverId').isUUID(),
    body('canEdit').optional().isBoolean(),
  ],
  validate,
  async (req, res) => {
    try {
      const { noteId, receiverId, canEdit } = req.body;

      const note = await Note.findByPk(noteId);

      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      if (note.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const receiver = await User.findByPk(receiverId);

      if (!receiver) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if already shared
      const existingShare = await Share.findOne({
        where: { noteId, receiverId },
      });

      if (existingShare) {
        return res.status(400).json({ message: 'Note already shared with this user' });
      }

      const share = await Share.create({
        noteId,
        senderId: req.user.id,
        receiverId,
        canEdit: canEdit || false,
      });

      // Create notification
      await Notification.create({
        userId: receiverId,
        type: 'share',
        message: `${req.user.username} shared a note with you: ${note.title}`,
        relatedNoteId: noteId,
        fromUserId: req.user.id,
      });

      res.status(201).json(share);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update share permissions
router.put(
  '/:id',
  protect,
  [body('canEdit').isBoolean()],
  validate,
  async (req, res) => {
    try {
      const share = await Share.findByPk(req.params.id, {
        include: [{ model: Note }],
      });

      if (!share) {
        return res.status(404).json({ message: 'Share not found' });
      }

      if (share.Note.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      await share.update({ canEdit: req.body.canEdit });

      res.json(share);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Remove share
router.delete('/:id', protect, async (req, res) => {
  try {
    const share = await Share.findByPk(req.params.id, {
      include: [{ model: Note }],
    });

    if (!share) {
      return res.status(404).json({ message: 'Share not found' });
    }

    if (share.Note.userId !== req.user.id && share.receiverId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await share.destroy();

    res.json({ message: 'Share removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
