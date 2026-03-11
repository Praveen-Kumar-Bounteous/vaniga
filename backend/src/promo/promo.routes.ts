// backend/src/routes/promo.routes.ts
import { Router } from 'express';
import { validateCoupon } from './promo.controller';
import { protect } from '../middleware/auth.middleware.js';

const promoRoutes = Router();

promoRoutes.post('/validate', protect, validateCoupon);

export default promoRoutes;