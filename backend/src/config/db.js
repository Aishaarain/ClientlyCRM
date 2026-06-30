import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log('MongoDB connected:', conn.connection.host);
  } catch (err) {
    isConnected = false;
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};
