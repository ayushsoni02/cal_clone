// backend/src/routes/availability.ts
import { Router } from 'express';
import {
  getAvailability,
  updateAvailability,
} from '../controllers/availability.controller';

const router = Router();

router.get('/', getAvailability);
router.put('/', updateAvailability);

export default router;
