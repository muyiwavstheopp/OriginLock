"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        setSubmitting(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-ink/60 p-6"
    >
      <div>
        <label htmlFor="username" className="block font-mono text-xs uppercase tracking-wide text-fog/60">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-signal focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="password" className="block font-mono text-xs uppercase tracking-wide text-fog/60">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-signal focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition hover:bg-signal/90 disabled:opacity-60"
      >
        {submitting ? "Logging in…" : "Log in"}
      </button>
      {error && <p className="text-center text-xs text-red-300">{error}</p>}
    </form>
  );
}