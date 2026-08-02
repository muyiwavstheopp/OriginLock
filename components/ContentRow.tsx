"use client";

import { useState } from "react";
import { Icons } from "@/components/OriginLockIcons";
import { useWallet } from "@/lib/web3/useWallet";
import { ORIGIN_LOCK_ABI, ORIGIN_LOCK_ADDRESS, SEPOLIA_USDC_ADDRESS } from "@/lib/web3/contract";

interface ContentRecord {
  id: string;
  title: string | null;
  content_type: string | null;
  media_subtype: string | null;
  content_hash: string;
  license_terms: { price_per_use?: string; currency?: string } | null;
  onchain_registered: boolean;
  onchain_tx_hash: string | null;
  created_at: string;
}

interface ContentRowProps {
  record: ContentRecord;
  accountWalletAddress: string;
}

function truncateHash(hash: string) {
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function ContentRow({ record, accountWalletAddress }: ContentRowProps) {
  const currentPrice = record.license_terms?.price_per_use
    ? (Number(record.license_terms.price_per_use) / 1_000_000).toString()
    : "0";

  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(currentPrice);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPrice, setSavedPrice] = useState(currentPrice);

  const wallet = useWallet();
  const [chainStatus, setChainStatus] = useState<"idle" | "pending" | "success" | "error">(
    record.onchain_registered ? "success" : "idle"
  );
  const [chainError, setChainError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(record.onchain_tx_hash);

  const walletMismatch =
    !!wallet.address && wallet.address.toLowerCase() !== accountWalletAddress.toLowerCase();

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/content/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricePerUse: price }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not update price.");
        setSaving(false);
        return;
      }

      setSavedPrice(price);
      setEditing(false);
      setSaving(false);
    } catch {
      setError("Couldn't reach the server.");
      setSaving(false);
    }
  }

  async function handleRegisterOnChain() {
    if (!wallet.client || !wallet.address) return;

    if (walletMismatch) {
      setChainStatus("error");
      setChainError(
        `Connected wallet doesn't match your account's wallet (${truncateAddress(accountWalletAddress)}). Switch accounts in MetaMask.`
      );
      return;
    }

    if (!ORIGIN_LOCK_ADDRESS) {
      setChainStatus("error");
      setChainError("Contract address isn't configured.");
      return;
    }

    setChainStatus("pending");
    setChainError(null);

    try {
      const smallestUnit = BigInt(record.license_terms?.price_per_use ?? "0");

      const hash = await wallet.client.writeContract({
        account: wallet.address,
        address: ORIGIN_LOCK_ADDRESS,
        abi: ORIGIN_LOCK_ABI,
        functionName: "register",
        args: [`0x${record.content_hash}` as `0x${string}`, SEPOLIA_USDC_ADDRESS, smallestUnit],
        chain: wallet.client.chain,
        gas: BigInt(300000),
      });

      setTxHash(hash);
      setChainStatus("success");

      await fetch(`/api/content/${record.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onchainRegistered: true, onchainTxHash: hash }),
      }).catch(() => {
        // Non-fatal — the on-chain transaction already succeeded.
      });
    } catch (err: any) {
      setChainStatus("error");
      const msg = err?.shortMessage || err?.message || "Transaction failed.";
      setChainError(msg.includes("AlreadyRegistered") ? "Already registered on-chain." : msg);
    }
  }

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4">
      <div className="flex min-w-0 items-start gap-2">
        <Icons.Dataset className="mt-0.5 h-4 w-4 shrink-0 text-fog/40" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">
            {record.title || `${record.content_type ?? "Untitled"} — ${record.media_subtype ?? ""}`}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 font-mono text-xs text-fog/50">
            <Icons.Fingerprint className="h-3.5 w-3.5 shrink-0" />
            {truncateHash(record.content_hash)}
          </p>

          {/* On-chain status + registration action */}
          <div className="mt-1.5">
            {chainStatus === "success" && txHash ? (
              
              <a  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-signal underline"
              >
                <Icons.Shield className="h-3 w-3" />
                On-chain ↗
              </a>
            ) : !wallet.address ? (
              <button
                onClick={wallet.connect}
                disabled={wallet.connecting}
                className="text-xs text-fog/50 underline transition hover:text-white disabled:opacity-60"
              >
                {wallet.connecting ? "Connecting…" : "Connect wallet to register on-chain"}
              </button>
            ) : walletMismatch ? (
              <p className="text-xs text-red-300/80">
                Wrong wallet connected — switch to {truncateAddress(accountWalletAddress)}
              </p>
            ) : (
              <button
                onClick={handleRegisterOnChain}
                disabled={chainStatus === "pending"}
                className="text-xs text-signal underline transition hover:text-white disabled:opacity-60"
              >
                {chainStatus === "pending" ? "Confirm in wallet…" : "Register on-chain"}
              </button>
            )}
            {chainStatus === "error" && chainError && (
              <p className="mt-1 text-xs text-red-300/80">{chainError}</p>
            )}
          </div>
        </div>
      </div>

      {editing ? (
        <div className="flex items-center gap-1">
          <input
            type="number"
            step="0.000001"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-24 rounded-lg border border-white/10 bg-transparent px-2 py-1 text-right text-sm text-white focus:border-signal focus:outline-none"
          />
          <span className="text-xs text-fog/50">USDC</span>
        </div>
      ) : (
        <span className="flex items-center gap-1.5 font-mono text-sm text-white">
          <Icons.Royalty className="h-3.5 w-3.5 text-fog/50" />
          {savedPrice} USDC
        </span>
      )}

      <div className="flex items-center gap-2 whitespace-nowrap">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-signal px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-signal/90 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setPrice(savedPrice);
                setError(null);
              }}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 transition hover:border-signal"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/80 transition hover:border-signal hover:text-white"
          >
            Edit price
          </button>
        )}
      </div>

      {error && <p className="col-span-3 text-xs text-red-300">{error}</p>}
    </div>
  );
}