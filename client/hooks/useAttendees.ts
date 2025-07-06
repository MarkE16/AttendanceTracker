import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/lib/utils";

export default function useAttendees(eventId: string | null) {
  return useQuery<string[]>({
    queryKey: ["attendees", eventId],
    queryFn: async function () {
      if (!eventId) {
        return [];
      }

      const response = await fetchWithAuth(`${API_URL}/events/attendance/${eventId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch attendees for event ${eventId}`);
      }

      const attendees = await response.json();
      return attendees;
    },
  });
}
