#!/usr/bin/env node

const { ingestAllDocuments } = require('../vectorStore/ingestDocs');
const { initVectorDB, getDocumentCount, closeConnection } = require('../vectorStore/mongoVectorClient');

async function main() {
  const args = process.argv.slice(2);
  const reset = args.includes('--reset');
  const verbose = args.includes('--verbose');

  console.log('\n=======================================');
  console.log('   VECTOR DATABASE INITIALIZATION');
  console.log('=======================================\n');

  try {
    // Initialize connection
    console.log('Connecting to MongoDB Atlas...');
    await initVectorDB();

    // Check existing documents
    const existingCount = await getDocumentCount();
    console.log(`Current documents in database: ${existingCount}\n`);

    if (reset && existingCount > 0) {
      console.log('Reset flag detected - existing data will be deleted\n');
    }

    // Run ingestion
    await ingestAllDocuments(reset);

    // Final count
    const finalCount = await getDocumentCount();

    console.log('=======================================');
    console.log('   INITIALIZATION COMPLETE');
    console.log('=======================================');
    console.log(`Documents in database: ${finalCount}`);
    console.log('Vector database is ready!\n');
  } catch (error) {
    console.error('\nInitialization failed:', error.message);
    if (verbose) {
      console.error(error);
    }
    process.exitCode = 1;
  } finally {
    await closeConnection();
    process.exit(process.exitCode || 0);
  }
}

main();
