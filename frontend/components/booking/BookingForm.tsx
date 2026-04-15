'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { createBooking } from '@/lib/api';
import { EventTypePublic, Slot } from '@/types';

interface BookingFormProps {
  eventType: EventTypePublic;
  selectedDate: Date;
  selectedSlot: Slot;
  onBack: () => void;
}

export default function BookingForm({ eventType, selectedDate, selectedSlot, onBack }: BookingFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBooking({
        eventTypeId: eventType.id,
        bookerName: name.trim(),
        bookerEmail: email.trim(),
        startTime: selectedSlot.datetime,
      });

      router.push(
        `/${eventType.user.username}/${eventType.slug}/confirmed?bookingId=${res.data.id}`
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      {/* Selected time summary */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium text-gray-900">
          {format(selectedDate, 'EEEE, MMMM d')}
        </p>
        <p className="text-sm text-gray-600">
          {selectedSlot.time} · {eventType.duration} min
        </p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="booker-name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            id="booker-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-shadow"
          />
        </div>

        <div>
          <label htmlFor="booker-email" className="block text-sm font-medium text-gray-700 mb-1">
            Your Email *
          </label>
          <input
            id="booker-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-shadow"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Confirming...
            </>
          ) : (
            'Confirm booking'
          )}
        </button>
      </form>
    </div>
  );
}
