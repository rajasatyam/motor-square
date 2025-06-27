// lib/database.js
import mongoose from 'mongoose';

let isConnected = false;

export async function connect() {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    connection.on('error', (err) => {
      console.error("MongoDB connection error: " + err);
      process.exit(1);
    });

    isConnected = true;
  

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw new Error('Unable to connect to MongoDB');
  }
}
