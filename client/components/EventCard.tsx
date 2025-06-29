import { Event } from "@/types";

type EventCardProps = Event;

export default function EventCard({ id, title }: EventCardProps) {
  return (
    <a href={`/event?id=${id}`} className="mb-4 p-4 border rounded">
      <h2 className="text-xl font-semibold">{title}</h2>
      {/* Additional event details can be added here */}
      <p className="text-gray-500">Event ID: {id}</p>
    </a>
  );
}
