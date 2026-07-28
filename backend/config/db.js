const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas or local instance.
 * Exits the process if the connection fails.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB Connected Successfully');
  } catch (error) {
    console.error(`✗ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
