'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBookings, cancelBooking } from '@/lib/api';
import { Booking } from '@/types';
import BookingRow from '@/components/bookings/BookingRow';

type Tab = 'upcoming' | 'past' | 'cancelled';

const TABS: { key: Tab; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await getBookings();
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (id: number) => {
    setCancelling(true);
    try {
      await cancelBooking(id);
      setCancelId(null);
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
    } finally {
      setCancelling(false);
    }
  };

  const now = new Date();
  const filtered = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'upcoming' && new Date(b.startTime) > now;
    if (activeTab === 'past') return new Date(b.startTime) < now || b.status === 'past';
    return b.status === 'cancelled';
  });

  const tabCounts = {
    upcoming: bookings.filter(b => b.status === 'upcoming' && new Date(b.startTime) > now).length,
    past: bookings.filter(b => new Date(b.startTime) < now || b.status === 'past').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-7 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-56 bg-gray-200 rounded mb-8" />
        <div className="flex gap-4 mb-6">
          {[1, 2, 3].map(i => <div key={i} className="h-9 w-28 bg-gray-200 rounded-lg" />)}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-[var(--cal-bg)] rounded-lg border border-[var(--cal-border)]" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--cal-text)]">Bookings</h1>
        <p className="text-[var(--cal-text-muted)] mt-1 text-sm">View and manage your upcoming and past bookings.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
              activeTab === tab.key ? 'bg-[var(--cal-bg)] text-[var(--cal-text)] shadow-sm' : 'text-[var(--cal-text-muted)] hover:text-[var(--cal-text)]'
            }`}
          >
            {tab.label}
            {tabCounts[tab.key] > 0 && (
              <span className={`ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium rounded-full ${
                activeTab === tab.key ? 'bg-[var(--cal-brand)] text-[var(--cal-brand-text)]' : 'bg-gray-200 text-gray-600'
              }`}>{tabCounts[tab.key]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[var(--cal-bg)] rounded-lg border border-[var(--cal-border)]">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <h3 className="mt-3 text-sm font-semibold text-gray-900">
            {activeTab === 'upcoming' && 'No upcoming bookings'}
            {activeTab === 'past' && 'No past bookings yet'}
            {activeTab === 'cancelled' && 'No cancelled bookings'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab === 'upcoming' && 'Share your booking link to get started.'}
            {activeTab === 'past' && 'Your completed bookings will appear here.'}
            {activeTab === 'cancelled' && 'Cancelled bookings will appear here.'}
          </p>
        </div>
      ) : (
        <div className="bg-[var(--cal-bg)] rounded-lg border border-[var(--cal-border)] divide-y divide-[var(--cal-border)] overflow-hidden shadow-sm">
          {filtered.map((booking) => (
            <BookingRow key={booking.id} booking={booking} now={now} onCancel={setCancelId} />
          ))}
        </div>
      )}

      {/* Cancel confirmation modal */}
      {cancelId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCancelId(null)} />
          <div className="relative bg-[var(--cal-bg)] rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Cancel booking</h3>
                <p className="text-sm text-gray-500 mt-0.5">Are you sure? This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setCancelId(null)} disabled={cancelling} className="h-10 px-4 text-sm font-medium text-[var(--cal-text-muted)] bg-[var(--cal-bg)] border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Keep booking</button>
              <button onClick={() => handleCancel(cancelId)} disabled={cancelling} className="inline-flex items-center gap-2 h-10 px-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors">
                {cancelling && (
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {cancelling ? 'Cancelling...' : 'Cancel booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
