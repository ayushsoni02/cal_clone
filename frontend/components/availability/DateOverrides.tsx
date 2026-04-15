'use client';

import { useState, useEffect } from 'react';
import { getOverrides, saveOverride, deleteOverride } from '@/lib/api';
import { format } from 'date-fns';

interface Override {
  id: number;
  date: string;
  isBlocked: boolean;
  startTime: string | null;
  endTime: string | null;
}

export default function DateOverrides() {
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);

  // Form state
  const [date, setDate] = useState('');
  const [isBlocked, setIsBlocked] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOverrides();
  }, []);

  const fetchOverrides = async () => {
    try {
      const res = await getOverrides();
      setOverrides(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOverride(id);
      setOverrides(overrides.filter(o => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    if (!isBlocked && startTime >= endTime) {
      setError('Start time must be before end time');
      return;
    }
    setError('');
    setAdding(true);
    try {
      await saveOverride({
        date,
        isBlocked,
        startTime: isBlocked ? null : startTime,
        endTime: isBlocked ? null : endTime,
      });
      setShowAdd(false);
      fetchOverrides();
    } catch (err) {
      setError('Failed to save override');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return null;

  return (
    <div className="mt-8 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-base font-semibold text-[var(--cal-text)]">Date Overrides</h2>
          <p className="text-sm text-gray-500 mt-1">Add specific dates when your availability changes.</p>
        </div>
        {!showAdd && (
          <button
            onClick={() => { setShowAdd(true); setDate(''); setIsBlocked(true); }}
            className="text-sm font-medium text-[var(--cal-brand)] px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            + Add override
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleSave} className="p-5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-end gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 px-3 border border-gray-300 rounded-md text-sm text-[var(--cal-text)] outline-none focus:border-gray-500 bg-white w-full sm:w-48"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center h-10 px-1 gap-2">
            <input
              type="checkbox"
              id="isBlocked"
              checked={isBlocked}
              onChange={(e) => setIsBlocked(e.target.checked)}
              className="rounded border-gray-300 text-[var(--cal-brand)] focus:ring-[var(--cal-brand)]"
            />
            <label htmlFor="isBlocked" className="text-sm text-gray-700 font-medium cursor-pointer">Mark as unavailable</label>
          </div>

          {!isBlocked && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="h-10 px-2 border border-gray-300 rounded-md text-sm outline-none focus:border-gray-500 bg-white w-28"
                  required={!isBlocked}
                />
              </div>
              <span className="text-gray-400 mt-6">-</span>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="h-10 px-2 border border-gray-300 rounded-md text-sm outline-none focus:border-gray-500 bg-white w-28"
                  required={!isBlocked}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto ml-auto">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="flex-1 sm:flex-none h-10 px-4 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adding}
              className="flex-1 sm:flex-none h-10 px-4 bg-[var(--cal-brand)] text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {adding ? 'Saving...' : 'Save'}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 absolute bottom-1 sm:bottom-auto sm:-mt-5">{error}</p>}
        </form>
      )}

      {overrides.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {overrides.map((override) => (
            <div key={override.id} className="p-4 sm:px-6 flex items-center justify-between group hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center border border-gray-200">
                  <span className="text-xs font-medium text-gray-500 uppercase">{format(new Date(override.date), 'MMM')}</span>
                  <span className="text-lg font-bold text-[var(--cal-text)] leading-none mt-0.5">{format(new Date(override.date), 'd')}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--cal-text)]">
                    {format(new Date(override.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5 flex flex-wrap gap-2 items-center">
                    {override.isBlocked ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        Unavailable
                      </span>
                    ) : (
                      <>
                        <span className="inline-flex items-center text-xs font-medium text-[var(--cal-text-muted)]">
                          {override.startTime} - {override.endTime}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(override.id)}
                className="p-2 text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 rounded-md border border-transparent hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 border-t border-dashed border-gray-200 m-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-3">You haven't set any overrides yet.</p>
          <button
            onClick={() => { setShowAdd(true); setDate(''); setIsBlocked(true); }}
            className="text-sm font-medium text-[var(--cal-brand)] bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Add an override
          </button>
        </div>
      )}
    </div>
  );
}
