import { ChangeEvent, useEffect, useState } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";
import useEvent from "@/hooks/useEvent";
import { Clock, MapPin, Users, Calendar as CaendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { fetchWithAuth, format12HourTimeTo24Hour } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import useAttendees from "@/hooks/useAttendees";
import { API_URL } from "@/lib/constants";
import { Event } from "@/types";

export default function Page() {
  const params = useQueryParams();
  const id = params.get("id");
  const { data, isPending, error } = useEvent(id);
  const [editing, setEditing] = useState<boolean>(false);
  const user = useAuth();
  const { data: attendees = [] } = useAttendees(id);
  const [rsvp, setRsvp] = useState<boolean>(false);
  const { mutateAsync: rsvpEvent, isPending: isRSVPing } = useMutation({
    mutationFn: async function (newRsvp: boolean) {
      if (!user || !id) {
        throw new Error("User must be logged in to RSVP.");
      }

      const response = await fetchWithAuth(`${API_URL}/events/rsvp/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to RSVP for the event.");
      }

      return response.json();
    },
  });
  const { mutateAsync: updateEvent, isPending: isUpdating } = useMutation({
    mutationFn: async function (eventData: Omit<Event, "id" | "user_id" | "attendeeCount">) {
      if (!user || !id) {
        throw new Error("User must be logged in to update the event.");
      }

      const response = await fetchWithAuth(`${API_URL}/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...eventData,
          user_id: user.id,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Failed to update the event: " + errorText);
      }

      return response.json();
    },
  });
  const [editState, setEditState] = useState<Omit<Event, "id" | "user_id" | "attendeeCount">>({
    title: "",
    description: "",
    meet_datetime: "",
    location: "",
    maxAttendees: 0,
  });
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (data) {
      setEditState({
        title: data.title,
        description: data.description,
        meet_datetime: data.meet_datetime,
        location: data.location,
        maxAttendees: data.maxAttendees,
      });
      setCalendarDate(new Date(data.meet_datetime));
    }
  }, [data]);

  useEffect(() => {
    const s = new Set(attendees);

    setRsvp(s.has(user?.id || ""));
  }, [attendees, user]);

  if (error) {
    let message = error.code === 401 ? "Auth session invalid. Please log in again." : error.message;
    return <div className="text-red-500">Error loading event: {message}</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div className="text-red-500">Event not found.</div>;
  }

  const { title, description, meet_datetime, location, maxAttendees } = editState;
  const attendeeCount = attendees.length;
  const owner_id = data.user_id;
  const date = new Date(meet_datetime);
  const TIMEZONE = "UTC";
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE,
  });
  const formattedTime = format12HourTimeTo24Hour(time);

  async function toggleEditing() {
    if (editing) {
      try {
        await updateEvent({
          ...editState,
          date: calendarDate ? calendarDate.toISOString() : new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to update event:", error);
        alert((error as Error).message);
        return;
      }
    }
    setEditing((prev) => !prev);
  }

  function handleEditChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    
    if (name === "time") {
      //...
    }
    
    setEditState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function onDateChange(date: Date | undefined) {
    if (date) {
      setCalendarDate(date);
      setEditState((prev) => ({
        ...prev,
        date: date.toISOString().split("T")[0],
      }));
    } else {
      setCalendarDate(undefined);
      setEditState((prev) => ({
        ...prev,
        date: "",
      }));
    }
  }

  async function handleRSVP() {
    if (!user) {
      console.error("User must be logged in to RSVP.");
      return;
    }

    try {
      await rsvpEvent(!rsvp);
      setRsvp((prev) => !prev);
    } catch (error) {
      console.error("Failed to RSVP:", error);
    }
  }

  const eventDetails = editing ? (
    <>
      <div className="mb-2">
        <label>Event Date</label>
        <Calendar
          className="mr-2 w-[30%]"
          mode="single"
          selected={calendarDate}
          onSelect={onDateChange}
          disabled={isUpdating}
        />

        <label className="ml-2" htmlFor="time">
          Event Time
        </label>
        <Input
          type="time"
          name="time"
          className="w-[30%] ml-2"
          value={formattedTime}
          onChange={handleEditChange}
          disabled={isUpdating}
        />

        <label className="ml-2" htmlFor="location">
          Event Location
        </label>
        <Input
          type="text"
          name="location"
          className="w-[30%] ml-2"
          value={editState.location}
          onChange={handleEditChange}
          placeholder="Event Location"
          disabled={isUpdating}
        />

        <label className="ml-2" htmlFor="maxAttendees">
          Max Attendees
        </label>
        <Input
          type="number"
          name="maxAttendees"
          className="w-[30%] ml-2"
          value={editState.maxAttendees}
          onChange={handleEditChange}
          disabled={isUpdating}
        />
      </div>

      <label htmlFor="description">Description</label>
      <Textarea
        id="description"
        name="description"
        className="mb-2"
        value={editState.description}
        onChange={handleEditChange}
        disabled={isUpdating}
        placeholder="Event Description"
      />
    </>
  ) : (
    <>
      <div className="flex items-center">
        <CaendarIcon className="size-5 inline-block text-gray-500 mr-1" />
        <span className="text-gray-500 mr-2">{date.toLocaleDateString()}</span>

        <Clock className="size-5 inline-block text-gray-500 mr-1" />
        <span className="text-gray-500 mr-2">
          {time} {TIMEZONE}
        </span>

        <MapPin className="size-5 inline-block text-gray-500 mr-1" />
        <span className="text-gray-500 mr-2">{location}</span>

        <Users className="size-5 text-gray-500 inline-block mr-1" />
        <span className="text-gray-500">
          {attendeeCount}/{maxAttendees}
        </span>
      </div>

      <i>{description}</i>
    </>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-1">
        {editing ? (
          <Input
            className="mr-2"
            type="text"
            name="title"
            value={editState.title}
            onChange={handleEditChange}
            placeholder="Event Title"
          />
        ) : (
          <h1 className="font-bold text-3xl">{title}</h1>
        )}

        {user && user.id === owner_id ? (
          <Button variant="outline" onClick={toggleEditing} disabled={isUpdating}>
            {editing ? "Save Changes" : "Edit Event"}
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <Button variant="outline" disabled={!user} onClick={handleRSVP}>
                {rsvp ? "Cancel RSVP" : "RSVP"}
                {isRSVPing && <span className="ml-2">...</span>}
              </Button>

              <TooltipContent>
                {user && rsvp
                  ? "Cancel RSVP to this event"
                  : user && !rsvp
                    ? "RSVP to this event"
                    : "You must be logged in to RSVP"}
                .
              </TooltipContent>
            </TooltipTrigger>
          </Tooltip>
        )}
      </div>
      <hr className="mt-1 mb-1" />

      {eventDetails}
    </>
  );
} // event/2fb15670-ee01-4c6d-81cb-87cbacb8d192
