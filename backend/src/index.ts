import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './lib/db';

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (_req, res) => {
  res.send('🚀 API REST funcionando');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
