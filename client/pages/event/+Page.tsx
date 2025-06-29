import { useQueryParams } from "@/hooks/useQueryParams";
import useEvent from "@/hooks/useEvent";

export default function Page() {
  const params = useQueryParams();
  const id = params.get("id");
  const { data, isPending, error } = useEvent(id);

  if (error) {
    return <div className="text-red-500">Error loading event: {error.message}</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div className="text-red-500">Event not found.</div>;
  }

  return (
    <>
      <h1 className="font-bold text-3xl pb-4">{data.title}</h1>
      {/* <p>{data.description}</p> */}
      <p className="text-gray-500">Event ID: {data.id}</p>
      {/* Additional event details can be displayed here */}
    </>
  );
}
