const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const Pod = require('../models/Pod');
const auth = require('../middleware/auth'); // We'll create this middleware later

// Create a new resource
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, url, type, category, tags, podId, accessControl, specificRoles } = req.body;
    
    let pod;
    if (podId) {
      pod = await Pod.findById(podId);
      if (!pod) {
        return res.status(404).json({ message: 'Pod not found' });
      }
    }

    const resource = new Resource({
      title,
      description,
      url,
      type,
      category,
      tags,
      uploader: req.user.userId,
      pod: podId,
      accessControl,
      specificRoles
    });

    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all resources (with optional filtering)
router.get('/', auth, async (req, res) => {
  try {
    const { type, category, podId } = req.query;
    let filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (podId) filter.pod = podId;

    // TODO: Implement access control check based on user's roles (hats)

    const resources = await Resource.find(filter)
      .populate('uploader', 'firstName lastName')
      .populate('pod', 'name');

    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific resource
router.get('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploader', 'firstName lastName')
      .populate('pod', 'name');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // TODO: Implement access control check based on user's roles (hats)

    res.json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a resource
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, url, type, category, tags, accessControl, specificRoles } = req.body;
    
    let resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if the current user is the uploader
    if (resource.uploader.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this resource' });
    }

    resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { title, description, url, type, category, tags, accessControl, specificRoles },
      { new: true }
    );

    res.json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a resource
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if the current user is the uploader
    if (resource.uploader.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }

    await resource.remove();
    res.json({ message: 'Resource removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;