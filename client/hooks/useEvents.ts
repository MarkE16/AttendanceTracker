import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Event, EventPayload } from "@/types";
import { fetchWithAuth } from "@/lib/utils";

export default function useEvents() {
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async function() {
      const response = await fetchWithAuth(`${API_URL}/events/`, {
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch events: ${errorText}`);
      }

      const events = await response.json() as EventPayload[];
      
      return events.map(ev => ({ ...ev, maxAttendees: ev.max_attendees })); // convert snake_case to camelCase
    }
  });
}