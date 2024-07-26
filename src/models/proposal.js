import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  title: {
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
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'executed'],
    default: 'draft'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  votingSystem: {
    type: String,
    enum: ['single-choice', 'multiple-choice', 'ranked-choice'],
    required: true
  },
  options: [{
    text: String,
    votes: {
      type: Number,
      default: 0
    }
  }],
  totalVotes: {
    type: Number,
    default: 0
  },
  result: {
    type: String
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProposalTemplate'
  }
}, {
  timestamps: true
});

proposalSchema.methods.isVotingOpen = function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
};

const Proposal = mongoose.model('Proposal', proposalSchema);

export default Proposal;