import express from 'express';
import Proposal from '../models/proposal.js';
import auth from '../middleware/auth.js';
import { sendNotificationToAllUsers } from '../utils/notificationUtils.js';

const router = express.Router();

// Create a new proposal
router.post('/', auth, async (req, res) => {
  try {
    const proposal = new Proposal({
      ...req.body,
      creator: req.user._id
    });
    await proposal.save();
    
    // Send notification to all users about the new proposal
    await sendNotificationToAllUsers(
      'NEW_PROPOSAL',
      `New proposal created: ${proposal.title}`,
      proposal._id
    );
    
    res.status(201).send(proposal);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all proposals
router.get('/', async (req, res) => {
  try {
    const proposals = await Proposal.find({});
    res.send(proposals);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific proposal
router.get('/:id', async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).send();
    }
    res.send(proposal);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a proposal
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description', 'status', 'startDate', 'endDate', 'options', 'votingSystem'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const proposal = await Proposal.findOne({ _id: req.params.id, creator: req.user._id });

    if (!proposal) {
      return res.status(404).send();
    }

    updates.forEach((update) => proposal[update] = req.body[update]);
    await proposal.save();
    res.send(proposal);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a proposal
router.delete('/:id', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findOneAndDelete({ _id: req.params.id, creator: req.user._id });

    if (!proposal) {
      return res.status(404).send();
    }

    res.send(proposal);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Vote on a proposal
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).send();
    }

    if (!proposal.isVotingOpen()) {
      return res.status(400).send({ error: 'This proposal is not currently open for voting.' });
    }

    const optionIndex = req.body.optionIndex;
    if (optionIndex < 0 || optionIndex >= proposal.options.length) {
      return res.status(400).send({ error: 'Invalid option index.' });
    }

    proposal.options[optionIndex].votes += 1;
    proposal.totalVotes += 1;

    await proposal.save();
    res.send(proposal);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;