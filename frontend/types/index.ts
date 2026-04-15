// ===== Shared TypeScript Types =====

export interface EventType {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  bufferMinutes?: number;
  slug: string;
  userId: number;
  questions?: { id: string; label: string; required: boolean }[];
  createdAt: string;
}

export interface EventTypePublic {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  bufferMinutes?: number;
  slug: string;
  questions?: { id: string; label: string; required: boolean }[];
  user: {
    id: number;
    username: string;
    name: string;
  };
}

export interface Booking {
  id: number;
  eventTypeId: number;
  bookerName: string;
  bookerEmail: string;
  startTime: string;
  endTime: string;
  status: string;
  responses?: any;
  createdAt: string;
  eventType: {
    id: number;
    title: string;
    slug: string;
    duration: number;
    questions?: any;
  };
}

export interface AvailabilityDay {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface DaySchedule {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface Slot {
  time: string;
  datetime: string;
}
