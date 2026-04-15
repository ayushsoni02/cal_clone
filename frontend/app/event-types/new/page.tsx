import EventTypeForm from '@/components/event-types/EventTypeForm';
import Link from 'next/link';

export default function NewEventTypePage() {
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
        <span className="text-gray-900 font-medium">New</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create event type</h1>
        <p className="text-gray-500 mt-1 text-sm">Set up a new event type for people to book with you.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <EventTypeForm mode="create" />
      </div>
    </div>
  );
}
