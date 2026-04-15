'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { api } from '@/lib/api';

interface BookingInfo {
  id: number;
  bookerName: string;
  bookerEmail: string;
  startTime: string;
  endTime: string;
  status: string;
  eventType: {
    title: string;
    duration: number;
    slug: string;
    user?: {
      name: string;
      username: string;
    };
  };
}

export default function ConfirmedPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;
  const slug = params.slug as string;
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooking() {
      if (!bookingId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/bookings');
        const found = res.data.find((b: BookingInfo) => b.id === Number(bookingId));
        if (found) setBooking(found);
      } catch {
        // Silently fail — we still show generic confirmation
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cal-bg-subtle)] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  const startDate = booking ? new Date(booking.startTime) : null;
  const endDate = booking ? new Date(booking.endTime) : null;

  return (
    <div className="min-h-screen bg-[var(--cal-bg-subtle)] flex items-center justify-center p-4">
      <div className="bg-[var(--cal-bg)] rounded-2xl shadow-lg border border-[var(--cal-border)] max-w-md w-full p-8 text-center animate-fade-in-up">
        {/* Animated success icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-6 animate-scale-in">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--cal-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path className="checkmark-animated" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[var(--cal-text)] mb-1">This meeting is scheduled</h1>
        <p className="text-sm text-[var(--cal-text-muted)] mb-8">
          A calendar invitation has been sent to your email address.
        </p>

        {/* Booking details table */}
        <div className="rounded-xl border border-[var(--cal-border)] overflow-hidden text-left mb-8">
          {/* What */}
          <div className="flex items-start gap-3 px-5 py-4 border-b border-[var(--cal-border)] bg-[var(--cal-bg)]">
            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-[var(--cal-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-[var(--cal-text-muted)] uppercase tracking-wider font-semibold">What</p>
              <p className="text-sm font-medium text-[var(--cal-text)] mt-0.5">
                {booking?.eventType.title || slug}
              </p>
            </div>
          </div>

          {/* When */}
          {startDate && endDate && (
            <div className="flex items-start gap-3 px-5 py-4 border-b border-[var(--cal-border)] bg-[var(--cal-bg)]">
              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-[var(--cal-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-[var(--cal-text-muted)] uppercase tracking-wider font-semibold">When</p>
                <p className="text-sm font-medium text-[var(--cal-text)] mt-0.5">
                  {format(startDate, 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-sm text-[var(--cal-text-muted)]">
                  {format(startDate, 'h:mm a')} – {format(endDate, 'h:mm a')} ({booking?.eventType.duration}m)
                </p>
              </div>
            </div>
          )}

          {/* Who */}
          {booking && (
            <div className="flex items-start gap-3 px-5 py-4 bg-[var(--cal-bg)]">
              <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-[var(--cal-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-[var(--cal-text-muted)] uppercase tracking-wider font-semibold">Who</p>
                <p className="text-sm font-medium text-[var(--cal-text)] mt-0.5">{booking.bookerName}</p>
                <p className="text-sm text-[var(--cal-text-muted)]">{booking.bookerEmail}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/${username}/${slug}`}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 bg-[var(--cal-brand)] text-[var(--cal-brand-text)] text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Schedule another meeting
          </Link>
          <Link
            href="/"
            className="text-sm text-[var(--cal-text-muted)] hover:text-[var(--cal-text)] transition-colors"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
