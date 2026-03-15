const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // In Mongoose 9+, these options are no longer needed
    // They are enabled by default
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.error('Please make sure MongoDB is installed and running');
    console.error('You can download MongoDB from: https://www.mongodb.com/try/download/community');
    process.exit(1);
  }
};

module.exports = connectDB;