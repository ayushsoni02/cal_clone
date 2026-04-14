import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { generateSlots } from '../utils/slots';
import { parseISO } from 'date-fns';

// GET / — List all bookings with event type info
export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        eventType: {
          select: {
            id: true,
            title: true,
            slug: true,
            duration: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// GET /slots — Get available slots for a given event type and date
export const getSlots = async (req: Request, res: Response) => {
  try {
    const { eventTypeId, date } = req.query;

    if (!eventTypeId || !date) {
      return res.status(400).json({ error: 'eventTypeId and date are required' });
    }

    const dateStr = date as string;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return res.status(400).json({ error: 'date must be in YYYY-MM-DD format' });
    }

    // Get the event type
    const eventType = await prisma.eventType.findUnique({
      where: { id: Number(eventTypeId) },
    });

    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    // Get the day of week for the requested date
    const requestedDate = parseISO(dateStr);
    const dayOfWeek = requestedDate.getDay(); // 0 = Sunday, 6 = Saturday

    // Get availability for that day
    const availability = await prisma.availability.findFirst({
      where: {
        userId: eventType.userId,
        dayOfWeek,
      },
    });

    if (!availability) {
      return res.json({ slots: [], message: 'No availability for this day' });
    }

    // Get existing non-cancelled bookings for that date
    const startOfDay = new Date(dateStr + 'T00:00:00.000Z');
    const endOfDay = new Date(dateStr + 'T23:59:59.999Z');

    const existingBookings = await prisma.booking.findMany({
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
    const slots = generateSlots(
      dateStr,
      availability.startTime,
      availability.endTime,
      eventType.duration,
      existingBookings
    );

    res.json({ slots });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
};

// POST / — Create a new booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { eventTypeId, bookerName, bookerEmail, startTime } = req.body;

    if (!eventTypeId || !bookerName || !bookerEmail || !startTime) {
      return res.status(400).json({
        error: 'eventTypeId, bookerName, bookerEmail, and startTime are required',
      });
    }

    // Get the event type to calculate end time
    const eventType = await prisma.eventType.findUnique({
      where: { id: Number(eventTypeId) },
    });

    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    const bookingStart = new Date(startTime);
    const bookingEnd = new Date(bookingStart.getTime() + eventType.duration * 60 * 1000);

    // Check for overlapping bookings (non-cancelled)
    const overlapping = await prisma.booking.findFirst({
      where: {
        eventType: {
          userId: eventType.userId,
        },
        status: { not: 'cancelled' },
        AND: [
          { startTime: { lt: bookingEnd } },
          { endTime: { gt: bookingStart } },
        ],
      },
    });

    if (overlapping) {
      return res.status(409).json({ error: 'This time slot is no longer available' });
    }

    const booking = await prisma.booking.create({
      data: {
        eventTypeId: Number(eventTypeId),
        bookerName,
        bookerEmail,
        startTime: bookingStart,
        endTime: bookingEnd,
        status: 'upcoming',
      },
      include: {
        eventType: {
          select: {
            title: true,
            duration: true,
          },
        },
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

// PATCH /:id/cancel — Cancel a booking
export const cancelBooking = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(id) },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    const updated = await prisma.booking.update({
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

    res.json(updated);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};
