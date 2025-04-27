import mongoose from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const mongoURI = process.env.MONGO_URI as string;

interface FileMetadata {
  bucketName: string;
  filename: string;
}

export const storage = new GridFsStorage({
  url: mongoURI,
  file: (_req, file) => ({
    bucketName: 'uploads',
    filename: `${Date.now()}-${file.originalname}`
  })
});

export const upload = multer({ storage });

// Devuelve una instancia de GridFSBucket
export function getBucket(): mongoose.mongo.GridFSBucket {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection is not established.');
  }
  return new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
}
