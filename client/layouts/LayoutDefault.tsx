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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { fetchWithAuth } from "@/lib/utils";
import { AuthContextProvider } from "@/context/AuthContext";

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  const {
    mutateAsync: createEvent,
    isPending,
    error,
  } = useMutation<void, Error, FormData>({
    mutationFn: async function (form) {
      const response = await fetchWithAuth(`${API_URL}/events/new`, {
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
  const [date, setDate] = useState<Date | undefined>(undefined);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("date", date?.toDateString() || new Date().toDateString());

    await createEvent(formData);
    setOpen(false);

    if (window.location.href === "/") {
      window.location.reload();
    } else {
      window.location.href = "/";
    }
  }

  async function handleLogout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Logout failed: ${errorText}`);
    }

    window.location.href = "/signin";
  }

  return (
    <div className={"flex max-w-5xl m-auto"}>
      <Sidebar>
        <Logo />
        <Link href="/">Home</Link>
        <Link href="/signin">Sign In</Link>
        <Link href="/signup">Sign Up</Link>
        <hr className="mt-1 mb-1" />
        <button className="cursor-pointer text-black p-0" onClick={handleLogout}>
          Logout
        </button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={"text-blue-500 hover:underline"}>
            <button className="cursor-pointer text-black p-0">New Event</button>
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
                <Input id="title" name="title" className="w-full" placeholder="Event Title" required />
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  name="description"
                  className="w-full"
                  placeholder="Event Description"
                  required
                />

                <div className="w-full grid-cols-2 grid gap-4 mt-4">
                  <div>
                    <label htmlFor="date">Date</label>
                    <Calendar id="date" mode="single" selected={date} onSelect={setDate} />
                  </div>
                  <div>
                    <label htmlFor="time">Time</label>
                    <Input id="time" name="time" type="time" placeholder="HH:MM" required />

                    <label htmlFor="location">Location</label>
                    <Input id="location" name="location" className="w-full" placeholder="Event Location" required />

                    <label htmlFor="max_attendees">Max Attendees</label>
                    <Input
                      id="max_attendees"
                      name="max_attendees"
                      type="number"
                      className="w-full"
                      placeholder="Max Attendees"
                      min={1}
                      defaultValue={10}
                      required
                    />
                  </div>
                </div>
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
    <div id="page-container" className={"w-full"}>
      <div id="page-content" className={"p-5 pb-12 min-h-screen w-full"}>
        <AuthContextProvider>{children}</AuthContextProvider>
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
