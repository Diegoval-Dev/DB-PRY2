// backend/src/types/multer-gridfs-storage.d.ts
declare module 'multer-gridfs-storage' {
  import { StorageEngine } from 'multer';
  import * as express from 'express';

  export interface FileMetadata {
    bucketName?: string;
    filename?: string;
    metadata?: Record<string, any>;
  }

  export interface GridFsStorageOptions {
    url: string;
    file?: (
      req: express.Request,
      file: express.Multer.File
    ) => Promise<FileMetadata> | FileMetadata;
  }

  export class GridFsStorage implements StorageEngine {
    constructor(opts: GridFsStorageOptions);
    _handleFile(
      req: express.Request,
      file: express.Multer.File,
      callback: (error: any, info?: Partial<express.Multer.File> & { id: any; filename: string }) => void
    ): void;
    _removeFile(
      req: express.Request,
      file: express.Multer.File,
      callback: (error: any) => void
    ): void;
  }
  export { GridFsStorage };
}
