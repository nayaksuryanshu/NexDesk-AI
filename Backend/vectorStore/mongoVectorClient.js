const { MongoClient } = require('mongodb');
require('dotenv').config();

let client;
let db;
let collection;

// Initialize MongoDB connection
async function initVectorDB() {
  try {
    if (client) return { db, collection };

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    db = client.db(process.env.VECTOR_DB_NAME);
    collection = db.collection(process.env.VECTOR_COLLECTION_NAME);

    console.log('Connected to MongoDB Atlas Vector Store');
    return { db, collection };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Upsert documents with embeddings
async function upsertDocuments(documents) {
  try {
    const { collection } = await initVectorDB();

    const bulkOps = documents.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: { $set: doc },
        upsert: true,
      },
    }));

    const result = await collection.bulkWrite(bulkOps);
    console.log(`Upserted ${result.upsertedCount + result.modifiedCount} documents`);
    return result;
  } catch (error) {
    console.error('Upsert error:', error);
    throw error;
  }
}

// Perform vector search using MongoDB Atlas Vector Search
async function vectorSearch(queryEmbedding, limit = 3) {
  try {
    const { collection } = await initVectorDB();

    const pipeline = [
      {
        $vectorSearch: {
          index: process.env.VECTOR_INDEX_NAME,
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: limit * 10,
          limit,
        },
      },
      {
        $project: {
          _id: 1,
          text: 1,
          metadata: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];

    const results = await collection.aggregate(pipeline).toArray();
    return results;
  } catch (error) {
    console.error('Vector search error:', error);
    throw error;
  }
}

// Fallback keyword search when vector index is unavailable or returns no results
async function keywordSearch(query, limit = 3) {
  try {
    const { collection } = await initVectorDB();
    const tokens = String(query || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2)
      .slice(0, 8);

    if (tokens.length === 0) {
      return [];
    }

    const regex = tokens.map((token) => ({ text: { $regex: token, $options: "i" } }));
    const results = await collection
      .find({ $or: regex })
      .project({ _id: 1, text: 1, metadata: 1 })
      .limit(limit)
      .toArray();

    return results.map((doc) => ({
      ...doc,
      score: null,
    }));
  } catch (error) {
    console.error('Keyword search error:', error);
    return [];
  }
}

// Delete all documents (for re-ingestion)
async function deleteAllDocuments() {
  try {
    const { collection } = await initVectorDB();
    const result = await collection.deleteMany({});
    console.log(`Deleted ${result.deletedCount} documents`);
    return result;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}

// Get document count
async function getDocumentCount() {
  try {
    const { collection } = await initVectorDB();
    return await collection.countDocuments();
  } catch (error) {
    console.error('Count error:', error);
    return 0;
  }
}

// Close connection
async function closeConnection() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

module.exports = {
  initVectorDB,
  upsertDocuments,
  vectorSearch,
  keywordSearch,
  deleteAllDocuments,
  getDocumentCount,
  closeConnection,
};
