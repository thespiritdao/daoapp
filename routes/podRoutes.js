const express = require('express');
const router = express.Router();
const Pod = require('../models/Pod');
const auth = require('../middleware/auth'); // We'll create this middleware later

// Create a new pod
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, parentPod, hatId } = req.body;
    
    const pod = new Pod({
      name,
      description,
      creator: req.user.userId,
      parentPod,
      hatId,
      members: [req.user.userId] // Creator is automatically a member
    });

    await pod.save();
    res.status(201).json(pod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all pods
router.get('/', auth, async (req, res) => {
  try {
    const pods = await Pod.find().populate('creator', 'firstName lastName');
    res.json(pods);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific pod
router.get('/:id', auth, async (req, res) => {
  try {
    const pod = await Pod.findById(req.params.id)
      .populate('creator', 'firstName lastName')
      .populate('members', 'firstName lastName')
      .populate('parentPod', 'name');
    
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }
    res.json(pod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a pod
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, apps } = req.body;
    
    let pod = await Pod.findById(req.params.id);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }

    // Check if the current user is the creator or has necessary permissions
    // This is a simplified check and should be expanded based on your permission system
    if (pod.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this pod' });
    }

    pod = await Pod.findByIdAndUpdate(
      req.params.id,
      { name, description, apps },
      { new: true }
    );

    res.json(pod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a member to a pod
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    
    const pod = await Pod.findById(req.params.id);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }

    // Check if the user is already a member
    if (pod.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this pod' });
    }

    pod.members.push(userId);
    await pod.save();

    res.json(pod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a member from a pod
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const pod = await Pod.findById(req.params.id);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }

    // Remove the member
    pod.members = pod.members.filter(member => member.toString() !== req.params.userId);
    await pod.save();

    res.json(pod);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;