import { Router } from 'express';
import {
  getBrochureContent,
  getBrochureSection,
  updateProgress,
  getUserProgress,
  resetProgress,
} from '../controllers/brochure.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// GET /api/v1/brochures/myomectomy - Get full brochure content
router.get('/myomectomy', getBrochureContent);

// GET /api/v1/brochures/sections/:sectionId - Get specific section
router.get('/sections/:sectionId', getBrochureSection);

// Progress routes (require authentication)
router.post('/progress', authenticateToken, updateProgress);
router.get('/progress', authenticateToken, getUserProgress);
router.delete('/progress/reset', authenticateToken, resetProgress);

export default router;
