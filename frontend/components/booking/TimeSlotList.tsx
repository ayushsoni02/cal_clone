'use client';

import { Slot } from '@/types';

interface TimeSlotListProps {
  slots: Slot[];
  loading: boolean;
  dateLabel: string;
  onSelectSlot: (slot: Slot) => void;
}

export default function TimeSlotList({ slots, loading, dateLabel, onSelectSlot }: TimeSlotListProps) {
  return (
    <>
      <h2 className="text-sm font-semibold text-gray-900 mb-1">{dateLabel}</h2>
      <p className="text-xs text-gray-500 mb-4">
        {slots.length} {slots.length === 1 ? 'slot' : 'slots'} available
      </p>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No available slots</p>
        </div>
      ) : (
        <div className="space-y-2">
          {slots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => onSelectSlot(slot)}
              className="w-full px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-150 text-gray-900"
            >
              {slot.time}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
