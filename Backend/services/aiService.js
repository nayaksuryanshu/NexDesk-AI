const Groq = require('groq-sdk');
const { getRelevantContext } = require('./ragService');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

function buildFallbackResponse(userMessage, context) {
  if (context && context.trim()) {
    return [
      'I could not reach the AI model provider right now, but I found relevant knowledge base context:',
      '',
      context.slice(0, 900),
      '',
      'If you want, I can still help summarize this or route you to a human support agent.',
    ].join('\n');
  }

  return [
    'I am temporarily unable to reach the AI model provider.',
    `Your question was: "${userMessage}"`,
    'Please try again shortly or continue with a human support agent for urgent help.',
  ].join('\n');
}

function buildRetrievalQuery(userMessage, conversationHistory = []) {
  const normalized = String(userMessage || '').trim();
  const genericReplies = new Set(['yes', 'ok', 'okay', 'sure', 'yep', 'no', 'nah', 'thanks', 'thank you']);
  const normalizedLower = normalized.toLowerCase();

  if (normalized.length > 8 && !genericReplies.has(normalizedLower)) {
    return normalized;
  }

  const lastCustomer = [...conversationHistory]
    .reverse()
    .find((msg) => msg?.role === 'customer' && msg?.content && String(msg.content).trim().toLowerCase() !== normalizedLower);

  if (lastCustomer) {
    return `${lastCustomer.content} ${normalized}`.trim();
  }

  return normalized || 'product support policy';
}

// Generate AI response with RAG
async function generateAIResponse(userMessage, ticketId = null, conversationHistory = []) {
  try {
    console.log(`Generating AI response for: "${userMessage}"`);

    // Retrieve relevant context from vector database
    let context = '';
    let sources = [];
    const retrievalQuery = buildRetrievalQuery(userMessage, conversationHistory);

    try {
      const contextResult = await getRelevantContext(retrievalQuery, 3);
      context = contextResult.context;
      sources = contextResult.sources;
    } catch (vectorError) {
      console.error('Vector retrieval error:', vectorError);
    }

    const question = userMessage;

    // Build strict context-only prompt
    const systemPrompt = `You are a documentation assistant.

  Answer ONLY using the provided context.
  Do NOT use outside knowledge.
  If the answer is not found in context, reply:

  "I don't have information about that in the documentation."

  Context:
  ${context}

  User Question:
  ${question}

  Answer clearly and concisely.`;

    // Build messages array
    const messages = [{ role: 'system', content: systemPrompt }];

    // Add conversation history if provided
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg) => {
        messages.push({
          role: msg.role === 'customer' ? 'user' : 'assistant',
          content: msg.content,
        });
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    try {
      // Call Groq API
      const completion = await groq.chat.completions.create({
        messages,
        model: GROQ_MODEL,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      });

      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response.';

      console.log('AI response generated successfully');

      return {
        response: aiResponse,
        sources,
        model: completion.model,
        tokensUsed: completion.usage?.total_tokens || 0,
      };
    } catch (providerError) {
      console.error('Groq API error:', providerError);

      return {
        response: buildFallbackResponse(userMessage, context),
        sources,
        model: 'fallback-rag-context',
        tokensUsed: 0,
      };
    }
  } catch (error) {
    console.error('AI service error:', error);
    return {
      response: buildFallbackResponse(userMessage, ''),
      sources: [],
      model: 'fallback-unavailable',
      tokensUsed: 0,
    };
  }
}

// Test Groq connection
async function checkGroqConnection() {
  try {
    await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Hello' }],
      model: GROQ_MODEL,
      max_tokens: 10,
    });
    return true;
  } catch (error) {
    console.error('Groq connection test failed:', error);
    return false;
  }
}

module.exports = {
  generateAIResponse,
  checkGroqConnection,
};
