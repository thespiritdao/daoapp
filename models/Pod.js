const mongoose = require('mongoose');

const podSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  apps: [{ 
    name: String, 
    description: String, 
    config: mongoose.Schema.Types.Mixed 
  }],
  parentPod: { type: mongoose.Schema.Types.ObjectId, ref: 'Pod' },
  hatId: { type: String, required: true }, // Reference to the Hats Protocol token
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Pod = mongoose.model('Pod', podSchema);

module.exports = Pod;