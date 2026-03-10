import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from './cart.controller.js';
import { protect } from '../middleware/auth.middleware.js';


const cartRoutes = Router();

cartRoutes.get('/', protect, getCart);
cartRoutes.post('/', protect, addToCart);
cartRoutes.patch('/:itemId', protect, updateCartItem);
cartRoutes.delete('/:itemId', protect, removeFromCart);

export default cartRoutes;