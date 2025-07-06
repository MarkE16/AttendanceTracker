import { useEffect, useState } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";
import useEvent from "@/hooks/useEvent";
import { Clock, MapPin, Users, Calendar as CaendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { fetchWithAuth, format24HourTimeTo12Hour } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import useAttendees from "@/hooks/useAttendees";
import { API_URL } from "@/lib/constants";

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

  useEffect(() => {
    console.log(attendees);
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

  const { title, description, date, time, location, attendeeCount, maxAttendees, user_id: owner_id } = data;

  function toggleEditing() {
    setEditing((prev) => !prev);
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
        <Calendar className="mr-2 w-[30%]" />

        <label className="ml-2">Event Time</label>
        <Input
          type="time"
          className="w-[30%] ml-2"
          defaultValue={time}
          onBlur={(e) => {
            // Handle time update logic here
            console.log("Updated time:", e.target.value);
          }}
        />

        <label className="ml-2">Event Location</label>
        <Input
          className="w-[30%] ml-2"
          defaultValue={location}
          onBlur={(e) => {
            // Handle location update logic here
            console.log("Updated location:", e.target.value);
          }}
        />

        <label className="ml-2">Max Attendees</label>
        <Input
          type="number"
          className="w-[30%] ml-2"
          defaultValue={maxAttendees}
          onBlur={(e) => {
            // Handle max attendees update logic here
            console.log("Updated max attendees:", e.target.value);
          }}
        />
      </div>

      <label htmlFor="description">Description</label>
      <Textarea
        id="description"
        name="description"
        className="mb-2"
        defaultValue={description}
        onBlur={(e) => {
          // Handle description update logic here
          console.log("Updated description:", e.target.value);
        }}
      />
    </>
  ) : (
    <>
      <div className="flex items-center">
        <CaendarIcon className="size-5 inline-block text-gray-500 mr-1" />
        <span className="text-gray-500 mr-2">{new Date(date).toLocaleDateString()}</span>

        <Clock className="size-5 inline-block text-gray-500 mr-1" />
        <span className="text-gray-500 mr-2">{format24HourTimeTo12Hour(time)}</span>

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
            defaultValue={title}
            onBlur={(e) => {
              // Handle title update logic here
              console.log("Updated title:", e.target.value);
            }}
          />
        ) : (
          <h1 className="font-bold text-3xl">{title}</h1>
        )}

        {user && user.id === owner_id ? (
          <Button variant="outline" onClick={toggleEditing}>
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
