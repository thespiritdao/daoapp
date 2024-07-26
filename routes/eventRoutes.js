const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Pod = require('../models/Pod');
const auth = require('../middleware/auth'); // We'll create this middleware later

// Create a new event
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, podId, maxAttendees, tags } = req.body;
    
    let pod;
    if (podId) {
      pod = await Pod.findById(podId);
      if (!pod) {
        return res.status(404).json({ message: 'Pod not found' });
      }
    }

    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      organizer: req.user.userId,
      pod: podId,
      maxAttendees,
      tags
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all events (with optional filtering)
router.get('/', auth, async (req, res) => {
  try {
    const { podId, startDate, endDate } = req.query;
    let filter = {};

    if (podId) filter.pod = podId;
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const events = await Event.find(filter)
      .populate('organizer', 'firstName lastName')
      .populate('pod', 'name')
      .populate('attendees', 'firstName lastName');

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific event
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName')
      .populate('pod', 'name')
      .populate('attendees', 'firstName lastName');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an event
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, maxAttendees, tags } = req.body;
    
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the current user is the organizer
    if (event.organizer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, startDate, endDate, location, maxAttendees, tags },
      { new: true }
    );

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for an event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.attendees.includes(req.user.userId)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is already at maximum capacity' });
    }

    event.attendees.push(req.user.userId);
    await event.save();

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unregister from an event
router.post('/:id/unregister', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.attendees.includes(req.user.userId)) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }

    event.attendees = event.attendees.filter(attendee => attendee.toString() !== req.user.userId);
    await event.save();

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;