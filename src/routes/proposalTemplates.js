const express = require('express');
const router = express.Router();
const ProposalTemplate = require('../models/proposalTemplate');
const auth = require('../middleware/auth');

// Create a new proposal template
router.post('/', auth, async (req, res) => {
  try {
    const template = new ProposalTemplate({
      ...req.body,
      creator: req.user._id
    });
    await template.save();
    res.status(201).send(template);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all proposal templates
router.get('/', async (req, res) => {
  try {
    const templates = await ProposalTemplate.find({ isActive: true });
    res.send(templates);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a specific proposal template
router.get('/:id', async (req, res) => {
  try {
    const template = await ProposalTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).send();
    }
    res.send(template);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a proposal template
router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'description', 'structure', 'isActive'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const template = await ProposalTemplate.findOne({ _id: req.params.id, creator: req.user._id });

    if (!template) {
      return res.status(404).send();
    }

    updates.forEach((update) => template[update] = req.body[update]);
    await template.save();
    res.send(template);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a proposal template (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const template = await ProposalTemplate.findOne({ _id: req.params.id, creator: req.user._id });

    if (!template) {
      return res.status(404).send();
    }

    template.isActive = false;
    await template.save();
    res.send(template);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;