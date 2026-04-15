// backend/src/routes/availability.ts
import { Router } from 'express';
import {
  getAvailability,
  updateAvailability,
  getOverrides,
  createOverride,
  deleteOverride,
} from '../controllers/availability.controller';

const router = Router();

router.get('/', getAvailability);
router.put('/', updateAvailability);
router.get('/overrides', getOverrides);
router.post('/overrides', createOverride);
router.delete('/overrides/:id', deleteOverride);

export default router;
