import { useState, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  const {
    mutateAsync: signUp,
    error,
    isPending,
  } = useMutation<void, Error, FormData>({
    mutationFn: async function (formData) {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sign up failed: ${errorText}`);
      }

      return response.json();
    },
  });
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await signUp(formData);
      window.location.href = "/signin";
    } catch (error) {
      console.error("Sign up error:", error);
    }
  }
  return (
    <>
      <h1 className="text-2xl font-bold">Sign Up</h1>
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <Input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <Input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <Input type="password" id="password" name="password" required />
        </div>
        <Button type="submit" disabled={isPending}>
          Sign In
        </Button>
      </form>
    </>
  );
}
