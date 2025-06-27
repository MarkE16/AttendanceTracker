import "./style.css";

import "./tailwind.css";
import logoUrl from "../assets/logo.svg";
import { Link } from "../components/Link.js";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { API_URL } from "@/lib/constants";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  const {
    mutateAsync: createEvent,
    isPending,
    error,
  } = useMutation<void, Error, FormData>({
    mutationFn: async function (form) {
      const response = await fetch(`${API_URL}/events/new`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create event: ${errorText}`);
      }

      return response.json();
    },
  });
  const [open, setOpen] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;

    await createEvent(formData);
    setOpen(false);
  }

  return (
    <div className={"flex max-w-5xl m-auto"}>
      <Sidebar>
        <Logo />
        <Link href="/">Welcome</Link>
        <Link href="/todo">Todo</Link>
        <button></button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={"text-blue-500 hover:underline"}>
            <button>New Event</button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
                <DialogDescription>
                  Provide details for your event.
                  <br />
                  {error && <>Error: {error.message}</>}
                </DialogDescription>
              </DialogHeader>
              <div>
                <label htmlFor="title">Title</label>
                <Input id="title" name="title" className={"w-full"} placeholder="Event Title" />
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button disabled={isPending}>Close</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Link href="/star-wars">Data Fetching</Link>
      </Sidebar>
      <Content>{children}</Content>
    </div>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div id="sidebar" className={"p-5 flex flex-col shrink-0 border-r-2 border-r-gray-200"}>
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container">
      <div id="page-content" className={"p-5 pb-12 min-h-screen"}>
        {children}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className={"p-5 mb-2"}>
      <a href="/">
        <img src={logoUrl} height={64} width={64} alt="logo" />
      </a>
    </div>
  );
}
