import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/constants';
import { Event, EventPayload } from '@/types';
import useDebounce from './useDebounce';
import { ExtendedError } from '@/lib/classes/ExtendedError';

export default function useSearchEvents(query: string) {
  const debouncedQuery = useDebounce(query, 500);
  
  return useQuery<Event[], Error>({
    queryKey: ['search', debouncedQuery],
    queryFn: async function () {
      if (!debouncedQuery) return [];
      
      const response = await fetch(`${API_URL}/events/search?query=${encodeURIComponent(debouncedQuery)}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new ExtendedError(`Failed to fetch events: ${errorText}`, { code: response.status });
      }

      const events = (await response.json()) as EventPayload[];

      return events.map((ev) => ({ ...ev, maxAttendees: ev.max_attendees, attendeeCount: ev.attendee_count })); // convert snake_case to camelCase
    }
  });
}