import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './auth/auth.routes.js';
import productRoutes from './products/product.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true // Crucial for cookies
}));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);

export default app;