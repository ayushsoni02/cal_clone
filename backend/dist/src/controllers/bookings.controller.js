"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rescheduleBooking = exports.cancelBooking = exports.createBooking = exports.getSlots = exports.getAllBookings = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const slots_1 = require("../utils/slots");
const email_1 = require("../utils/email");
const date_fns_1 = require("date-fns");
// GET / — List all bookings with event type info
const getAllBookings = async (_req, res) => {
    try {
        const bookings = await prisma_1.default.booking.findMany({
            include: {
                eventType: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        duration: true,
                        questions: true,
                    },
                },
            },
            orderBy: { startTime: 'desc' },
        });
        res.json(bookings);
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};
exports.getAllBookings = getAllBookings;
// GET /slots — Get available slots for a given event type and date
const getSlots = async (req, res) => {
    try {
        const { eventTypeId, date } = req.query;
        if (!eventTypeId || !date) {
            return res.status(400).json({ error: 'eventTypeId and date are required' });
        }
        const dateStr = date;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) {
            return res.status(400).json({ error: 'date must be in YYYY-MM-DD format' });
        }
        // Get the event type
        const eventType = await prisma_1.default.eventType.findUnique({
            where: { id: Number(eventTypeId) },
        });
        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' });
        }
        // Get the day of week for the requested date
        const requestedDate = (0, date_fns_1.parseISO)(dateStr);
        const dayOfWeek = requestedDate.getDay(); // 0 = Sunday, 6 = Saturday
        let activeStartTime = null;
        let activeEndTime = null;
        // 1. Check DateOverrides first
        const targetDate = new Date(dateStr);
        targetDate.setHours(0, 0, 0, 0); // normalize
        const override = await prisma_1.default.dateOverride.findUnique({
            where: { userId_date: { userId: eventType.userId, date: targetDate } },
        });
        if (override) {
            if (override.isBlocked) {
                return res.json({ slots: [], message: 'This date is blocked' });
            }
            activeStartTime = override.startTime;
            activeEndTime = override.endTime;
        }
        else {
            // 2. Fallback to weekly availability
            const availability = await prisma_1.default.availability.findFirst({
                where: {
                    userId: eventType.userId,
                    dayOfWeek,
                },
            });
            if (!availability) {
                return res.json({ slots: [], message: 'No availability for this day' });
            }
            activeStartTime = availability.startTime;
            activeEndTime = availability.endTime;
        }
        if (!activeStartTime || !activeEndTime) {
            return res.json({ slots: [], message: 'No hours set' });
        }
        // Get existing non-cancelled bookings for that date
        const startOfDay = new Date(dateStr + 'T00:00:00.000Z');
        const endOfDay = new Date(dateStr + 'T23:59:59.999Z');
        const existingBookings = await prisma_1.default.booking.findMany({
            where: {
                eventType: {
                    userId: eventType.userId,
                },
                status: { not: 'cancelled' },
                startTime: { gte: startOfDay },
                endTime: { lte: endOfDay },
            },
            select: {
                startTime: true,
                endTime: true,
            },
        });
        // Generate available slots
        const slots = (0, slots_1.generateSlots)(dateStr, activeStartTime, activeEndTime, eventType.duration, existingBookings, eventType.bufferMinutes);
        res.json({ slots });
    }
    catch (error) {
        console.error('Error fetching slots:', error);
        res.status(500).json({ error: 'Failed to fetch slots' });
    }
};
exports.getSlots = getSlots;
// POST / — Create a new booking
const createBooking = async (req, res) => {
    try {
        const { eventTypeId, bookerName, bookerEmail, startTime, responses } = req.body;
        if (!eventTypeId || !bookerName || !bookerEmail || !startTime) {
            return res.status(400).json({
                error: 'eventTypeId, bookerName, bookerEmail, and startTime are required',
            });
        }
        // Get the event type to calculate end time
        const eventType = await prisma_1.default.eventType.findUnique({
            where: { id: Number(eventTypeId) },
        });
        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' });
        }
        const bookingStart = new Date(startTime);
        const bookingEnd = new Date(bookingStart.getTime() + eventType.duration * 60 * 1000);
        const bufferMs = (eventType.bufferMinutes || 0) * 60 * 1000;
        const paddedStart = new Date(bookingStart.getTime() - bufferMs);
        const paddedEnd = new Date(bookingEnd.getTime() + bufferMs);
        // Use a transaction to prevent race conditions on double booking
        const booking = await prisma_1.default.$transaction(async (tx) => {
            // Check for overlapping bookings (non-cancelled)
            const overlapping = await tx.booking.findFirst({
                where: {
                    eventType: {
                        userId: eventType.userId,
                    },
                    status: { not: 'cancelled' },
                    AND: [
                        { startTime: { lt: paddedEnd } },
                        { endTime: { gt: paddedStart } },
                    ],
                },
            });
            if (overlapping) {
                throw new Error('CONFLICT');
            }
            return tx.booking.create({
                data: {
                    eventTypeId: Number(eventTypeId),
                    bookerName,
                    bookerEmail,
                    startTime: bookingStart,
                    endTime: bookingEnd,
                    status: 'upcoming',
                    responses: responses || null,
                },
                include: {
                    eventType: {
                        select: {
                            title: true,
                            duration: true,
                            questions: true,
                        },
                    },
                },
            });
        });
        (0, email_1.sendEmail)(bookerEmail, `Booking Confirmed: ${booking.eventType.title}`, `Your booking for <b>${booking.eventType.title}</b> is confirmed for ${bookingStart.toLocaleString()}.<br><br>Cancel here: http://localhost:3000/bookings`);
        res.status(201).json(booking);
    }
    catch (error) {
        if (error.message === 'CONFLICT') {
            return res.status(409).json({ error: 'This time slot is no longer available' });
        }
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
};
exports.createBooking = createBooking;
// PATCH /:id/cancel — Cancel a booking
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await prisma_1.default.booking.findUnique({
            where: { id: Number(id) },
        });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ error: 'Booking is already cancelled' });
        }
        const updated = await prisma_1.default.booking.update({
            where: { id: Number(id) },
            data: { status: 'cancelled' },
            include: {
                eventType: {
                    select: {
                        title: true,
                        duration: true,
                    },
                },
            },
        });
        (0, email_1.sendEmail)(updated.bookerEmail, `Booking Cancelled: ${updated.eventType.title}`, `Your booking for <b>${updated.eventType.title}</b> on ${updated.startTime.toLocaleString()} has been cancelled.`);
        res.json(updated);
    }
    catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Failed to cancel booking' });
    }
};
exports.cancelBooking = cancelBooking;
// PATCH /:id/reschedule — Reschedule a booking
const rescheduleBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime } = req.body;
        if (!startTime) {
            return res.status(400).json({ error: 'startTime is required' });
        }
        const booking = await prisma_1.default.booking.findUnique({
            where: { id: Number(id) },
            include: { eventType: true },
        });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (booking.status === 'cancelled') {
            return res.status(400).json({ error: 'Cannot reschedule a cancelled booking' });
        }
        const eventType = booking.eventType;
        const bookingStart = new Date(startTime);
        const bookingEnd = new Date(bookingStart.getTime() + eventType.duration * 60 * 1000);
        const bufferMs = (eventType.bufferMinutes || 0) * 60 * 1000;
        const paddedStart = new Date(bookingStart.getTime() - bufferMs);
        const paddedEnd = new Date(bookingEnd.getTime() + bufferMs);
        // Use a transaction to prevent race conditions on double booking
        const updatedBooking = await prisma_1.default.$transaction(async (tx) => {
            // Check for overlapping bookings (excluding the current one)
            const overlapping = await tx.booking.findFirst({
                where: {
                    id: { not: Number(id) },
                    eventType: { userId: eventType.userId },
                    status: { not: 'cancelled' },
                    AND: [
                        { startTime: { lt: paddedEnd } },
                        { endTime: { gt: paddedStart } },
                    ],
                },
            });
            if (overlapping) {
                throw new Error('CONFLICT');
            }
            return tx.booking.update({
                where: { id: Number(id) },
                data: {
                    startTime: bookingStart,
                    endTime: bookingEnd,
                },
                include: {
                    eventType: {
                        select: { title: true, duration: true, questions: true },
                    },
                },
            });
        });
        (0, email_1.sendEmail)(booking.bookerEmail, `Booking Rescheduled: ${eventType.title}`, `Your booking for <b>${eventType.title}</b> has been successfully rescheduled to ${bookingStart.toLocaleString()}.`);
        res.json(updatedBooking);
    }
    catch (error) {
        if (error.message === 'CONFLICT') {
            return res.status(409).json({ error: 'This time slot is no longer available' });
        }
        console.error('Error rescheduling booking:', error);
        res.status(500).json({ error: 'Failed to reschedule booking' });
    }
};
exports.rescheduleBooking = rescheduleBooking;
//# sourceMappingURL=bookings.controller.js.map