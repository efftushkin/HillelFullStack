const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'hw65-express-mongodb';

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and fill in your Atlas connection string.');
  }

  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB_NAME });
  console.log(`Connected to MongoDB Atlas (database: ${MONGODB_DB_NAME})`);
}

module.exports = connectDB;
