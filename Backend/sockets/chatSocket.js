const Message = require('../models/Message');
const aiService = require('../services/aiService');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join ticket room
    socket.on('joinTicket', (ticketId) => {
      socket.join(ticketId);
      console.log(`User ${socket.id} joined ticket: ${ticketId}`);
    });

    // Handle incoming messages
    socket.on('sendMessage', async (data) => {
      try {
        const { ticketId, message, sender, role } = data;

        // Save user message to database
        const userMessage = await Message.create({
          ticketId,
          sender: sender || 'Customer',
          role: role || 'customer',
          content: message,
          isAI: false,
          timestamp: new Date(),
        });

        // Broadcast user message to room
        io.to(ticketId).emit('newMessage', userMessage);

        // If it's a customer message, trigger AI response
        if (role === 'customer') {
          // Emit typing indicator
          io.to(ticketId).emit('aiTyping', { isTyping: true });

          try {
            // Fetch recent conversation history
            const conversationHistory = await Message.find({ ticketId }).sort({ timestamp: -1 }).limit(10).lean();

            // Generate AI response with RAG
            const aiResult = await aiService.generateAIResponse(message, ticketId, conversationHistory.reverse());

            // Save AI message to database
            const aiMessage = await Message.create({
              ticketId,
              sender: 'AI Assistant',
              role: 'ai',
              content: aiResult.response,
              isAI: true,
              metadata: {
                sources: aiResult.sources,
                model: aiResult.model,
                tokensUsed: aiResult.tokensUsed,
              },
              timestamp: new Date(),
            });

            // Broadcast AI response
            io.to(ticketId).emit('newMessage', aiMessage);
          } catch (aiError) {
            console.error('AI generation error:', aiError);

            // Send error message to user
            io.to(ticketId).emit('aiError', {
              message: 'AI assistant is temporarily unavailable. A human agent will assist you shortly.',
            });
          } finally {
            // Stop typing indicator
            io.to(ticketId).emit('aiTyping', { isTyping: false });
          }
        }
      } catch (error) {
        console.error('Socket message error:', error);
        socket.emit('messageError', {
          error: 'Failed to send message',
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
