const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const Event = require('../models/event'); // We'll create this model next

// Validation schema for creating/editing an event
const eventSchema = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().required().max(1000),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
  location: Joi.string().max(200),
  maxAttendees: Joi.number().integer().min(1).optional()
});

// Route to create a new event
router.post('/create', auth, async (req, res) => {
  try {
    const { error } = eventSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { title, description, startDate, endDate, location, maxAttendees } = req.body;
    const creatorId = req.user.id;

    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      maxAttendees,
      creator: creatorId
    });

    await event.save();

    res.status(201).json({ message: 'Event created successfully', eventId: event._id });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).send('An error occurred while creating the event');
  }
});

// Route to edit an event
router.put('/edit/:eventId', auth, async (req, res) => {
  try {
    const { error } = eventSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const eventId = req.params.eventId;
    const { title, description, startDate, endDate, location, maxAttendees } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).send('Event not found');

    if (event.creator.toString() !== req.user.id) {
      return res.status(403).send('You are not authorized to edit this event');
    }

    event.title = title;
    event.description = description;
    event.startDate = startDate;
    event.endDate = endDate;
    event.location = location;
    event.maxAttendees = maxAttendees;

    await event.save();

    res.json({ message: 'Event updated successfully', eventId: event._id });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).send('An error occurred while updating the event');
  }
});

// Route to sign up for an event
router.post('/signup/:eventId', auth, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).send('Event not found');

    if (event.attendees.includes(userId)) {
      return res.status(400).send('You are already signed up for this event');
    }

    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).send('Event is already full');
    }

    event.attendees.push(userId);
    await event.save();

    res.json({ message: 'Successfully signed up for the event', eventId: event._id });
  } catch (error) {
    console.error('Error signing up for event:', error);
    res.status(500).send('An error occurred while signing up for the event');
  }
});

// Route to get all events
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find()
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit)
      .populate('creator', 'username');

    const totalEvents = await Event.countDocuments();

    res.json({
      events,
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('An error occurred while fetching events');
  }
});

module.exports = router;