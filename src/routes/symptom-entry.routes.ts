import { Router } from 'express';
import {
  createSymptomEntry,
  getUserSymptomEntries,
  updateSymptomEntry,
  deleteSymptomEntry,
  clearUserSymptomEntries,
} from '../controllers/symptom-entry.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/v1/symptoms - Create a new symptom entry
router.post('/', createSymptomEntry);

// GET /api/v1/symptoms - Get all symptom entries for the user
router.get('/', getUserSymptomEntries);

// PUT /api/v1/symptoms/:id - Update a specific symptom entry
router.put('/:id', updateSymptomEntry);

// DELETE /api/v1/symptoms/:id - Delete a specific symptom entry
router.delete('/:id', deleteSymptomEntry);

// DELETE /api/v1/symptoms/clear - Clear all symptom entries for the user
router.delete('/clear', clearUserSymptomEntries);

export default router;
