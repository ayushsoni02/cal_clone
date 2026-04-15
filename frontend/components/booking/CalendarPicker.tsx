'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CalendarPickerProps {
  selectedDate: Date | null;
  availableDays: Set<number>;
  onDateChange: (date: Date) => void;
}

export default function CalendarPicker({ selectedDate, availableDays, onDateChange }: CalendarPickerProps) {
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    return !availableDays.has(date.getDay());
  };

  return (
    <Calendar
      onChange={(value) => onDateChange(value as Date)}
      value={selectedDate}
      tileDisabled={tileDisabled}
      minDate={new Date()}
      locale="en-US"
      next2Label={null}
      prev2Label={null}
      minDetail="month"
    />
  );
}
