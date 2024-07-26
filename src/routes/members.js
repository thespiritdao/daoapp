const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await User.find().select('-password');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific member
router.get('/:id', async (req, res) => {
  try {
    const member = await User.findById(req.params.id).select('-password');
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search members
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const members = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).select('-password');
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;