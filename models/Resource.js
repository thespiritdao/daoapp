const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'Document', 'Video', 'Link', etc.
  category: { type: String, required: true },
  tags: [String],
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pod: { type: mongoose.Schema.Types.ObjectId, ref: 'Pod' },
  accessControl: {
    type: String,
    enum: ['Public', 'Members', 'Specific Roles'],
    default: 'Members'
  },
  specificRoles: [String], // Hat IDs for specific role access
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;