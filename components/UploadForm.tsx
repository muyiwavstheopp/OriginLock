"use client";

import { useState, FormEvent, useRef } from "react";
import { useWallet } from "@/lib/web3/useWallet";
import { ORIGIN_LOCK_ABI, ORIGIN_LOCK_ADDRESS, SEPOLIA_USDC_ADDRESS } from "@/lib/web3/contract";

type UploadStatus = "idle" | "pending" | "success" | "error";
type ChainStatus = "idle" | "pending" | "success" | "error";

interface UploadResult {
  id: string;
  contentHash: string;
  mediaKind: string;
  subtype: string;
  description: string;
}

function truncate(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

interface UploadFormProps {
  // The wallet address permanently tied to this account at signup.
  // Used only to gate the on-chain registration step below.
  accountWalletAddress: string;
}

export default function UploadForm({ accountWalletAddress }: UploadFormProps) {
  const wallet = useWallet();

  const walletMismatch =
    !!wallet.address && wallet.address.toLowerCase() !== accountWalletAddress.toLowerCase();

  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadMessage, setUploadMessage] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [pricePerUseSmallestUnit, setPricePerUseSmallestUnit] = useState<bigint>(BigInt(0));

  const [chainStatus, setChainStatus] = useState<ChainStatus>("idle");
  const [chainMessage, setChainMessage] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setUploadStatus("pending");
    setUploadMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!(formData.get("file") as File)?.size) {
      setUploadStatus("error");
      setUploadMessage("Choose a file first.");
      return;
    }

    const dollarAmount = parseFloat(formData.get("pricePerUse") as string);
    const smallestUnit = BigInt(Math.round((isNaN(dollarAmount) ? 0 : dollarAmount) * 1_000_000));
    formData.set("pricePerUse", smallestUnit.toString());

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setUploadStatus("error");
        setUploadMessage(data.error ?? "Upload failed. Try again.");
        return;
      }

      setUploadStatus("success");
      setResult(data.record);
      setPricePerUseSmallestUnit(smallestUnit);
      formRef.current?.reset();
    } catch {
      setUploadStatus("error");
      setUploadMessage("Couldn't reach the server. Try again.");
    }
  }

  async function handleRegisterOnChain() {
    if (!wallet.client || !wallet.address || !result) return;

    if (walletMismatch) {
      setChainStatus("error");
      setChainMessage(
        `Connected wallet doesn't match your account's registered wallet (${truncate(accountWalletAddress)}). Switch accounts in MetaMask and try again.`
      );
      return;
    }

    if (!ORIGIN_LOCK_ADDRESS) {
      setChainStatus("error");
      setChainMessage("Contract address isn't configured (NEXT_PUBLIC_ORIGINLOCK_CONTRACT_ADDRESS is missing).");
      return;
    }

    setChainStatus("pending");
    setChainMessage("");

    try {
      const hash = await wallet.client.writeContract({
        account: wallet.address,
        address: ORIGIN_LOCK_ADDRESS,
        abi: ORIGIN_LOCK_ABI,
        functionName: "register",
        args: [`0x${result.contentHash}` as `0x${string}`, SEPOLIA_USDC_ADDRESS, pricePerUseSmallestUnit],
        chain: wallet.client.chain,
        gas: BigInt(300000),
      });

      setTxHash(hash);
      setChainStatus("success");

      // Persist on-chain status so this doesn't get lost if the user
      // navigates away — this is what lets the dashboard show/retry
      // registration later instead of only right after upload.
      await fetch(`/api/content/${result.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onchainRegistered: true, onchainTxHash: hash }),
      }).catch(() => {
        // Non-fatal: the on-chain transaction already succeeded regardless.
        // Worst case, the dashboard still shows this as unregistered and
        // the creator can safely retry — recordUsage would just confirm
        // AlreadyRegistered on-chain if they somehow tried register() again.
      });
    } catch (err: any) {
      setChainStatus("error");
      const msg = err?.shortMessage || err?.message || "Transaction failed.";
      setChainMessage(msg.includes("AlreadyRegistered") ? "This content is already registered on-chain." : msg);
    }
  }

  function uploadAnother() {
    setUploadStatus("idle");
    setResult(null);
    setUploadMessage("");
    setChainStatus("idle");
    setChainMessage("");
    setTxHash(null);
  }

  if (uploadStatus === "success" && result) {
    return (
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-ink/60 p-6">
        <div className="flex items-center gap-2 text-signal">
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.15" />
            <path d="M5 9.5l2.5 2.5L13 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-sm font-medium">Registered in database</span>
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-fog/60">Media type</dt>
            <dd className="mt-0.5 text-white">{result.mediaKind} — {result.subtype}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-fog/60">Description</dt>
            <dd className="mt-0.5 text-fog">{result.description}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-fog/60">Content hash</dt>
            <dd className="mt-0.5 break-all font-mono text-xs text-fog">{result.contentHash}</dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-white/10 pt-5">
          {chainStatus === "success" && txHash ? (
            <div className="flex items-center gap-2 text-signal">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.15" />
                <path d="M5 9.5l2.5 2.5L13 6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <p className="font-display text-sm font-medium">Registered on-chain</p>
                
                <a  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block break-all font-mono text-xs text-signal underline"
                >
                  View transaction ↗
                </a>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs text-fog/60">
                This is only saved to the database so far. To make it enforceable on-chain,
                connect the wallet tied to your account ({truncate(accountWalletAddress)}) and
                sign a transaction registering it on OriginLock&apos;s Sepolia contract.
              </p>

              {!wallet.address ? (
                <button
                  type="button"
                  onClick={wallet.connect}
                  disabled={wallet.connecting}
                  className="mt-3 w-full rounded-lg border border-white/15 px-3 py-2 text-sm text-white/90 transition hover:border-signal disabled:opacity-60"
                >
                  {wallet.connecting ? "Connecting…" : "Connect wallet"}
                </button>
              ) : walletMismatch ? (
                <p className="mt-3 text-center text-xs text-red-300">
                  Connected wallet ({truncate(wallet.address)}) doesn&apos;t match your
                  account&apos;s registered wallet ({truncate(accountWalletAddress)}). Switch
                  accounts in MetaMask.
                </p>
              ) : (
                <button
                  onClick={handleRegisterOnChain}
                  disabled={chainStatus === "pending"}
                  className="mt-3 w-full rounded-full bg-seal px-5 py-3 text-sm font-semibold text-indigo-deep transition hover:bg-seal/90 disabled:opacity-60"
                >
                  {chainStatus === "pending" ? "Confirm in wallet…" : "Register on-chain"}
                </button>
              )}
              {chainStatus === "error" && (
                <p className="mt-2 text-center text-xs text-red-300">{chainMessage}</p>
              )}
            </>
          )}
        </div>

        <button
          onClick={uploadAnother}
          className="mt-4 w-full rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 transition hover:border-signal hover:text-white"
        >
          Register another file
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full max-w-lg space-y-5 rounded-2xl border border-white/10 bg-ink/60 p-6"
    >
      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-fog/60">
          Registering as
        </label>
        <div className="mt-2 flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
          <span className="font-mono text-sm text-white">{truncate(accountWalletAddress)}</span>
          <span className="h-2 w-2 rounded-full bg-signal" />
        </div>
        <p className="mt-1 text-xs text-fog/50">
          The wallet tied to your account. No wallet connection is needed to upload —
          it&apos;s only required later to register on-chain.
        </p>
      </div>

      <div>
        <label htmlFor="file" className="block font-mono text-xs uppercase tracking-wide text-fog/60">
          File
        </label>
        <input
          id="file"
          name="file"
          type="file"
          required
          className="mt-2 block w-full text-sm text-fog file:mr-4 file:rounded-full file:border-0 file:bg-mist file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-deep hover:file:bg-white"
        />
      </div>

      <div>
        <label htmlFor="title" className="block font-mono text-xs uppercase tracking-wide text-fog/60">
          Title (optional)
        </label>
        <input
          id="title"
          name="title"
          type="text"
          placeholder="e.g. Lagos skyline, evening"
          className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white placeholder:text-fog/40 focus:border-signal focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="pricePerUse" className="block font-mono text-xs uppercase tracking-wide text-fog/60">
          Price per use (USDC)
        </label>
        <input
          id="pricePerUse"
          name="pricePerUse"
          type="number"
          step="0.000001"
          min="0"
          defaultValue="1"
          className="mt-2 w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 text-sm text-white focus:border-signal focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={uploadStatus === "pending"}
        className="w-full rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition hover:bg-signal/90 disabled:opacity-60"
      >
        {uploadStatus === "pending" ? "Registering…" : "Register"}
      </button>

      {uploadStatus === "error" && (
        <p className="text-center text-xs text-red-300">{uploadMessage}</p>
      )}
    </form>
  );
}