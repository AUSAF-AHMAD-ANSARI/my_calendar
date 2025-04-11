const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  color: {
    type: String,
    default: '#3174ad' // Default color
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Goal', GoalSchema);