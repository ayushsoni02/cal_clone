// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventTypesRouter from './routes/eventTypes';
import availabilityRouter from './routes/availability';
import bookingsRouter from './routes/bookings';
import { errorHandler } from './middleware/errorHandler';
import { getPublicEventType, getPublicUser } from './controllers/eventTypes.controller';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


// Routes
app.use('/api/event-types', eventTypesRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/bookings', bookingsRouter);
app.get('/api/public/:username', getPublicUser);
app.get('/api/public/:username/:slug', getPublicEventType);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
