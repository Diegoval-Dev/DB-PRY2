import { Router } from 'express';
import { param } from 'express-validator';
import {
  uploadFile,
  getFile,
  deleteFile
} from '../controllers/fileController';
import { upload } from '../lib/gridfs';
import { validate } from '../lib/validators';

const router = Router();

// POST /api/files/upload (form field: 'file')
router.post('/upload', upload.single('file'), uploadFile);

// GET /api/files/:id
router.get(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid file ID')
  ]),
  getFile
);

// DELETE /api/files/:id
router.delete(
  '/:id',
  validate([
    param('id').isMongoId().withMessage('Invalid file ID')
  ]),
  deleteFile
);

export default router;
