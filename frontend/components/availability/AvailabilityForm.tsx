'use client';

import { DaySchedule } from '@/types';
import { DAYS, SHORT_DAYS, TIME_OPTIONS, TIMEZONES, formatTime12h } from '@/lib/utils';

interface AvailabilityFormProps {
  schedule: DaySchedule[];
  timezone: string;
  errors: Record<number, string>;
  saving: boolean;
  saved: boolean;
  onToggleDay: (dayOfWeek: number) => void;
  onUpdateTime: (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => void;
  onTimezoneChange: (tz: string) => void;
  onSave: () => void;
}

export default function AvailabilityForm({
  schedule, timezone, errors, saving, saved,
  onToggleDay, onUpdateTime, onTimezoneChange, onSave,
}: AvailabilityFormProps) {
  const enabledCount = schedule.filter(d => d.enabled).length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Timezone selector */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-900">Timezone</p>
              <p className="text-xs text-gray-500">All times are shown in this timezone</p>
            </div>
          </div>
          <select
            value={timezone}
            onChange={(e) => onTimezoneChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none cursor-pointer"
          >
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Day rows */}
      <div className="divide-y divide-gray-100">
        {schedule.map((day) => (
          <div
            key={day.dayOfWeek}
            className={`px-6 py-4 transition-colors ${day.enabled ? 'bg-white' : 'bg-gray-50/50'}`}
          >
            <div className="flex items-center gap-4">
              {/* Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={day.enabled}
                onClick={() => onToggleDay(day.dayOfWeek)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
                  day.enabled ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                    day.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              {/* Day name */}
              <span className={`w-24 text-sm font-medium flex-shrink-0 ${
                day.enabled ? 'text-gray-900' : 'text-gray-400'
              }`}>
                <span className="hidden sm:inline">{DAYS[day.dayOfWeek]}</span>
                <span className="sm:hidden">{SHORT_DAYS[day.dayOfWeek]}</span>
              </span>

              {/* Time range */}
              {day.enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <select
                    value={day.startTime}
                    onChange={(e) => onUpdateTime(day.dayOfWeek, 'startTime', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none cursor-pointer min-w-[130px]"
                  >
                    {TIME_OPTIONS.map(t => (
                      <option key={t} value={t}>{formatTime12h(t)}</option>
                    ))}
                  </select>
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                  <select
                    value={day.endTime}
                    onChange={(e) => onUpdateTime(day.dayOfWeek, 'endTime', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none cursor-pointer min-w-[130px]"
                  >
                    {TIME_OPTIONS.map(t => (
                      <option key={t} value={t}>{formatTime12h(t)}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="text-sm text-gray-400 italic">Unavailable</span>
              )}
            </div>
            {errors[day.dayOfWeek] && (
              <p className="mt-2 ml-15 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {errors[day.dayOfWeek]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer / Save */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50/50 rounded-b-xl">
        <p className="text-sm text-gray-500">
          {enabledCount} {enabledCount === 1 ? 'day' : 'days'} active
        </p>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1.5 animate-fade-in">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </span>
          )}
          <button
            onClick={onSave}
            disabled={saving || Object.keys(errors).length > 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {saving && (
              <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
