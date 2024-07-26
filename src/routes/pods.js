const express = require('express');
const router = express.Router();
const Pod = require('../models/pod');

// Get all pods
router.get('/', async (req, res) => {
  try {
    const pods = await Pod.find();
    res.json(pods);
  } catch (err) {
    console.error('Error fetching pods:', err);
    res.status(500).json({ message: 'An error occurred while fetching pods', error: err.message });
  }
});

// Get one pod
router.get('/:id', async (req, res) => {
  try {
    const pod = await Pod.findById(req.params.id);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }
    res.json(pod);
  } catch (err) {
    console.error('Error fetching pod:', err);
    res.status(500).json({ message: 'An error occurred while fetching the pod', error: err.message });
  }
});

// Create pod
router.post('/', async (req, res) => {
  if (!req.body.name || !req.body.description || !req.body.hatId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const pod = new Pod({
    name: req.body.name,
    description: req.body.description,
    creatorId: req.user._id,
    hatId: req.body.hatId
  });

  try {
    const newPod = await pod.save();
    res.status(201).json(newPod);
  } catch (err) {
    console.error('Error creating pod:', err);
    res.status(400).json({ message: 'An error occurred while creating the pod', error: err.message });
  }
});

// Update pod
router.put('/:id', async (req, res) => {
  try {
    const pod = await Pod.findById(req.params.id);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }

    if (req.body.name) {
      pod.name = req.body.name;
    }
    if (req.body.description) {
      pod.description = req.body.description;
    }
    if (req.body.hatId) {
      pod.hatId = req.body.hatId;
    }

    const updatedPod = await pod.save();
    res.json(updatedPod);
  } catch (err) {
    console.error('Error updating pod:', err);
    res.status(400).json({ message: 'An error occurred while updating the pod', error: err.message });
  }
});

// Delete pod
router.delete('/:id', async (req, res) => {
  try {
    const pod = await Pod.findById(req.params.id);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }

    await pod.remove();
    res.json({ message: 'Pod deleted successfully' });
  } catch (err) {
    console.error('Error deleting pod:', err);
    res.status(500).json({ message: 'An error occurred while deleting the pod', error: err.message });
  }
});

module.exports = router;