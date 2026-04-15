'use client';

import Link from 'next/link';
import { EventType } from '@/types';
import { getDurationColor, getDurationBadgeClasses } from '@/lib/utils';

interface EventTypeCardProps {
  eventType: EventType;
  copiedSlug: string | null;
  onCopyLink: (slug: string) => void;
  onDelete: (id: number) => void;
}

export default function EventTypeCard({ eventType: et, copiedSlug, onCopyLink, onDelete }: EventTypeCardProps) {
  return (
    <div className="flex items-center group hover:bg-gray-50 transition-colors">
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
          onClick={() => onCopyLink(et.slug)}
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
          onClick={() => onDelete(et.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}
