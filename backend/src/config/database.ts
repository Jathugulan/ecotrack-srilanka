import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.MONGODB_URI);
    console.log(`[Database] Successfully connected to MongoDB at ${env.MONGODB_URI}`);
  } catch (error) {
    console.error('[Database] Connection failed:', error);
    process.exit(1);
  }
}
