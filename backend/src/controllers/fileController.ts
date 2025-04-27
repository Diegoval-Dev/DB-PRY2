import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { getBucket } from '../lib/gridfs';

export function uploadFile(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Multer-gridfs-storage coloca el id del archivo en req.file.id
  res.status(201).json({
    fileId: req.file.id,
    filename: req.file.filename
  });
}

export function getFile(req: Request, res: Response, next: NextFunction) {
  try {
    const bucket = getBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.on('error', (err) => next(err));
    downloadStream.pipe(res);
  } catch (error) {
    next(error);
  }
}

export function deleteFile(req: Request, res: Response, next: NextFunction) {
  try {
    const bucket = getBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    bucket.delete(fileId).then(() => {
      res.json({ message: 'File deleted successfully' });
    }).catch((err: Error) => next(err));
  } catch (error) {
    next(error);
  }
}
