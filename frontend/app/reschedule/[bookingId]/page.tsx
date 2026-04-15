'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getBookings, getAvailability, getSlots, rescheduleBooking } from '@/lib/api';
import { AvailabilityDay, Slot, Booking } from '@/types';
import CalendarPicker from '@/components/booking/CalendarPicker';
import TimeSlotList from '@/components/booking/TimeSlotList';

export default function ReschedulePage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = Number(params.bookingId);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bkRes, avRes] = await Promise.all([
          getBookings(),
          getAvailability(),
        ]);
        const found = bkRes.data.find((b: Booking) => b.id === bookingId);
        if (!found) throw new Error('Not found');
        setBooking(found);
        setAvailability(avRes.data);
      } catch {
        setError('Booking not found');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [bookingId]);

  const fetchSlots = useCallback(async (date: Date) => {
    if (!booking) return;
    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const res = await getSlots(booking.eventTypeId, dateStr);
      setSlots(res.data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [booking]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    fetchSlots(date);
  };

  const handleReschedule = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setError(null);
    try {
      await rescheduleBooking(bookingId, { startTime: selectedSlot.datetime });
      router.push('/bookings');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reschedule. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const availableDays = new Set(availability.map(a => a.dayOfWeek));

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cal-bg-subtle)] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-56 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[var(--cal-bg-subtle)] flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <h2 className="mt-4 text-lg font-semibold text-[var(--cal-text)]">Cannot Reschedule</h2>
          <p className="mt-1 text-sm text-[var(--cal-text-muted)]">This booking doesn't exist or has been cancelled.</p>
          <button onClick={() => router.push('/bookings')} className="mt-4 text-sm text-[var(--cal-brand)]">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cal-bg-subtle)] flex items-center justify-center p-4">
      <div className="bg-[var(--cal-bg)] rounded-2xl shadow-lg border border-[var(--cal-border)] overflow-hidden max-w-4xl w-full">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--cal-border)]">

          {/* Left Panel */}
          <div className="w-full md:w-72 p-6 flex-shrink-0">
            <h1 className="text-xl font-bold text-[var(--cal-text)] mb-2">Reschedule Booking</h1>
            <p className="text-sm font-medium text-[var(--cal-text)]">{booking.eventType.title}</p>
            <p className="text-xs text-[var(--cal-text-muted)] mt-1">
              Currently: {format(new Date(booking.startTime), 'MMM d, yyyy h:mm a')}
            </p>

            <div className="mt-6 pt-6 border-t border-[var(--cal-border)]">
              <p className="text-sm text-[var(--cal-text-muted)] mb-2">Booker Details</p>
              <p className="text-sm font-medium text-[var(--cal-text)]">{booking.bookerName}</p>
              <p className="text-xs text-[var(--cal-text-muted)]">{booking.bookerEmail}</p>
            </div>
          </div>

          {/* Middle Panel — Calendar */}
          <div className="flex-1 p-6">
            <h2 className="text-sm font-semibold text-[var(--cal-text)] mb-4">Select a new date</h2>
            <CalendarPicker
              selectedDate={selectedDate}
              availableDays={availableDays}
              onDateChange={handleDateChange}
            />
          </div>

          {/* Right Panel — Slots */}
          {selectedDate && (
            <div className="w-full md:w-72 p-6 flex-shrink-0 overflow-y-auto max-h-[500px]">
              {selectedSlot ? (
                <div className="animate-slide-in-right">
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="flex items-center gap-1 text-sm text-[var(--cal-text-muted)] hover:text-[var(--cal-text)] transition-colors mb-4 group"
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back
                  </button>
                  <p className="text-sm font-medium text-[var(--cal-text)] mb-1">Confirm Reschedule</p>
                  <p className="text-xs text-[var(--cal-text-muted)] mb-4">
                    New time: {format(selectedDate, 'MMM d, yyyy')} at {selectedSlot.time}
                  </p>
                  
                  {error && <div className="mb-4 text-xs text-red-600 bg-red-50 p-2 rounded">{error}</div>}

                  <button
                    onClick={handleReschedule}
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 bg-[var(--cal-brand)] text-[var(--cal-brand-text)] text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Confirming...' : 'Confirm Reschedule'}
                  </button>
                </div>
              ) : (
                <TimeSlotList
                  slots={slots}
                  loading={slotsLoading}
                  dateLabel={format(selectedDate, 'EEEE, MMMM d')}
                  onSelectSlot={setSelectedSlot}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
