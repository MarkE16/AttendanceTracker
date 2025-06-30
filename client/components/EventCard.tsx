import { format24HourTimeTo12Hour } from "@/lib/utils";
import { Event } from "@/types";
import { Clock, MapPin, Users, Calendar } from "lucide-react";

type EventCardProps = Event;

export default function EventCard({ id, title, description, date, time, location, maxAttendees }: EventCardProps) {
  return (
    <div>
      <a href={`/event?id=${id}`} className="mb-4 p-4 rounded">
        <h2 className="text-xl font-semibold hover:underline">{title}</h2>
        <i className="text-gray-700">{description}</i>
      </a>

      <div>
        <Calendar className="size-5 inline-block text-gray-500" />
        <span className="text-gray-500 mr-2">{new Date(date).toLocaleDateString()}</span>

        <Clock className="size-5 inline-block text-gray-500" />
        <span className="text-gray-500 mr-2">{format24HourTimeTo12Hour(time)}</span>

        <MapPin className="size-5 inline-block text-gray-500" />
        <span className="text-gray-500 mr-2">{location}</span>

        <Users className="size-5 text-gray-500 inline-block" />
        <span className="text-gray-500">{maxAttendees}</span>
      </div>
    </div>
  );
}
