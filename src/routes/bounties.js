const express = require('express');
const router = express.Router();
const Bounty = require('../models/bounty');
const auth = require('../middleware/auth');
const { createEscrowContract } = require('../utils/escrow');

// Create a new bounty
router.post('/', auth, async (req, res) => {
  try {
    const bounty = new Bounty({
      ...req.body,
      creator: req.user._id
    });
    
    // Create escrow contract
    const escrowAddress = await createEscrowContract(bounty.reward, bounty.currency);
    bounty.escrowAddress = escrowAddress;

    await bounty.save();
    res.status(201).json(bounty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all bounties (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { status, tags, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const bounties = await Bounty.find(query)
      .populate('creator', 'username')
      .populate('assignee', 'username')
      .sort({ createdAt: -1 });
    res.json(bounties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific bounty
router.get('/:id', async (req, res) => {
  try {
    const bounty = await Bounty.findById(req.params.id)
      .populate('creator', 'username')
      .populate('assignee', 'username')
      .populate('submissions.submitter', 'username');
    if (!bounty) {
      return res.status(404).json({ message: 'Bounty not found' });
    }
    res.json(bounty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a bounty
router.patch('/:id', auth, async (req, res) => {
  try {
    const bounty = await Bounty.findById(req.params.id);
    if (!bounty) {
      return res.status(404).json({ message: 'Bounty not found' });
    }

    if (bounty.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to update this bounty' });
    }

    Object.assign(bounty, req.body);
    bounty.updatedAt = Date.now();
    await bounty.save();
    res.json(bounty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a bounty
router.delete('/:id', auth, async (req, res) => {
  try {
    const bounty = await Bounty.findById(req.params.id);
    if (!bounty) {
      return res.status(404).json({ message: 'Bounty not found' });
    }

    if (bounty.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to delete this bounty' });
    }

    await bounty.remove();
    res.json({ message: 'Bounty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit work for a bounty
router.post('/:id/submissions', auth, async (req, res) => {
  try {
    const bounty = await Bounty.findById(req.params.id);
    if (!bounty) {
      return res.status(404).json({ message: 'Bounty not found' });
    }

    const submission = {
      submitter: req.user._id,
      content: req.body.content
    };

    bounty.submissions.push(submission);
    bounty.status = 'Under Review';
    await bounty.save();

    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Review a submission
router.patch('/:id/submissions/:submissionId', auth, async (req, res) => {
  try {
    const bounty = await Bounty.findById(req.params.id);
    if (!bounty) {
      return res.status(404).json({ message: 'Bounty not found' });
    }

    if (bounty.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to review submissions' });
    }

    const submission = bounty.submissions.id(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.status = req.body.status;
    if (req.body.status === 'Accepted') {
      bounty.status = 'Completed';
      bounty.assignee = submission.submitter;
      // Here, you would trigger the escrow contract to release funds
    }

    await bounty.save();
    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;