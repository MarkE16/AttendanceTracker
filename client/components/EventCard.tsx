import { format24HourTimeTo12Hour } from "@/lib/utils";
import { Event } from "@/types";
import { Clock, MapPin, Users, Calendar } from "lucide-react";

type EventCardProps = Event;

export default function EventCard({
  id,
  title,
  description,
  meet_datetime,
  location,
  attendeeCount,
  maxAttendees,
}: EventCardProps) {
  const date = new Date(meet_datetime);
  const TIMEZONE = "UTC";
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIMEZONE,
  });

  return (
    <div className="border p-4 rounded hover:shadow-lg transition-shadow duration-200 w-full mt-3  mb-3">
      <a href={`/event?id=${id}`}>
        <h2 className="text-xl font-semibold hover:underline">{title}</h2>
        <i className="text-gray-700">{description}</i>
      </a>

      <div className="flex items-center">
        <Calendar className="size-5 inline-block text-gray-500 mr-1" />
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
    </div>
  );
}
