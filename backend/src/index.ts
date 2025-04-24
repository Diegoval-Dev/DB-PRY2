import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './lib/db';
import userRoutes from './api/users';
import restaurantRoutes from './api/restaurants';
import menuItemRoutes from './api/menuItems';
import orderRoutes from './api/orders';

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (_req, res) => {
  res.send('🚀 API REST funcionando');
});

app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/orders', orderRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
