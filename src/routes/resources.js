const express = require('express');
const router = express.Router();
const Resource = require('../models/resource');
const auth = require('../middleware/auth');
const { checkTokenGating } = require('../utils/tokenGating');

// Create a new resource
router.post('/', auth, async (req, res) => {
  try {
    const resource = new Resource({
      ...req.body,
      createdBy: req.user._id
    });
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all resources (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { category, tags, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const resources = await Resource.find(query).populate('createdBy', 'username');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific resource
router.get('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('createdBy', 'username');
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.requiredTokenId) {
      const hasAccess = await checkTokenGating(req.user._id, resource.requiredTokenId);
      if (!hasAccess) {
        return res.status(403).json({ message: 'Access denied. Required token not held.' });
      }
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a resource
router.patch('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to update this resource' });
    }

    Object.assign(resource, req.body);
    resource.updatedAt = Date.now();
    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a resource
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to delete this resource' });
    }

    await resource.remove();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;