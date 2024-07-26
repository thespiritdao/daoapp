const mongoose = require('mongoose');

const bountySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  reward: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    enum: ['$SELF', 'ETH', 'USDC']
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'Under Review', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  deadline: {
    type: Date,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  submissions: [{
    submitter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    }
  }],
  escrowAddress: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

bountySchema.index({ title: 'text', description: 'text', tags: 'text' });

const Bounty = mongoose.model('Bounty', bountySchema);

module.exports = Bounty;