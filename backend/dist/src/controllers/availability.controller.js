"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOverride = exports.createOverride = exports.getOverrides = exports.updateAvailability = exports.getAvailability = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const constants_1 = require("../config/constants");
// GET / — Get all availability records for the default user
const getAvailability = async (_req, res) => {
    try {
        const availability = await prisma_1.default.availability.findMany({
            where: { userId: constants_1.DEFAULT_USER_ID },
            orderBy: { dayOfWeek: 'asc' },
        });
        res.json(availability);
    }
    catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ error: 'Failed to fetch availability' });
    }
};
exports.getAvailability = getAvailability;
// PUT / — Bulk replace availability (delete all existing, create new)
const updateAvailability = async (req, res) => {
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
        await prisma_1.default.availability.deleteMany({
            where: { userId: constants_1.DEFAULT_USER_ID },
        });
        await prisma_1.default.availability.createMany({
            data: availability.map((record) => ({
                userId: constants_1.DEFAULT_USER_ID,
                dayOfWeek: record.dayOfWeek,
                startTime: record.startTime,
                endTime: record.endTime,
                timezone: record.timezone || 'Asia/Kolkata',
            })),
        });
        // Return the newly created records
        const newAvailability = await prisma_1.default.availability.findMany({
            where: { userId: constants_1.DEFAULT_USER_ID },
            orderBy: { dayOfWeek: 'asc' },
        });
        res.json(newAvailability);
    }
    catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({ error: 'Failed to update availability' });
    }
};
exports.updateAvailability = updateAvailability;
// GET /overrides — Get all date overrides for the default user
const getOverrides = async (_req, res) => {
    try {
        const overrides = await prisma_1.default.dateOverride.findMany({
            where: { userId: constants_1.DEFAULT_USER_ID },
            orderBy: { date: 'asc' },
        });
        res.json(overrides);
    }
    catch (error) {
        console.error('Error fetching overrides:', error);
        res.status(500).json({ error: 'Failed to fetch overrides' });
    }
};
exports.getOverrides = getOverrides;
// POST /overrides — Create or update a date override
const createOverride = async (req, res) => {
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
            userId: constants_1.DEFAULT_USER_ID,
            date: targetDate,
        };
        const existing = await prisma_1.default.dateOverride.findUnique({
            where: { userId_date: { userId: constants_1.DEFAULT_USER_ID, date: targetDate } },
        });
        let result;
        if (existing) {
            result = await prisma_1.default.dateOverride.update({
                where: { id: existing.id },
                data,
            });
        }
        else {
            result = await prisma_1.default.dateOverride.create({ data });
        }
        res.json(result);
    }
    catch (error) {
        console.error('Error creating override:', error);
        res.status(500).json({ error: 'Failed to create override' });
    }
};
exports.createOverride = createOverride;
// DELETE /overrides/:id — Delete an override by ID
const deleteOverride = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.dateOverride.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting override:', error);
        res.status(500).json({ error: 'Failed to delete override' });
    }
};
exports.deleteOverride = deleteOverride;
//# sourceMappingURL=availability.controller.js.map