const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: {
    type: { type: String, enum: ['Physical', 'Virtual'], required: true },
    details: { type: String, required: true }
  },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pod: { type: mongoose.Schema.Types.ObjectId, ref: 'Pod' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  maxAttendees: { type: Number },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;