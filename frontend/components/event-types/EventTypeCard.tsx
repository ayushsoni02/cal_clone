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
    <div className="flex group hover:bg-[var(--cal-bg-subtle)] transition-colors duration-150">
      {/* Colored left bar — 4px wide */}
      <div
        className="self-stretch rounded-l-lg flex-shrink-0"
        style={{ backgroundColor: getDurationColor(et.duration), width: '4px' }}
      />

      {/* Content + Actions wrapper */}
      <div className="flex-1 px-4 sm:px-5 py-3 sm:py-4 min-w-0">
        {/* Top row: title + badges + desktop actions */}
        <div className="flex items-start sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-[var(--cal-text)] truncate">{et.title}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDurationBadgeClasses(et.duration)}`}>
                {et.duration}m
              </span>
            </div>
            {et.description && (
              <p className="text-sm text-[var(--cal-text-muted)] mt-0.5 truncate">{et.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-1 font-mono">/admin/{et.slug}</p>
          </div>

          {/* Desktop actions — hover reveal */}
          <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Link
              href={`/admin/${et.slug}`}
              target="_blank"
              className="p-2 text-gray-400 hover:text-[var(--cal-brand)] hover:bg-gray-100 rounded-md transition-colors"
              title="View public page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </Link>
            <button
              onClick={() => onCopyLink(et.slug)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
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
            <Link
              href={`/event-types/${et.id}/edit`}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              title="Edit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </Link>
            <button
              onClick={() => onDelete(et.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile actions — always visible row */}
        <div className="flex sm:hidden items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap">
          <Link
            href={`/admin/${et.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--cal-text-muted)] bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            View
          </Link>
          <button
            onClick={() => onCopyLink(et.slug)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--cal-text-muted)] bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
          >
            {copiedSlug === et.slug ? (
              <>
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-3.686a4.5 4.5 0 010 6.364L10.5 19.5a4.5 4.5 0 01-6.364-6.364l4.5-4.5a4.5 4.5 0 016.364 0z" />
                </svg>
                Copy link
              </>
            )}
          </button>
          <Link
            href={`/event-types/${et.id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--cal-text-muted)] bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
            Edit
          </Link>
          <button
            onClick={() => onDelete(et.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors ml-auto"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
