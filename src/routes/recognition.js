const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const Recognition = require('../models/recognition'); // We'll create this model next
const { HatsClient } = require('@hatsprotocol/sdk-v1-core'); // Assuming we're using Hats Protocol SDK

// Validation schema for giving recognition
const recognitionSchema = Joi.object({
  recipientId: Joi.string().required(),
  reason: Joi.string().required().max(500),
  amount: Joi.number().positive().required()
});

// Route to give recognition
router.post('/give', auth, async (req, res) => {
  try {
    const { error } = recognitionSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { recipientId, reason, amount } = req.body;
    const giverId = req.user.id;

    // TODO: Implement Hats Protocol interaction here
    // This is a placeholder for the actual Hats Protocol implementation
    const hatsClient = new HatsClient(/* Add necessary configuration */);
    const hatId = await hatsClient.mintHat(recipientId, amount);

    const recognition = new Recognition({
      giver: giverId,
      recipient: recipientId,
      reason,
      amount,
      hatId
    });

    await recognition.save();

    res.status(201).json({ message: 'Recognition given successfully', recognitionId: recognition._id });
  } catch (error) {
    console.error('Error giving recognition:', error);
    res.status(500).send('An error occurred while giving recognition');
  }
});

// Route to view recognition for a user
router.get('/view/:userId', auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const recognitions = await Recognition.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('giver', 'username'); // Assuming we have a User model with username

    const totalRecognitions = await Recognition.countDocuments({ recipient: userId });

    res.json({
      recognitions,
      currentPage: page,
      totalPages: Math.ceil(totalRecognitions / limit),
      totalRecognitions
    });
  } catch (error) {
    console.error('Error fetching recognitions:', error);
    res.status(500).send('An error occurred while fetching recognitions');
  }
});

module.exports = router;