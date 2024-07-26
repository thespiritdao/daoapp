const mongoose = require('mongoose');

const proposalTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  podId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pod',
    required: true
  },
  structure: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    votingSystem: {
      type: String,
      enum: ['single-choice', 'multiple-choice', 'ranked-choice'],
      required: true
    },
    defaultOptions: [{
      text: String
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const ProposalTemplate = mongoose.model('ProposalTemplate', proposalTemplateSchema);

module.exports = ProposalTemplate;