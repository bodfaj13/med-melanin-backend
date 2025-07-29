import { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// GET /api/v1/users - Get all users with pagination (protected)
router.get('/', authenticateToken, getAllUsers);

// GET /api/v1/users/:userId - Get user by ID (protected)
router.get('/:userId', authenticateToken, getUserById);

export default router;
