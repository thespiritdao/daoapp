const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pod: { type: mongoose.Schema.Types.ObjectId, ref: 'Pod', required: true },
  templateUsed: { type: String },
  status: { 
    type: String, 
    enum: ['Draft', 'Active', 'Closed', 'Executed'],
    default: 'Draft'
  },
  startDate: { type: Date },
  endDate: { type: Date },
  votes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vote: { type: String, enum: ['For', 'Against', 'Abstain'] },
    weight: { type: Number, default: 1 },
    timestamp: { type: Date, default: Date.now }
  }],
  result: {
    for: { type: Number, default: 0 },
    against: { type: Number, default: 0 },
    abstain: { type: Number, default: 0 }
  },
  onChainId: { type: String }, // Reference to the on-chain proposal ID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Proposal = mongoose.model('Proposal', proposalSchema);

module.exports = Proposal;