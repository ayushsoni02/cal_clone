'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getEventTypes, deleteEventType } from '@/lib/api';
import { EventType } from '@/types';
import EventTypeCard from '@/components/event-types/EventTypeCard';

export default function DashboardPage() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const fetchEventTypes = useCallback(async () => {
    try {
      const res = await getEventTypes();
      setEventTypes(res.data);
    } catch (err) {
      console.error('Failed to fetch event types:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventTypes();
  }, [fetchEventTypes]);

  const handleDelete = async (id: number) => {
    try {
      await deleteEventType(id);
      setDeleteId(null);
      fetchEventTypes();
    } catch (err) {
      console.error('Failed to delete event type:', err);
    }
  };

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/admin/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-40 bg-gray-200 rounded" />
            <div className="h-4 w-72 bg-gray-200 rounded mt-2" />
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded-md" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-[var(--cal-bg)] rounded-lg border border-[var(--cal-border)]" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cal-text)]">Event Types</h1>
          <p className="text-[var(--cal-text-muted)] mt-1 text-sm">Create and manage event types for people to book.</p>
        </div>
        <Link
          href="/event-types/new"
          className="inline-flex items-center gap-2 h-10 px-4 bg-[var(--cal-brand)] text-[var(--cal-brand-text)] text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New event type
        </Link>
      </div>

      {/* Event Type List */}
      {eventTypes.length === 0 ? (
        <div className="text-center py-16 bg-[var(--cal-bg)] rounded-lg border border-[var(--cal-border)]">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <h3 className="mt-3 text-sm font-semibold text-gray-900">No event types</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first event type.</p>
          <Link
            href="/event-types/new"
            className="inline-flex items-center gap-2 mt-4 h-10 px-4 bg-[var(--cal-brand)] text-[var(--cal-brand-text)] text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New event type
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--cal-bg)] rounded-lg border border-[var(--cal-border)] divide-y divide-[var(--cal-border)] overflow-hidden shadow-sm">
          {eventTypes.map((et) => (
            <EventTypeCard
              key={et.id}
              eventType={et}
              copiedSlug={copiedSlug}
              onCopyLink={handleCopyLink}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      {/* Copied toast */}
      {copiedSlug && (
        <div className="fixed bottom-6 right-6 bg-[var(--cal-brand)] text-[var(--cal-brand-text)] px-4 py-2.5 rounded-md shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in z-50">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Link copied!
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-[var(--cal-bg)] rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Delete event type</h3>
                <p className="text-sm text-gray-500 mt-0.5">This will permanently delete this event type and all its bookings.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="h-10 px-4 text-sm font-medium text-[var(--cal-text-muted)] bg-[var(--cal-bg)] border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="h-10 px-4 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
