"use client";

import { useState } from "react";

interface ContentRecord {
  id: string;
  title: string | null;
  content_type: string | null;
  media_subtype: string | null;
  content_hash: string;
  license_terms: { price_per_use?: string; currency?: string } | null;
  created_at: string;
}

function truncateHash(hash: string) {
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

export default function ContentRow({ record }: { record: ContentRecord }) {
  const currentPrice = record.license_terms?.price_per_use
    ? (Number(record.license_terms.price_per_use) / 1_000_000).toString()
    : "0";

  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState(currentPrice);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPrice, setSavedPrice] = useState(currentPrice);

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

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">
          {record.title || `${record.content_type ?? "Untitled"} — ${record.media_subtype ?? ""}`}
        </p>
        <p className="mt-0.5 font-mono text-xs text-fog/50">{truncateHash(record.content_hash)}</p>
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
        <span className="font-mono text-sm text-white">{savedPrice} USDC</span>
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