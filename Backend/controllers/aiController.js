const aiService = require('../services/aiService');
const Message = require('../models/Message');

// Process AI query (REST endpoint)
async function processAIQuery(req, res) {
  try {
    const { message, ticketId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    // Optionally fetch conversation history
    let conversationHistory = [];
    if (ticketId) {
      const messages = await Message.find({ ticketId }).sort({ timestamp: -1 }).limit(10).lean();
      conversationHistory = messages.reverse();
    }

    // Generate AI response
    const result = await aiService.generateAIResponse(message, ticketId, conversationHistory);

    return res.json({
      success: true,
      aiResponse: result.response,
      sources: result.sources,
      model: result.model,
      tokensUsed: result.tokensUsed,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('AI Controller error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'AI service error',
    });
  }
}

// Health check for AI service
async function healthCheck(req, res) {
  try {
    const isConnected = await aiService.checkGroqConnection();
    return res.json({
      success: true,
      groqConnected: isConnected,
      timestamp: new Date(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Health check failed',
    });
  }
}

module.exports = {
  processAIQuery,
  healthCheck,
};
