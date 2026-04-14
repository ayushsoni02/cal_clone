// backend/src/routes/eventTypes.ts
import { Router } from 'express';
import {
  getAllEventTypes,
  createEventType,
  updateEventType,
  deleteEventType,
} from '../controllers/eventTypes.controller';

const router = Router();

router.get('/', getAllEventTypes);
router.post('/', createEventType);
router.put('/:id', updateEventType);
router.delete('/:id', deleteEventType);

export default router;

