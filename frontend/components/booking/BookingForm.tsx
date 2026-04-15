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
  const [responses, setResponses] = useState<Record<string, string>>({});
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
        responses,
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
    <div className="animate-slide-in-right">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-[var(--cal-text-muted)] hover:text-[var(--cal-text)] transition-colors mb-4 group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      {/* Selected time summary */}
      <div className="bg-[var(--cal-bg-subtle)] rounded-md p-3 mb-4 border border-[var(--cal-border)]">
        <p className="text-sm font-medium text-[var(--cal-text)]">
          {format(selectedDate, 'EEEE, MMMM d')}
        </p>
        <p className="text-sm text-[var(--cal-text-muted)]">
          {selectedSlot.time} · {eventType.duration} min
        </p>
      </div>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-sm text-red-700 animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="booker-name" className="block text-sm font-medium text-[var(--cal-text)] mb-1.5">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id="booker-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm text-[var(--cal-text)] placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--cal-brand)] focus:ring-offset-2 focus:border-[var(--cal-brand)] outline-none transition-shadow"
          />
        </div>

        <div>
          <label htmlFor="booker-email" className="block text-sm font-medium text-[var(--cal-text)] mb-1.5">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            id="booker-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm text-[var(--cal-text)] placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--cal-brand)] focus:ring-offset-2 focus:border-[var(--cal-brand)] outline-none transition-shadow"
          />
        </div>

        {eventType.questions && eventType.questions.length > 0 && (
          <div className="pt-2 space-y-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-[var(--cal-text)]">Additional Information</h3>
            {eventType.questions.map((q: any) => (
              <div key={q.id}>
                <label htmlFor={`q-${q.id}`} className="block text-sm font-medium text-[var(--cal-text)] mb-1.5">
                  {q.label} {q.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  id={`q-${q.id}`}
                  type="text"
                  value={responses[q.id] || ''}
                  onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
                  placeholder="Your answer"
                  required={q.required}
                  className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm text-[var(--cal-text)] placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--cal-brand)] focus:ring-offset-2 focus:border-[var(--cal-brand)] outline-none transition-shadow"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 bg-[var(--cal-brand)] text-[var(--cal-brand-text)] text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
