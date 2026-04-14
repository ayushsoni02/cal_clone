'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, parseISO } from 'date-fns';
import { api } from '@/lib/api';
import BookingForm from './BookingForm';

interface EventTypeInfo {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  slug: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
}

interface Slot {
  time: string;
  datetime: string;
}

interface AvailabilityDay {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export default function PublicBookingPage() {
  const params = useParams();
  const username = params.username as string;
  const slug = params.slug as string;

  const [eventType, setEventType] = useState<EventTypeInfo | null>(null);
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch event type info + availability
  useEffect(() => {
    async function fetchData() {
      try {
        const [etRes, avRes] = await Promise.all([
          api.get(`/public/${username}/${slug}`),
          api.get('/availability'),
        ]);
        setEventType(etRes.data);
        setAvailability(avRes.data);
      } catch {
        setError('Event type not found');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [username, slug]);

  // Fetch slots when date is selected
  const fetchSlots = useCallback(async (date: Date) => {
    if (!eventType) return;
    setSlotsLoading(true);
    setSlots([]);
    setSelectedSlot(null);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const res = await api.get(`/bookings/slots?eventTypeId=${eventType.id}&date=${dateStr}`);
      setSlots(res.data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [eventType]);

  const handleDateChange = (value: any) => {
    const date = value as Date;
    setSelectedDate(date);
    fetchSlots(date);
  };

  // Which day-of-week numbers are available
  const availableDays = new Set(availability.map(a => a.dayOfWeek));

  // Disable dates: past dates + days not in availability
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    return !availableDays.has(date.getDay());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-56 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !eventType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">Page not found</h2>
          <p className="mt-1 text-sm text-gray-500">This event type doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden max-w-4xl w-full">
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">

          {/* Left Panel — Event Info */}
          <div className="w-full md:w-72 p-6 flex-shrink-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {eventType.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{eventType.user.name}</p>
                <p className="text-xs text-gray-500">@{eventType.user.username}</p>
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2">{eventType.title}</h1>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{eventType.duration} minutes</span>
              </div>

              {availability.length > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                  <span>{availability[0].timezone.replace(/_/g, ' ')}</span>
                </div>
              )}
            </div>

            {eventType.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 leading-relaxed">{eventType.description}</p>
              </div>
            )}

            {/* Show selected date/time summary */}
            {selectedDate && selectedSlot && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-900 font-medium mt-1.5">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {selectedSlot.time}
                </div>
              </div>
            )}
          </div>

          {/* Middle Panel — Calendar */}
          <div className="flex-1 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Select a date</h2>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileDisabled={tileDisabled}
              minDate={new Date()}
              locale="en-US"
              next2Label={null}
              prev2Label={null}
              minDetail="month"
            />
          </div>

          {/* Right Panel — Slots or Form */}
          {selectedDate && (
            <div className="w-full md:w-72 p-6 flex-shrink-0 overflow-y-auto max-h-[500px]">
              {selectedSlot ? (
                /* Booking Form */
                <BookingForm
                  eventType={eventType}
                  selectedDate={selectedDate}
                  selectedSlot={selectedSlot}
                  onBack={() => setSelectedSlot(null)}
                />
              ) : (
                /* Time Slots */
                <>
                  <h2 className="text-sm font-semibold text-gray-900 mb-1">
                    {format(selectedDate, 'EEEE, MMMM d')}
                  </h2>
                  <p className="text-xs text-gray-500 mb-4">
                    {slots.length} {slots.length === 1 ? 'slot' : 'slots'} available
                  </p>

                  {slotsLoading ? (
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
                          onClick={() => setSelectedSlot(slot)}
                          className="w-full px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-150 text-gray-900"
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
