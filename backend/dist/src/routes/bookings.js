"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/bookings.ts
const express_1 = require("express");
const bookings_controller_1 = require("../controllers/bookings.controller");
const router = (0, express_1.Router)();
router.get('/', bookings_controller_1.getAllBookings);
router.get('/slots', bookings_controller_1.getSlots);
router.post('/', bookings_controller_1.createBooking);
router.patch('/:id/cancel', bookings_controller_1.cancelBooking);
router.patch('/:id/reschedule', bookings_controller_1.rescheduleBooking);
exports.default = router;
//# sourceMappingURL=bookings.js.map