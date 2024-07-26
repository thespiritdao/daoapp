const mongoose = require('mongoose');

const podSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentPodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pod',
    default: null
  },
  hatId: {
    type: String,
    required: true
  },
  apps: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'App'
  }]
}, {
  timestamps: true
});

const Pod = mongoose.model('Pod', podSchema);

module.exports = Pod;