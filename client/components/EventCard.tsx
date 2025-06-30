import { format24HourTimeTo12Hour } from "@/lib/utils";
import { Event } from "@/types";

type EventCardProps = Event;

export default function EventCard({ id, title, description, date, time, location, maxAttendees }: EventCardProps) {
  return (
    <a href={`/event?id=${id}`} className="mb-4 p-4 border rounded">
      <h2 className="text-xl font-semibold">{title}</h2>
      <i className="text-gray-700">{description}</i>
      <p className="text-gray-500">Date: {new Date(date).toLocaleDateString()}</p>
      <p className="text-gray-500">Time: {format24HourTimeTo12Hour(time)}</p>
      <p className="text-gray-500">Location: {location}</p>
      <p className="text-gray-500">Max Attendees: {maxAttendees}</p>
      <p className="text-gray-500">Event ID: {id}</p>
    </a>
  );
}
