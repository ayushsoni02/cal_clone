import { format, addMinutes, parseISO, setHours, setMinutes } from 'date-fns';

export function generateSlots(
  date: string,
  startTime: string,
  endTime: string,
  duration: number,
  existingBookings: { startTime: Date; endTime: Date }[],
  bufferMinutes: number = 0
): { time: string; datetime: string }[] {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const baseDate = parseISO(date);
  let current = setMinutes(setHours(baseDate, startH), startM);
  const end = setMinutes(setHours(baseDate, endH), endM);
  const slots: { time: string; datetime: string }[] = [];

  while (addMinutes(current, duration) <= end) {
    const slotEnd = addMinutes(current, duration);
    const isBooked = existingBookings.some(booking => {
      const paddedStart = addMinutes(booking.startTime, -bufferMinutes);
      const paddedEnd = addMinutes(booking.endTime, bufferMinutes);
      return current < paddedEnd && slotEnd > paddedStart;
    });
    if (!isBooked) {
      slots.push({
        time: format(current, 'HH:mm'),
        datetime: current.toISOString(),
      });
    }
    current = addMinutes(current, duration);
  }

  return slots;
}
