const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add a content'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  createdFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
  },
});

module.exports = mongoose.model('Ticket', ticketSchema);
