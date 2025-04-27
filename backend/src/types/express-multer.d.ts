// backend/src/types/express-multer.d.ts
import 'express';

declare global {
  namespace Express {
    namespace Multer {
      interface File {
        id: any;
        filename: string;
      }
    }
  }
}
