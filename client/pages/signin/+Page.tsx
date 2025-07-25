import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { FormEvent } from "react";
import { API_URL } from "@/lib/constants";

export default function Page() {
  const {
    mutateAsync: signIn,
    error,
    isPending,
  } = useMutation<void, Error, FormData>({
    mutationFn: async function (formData) {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sign in failed: ${errorText}`);
      }

      return response.json();
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await signIn(formData);
      window.location.href = "/";
    } catch (error) {
      console.error("Sign in error:", error);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Sign In</h1>
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      <form onSubmit={handleSubmit}>
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
