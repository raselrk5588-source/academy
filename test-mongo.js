const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://tuhinshekh27r_db_user:YjzNI2stxegxS0aP@ac-oeb5uwo-shard-00-00.fgvnnni.mongodb.net:27017,ac-oeb5uwo-shard-00-01.fgvnnni.mongodb.net:27017,ac-oeb5uwo-shard-00-02.fgvnnni.mongodb.net:27017/academy?ssl=true&replicaSet=atlas-3x0bqo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  console.log('Attempting to connect to MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    
    // Check if flashcards exist
    const db = mongoose.connection.db;
    const count = await db.collection('flashcards').countDocuments();
    console.log(`Found ${count} flashcards in the database.`);
    
  } catch (error) {
    console.error('FAILED to connect to MongoDB:');
    console.error(error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testConnection();
