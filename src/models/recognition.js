const mongoose = require('mongoose');

const recognitionSchema = new mongoose.Schema({
  giver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true,
    maxlength: 500
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  hatId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Recognition = mongoose.model('Recognition', recognitionSchema);

module.exports = Recognition;