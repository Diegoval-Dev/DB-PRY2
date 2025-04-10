import mongoose from 'mongoose';


export default async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI as string;
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🟢 Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('🔴 Error al conectar a MongoDB', error);
    process.exit(1);
  }
}
