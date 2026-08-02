"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AccountPanel({ currentUsername }: { currentUsername: string }) {
  const router = useRouter();

  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState(false);

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  async function handleUsernameSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUsernameSaving(true);
    setUsernameError(null);
    setUsernameSuccess(false);

    const formData = new FormData(e.currentTarget);
    const newUsername = formData.get("newUsername") as string;

    try {
      const res = await fetch("/api/account/username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUsername }),
      });
      const data = await res.json();

      if (!res.ok) {
        setUsernameError(data.error ?? "Could not update username.");
        setUsernameSaving(false);
        return;
      }

      setUsernameSuccess(true);
      setUsernameSaving(false);
      router.refresh();
    } catch {
      setUsernameError("Couldn't reach the server.");
      setUsernameSaving(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords don't match.");
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error ?? "Could not update password.");
        setPasswordSaving(false);
        return;
      }

      setPasswordSuccess(true);
      setPasswordSaving(false);
      (e.target as HTMLFormElement).reset();
    } catch {
      setPasswordError("Couldn't reach the server.");
      setPasswordSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-ink/60 p-6">
        <h2 className="font-display text-base font-medium text-white">Username</h2>
        <p className="mt-1 text-xs text-fog/60">
          Currently <span className="font-mono text-white">{currentUsername}</span>
        </p>
        <form onSubmit={handleUsernameSubmit} className="mt-4 flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="newUsername" className="block font-mono text-xs uppercase tracking-wide text-fog/60">
              New username
            </label>
            <input
              id="newUsername"
              name="newUsername"
              type="text"
              required
              pattern="[a-zA-Z0-9_]{3,20}"
              title="3-20 characters: letters, numbers, underscore"
              className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-signal focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={usernameSaving}
            className="rounded-full bg-signal px-5 py-2 text-sm font-semibold text-white transition hover:bg-signal/90 disabled:opacity-60"
          >
            {usernameSaving ? "Saving…" : "Save"}
          </button>
        </form>
        {usernameError && <p className="mt-2 text-xs text-red-300">{usernameError}</p>}
        {usernameSuccess && <p className="mt-2 text-xs text-signal">Username updated.</p>}
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink/60 p-6">
        <h2 className="font-display text-base font-medium text-white">Password</h2>
        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block font-mono text-xs uppercase tracking-wide text-fog/60">
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-signal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block font-mono text-xs uppercase tracking-wide text-fog/60">
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-signal focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block font-mono text-xs uppercase tracking-wide text-fog/60">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-signal focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={passwordSaving}
            className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-signal/90 disabled:opacity-60"
          >
            {passwordSaving ? "Saving…" : "Update password"}
          </button>
          {passwordError && <p className="text-xs text-red-300">{passwordError}</p>}
          {passwordSuccess && <p className="text-xs text-signal">Password updated.</p>}
        </form>
      </div>
    </div>
  );
}