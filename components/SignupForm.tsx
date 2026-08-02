"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/web3/useWallet";

function signupMessage(address: string, nonce: string) {
  return `Sign this message to create your OriginLock account.\n\nWallet: ${address}\nNonce: ${nonce}\n\nThis signature does not cost gas and will not be broadcast.`;
}

type Step = "connect" | "sign" | "details" | "submitting";

export default function SignupForm() {
  const wallet = useWallet();
  const router = useRouter();

  const [step, setStep] = useState<Step>("connect");
  const [nonce, setNonce] = useState<string | null>(null);
  const [signature, setSignature] = useState<`0x${string}` | null>(null);
  const [signError, setSignError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSign() {
    if (!wallet.client || !wallet.address) return;
    setSignError(null);
    const freshNonce = crypto.randomUUID();

    try {
      const sig = await wallet.client.signMessage({
        account: wallet.address,
        message: signupMessage(wallet.address, freshNonce),
      });
      setNonce(freshNonce);
      setSignature(sig);
      setStep("details");
    } catch (err) {
      setSignError(err instanceof Error ? err.message : "Signature was rejected.");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!wallet.address || !nonce || !signature) return;

    setStep("submitting");
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: wallet.address, nonce, signature, username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error ?? "Signup failed.");
        setStep("details");
        return;
      }

      // Establish the session right away so the user lands in /upload
      // already logged in, instead of having to log in a second time.
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!loginRes.ok) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setFormError("Couldn't reach the server. Try again.");
      setStep("details");
    }
  }

  return (
    <div className="w-full max-w-md space-y-5 rounded-2xl border border-white/10 bg-ink/60 p-6">
      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-fog/60">
          Step 1 — Wallet
        </label>
        {wallet.address ? (
          <div className="mt-2 flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
            <span className="font-mono text-sm text-white">
              {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
            </span>
            <span className="h-2 w-2 rounded-full bg-signal" />
          </div>
        ) : (
          <button
            type="button"
            onClick={wallet.connect}
            disabled={wallet.connecting}
            className="mt-2 w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-white/90 transition hover:border-signal disabled:opacity-60"
          >
            {wallet.connecting ? "Connecting…" : "Connect wallet"}
          </button>
        )}
        {wallet.error && <p className="mt-1 text-xs text-red-300">{wallet.error}</p>}
      </div>

      {wallet.address && !signature && (
        <div>
          <label className="block font-mono text-xs uppercase tracking-wide text-fog/60">
            Step 2 — Prove ownership
          </label>
          <p className="mt-2 text-xs text-fog/70">
            Sign a free message (no gas, no transaction) to prove you control this wallet.
          </p>
          <button
            type="button"
            onClick={handleSign}
            className="mt-3 w-full rounded-full bg-seal px-5 py-3 text-sm font-semibold text-indigo-deep transition hover:bg-seal/90"
          >
            Sign message
          </button>
          {signError && <p className="mt-2 text-xs text-red-300">{signError}</p>}
        </div>
      )}

      {signature && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block font-mono text-xs uppercase tracking-wide text-fog/60">
              Step 3 — Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              pattern="[a-zA-Z0-9_]{3,20}"
              title="3-20 characters: letters, numbers, underscore"
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
              minLength={8}
              className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-signal focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={step === "submitting"}
            className="w-full rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition hover:bg-signal/90 disabled:opacity-60"
          >
            {step === "submitting" ? "Creating account…" : "Create account"}
          </button>
          {formError && <p className="text-center text-xs text-red-300">{formError}</p>}
        </form>
      )}
    </div>
  );
}