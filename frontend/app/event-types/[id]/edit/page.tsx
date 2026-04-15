'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import EventTypeForm from '@/components/event-types/EventTypeForm';
import { api } from '@/lib/api';
import { EventType } from '@/types';

export default function EditEventTypePage() {
  const params = useParams();
  const id = Number(params.id);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEventType() {
      try {
        const res = await api.get(`/event-types`);
        const found = res.data.find((et: EventType) => et.id === id);
        if (!found) {
          setError('Event type not found');
        } else {
          setEventType(found);
        }
      } catch {
        setError('Failed to load event type');
      } finally {
        setLoading(false);
      }
    }
    fetchEventType();
  }, [id]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded mb-6" />
        <div className="h-7 w-56 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-72 bg-gray-200 rounded mb-6" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i}>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !eventType) {
    return (
      <div className="text-center py-16">
        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <h3 className="mt-3 text-sm font-semibold text-gray-900">{error || 'Not found'}</h3>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-gray-600 hover:text-gray-900 underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/dashboard" className="hover:text-gray-700 transition-colors">
          Event Types
        </Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-gray-900 font-medium">Edit</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit event type</h1>
        <p className="text-gray-500 mt-1 text-sm">Update your event type details.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <EventTypeForm mode="edit" initialData={eventType} />
      </div>
    </div>
  );
}
