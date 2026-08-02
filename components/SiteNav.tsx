"use client";

import { useState } from "react";
import { Logo } from "@/components/OriginLockLogo";

interface SiteNavProps {
  current?: "home" | "how" | "creators" | "labs";
}

const LINKS = [
  { href: "/how-it-works", label: "How it works", key: "how" },
  { href: "/for-creators", label: "For creators", key: "creators" },
  { href: "/for-ai-labs", label: "For AI labs", key: "labs" },
];

export default function SiteNav({ current }: SiteNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative mx-auto max-w-6xl px-6 py-7">
      <div className="flex items-center justify-between">
        <a href="/">
          <Logo className="h-7" />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 text-sm text-fog md:flex">
          {LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={`transition hover:text-white ${current === link.key ? "text-white" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          
          <a  href="/login"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 transition hover:border-white/40 hover:text-white"
          >
            Log in
          </a>
          
          <a  href="/signup"
            className="rounded-full bg-signal px-4 py-2 text-sm font-semibold text-white transition hover:bg-signal/90"
          >
            Register
          </a>
        </div>

        {/* Mobile hamburger toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mx-6 mt-2 rounded-2xl border border-white/10 bg-ink/95 p-4 backdrop-blur md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
             <a 
                key={link.key}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm transition hover:bg-white/5 hover:text-white ${
                  current === link.key ? "text-white" : "text-fog"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
            
            <a  href="/login"
              className="rounded-full border border-white/15 px-4 py-2.5 text-center text-sm text-white/90 transition hover:border-white/40 hover:text-white"
            >
              Log in
            </a>
            
            <a  href="/signup"
              className="rounded-full bg-signal px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-signal/90"
            >
              Register
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}