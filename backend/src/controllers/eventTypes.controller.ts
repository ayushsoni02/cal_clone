import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { DEFAULT_USER_ID } from '../config/constants';

// GET / — List all event types for the default user
export const getAllEventTypes = async (_req: Request, res: Response) => {
  try {
    const eventTypes = await prisma.eventType.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { createdAt: 'desc' },
    });
    res.json(eventTypes);
  } catch (error) {
    console.error('Error fetching event types:', error);
    res.status(500).json({ error: 'Failed to fetch event types' });
  }
};

// GET /public/:username/:slug — Public endpoint
export const getPublicEventType = async (req: Request<{ username: string; slug: string }>, res: Response) => {
  try {
    const { username, slug } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const eventType = await prisma.eventType.findUnique({
      where: {
        userId_slug: { userId: user.id, slug },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    res.json(eventType);
  } catch (error) {
    console.error('Error fetching public event type:', error);
    res.status(500).json({ error: 'Failed to fetch event type' });
  }
};

// POST / — Create a new event type
export const createEventType = async (req: Request, res: Response) => {
  try {
    const { title, slug, description, duration, bufferMinutes, questions } = req.body;

    if (!title || !slug || !duration) {
      return res.status(400).json({ error: 'title, slug, and duration are required' });
    }

    // Check for duplicate slug for this user
    const existing = await prisma.eventType.findUnique({
      where: { userId_slug: { userId: DEFAULT_USER_ID, slug } },
    });

    if (existing) {
      return res.status(409).json({ error: 'An event type with this slug already exists' });
    }

    const eventType = await prisma.eventType.create({
      data: {
        title,
        slug,
        description: description || null,
        duration: Number(duration),
        bufferMinutes: bufferMinutes ? Number(bufferMinutes) : 0,
        questions: questions || null,
        userId: DEFAULT_USER_ID,
      },
    });

    res.status(201).json(eventType);
  } catch (error) {
    console.error('Error creating event type:', error);
    res.status(500).json({ error: 'Failed to create event type' });
  }
};

// PUT /:id — Update an event type
export const updateEventType = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, description, duration, bufferMinutes, questions } = req.body;

    const eventType = await prisma.eventType.findUnique({
      where: { id: Number(id) },
    });

    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    // If slug is being changed, check for duplicates
    if (slug && slug !== eventType.slug) {
      const existing = await prisma.eventType.findUnique({
        where: { userId_slug: { userId: DEFAULT_USER_ID, slug } },
      });
      if (existing) {
        return res.status(409).json({ error: 'An event type with this slug already exists' });
      }
    }

    const updated = await prisma.eventType.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(duration !== undefined && { duration: Number(duration) }),
        ...(bufferMinutes !== undefined && { bufferMinutes: Number(bufferMinutes) }),
        ...(questions !== undefined && { questions }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating event type:', error);
    res.status(500).json({ error: 'Failed to update event type' });
  }
};

// DELETE /:id — Delete an event type (and its related bookings)
export const deleteEventType = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const eventType = await prisma.eventType.findUnique({
      where: { id: Number(id) },
    });

    if (!eventType) {
      return res.status(404).json({ error: 'Event type not found' });
    }

    // Delete related bookings first, then the event type
    await prisma.booking.deleteMany({
      where: { eventTypeId: Number(id) },
    });

    await prisma.eventType.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Event type deleted successfully' });
  } catch (error) {
    console.error('Error deleting event type:', error);
    res.status(500).json({ error: 'Failed to delete event type' });
  }
};
