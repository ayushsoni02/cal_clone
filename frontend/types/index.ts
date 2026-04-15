// ===== Shared TypeScript Types =====

export interface EventType {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  slug: string;
  userId: number;
  createdAt: string;
}

export interface EventTypePublic {
  id: number;
  title: string;
  description: string | null;
  duration: number;
  slug: string;
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
  createdAt: string;
  eventType: {
    id: number;
    title: string;
    slug: string;
    duration: number;
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
