const mongoose = require('mongoose');

const recognitionSchema = new mongoose.Schema({
  giver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  emoji: { type: String },
  type: { type: String, enum: ['Praise', 'Feedback'], required: true },
  score: { type: Number, min: 1, max: 5 },
  pod: { type: mongoose.Schema.Types.ObjectId, ref: 'Pod' },
  onChainId: { type: String }, // Reference to on-chain recognition if applicable
  createdAt: { type: Date, default: Date.now }
});

const Recognition = mongoose.model('Recognition', recognitionSchema);

module.exports = Recognition;