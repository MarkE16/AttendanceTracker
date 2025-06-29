import { useQuery } from "@tanstack/react-query";
import type { Event } from "@/types";
import { API_URL } from "@/lib/constants";

export default function useEvent(id: string | null) {
  return useQuery<Event | null>({
    queryKey: ["event", id],
    queryFn: async function () {
      if (!id) {
        return null;
      }

      const response = await fetch(`${API_URL}/events?id=${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch event with id ${id}`);
      }

      return response.json();
    },
  });
}
