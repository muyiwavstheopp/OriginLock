// OriginLock brand mark — hexagon + keyhole symbol, with circuit-trace details.
// Three export shapes: LogoMark (icon only), Wordmark (text only), Logo (full horizontal lockup)

import React from "react";

interface LogoProps {
  className?: string;
}

// The hexagon + keyhole symbol, split blue -> orange, with circuit traces.
export function LogoMark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ol-hex-grad" x1="4" y1="8" x2="60" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4F7CFF" />
          <stop offset="1" stopColor="#FFB84D" />
        </linearGradient>
        <clipPath id="ol-hex-clip">
          <path d="M32 3L58 18V46L32 61L6 46V18L32 3Z" />
        </clipPath>
      </defs>

      {/* Hexagon outline, gradient stroke */}
      <path d="M32 3L58 18V46L32 61L6 46V18L32 3Z" stroke="url(#ol-hex-grad)" strokeWidth="2.5" />

      {/* Split fill: blue left half, orange right half, clipped to hexagon */}
      <g clipPath="url(#ol-hex-clip)" opacity="0.16">
        <rect x="0" y="0" width="32" height="64" fill="#4F7CFF" />
        <rect x="32" y="0" width="32" height="64" fill="#FFB84D" />
      </g>

      {/* Keyhole */}
      <circle cx="32" cy="27" r="7" stroke="#0B0F1A" strokeWidth="2.5" />
      <path d="M32 33L32 43" stroke="#0B0F1A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M27 43L37 43" stroke="#0B0F1A" strokeWidth="2.5" strokeLinecap="round" />

      {/* Circuit traces extending from hexagon vertices */}
      <path d="M6 18H0M6 18V14" stroke="#4F7CFF" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="0" cy="18" r="1.6" fill="#4F7CFF" />
      <path d="M6 46H0M6 46V50" stroke="#4F7CFF" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="0" cy="46" r="1.6" fill="#4F7CFF" />
      <path d="M58 18H64M58 18V14" stroke="#FFB84D" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="64" cy="18" r="1.6" fill="#FFB84D" />
      <path d="M58 46H64M58 46V50" stroke="#FFB84D" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="64" cy="46" r="1.6" fill="#FFB84D" />
    </svg>
  );
}

// Text-only wordmark: "Origin" in white, "Lock" in gradient.
export function Wordmark({ className }: LogoProps) {
  return (
    <svg viewBox="0 0 180 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ol-word-grad" x1="0" y1="0" x2="60" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4F7CFF" />
          <stop offset="1" stopColor="#FFB84D" />
        </linearGradient>
      </defs>
      <text x="0" y="24" fontFamily="var(--font-display, sans-serif)" fontSize="26" fontWeight="600" fill="#FFFFFF">
        Origin
      </text>
      <text x="86" y="24" fontFamily="var(--font-display, sans-serif)" fontSize="26" fontWeight="600" fill="url(#ol-word-grad)">
        Lock
      </text>
    </svg>
  );
}

// Full horizontal lockup: mark + wordmark side by side.
export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <Wordmark className="h-6 w-auto" />
    </div>
  );
}

export default Logo;