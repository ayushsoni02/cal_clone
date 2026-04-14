import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({ baseURL: BASE });

// Event Types
export const getEventTypes = () => api.get('/event-types');
export const createEventType = (data: any) => api.post('/event-types', data);
export const updateEventType = (id: number, data: any) => api.put(`/event-types/${id}`, data);
export const deleteEventType = (id: number) => api.delete(`/event-types/${id}`);

// Availability
export const getAvailability = () => api.get('/availability');
export const saveAvailability = (data: any) => api.put('/availability', data);

// Bookings
export const getBookings = () => api.get('/bookings');
export const getSlots = (eventTypeId: number, date: string) =>
  api.get(`/bookings/slots?eventTypeId=${eventTypeId}&date=${date}`);
export const createBooking = (data: any) => api.post('/bookings', data);
export const cancelBooking = (id: number) => api.patch(`/bookings/${id}/cancel`);

// Public
export const getPublicEventType = (username: string, slug: string) =>
  api.get(`/public/${username}/${slug}`);
