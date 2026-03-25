import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './auth/auth.routes.js';
import productRoutes from './products/product.routes.js';
import cartRoutes from './cart/cart.routes.js';
import orderRoutes from './order/order.routes.js';
import promoRoutes from './promo/promo.routes.js';
import userRoutes from './user/user.routes.js';

const app = express();

// CRITICAL FOR RENDER DEPLOYMENT:
// Tells Express to trust the headers set by Render's proxy (important for HTTPS)
app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  // Only allow your specific Vercel URL in production
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  credentials: true 
}));

app.get('/health', (_req, res) => res.status(200).send('OK'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/promo', promoRoutes);
app.use('/api/v1/users', userRoutes);

export default app;