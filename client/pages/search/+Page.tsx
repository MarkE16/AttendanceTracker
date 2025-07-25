import { Input } from "@/components/ui/input";
import { useState, ChangeEvent } from "react";
import useDebounce from "@/hooks/useDebounce";
import EventCard from "@/components/EventCard";
import useSearchEvents from "@/hooks/useSearchEvents";

export default function Page() {
  const [query, setQuery] = useState("");
  const { data: results = [], isPending, error } = useSearchEvents(query);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  if (error) {
    return <div className="text-red-500">Error loading search results: {error.message}</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Search</h1>
      <Input placeholder="Event Name" value={query} onChange={handleInputChange} />
      <div className="mt-4">
        {isPending && results.length === 0 ? (
          <p className="text-gray-500">Loading...</p>
        ) : query.length > 0 && results.length > 0 ? (
          <ul>
            {results.map((result, index) => (
              <EventCard key={result.id} {...result} />
            ))}
          </ul>
        ) : query.length > 0 && results.length === 0 ? (
          <p className="text-gray-500">No results found</p>
        ) : (
          <p className="text-gray-500">Start typing to search for events</p>
        )}
      </div>
    </>
  );
}
