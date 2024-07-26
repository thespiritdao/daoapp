const express = require('express');
const router = express.Router();
const Artifact = require('../models/Artifact');
const auth = require('../middleware/auth'); // We'll create this middleware later

// Create a new artifact
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, imageUrl, quantity, tags } = req.body;
    
    const artifact = new Artifact({
      name,
      description,
      price,
      imageUrl,
      seller: req.user.userId,
      quantity,
      tags
    });

    await artifact.save();
    res.status(201).json(artifact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all artifacts
router.get('/', async (req, res) => {
  try {
    const artifacts = await Artifact.find().populate('seller', 'firstName lastName');
    res.json(artifacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific artifact
router.get('/:id', async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id).populate('seller', 'firstName lastName');
    if (!artifact) {
      return res.status(404).json({ message: 'Artifact not found' });
    }
    res.json(artifact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an artifact
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, price, imageUrl, quantity, tags } = req.body;
    
    let artifact = await Artifact.findById(req.params.id);
    if (!artifact) {
      return res.status(404).json({ message: 'Artifact not found' });
    }

    // Check if the current user is the seller
    if (artifact.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this artifact' });
    }

    artifact = await Artifact.findByIdAndUpdate(
      req.params.id,
      { name, description, price, imageUrl, quantity, tags },
      { new: true }
    );

    res.json(artifact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an artifact
router.delete('/:id', auth, async (req, res) => {
  try {
    const artifact = await Artifact.findById(req.params.id);
    if (!artifact) {
      return res.status(404).json({ message: 'Artifact not found' });
    }

    // Check if the current user is the seller
    if (artifact.seller.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this artifact' });
    }

    await artifact.remove();
    res.json({ message: 'Artifact removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;