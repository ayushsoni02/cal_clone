// backend/src/routes/bookings.ts
import { Router } from 'express';
import {
  getAllBookings,
  getSlots,
  createBooking,
  cancelBooking,
} from '../controllers/bookings.controller';

const router = Router();

router.get('/', getAllBookings);
router.get('/slots', getSlots);
router.post('/', createBooking);
router.patch('/:id/cancel', cancelBooking);

export default router;
