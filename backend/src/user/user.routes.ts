import { Router } from 'express';
import { getProfileDashboard, updateProfile } from './user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const userRoutes = Router();

// Apply protection to all user routes
userRoutes.use(protect);

// GET /api/v1/users/me (Dashboard Data)
userRoutes.get('/profile', getProfileDashboard);

// PATCH /api/v1/users/me (Update Name/Address)
userRoutes.patch('/edit-profile', updateProfile);

export default userRoutes;