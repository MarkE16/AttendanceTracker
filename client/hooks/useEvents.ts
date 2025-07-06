import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Event, EventPayload } from "@/types";
import { fetchWithAuth } from "@/lib/utils";
import { ExtendedError } from "@/lib/classes/ExtendedError";

export default function useEvents() {
  return useQuery<Event[], ExtendedError>({
    queryKey: ["events"],
    queryFn: async function () {
      const response = await fetchWithAuth(`${API_URL}/events/`, {
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new ExtendedError(`Failed to fetch events: ${errorText}`, { code: response.status });
      }

      const events = (await response.json()) as EventPayload[];

      return events.map((ev) => ({ ...ev, maxAttendees: ev.max_attendees, attendeeCount: ev.attendee_count })); // convert snake_case to camelCase
    },
  });
}
