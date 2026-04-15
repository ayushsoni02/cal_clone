import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { DEFAULT_USER_ID } from '../config/constants';

// GET / — Get all availability records for the default user
export const getAvailability = async (_req: Request, res: Response) => {
  try {
    const availability = await prisma.availability.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { dayOfWeek: 'asc' },
    });
    res.json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

// PUT / — Bulk replace availability (delete all existing, create new)
export const updateAvailability = async (req: Request, res: Response) => {
  try {
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({ error: 'availability must be an array' });
    }

    // Validate each record
    for (const record of availability) {
      if (record.dayOfWeek === undefined || !record.startTime || !record.endTime) {
        return res.status(400).json({
          error: 'Each availability record must have dayOfWeek, startTime, and endTime',
        });
      }
      if (record.dayOfWeek < 0 || record.dayOfWeek > 6) {
        return res.status(400).json({
          error: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)',
        });
      }
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(record.startTime) || !timeRegex.test(record.endTime)) {
        return res.status(400).json({
          error: 'startTime and endTime must be in HH:mm format',
        });
      }
      if (record.startTime >= record.endTime) {
        return res.status(400).json({
          error: 'startTime must be before endTime',
        });
      }
    }

    // Delete all existing, then create new
    await prisma.availability.deleteMany({
      where: { userId: DEFAULT_USER_ID },
    });

    await prisma.availability.createMany({
      data: availability.map((record: { dayOfWeek: number; startTime: string; endTime: string; timezone?: string }) => ({
        userId: DEFAULT_USER_ID,
        dayOfWeek: record.dayOfWeek,
        startTime: record.startTime,
        endTime: record.endTime,
        timezone: record.timezone || 'Asia/Kolkata',
      })),
    });

    // Return the newly created records
    const newAvailability = await prisma.availability.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { dayOfWeek: 'asc' },
    });

    res.json(newAvailability);
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};

// GET /overrides — Get all date overrides for the default user
export const getOverrides = async (_req: Request, res: Response) => {
  try {
    const overrides = await prisma.dateOverride.findMany({
      where: { userId: DEFAULT_USER_ID },
      orderBy: { date: 'asc' },
    });
    res.json(overrides);
  } catch (error) {
    console.error('Error fetching overrides:', error);
    res.status(500).json({ error: 'Failed to fetch overrides' });
  }
};

// POST /overrides — Create or update a date override
export const createOverride = async (req: Request, res: Response) => {
  try {
    const { date, isBlocked, startTime, endTime } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'date is required' });
    }

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // normalize date

    const data = {
      isBlocked: Boolean(isBlocked),
      startTime: isBlocked ? null : startTime,
      endTime: isBlocked ? null : endTime,
      userId: DEFAULT_USER_ID,
      date: targetDate,
    };

    const existing = await prisma.dateOverride.findUnique({
      where: { userId_date: { userId: DEFAULT_USER_ID, date: targetDate } },
    });

    let result;
    if (existing) {
      result = await prisma.dateOverride.update({
        where: { id: existing.id },
        data,
      });
    } else {
      result = await prisma.dateOverride.create({ data });
    }

    res.json(result);
  } catch (error) {
    console.error('Error creating override:', error);
    res.status(500).json({ error: 'Failed to create override' });
  }
};

// DELETE /overrides/:id — Delete an override by ID
export const deleteOverride = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.dateOverride.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting override:', error);
    res.status(500).json({ error: 'Failed to delete override' });
  }
};

