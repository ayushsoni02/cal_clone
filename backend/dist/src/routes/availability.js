"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/availability.ts
const express_1 = require("express");
const availability_controller_1 = require("../controllers/availability.controller");
const router = (0, express_1.Router)();
router.get('/', availability_controller_1.getAvailability);
router.put('/', availability_controller_1.updateAvailability);
router.get('/overrides', availability_controller_1.getOverrides);
router.post('/overrides', availability_controller_1.createOverride);
router.delete('/overrides/:id', availability_controller_1.deleteOverride);
exports.default = router;
//# sourceMappingURL=availability.js.map