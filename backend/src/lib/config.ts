// src/lib/config.ts
import dotenv from 'dotenv';
dotenv.config();
export const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
