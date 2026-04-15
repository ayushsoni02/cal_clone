'use client';

import { format } from 'date-fns';
import { Booking } from '@/types';

interface BookingRowProps {
  booking: Booking;
  now: Date;
  onCancel: (id: number) => void;
}

export default function BookingRow({ booking, now, onCancel }: BookingRowProps) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className={`px-5 py-4 flex items-center gap-5 group hover:bg-gray-50 transition-colors ${isCancelled ? 'opacity-60' : ''}`}>
      {/* Date/Time block */}
      <div className="flex-shrink-0 w-36">
        <p className="text-sm font-medium text-gray-900">
          {format(start, 'EEE, MMM d, yyyy')}
        </p>
        <p className="text-sm text-gray-500">
          {format(start, 'h:mm a')} – {format(end, 'h:mm a')}
        </p>
      </div>

      {/* Vertical divider */}
      <div className="w-px h-10 bg-gray-200 flex-shrink-0" />

      {/* Event & Booker info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {booking.eventType.title}
          </p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 flex-shrink-0">
            {booking.eventType.duration}m
          </span>
          {isCancelled && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 flex-shrink-0">
              Cancelled
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <p className="text-sm text-gray-500 truncate">
            {booking.bookerName} · {booking.bookerEmail}
          </p>
        </div>
      </div>

      {/* Cancel button (only for upcoming) */}
      {booking.status === 'upcoming' && new Date(booking.startTime) > now && (
        <button
          onClick={() => onCancel(booking.id)}
          className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
