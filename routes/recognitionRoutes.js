const express = require('express');
const router = express.Router();
const Recognition = require('../models/Recognition');
const User = require('../models/User');
const Pod = require('../models/Pod');
const auth = require('../middleware/auth'); // We'll create this middleware later

// Give recognition
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, message, emoji, type, score, podId } = req.body;
    
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    let pod;
    if (podId) {
      pod = await Pod.findById(podId);
      if (!pod) {
        return res.status(404).json({ message: 'Pod not found' });
      }
    }

    const recognition = new Recognition({
      giver: req.user.userId,
      receiver: receiverId,
      message,
      emoji,
      type,
      score,
      pod: podId
    });

    await recognition.save();

    // TODO: Implement on-chain recognition here
    // This would involve interacting with a smart contract
    // recognition.onChainId = result from smart contract interaction

    res.status(201).json(recognition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all recognitions (with optional filtering)
router.get('/', auth, async (req, res) => {
  try {
    const { type, podId } = req.query;
    let filter = {};

    if (type) filter.type = type;
    if (podId) filter.pod = podId;

    const recognitions = await Recognition.find(filter)
      .populate('giver', 'firstName lastName')
      .populate('receiver', 'firstName lastName')
      .populate('pod', 'name');

    res.json(recognitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recognitions for a specific user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const recognitions = await Recognition.find({ 
      $or: [{ giver: req.params.userId }, { receiver: req.params.userId }]
    })
      .populate('giver', 'firstName lastName')
      .populate('receiver', 'firstName lastName')
      .populate('pod', 'name');

    res.json(recognitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recognitions for a specific pod
router.get('/pod/:podId', auth, async (req, res) => {
  try {
    const recognitions = await Recognition.find({ pod: req.params.podId })
      .populate('giver', 'firstName lastName')
      .populate('receiver', 'firstName lastName')
      .populate('pod', 'name');

    res.json(recognitions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;