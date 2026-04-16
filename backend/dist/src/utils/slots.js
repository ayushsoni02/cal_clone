"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlots = generateSlots;
const date_fns_1 = require("date-fns");
function generateSlots(date, startTime, endTime, duration, existingBookings, bufferMinutes = 0) {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const baseDate = (0, date_fns_1.parseISO)(date);
    let current = (0, date_fns_1.setMinutes)((0, date_fns_1.setHours)(baseDate, startH), startM);
    const end = (0, date_fns_1.setMinutes)((0, date_fns_1.setHours)(baseDate, endH), endM);
    const slots = [];
    while ((0, date_fns_1.addMinutes)(current, duration) <= end) {
        const slotEnd = (0, date_fns_1.addMinutes)(current, duration);
        const isBooked = existingBookings.some(booking => {
            const paddedStart = (0, date_fns_1.addMinutes)(booking.startTime, -bufferMinutes);
            const paddedEnd = (0, date_fns_1.addMinutes)(booking.endTime, bufferMinutes);
            return current < paddedEnd && slotEnd > paddedStart;
        });
        if (!isBooked) {
            slots.push({
                time: (0, date_fns_1.format)(current, 'HH:mm'),
                datetime: current.toISOString(),
            });
        }
        current = (0, date_fns_1.addMinutes)(current, duration);
    }
    return slots;
}
//# sourceMappingURL=slots.js.map