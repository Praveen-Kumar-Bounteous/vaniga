import { Router } from 'express';
import { initiatePayment, confirmOrder, getHistory } from './order.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const orderRoutes = Router();

// All order routes require authentication
orderRoutes.use(protect);

orderRoutes.post('/initiate-payment', initiatePayment);
orderRoutes.post('/confirm', confirmOrder);
orderRoutes.get('/history', getHistory);

export default orderRoutes;