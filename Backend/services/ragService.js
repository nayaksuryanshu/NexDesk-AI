const { generateEmbedding } = require('./embeddingService');
const { vectorSearch, keywordSearch } = require('../vectorStore/mongoVectorClient');

// Retrieve relevant context
async function retrieveContext(query, topK = 3) {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Search vector database
    let results = await vectorSearch(queryEmbedding, topK);

    // Fallback to keyword search if vector search finds nothing
    if (!results || results.length === 0) {
      results = await keywordSearch(query, topK);
    }

    return results.map((result) => ({
      text: result.text,
      score: result.score,
      source: result.metadata?.source || 'knowledge-base',
    }));
  } catch (error) {
    console.error('Context retrieval error:', error);
    const fallbackResults = await keywordSearch(query, topK);
    return fallbackResults.map((result) => ({
      text: result.text,
      score: result.score,
      source: result.metadata?.source || 'knowledge-base',
    }));
  }
}

// Format context for LLM prompt
function formatContextForPrompt(chunks) {
  if (!chunks || chunks.length === 0) {
    return 'No relevant information found in the knowledge base.';
  }

  let formatted = 'Relevant Information from Knowledge Base:\n\n';

  chunks.forEach((chunk, index) => {
    formatted += `[Source: ${chunk.source}]\n`;
    formatted += `${chunk.text}\n\n`;
  });

  return formatted;
}

// Main RAG function
async function getRelevantContext(userMessage, topK = 3) {
  try {
    const chunks = await retrieveContext(userMessage, topK);
    const formattedContext = formatContextForPrompt(chunks);

    return {
      context: formattedContext,
      sources: chunks.map((c) => c.source),
      chunks,
    };
  } catch (error) {
    console.error('RAG error:', error);
    return {
      context: 'Unable to retrieve context at this time.',
      sources: [],
      chunks: [],
    };
  }
}

module.exports = {
  retrieveContext,
  formatContextForPrompt,
  getRelevantContext,
};
