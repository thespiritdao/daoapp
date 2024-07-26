const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
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
  version: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  permissions: [{
    type: String
  }],
  settings: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

const App = mongoose.model('App', appSchema);

module.exports = App;