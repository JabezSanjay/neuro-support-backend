const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  reciever: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  commonId: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Message', messageSchema)
