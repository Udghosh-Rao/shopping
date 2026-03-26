import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export function isMongoConfigured() {
  return Boolean(MONGODB_URI);
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  disabledUntil?: number;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null, disabledUntil: 0 };

if (!global.mongoose) {
  global.mongoose = cached;
}

export function canAttemptMongo() {
  return Boolean(MONGODB_URI) && Date.now() >= (cached.disabledUntil || 0);
}

async function dbConnect(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error('MongoDB is not configured: missing MONGODB_URI.');
  }

  if (!canAttemptMongo()) {
    throw new Error('MongoDB temporarily unavailable. Using fallback data.');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    cached.disabledUntil = 0;
  } catch (e) {
    cached.promise = null;
    cached.disabledUntil = Date.now() + 30_000;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
