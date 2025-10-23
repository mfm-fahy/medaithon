import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-management';

    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('⚠️  MongoDB connection error:', error instanceof Error ? error.message : error);
    console.log('⚠️  Server will continue running without database connection');
    console.log('⚠️  Please ensure MongoDB is running and accessible');
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};

