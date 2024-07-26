const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const Pod = require('../models/Pod');
const auth = require('../middleware/auth'); // We'll create this middleware later

// Create a new proposal
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, podId, templateUsed, startDate, endDate } = req.body;
    
    const pod = await Pod.findById(podId);
    if (!pod) {
      return res.status(404).json({ message: 'Pod not found' });
    }

    const proposal = new Proposal({
      title,
      description,
      creator: req.user.userId,
      pod: podId,
      templateUsed,
      startDate,
      endDate,
      status: 'Active'
    });

    await proposal.save();
    res.status(201).json(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all proposals
router.get('/', auth, async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate('creator', 'firstName lastName')
      .populate('pod', 'name');
    res.json(proposals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific proposal
router.get('/:id', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('creator', 'firstName lastName')
      .populate('pod', 'name')
      .populate('votes.user', 'firstName lastName');
    
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }
    res.json(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Vote on a proposal
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { vote, weight } = req.body;
    
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    if (proposal.status !== 'Active') {
      return res.status(400).json({ message: 'This proposal is not active' });
    }

    // Check if user has already voted
    const existingVote = proposal.votes.find(v => v.user.toString() === req.user.userId);
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted on this proposal' });
    }

    // Add the vote
    proposal.votes.push({
      user: req.user.userId,
      vote,
      weight: weight || 1
    });

    // Update the result
    proposal.result[vote.toLowerCase()] += weight || 1;

    await proposal.save();
    res.json(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Close a proposal
router.put('/:id/close', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Check if the user has permission to close the proposal
    // This is a simplified check and should be expanded based on your permission system
    const pod = await Pod.findById(proposal.pod);
    if (pod.creator.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to close this proposal' });
    }

    proposal.status = 'Closed';
    await proposal.save();

    res.json(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;