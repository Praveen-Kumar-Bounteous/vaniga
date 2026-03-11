import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './auth/auth.routes.js';
import productRoutes from './products/product.routes.js';
import cartRoutes from './cart/cart.routes.js';
import orderRoutes from './order/order.routes.js';
import promoRoutes from './promo/promo.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true // Crucial for cookies
}));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/promo', promoRoutes);

export default app;