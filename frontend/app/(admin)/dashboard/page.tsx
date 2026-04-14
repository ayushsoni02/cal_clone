'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getEventTypes, deleteEventType } from '@/lib/api';

interface EventType {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  slug: string;
  userId: number;
  createdAt: string;
}

function getDurationColor(duration: number): string {
  switch (duration) {
    case 15: return '#3B82F6'; // blue
    case 30: return '#22C55E'; // green
    case 60: return '#7C3AED'; // purple
    case 45: return '#F59E0B'; // amber
    case 90: return '#EF4444'; // red
    case 120: return '#EC4899'; // pink
    default: return '#6B7280'; // gray
  }
}

function getDurationBadgeClasses(duration: number): string {
  switch (duration) {
    case 15: return 'bg-blue-50 text-blue-700';
    case 30: return 'bg-green-50 text-green-700';
    case 60: return 'bg-purple-50 text-purple-700';
    case 45: return 'bg-amber-50 text-amber-700';
    case 90: return 'bg-red-50 text-red-700';
    case 120: return 'bg-pink-50 text-pink-700';
    default: return 'bg-gray-50 text-gray-700';
  }
}

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
          <div className="h-10 w-36 bg-gray-200 rounded-lg" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-white rounded-lg border border-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Types</h1>
          <p className="text-gray-500 mt-1 text-sm">Create and manage event types for people to book.</p>
        </div>
        <Link
          href="/event-types/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New event type
        </Link>
      </div>

      {/* Event Type List */}
      {eventTypes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <h3 className="mt-3 text-sm font-semibold text-gray-900">No event types</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first event type.</p>
          <Link
            href="/event-types/new"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New event type
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200 overflow-hidden shadow-sm">
          {eventTypes.map((et) => (
            <div key={et.id} className="flex items-center group hover:bg-gray-50 transition-colors">
              {/* Colored left bar */}
              <div
                className="w-1.5 self-stretch rounded-l-xl flex-shrink-0"
                style={{ backgroundColor: getDurationColor(et.duration) }}
              />

              {/* Content */}
              <div className="flex-1 px-5 py-4 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{et.title}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDurationBadgeClasses(et.duration)}`}>
                    {et.duration}m
                  </span>
                </div>
                {et.description && (
                  <p className="text-sm text-gray-500 mt-0.5 truncate">{et.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1 font-mono">/admin/{et.slug}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Copy link */}
                <button
                  onClick={() => handleCopyLink(et.slug)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy public link"
                >
                  {copiedSlug === et.slug ? (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.686a4.5 4.5 0 010 6.364L10.5 19.5a4.5 4.5 0 01-6.364-6.364l4.5-4.5a4.5 4.5 0 016.364 0z" />
                    </svg>
                  )}
                </button>

                {/* Edit */}
                <Link
                  href={`/event-types/${et.id}/edit`}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </Link>

                {/* Delete */}
                <button
                  onClick={() => setDeleteId(et.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Copied toast */}
      {copiedSlug && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 animate-fade-in z-50">
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
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
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
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
