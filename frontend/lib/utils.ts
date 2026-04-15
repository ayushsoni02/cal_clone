import { format } from 'date-fns';

// ===== Date / Time Utilities =====

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Generate time options every 30 minutes from 00:00 to 23:30
 */
export function generateTimeOptions(): string[] {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return times;
}

export const TIME_OPTIONS = generateTimeOptions();

/**
 * Format 24h time string to 12h display (e.g. "09:00" → "9:00 AM")
 */
export function formatTime12h(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

/**
 * Slugify a text string for URL usage
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get duration-based color for event type cards
 */
export function getDurationColor(duration: number): string {
  switch (duration) {
    case 15: return '#3B82F6';
    case 30: return '#22C55E';
    case 60: return '#7C3AED';
    case 45: return '#F59E0B';
    case 90: return '#EF4444';
    case 120: return '#EC4899';
    default: return '#6B7280';
  }
}

/**
 * Get Tailwind badge class based on duration
 */
export function getDurationBadgeClasses(duration: number): string {
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

/**
 * List of common timezones
 */
export const TIMEZONES = [
  'Asia/Kolkata',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Auckland',
];
