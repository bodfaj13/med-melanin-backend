import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/myomectomy_db';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'myomectomy_db',
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log('✅ MongoDB connected successfully');
    console.log(
      `📊 Database: ${mongoose.connection.db?.databaseName || 'unknown'}`
    );
    console.log(`🌐 Connection: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log(
      '1. Make sure MongoDB is running locally: brew services start mongodb-community'
    );
    console.log('2. Or install MongoDB: brew install mongodb-community');
    console.log('3. Check your MONGODB_URI in .env file');
    console.log(
      '4. For local development, use: mongodb://localhost:27017/myomectomy_db'
    );
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
};
