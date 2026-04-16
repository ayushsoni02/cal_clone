"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicUser = exports.deleteEventType = exports.updateEventType = exports.createEventType = exports.getPublicEventType = exports.getAllEventTypes = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const constants_1 = require("../config/constants");
// GET / — List all event types for the default user
const getAllEventTypes = async (_req, res) => {
    try {
        const eventTypes = await prisma_1.default.eventType.findMany({
            where: { userId: constants_1.DEFAULT_USER_ID },
            orderBy: { createdAt: 'desc' },
        });
        res.json(eventTypes);
    }
    catch (error) {
        console.error('Error fetching event types:', error);
        res.status(500).json({ error: 'Failed to fetch event types' });
    }
};
exports.getAllEventTypes = getAllEventTypes;
// GET /public/:username/:slug — Public endpoint
const getPublicEventType = async (req, res) => {
    try {
        const { username, slug } = req.params;
        const user = await prisma_1.default.user.findUnique({
            where: { username },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const eventType = await prisma_1.default.eventType.findUnique({
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
    }
    catch (error) {
        console.error('Error fetching public event type:', error);
        res.status(500).json({ error: 'Failed to fetch event type' });
    }
};
exports.getPublicEventType = getPublicEventType;
// POST / — Create a new event type
const createEventType = async (req, res) => {
    try {
        const { title, slug, description, duration, bufferMinutes, questions } = req.body;
        if (!title || !slug || !duration) {
            return res.status(400).json({ error: 'title, slug, and duration are required' });
        }
        // Check for duplicate slug for this user
        const existing = await prisma_1.default.eventType.findUnique({
            where: { userId_slug: { userId: constants_1.DEFAULT_USER_ID, slug } },
        });
        if (existing) {
            return res.status(409).json({ error: 'An event type with this slug already exists' });
        }
        const eventType = await prisma_1.default.eventType.create({
            data: {
                title,
                slug,
                description: description || null,
                duration: Number(duration),
                bufferMinutes: bufferMinutes ? Number(bufferMinutes) : 0,
                questions: questions || null,
                userId: constants_1.DEFAULT_USER_ID,
            },
        });
        res.status(201).json(eventType);
    }
    catch (error) {
        console.error('Error creating event type:', error);
        res.status(500).json({ error: 'Failed to create event type' });
    }
};
exports.createEventType = createEventType;
// PUT /:id — Update an event type
const updateEventType = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, description, duration, bufferMinutes, questions } = req.body;
        const eventType = await prisma_1.default.eventType.findUnique({
            where: { id: Number(id) },
        });
        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' });
        }
        // If slug is being changed, check for duplicates
        if (slug && slug !== eventType.slug) {
            const existing = await prisma_1.default.eventType.findUnique({
                where: { userId_slug: { userId: constants_1.DEFAULT_USER_ID, slug } },
            });
            if (existing) {
                return res.status(409).json({ error: 'An event type with this slug already exists' });
            }
        }
        const updated = await prisma_1.default.eventType.update({
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
    }
    catch (error) {
        console.error('Error updating event type:', error);
        res.status(500).json({ error: 'Failed to update event type' });
    }
};
exports.updateEventType = updateEventType;
// DELETE /:id — Delete an event type (and its related bookings)
const deleteEventType = async (req, res) => {
    try {
        const { id } = req.params;
        const eventType = await prisma_1.default.eventType.findUnique({
            where: { id: Number(id) },
        });
        if (!eventType) {
            return res.status(404).json({ error: 'Event type not found' });
        }
        // Delete related bookings first, then the event type
        await prisma_1.default.booking.deleteMany({
            where: { eventTypeId: Number(id) },
        });
        await prisma_1.default.eventType.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'Event type deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting event type:', error);
        res.status(500).json({ error: 'Failed to delete event type' });
    }
};
exports.deleteEventType = deleteEventType;
// GET /api/public/:username — List all public event types for a user
const getPublicUser = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await prisma_1.default.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                name: true,
                eventTypes: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        duration: true,
                        slug: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error fetching public user:', error);
        res.status(500).json({ error: 'Failed to fetch public user' });
    }
};
exports.getPublicUser = getPublicUser;
//# sourceMappingURL=eventTypes.controller.js.map