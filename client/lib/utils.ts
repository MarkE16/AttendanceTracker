import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function format24HourTimeTo12Hour(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include", // Include cookies for authentication
  });

  if (!response.ok && response.status === 401) {
    // Attempt to refresh the session
    await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    // Retry the original request after refreshing the session (if successful)
    return fetch(url, {
      ...options,
      credentials: "include", // Include cookies for authentication
    });
  }
  return response;
}
