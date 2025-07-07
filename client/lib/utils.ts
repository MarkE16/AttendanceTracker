import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_URL } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function format12HourTimeTo24Hour(time: string): string {
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (modifier === "PM" && hours < 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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
