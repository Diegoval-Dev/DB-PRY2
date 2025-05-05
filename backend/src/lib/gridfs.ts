/* backend/src/lib/gridfs.ts */
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
// Carga el módulo y extrae la clase
const storageModule = require('multer-gridfs-storage');
const GridFsStorage =
  storageModule.GridFsStorage ??
  storageModule.default ??
  storageModule;

// Configuración de GridFS
export const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (_req: any, file: any) => ({
    bucketName: 'uploads',
    filename: `${Date.now()}-${file.originalname}`
  })
});

export const upload = multer({ storage });

export function getBucket(): mongoose.mongo.GridFSBucket {
  const db = mongoose.connection.db;
  return new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
}
//vacaca