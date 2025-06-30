export type Event = {
  id: string;
  title: string;
  description: string;
  date: string; // date string
  time: string; // time string
  location: string;
  maxAttendees: number;
};

export type EventPayload = Omit<Event, "maxAttendees"> & {
  max_attendees: number; // using snake_case for API compatibility
}