
"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to subscribe right now.");
      }

      setStatus("success");
      setMessage(result.message || "You're subscribed! Look out for our latest updates.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="mx-auto mt-8 max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Your email address
        </label>

        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          maxLength={254}
          disabled={status === "loading"}
          className="min-w-0 flex-1 rounded-full border border-[#DCE2EA] bg-white px-5 py-4 text-sm outline-none transition placeholder:text-[#8A96A8] focus:border-[#3976D8] focus:ring-2 focus:ring-[#3976D8]/15 disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-[#14233B] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#263D60] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className={`mt-4 text-sm ${
            status === "error" ? "text-red-600" : "text-[#315B9A]"
          }`}
        >
          {message}
        </p>
      )}

      <p className="mt-4 text-xs leading-6 text-[#7B8798]">
        Get practical money insights and new articles in your inbox.
        You can unsubscribe from the newsletter when you no longer want updates.
      </p>
    </div>
  );
}
