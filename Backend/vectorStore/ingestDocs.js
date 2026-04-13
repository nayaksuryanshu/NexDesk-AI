const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const { generateEmbedding } = require('../services/embeddingService');
const { upsertDocuments, deleteAllDocuments } = require('./mongoVectorClient');

// Load documents from data directory
async function loadDocuments(dirPath = path.join(__dirname, '../data')) {
  const documents = [];

  try {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const ext = path.extname(file).toLowerCase();

      let content = '';

      if (ext === '.txt' || ext === '.md') {
        content = await fs.readFile(filePath, 'utf-8');
      } else if (ext === '.pdf') {
        const dataBuffer = await fs.readFile(filePath);
        const pdfData = await pdf(dataBuffer);
        content = pdfData.text;
      } else if (ext === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        content = result.value;
      } else {
        console.log(`Skipping unsupported file: ${file}`);
        continue;
      }

      documents.push({ filename: file, content });
      console.log(`Loaded: ${file}`);
    }

    return documents;
  } catch (error) {
    console.error('Error loading documents:', error);
    throw error;
  }
}

// Split text into chunks
function splitIntoChunks(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    start += chunkSize - overlap;
  }

  return chunks;
}

// Process single document
async function processDocument(filename, content) {
  const chunks = splitIntoChunks(content);
  const processedDocs = [];

  for (let i = 0; i < chunks.length; i += 1) {
    console.log(`Processing ${filename} - chunk ${i + 1}/${chunks.length}`);

    const embedding = await generateEmbedding(chunks[i]);

    processedDocs.push({
      _id: `${filename}_chunk_${i}`,
      text: chunks[i],
      embedding,
      metadata: {
        source: filename,
        chunkIndex: i,
        totalChunks: chunks.length,
      },
      createdAt: new Date(),
    });
  }

  return processedDocs;
}

// Main ingestion function
async function ingestAllDocuments(reset = false) {
  try {
    console.log('\nStarting document ingestion...\n');

    if (reset) {
      console.log('Resetting vector database...');
      await deleteAllDocuments();
    }

    const documents = await loadDocuments();
    console.log(`\nFound ${documents.length} documents\n`);

    let totalChunks = 0;

    for (const doc of documents) {
      const processedDocs = await processDocument(doc.filename, doc.content);
      await upsertDocuments(processedDocs);
      totalChunks += processedDocs.length;
      console.log(`Ingested ${processedDocs.length} chunks from ${doc.filename}\n`);
    }

    console.log('\nIngestion complete!');
    console.log(`   Documents processed: ${documents.length}`);
    console.log(`   Total chunks created: ${totalChunks}\n`);

    return { documentsProcessed: documents.length, totalChunks };
  } catch (error) {
    console.error('Ingestion error:', error);
    throw error;
  }
}

module.exports = {
  loadDocuments,
  splitIntoChunks,
  processDocument,
  ingestAllDocuments,
};
