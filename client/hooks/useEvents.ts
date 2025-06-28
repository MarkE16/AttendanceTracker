import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";

export default function useEvents(userId: string) {
  return useQuery({
    queryKey: ["events", userId],
    queryFn: async function() {
      const response = await fetch(`${API_URL}/events/${userId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch events: ${errorText}`);
      }

      return response.json();
    }
  });
}