import { API_URL } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/types";

export default function useEvents() {
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: async function() {
      const response = await fetch(`${API_URL}/events/`, {
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