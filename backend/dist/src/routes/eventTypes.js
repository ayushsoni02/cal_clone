"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/eventTypes.ts
const express_1 = require("express");
const eventTypes_controller_1 = require("../controllers/eventTypes.controller");
const router = (0, express_1.Router)();
router.get('/', eventTypes_controller_1.getAllEventTypes);
router.post('/', eventTypes_controller_1.createEventType);
router.put('/:id', eventTypes_controller_1.updateEventType);
router.delete('/:id', eventTypes_controller_1.deleteEventType);
exports.default = router;
//# sourceMappingURL=eventTypes.js.map