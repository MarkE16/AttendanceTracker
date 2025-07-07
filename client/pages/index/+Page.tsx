import EventCard from "@/components/EventCard";
import useAuth from "@/hooks/useAuth";
import useEvents from "@/hooks/useEvents";

export default function Page() {
  const { data: events = [], isPending, error } = useEvents();
  const auth = useAuth();

  if (error) {
    let message = error.code === 401 ? "Auth session invalid. Please log in again." : error.message;
    return <div className="text-red-500">Error loading events: {message}</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (events.length === 0) {
    return (
      <>
        <h1 className={"font-bold text-3xl pb-4"}>Hello, {auth?.name ?? "User"}.</h1>
        <div className="text-gray-500">No events found. Please create an event.</div>
      </>
    );
  }

  return (
    <>
      <h1 className={"font-bold text-3xl pb-4"}>{auth?.name ?? "User"}&apos;s Events.</h1>
      {events.map((ev) => (
        <EventCard key={ev.id} {...ev} />
      ))}
    </>
  );
}
