const mongoose = require('mongoose');

const artifactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { 
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['$SELF', 'USD', 'ETH', 'OP'], required: true }
  },
  imageUrl: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, default: 1 },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Artifact = mongoose.model('Artifact', artifactSchema);

module.exports = Artifact;