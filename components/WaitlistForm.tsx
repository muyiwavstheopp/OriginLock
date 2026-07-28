"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "pending" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("pending");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "You're on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Couldn't reach the server. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-full bg-mist px-6 py-3.5 text-sm font-medium text-indigo-deep shadow-glass">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="9" fill="#4F7CFF" />
          <path d="M5 9.5l2.5 2.5L13 6.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex items-center gap-1 rounded-full bg-mist p-1.5 shadow-glass">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-sm text-indigo-deep placeholder:text-indigo-deep/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "pending"}
          className="whitespace-nowrap rounded-full bg-indigo-deep px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-signal disabled:opacity-60"
        >
          {status === "pending" ? "Joining…" : "Join waitlist"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-center text-xs text-red-300">{message}</p>
      )}
    </form>
  );
}