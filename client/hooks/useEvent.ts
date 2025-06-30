import { useQuery } from "@tanstack/react-query";
import type { Event, EventPayload } from "@/types";
import { API_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/utils";

export default function useEvent(id: string | null) {
  return useQuery<Event | null>({
    queryKey: ["event", id],
    queryFn: async function () {
      if (!id) {
        return null;
      }

      const response = await fetchWithAuth(`${API_URL}/events?id=${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch event with id ${id}`);
      }
      
      const event = await response.json() as EventPayload;

      return {
        ...event,
        maxAttendees: event.max_attendees, // convert snake_case to camelCase
      };
    },
  });
}
