"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const eventTypes_1 = __importDefault(require("./routes/eventTypes"));
const availability_1 = __importDefault(require("./routes/availability"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const errorHandler_1 = require("./middleware/errorHandler");
const eventTypes_controller_1 = require("./controllers/eventTypes.controller");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: 'http://localhost:3000' }));
app.use(express_1.default.json());
// Routes
app.use('/api/event-types', eventTypes_1.default);
app.use('/api/availability', availability_1.default);
app.use('/api/bookings', bookings_1.default);
app.get('/api/public/:username', eventTypes_controller_1.getPublicUser);
app.get('/api/public/:username/:slug', eventTypes_controller_1.getPublicEventType);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Global error handler (must be last)
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map