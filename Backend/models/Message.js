const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, index: true },
  sender: { type: String, required: true },
  role: { type: String, enum: ['customer', 'agent', 'ai'], required: true },
  content: { type: String, required: true },
  isAI: { type: Boolean, default: false },
  metadata: {
    sources: [String],
    model: String,
    tokensUsed: Number
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
