const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const Message = require('../models/message');

// TODO: Import Socket.IO instance from app.js

// Validation schema for sending a message
const messageSchema = Joi.object({
  content: Joi.string().required().max(1000),
  recipientId: Joi.string().required()
});

// Route to send a message
router.post('/send', auth, async (req, res) => {
  try {
    const { error } = messageSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { content, recipientId } = req.body;
    const senderId = req.user.id;

    const message = new Message({
      content,
      sender: senderId,
      recipient: recipientId
    });

    await message.save();

    // Emit socket event for real-time updates
    try {
      const io = req.app.get('io');
      io.to(senderId).to(recipientId).emit('new_message', message);
    } catch (socketError) {
      console.error('Error emitting socket event:', socketError);
    }

    res.status(201).json({ message: 'Message sent successfully', messageId: message._id });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('An error occurred while sending the message');
  }
});

// Route to get messages for a user
router.get('/messages', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({
      $or: [{ sender: userId }, { recipient: userId }]
    });

    res.json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
      totalMessages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('An error occurred while fetching messages');
  }
});

module.exports = router;