"use client";

import { useState } from "react";
import ContentRow from "@/components/ContentRow";
import AccountPanel from "@/components/AccountPanel";
import SecurityPanel from "@/components/SecurityPanel";
import { Icons } from "@/components/OriginLockIcons";
import { Logo } from "@/components/OriginLockLogo";
import HeroBackground from "@/components/HeroBackground";

interface ContentRecord {
  id: string;
  title: string | null;
  content_type: string | null;
  media_subtype: string | null;
  content_hash: string;
  license_terms: { price_per_use?: string; currency?: string } | null;
  created_at: string;
}

interface DashboardShellProps {
  username: string;
  walletAddress: string;
  records: ContentRecord[];
}

type Tab = "overview" | "account" | "security";

const NAV: { id: Tab; label: string; icon: JSX.Element }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        <rect x="10" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        <rect x="2" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        <rect x="10" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3.2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2.8 15c.8-3 3.3-4.6 6.2-4.6s5.4 1.6 6.2 4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "Security",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2l6 2.4v4.2c0 3.8-2.5 6.7-6 7.4-3.5-.7-6-3.6-6-7.4V4.4L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M6.5 9l1.8 1.8L11.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function DashboardShell({ username, walletAddress, records }: DashboardShellProps) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-hero-gradient">
      <HeroBackground className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      {/* Sidebar */}
      <aside className="relative z-10 flex w-60 flex-col border-r border-white/10 bg-ink/60 px-4 py-6">
        <a href="/" className="mb-8 flex items-center px-2">
          <Logo className="h-6" />
        </a>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                tab === item.id
                  ? "bg-signal/15 text-white"
                  : "text-fog/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className={tab === item.id ? "text-signal" : "text-fog/50"}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-fog/70 transition hover:bg-white/5 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 15.5H3.8a1.3 1.3 0 01-1.3-1.3V3.8a1.3 1.3 0 011.3-1.3H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M11.5 12.3l3.3-3.3-3.3-3.3M14.6 9H6.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Log out
          </button>
        </form>
      </aside>

      {/* Main content */}
      <div className="relative z-10 flex-1 px-10 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-medium tracking-tight text-white">
                {tab === "overview" && "Overview"}
                {tab === "account" && "Account"}
                {tab === "security" && "Security"}
              </h1>
              <p className="mt-1 text-sm text-fog">
                <span className="font-mono text-white">{username}</span>
              </p>
            </div>
            {tab === "overview" && (
              
              <a  href="/upload"
  className="flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-signal/90"
>
  <Icons.License className="h-4 w-4" />
  Register new content
</a>
            )}
          </div>

          <div className="mt-8">
            {tab === "overview" && (
              <div className="rounded-2xl border border-white/10 bg-ink/60">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-white/10 px-6 py-3 font-mono text-xs uppercase tracking-wide text-fog/50">
                  <span>Content</span>
                  <span>Price / use</span>
                  <span></span>
                </div>

                {records.length === 0 ? (
  <div className="px-6 py-12 text-center">
    <Icons.Dataset className="mx-auto mb-3 h-8 w-8 text-fog/30" />
    <p className="text-sm text-fog">You haven&apos;t registered any content yet.</p>
                    
                    <a  href="/upload"
                      className="mt-4 inline-block rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 transition hover:border-signal hover:text-white"
                    >
                      Register your first piece
                    </a>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {records.map((record) => (
                      <ContentRow key={record.id} record={record} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "account" && <AccountPanel currentUsername={username} />}
            {tab === "security" && <SecurityPanel walletAddress={walletAddress} />}
          </div>
        </div>
      </div>
    </div>
  );
}