// backend/scripts/upload-images.ts
import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { getBucket } from '../src/lib/gridfs';

async function main() {
  const uri = process.env.MONGO_URI as string;
  console.log('URI')
  await mongoose.connect(uri, { dbName: 'gercoraunte' });
  const bucket = getBucket();

  // Carpeta raíz de imágenes
  const baseDir = path.resolve(__dirname, '../data/images');
  const folders = ['restaurants', 'menuItems'];

  const mapping: Record<string, string[]> = {};

  for (const folder of folders) {
    const dir = path.join(baseDir, folder);
    const files = fs.readdirSync(dir);
    mapping[folder] = [];

    for (const file of files) {
      const fileStream = fs.createReadStream(path.join(dir, file));
      const uploadStream = bucket.openUploadStream(file);
      fileStream.pipe(uploadStream);
      await new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
          console.log(`Uploaded ${folder}/${file} → ${uploadStream.id}`);
          mapping[folder].push(`${uploadStream.id}`);
          resolve(null);
        });
        uploadStream.on('error', reject);
      });
    }
  }

  // Guarda un archivo mapping.json con los IDs generados
  fs.writeFileSync(
    path.join(baseDir, 'imageMapping.json'),
    JSON.stringify(mapping, null, 2)
  );
  console.log('✅ Image mapping saved to data/images/imageMapping.json');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
