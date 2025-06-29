import { usePageContext } from "vike-react/usePageContext";

export function useQueryParams() {
  const ctx = usePageContext();

  if (typeof window === "undefined") {
    return new URLSearchParams(ctx.urlParsed.search);
  }

  return new URLSearchParams(window.location.search);
}
