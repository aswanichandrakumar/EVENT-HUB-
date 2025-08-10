import heroConference from '@/assets/hero-conference.jpg';
import collegeFest from '@/assets/college-fest.jpg';
import webinar from '@/assets/webinar.jpg';
import sportsEvent from '@/assets/sports-event.jpg';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  registered: number;
  type: string;
  price: 'Free' | number;
  image: string;
  longDescription?: string;
  features?: string[];
  organizer?: string;
}

export const mockEvents: Event[] = [
  // Demo data removed - events will be loaded from database
];

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

export const getEventsByType = (type: Event['type']): Event[] => {
  return mockEvents.filter(event => event.type === type);
};

export const getFeaturedEvents = (): Event[] => {
  return mockEvents.slice(0, 3);
};

// Helper to map Supabase `events` rows to our `Event` interface
export const mapSupabaseEventToEvent = (row: {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  date: string;
  time: string;
  location: string;
  price: string;
  capacity: number;
  registered: number;
  image: string | null;
  features: string[] | null;
}): Event => {
  const parsedPrice = row.price?.toLowerCase?.() === 'free'
    ? 'Free'
    : (isNaN(Number(row.price)) ? 'Free' : Number(row.price));

  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    date: row.date,
    time: row.time,
    location: row.location,
    capacity: row.capacity ?? 100,
    registered: row.registered ?? 0,
    type: row.event_type || 'Event',
    price: parsedPrice as 'Free' | number,
    image: row.image || '/placeholder.svg',
    features: row.features || undefined,
  };
};