'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublicUser } from '@/lib/api';
import { EventTypePublic } from '@/types';

interface PublicUser {
  id: number;
  username: string;
  name: string;
  eventTypes: EventTypePublic[];
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getPublicUser(username);
        setUser(res.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchUser();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cal-bg-subtle)] flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center gap-4 w-full max-w-2xl">
          <div className="w-20 h-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--cal-bg-subtle)] flex flex-col items-center py-12 px-4 sm:px-6">
      
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-2xl font-bold tracking-wide shadow-md mb-4 uppercase">
          {user.name.substring(0, 2)}
        </div>
        <h1 className="text-2xl font-bold text-[var(--cal-text)]">{user.name}</h1>
        <p className="text-[var(--cal-text-muted)] text-sm mt-1">Welcome to my scheduling page.</p>
      </div>

      {/* Event Types Grid */}
      <div className="w-full max-w-3xl">
        {user.eventTypes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-900">No active event types</h3>
            <p className="text-sm text-gray-500 mt-1">Check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.eventTypes.map((et) => (
              <Link 
                key={et.id} 
                href={`/${username}/${et.slug}`}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-semibold text-[var(--cal-text)] group-hover:text-[var(--cal-brand)] transition-colors">{et.title}</h2>
                </div>
                {et.description && (
                  <p className="text-sm text-[var(--cal-text-muted)] line-clamp-2 mb-4 flex-1">
                    {et.description}
                  </p>
                )}
                <div className="mt-auto pt-4 flex items-center text-xs font-medium text-gray-500 uppercase tracking-wide gap-1.5">
                  <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {et.duration} minutes
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16 sm:mt-24">
        <a href="https://cal.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
          <span className="text-[11px] font-medium text-gray-400 mb-1.5 opacity-80">POWERED BY</span>
          <span className="text-lg font-bold tracking-tight text-gray-300 group-hover:text-[var(--cal-text-muted)] transition-colors">Cal.com</span>
        </a>
      </div>

    </div>
  );
}
