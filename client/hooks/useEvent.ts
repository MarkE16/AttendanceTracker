import { useQuery } from "@tanstack/react-query";
import type { Event, EventPayload } from "@/types";
import { API_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/utils";
import { ExtendedError } from "@/lib/classes/ExtendedError";

export default function useEvent(id: string | null) {
  return useQuery<Event | null, ExtendedError>({
    queryKey: ["event", id],
    queryFn: async function () {
      if (!id) {
        return null;
      }

      const response = await fetchWithAuth(`${API_URL}/events/${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new ExtendedError(`Failed to fetch event with id ${id}`, { code: response.status });
      }

      const event = (await response.json()) as EventPayload;

      return {
        ...event,
        maxAttendees: event.max_attendees, // convert snake_case to camelCase
        attendeeCount: event.attendee_count, // convert snake_case to camelCase
      };
    },
  });
}
