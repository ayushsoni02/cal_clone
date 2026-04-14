import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// GET / — Get all availability records for the default user
export const getAvailability = async (_req: Request, res: Response) => {
  try {
    const availability = await prisma.availability.findMany({
      where: { userId: 1 },
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
      where: { userId: 1 },
    });

    await prisma.availability.createMany({
      data: availability.map((record: { dayOfWeek: number; startTime: string; endTime: string; timezone?: string }) => ({
        userId: 1,
        dayOfWeek: record.dayOfWeek,
        startTime: record.startTime,
        endTime: record.endTime,
        timezone: record.timezone || 'Asia/Kolkata',
      })),
    });

    // Return the newly created records
    const newAvailability = await prisma.availability.findMany({
      where: { userId: 1 },
      orderBy: { dayOfWeek: 'asc' },
    });

    res.json(newAvailability);
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};
