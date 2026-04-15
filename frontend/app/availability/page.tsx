'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAvailability, saveAvailability } from '@/lib/api';
import { DaySchedule } from '@/types';
import { DAYS } from '@/lib/utils';
import AvailabilityForm from '@/components/availability/AvailabilityForm';

const DEFAULT_SCHEDULE: DaySchedule[] = DAYS.map((_, i) => ({
  dayOfWeek: i,
  enabled: false,
  startTime: '09:00',
  endTime: '17:00',
}));

export default function AvailabilityPage() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const fetchAvailability = useCallback(async () => {
    try {
      const res = await getAvailability();
      const data: { dayOfWeek: number; startTime: string; endTime: string; timezone: string }[] = res.data;

      const merged = DAYS.map((_, i) => {
        const existing = data.find(d => d.dayOfWeek === i);
        if (existing) {
          return { dayOfWeek: i, enabled: true, startTime: existing.startTime, endTime: existing.endTime };
        }
        return { dayOfWeek: i, enabled: false, startTime: '09:00', endTime: '17:00' };
      });

      setSchedule(merged);
      if (data.length > 0 && data[0].timezone) {
        setTimezone(data[0].timezone);
      }
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const toggleDay = (dayOfWeek: number) => {
    setSchedule(prev => prev.map(day => day.dayOfWeek === dayOfWeek ? { ...day, enabled: !day.enabled } : day));
    setErrors(prev => { const next = { ...prev }; delete next[dayOfWeek]; return next; });
    setSaved(false);
  };

  const updateTime = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => prev.map(day => day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day));
    setErrors(prev => {
      const next = { ...prev };
      const day = schedule.find(d => d.dayOfWeek === dayOfWeek)!;
      const newDay = { ...day, [field]: value };
      if (newDay.startTime >= newDay.endTime) { next[dayOfWeek] = 'End time must be after start time'; }
      else { delete next[dayOfWeek]; }
      return next;
    });
    setSaved(false);
  };

  const handleSave = async () => {
    const newErrors: Record<number, string> = {};
    schedule.forEach(day => {
      if (day.enabled && day.startTime >= day.endTime) {
        newErrors[day.dayOfWeek] = 'End time must be after start time';
      }
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setSaving(true);
    try {
      const enabledDays = schedule.filter(day => day.enabled).map(day => ({
        dayOfWeek: day.dayOfWeek, startTime: day.startTime, endTime: day.endTime, timezone,
      }));
      await saveAvailability({ availability: enabledDays });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save availability:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-7 w-40 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-72 bg-gray-200 rounded mb-8" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {[1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="h-12 bg-gray-100 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--cal-text)]">Availability</h1>
          <p className="text-gray-500 mt-1 text-sm">Set your weekly availability schedule.</p>
        </div>
      </div>

      <AvailabilityForm
        schedule={schedule}
        timezone={timezone}
        errors={errors}
        saving={saving}
        saved={saved}
        onToggleDay={toggleDay}
        onUpdateTime={updateTime}
        onTimezoneChange={(tz) => { setTimezone(tz); setSaved(false); }}
        onSave={handleSave}
      />
    </div>
  );
}
