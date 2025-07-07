export type Event = {
  id: string;
  user_id: string; // user ID of the event creator
  title: string;
  description: string;
  meet_datetime: string; // ISO date string
  location: string;
  maxAttendees: number;
  attendeeCount: number; // current number of attendees
};

export type EventPayload = Omit<Event, "maxAttendees" | "attendeeCount"> & {
  max_attendees: number; // using snake_case for API compatibility
  attendee_count: number; // using snake_case for API compatibility
};
