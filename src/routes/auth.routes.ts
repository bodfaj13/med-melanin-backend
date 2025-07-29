import { Router } from 'express';
import {
  signup,
  signin,
  getProfile,
  updateSurgeryDate,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// POST /api/v1/auth/signup - Register new user
router.post('/signup', signup);

// POST /api/v1/auth/signin - Sign in user
router.post('/signin', signin);

// GET /api/v1/auth/me - Get current user profile (protected)
router.get('/me', authenticateToken, getProfile);

// PATCH /api/v1/auth/surgery-date - Update surgery date (protected)
router.patch('/surgery-date', authenticateToken, updateSurgeryDate);

// PATCH /api/v1/auth/profile - Update user profile (protected)
router.patch('/profile', authenticateToken, updateProfile);

// PATCH /api/v1/auth/change-password - Change password (protected)
router.patch('/change-password', authenticateToken, changePassword);

export default router;
