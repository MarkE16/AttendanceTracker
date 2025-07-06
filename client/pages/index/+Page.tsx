import EventCard from "@/components/EventCard";
import useEvents from "@/hooks/useEvents";

export default function Page() {
  const { data: events = [], isPending, error } = useEvents();

  if (error) {
    let message = error.code === 401 ? "Auth session invalid. Please log in again." : error.message;
    return <div className="text-red-500">Error loading events: {message}</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (events.length === 0) {
    return <div>No events found.</div>;
  }

  return (
    <>
      <h1 className={"font-bold text-3xl pb-4"}>My Events</h1>
      {events.map((ev) => (
        <EventCard key={ev.id} {...ev} />
      ))}
    </>
  );
}
