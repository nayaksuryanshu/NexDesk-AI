const { pipeline } = require('@xenova/transformers');

let embedder = null;

// Initialize embedding model (lazy loading)
async function initEmbedder() {
  if (!embedder) {
    console.log('Loading embedding model...');
    embedder = await pipeline('feature-extraction', process.env.EMBEDDING_MODEL);
    console.log('Embedding model loaded');
  }
  return embedder;
}

// Generate single embedding
async function generateEmbedding(text) {
  try {
    const model = await initEmbedder();
    const output = await model(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error('Embedding generation error:', error);
    throw error;
  }
}

// Generate batch embeddings
async function generateBatchEmbeddings(texts) {
  try {
    const embeddings = [];
    for (let i = 0; i < texts.length; i += 1) {
      if (i % 10 === 0) {
        console.log(`Generating embeddings: ${i}/${texts.length}`);
      }
      const embedding = await generateEmbedding(texts[i]);
      embeddings.push(embedding);
    }
    return embeddings;
  } catch (error) {
    console.error('Batch embedding error:', error);
    throw error;
  }
}

module.exports = {
  generateEmbedding,
  generateBatchEmbeddings,
};
