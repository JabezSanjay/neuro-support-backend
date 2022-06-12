const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add a content'],
  },
  createdBy: String,
  course: String,
  createdFor: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  mentor: String,
});

module.exports = mongoose.model('Ticket', ticketSchema);
