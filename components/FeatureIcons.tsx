// Feature illustration icons — matches the "Provenance / Licensing / AI Training Access /
// Usage Tracking / Royalty Flow / Ecosystem" set from the brand moodboard.
// Larger and slightly more detailed than the minimal nav icon set (OriginLockIcons.tsx).

import React, { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 48,
  height: 48,
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "#4F7CFF",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Base({ children, className, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg {...base} className={className} {...props}>
      {children}
    </svg>
  );
}

export const FeatureIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  Provenance: (props) => (
    <Base {...props}>
      <rect x="6" y="22" width="12" height="12" rx="1.5" />
      <rect x="10" y="14" width="12" height="12" rx="1.5" opacity="0.5" />
      <circle cx="30" cy="16" r="7" />
      <path d="M27 16l2 2 4-4" />
      <path d="M22 20l4-2" strokeDasharray="2 2" />
    </Base>
  ),
  Licensing: (props) => (
    <Base {...props}>
      <path d="M14 6h14l6 6v28a2 2 0 01-2 2H14a2 2 0 01-2-2V8a2 2 0 012-2z" />
      <path d="M28 6v6h6" />
      <path d="M18 24h12M18 30h12M18 36h7" />
      <circle cx="34" cy="34" r="7" fill="#0B0F1A" />
      <path d="M31 34l2 2 4-4" />
    </Base>
  ),
  AITrainingAccess: (props) => (
    <Base {...props}>
      <rect x="6" y="14" width="16" height="16" rx="2" />
      <path d="M10 14v-3M18 14v-3M10 30v3M18 30v3M6 18H3M6 26H3" />
      <rect x="26" y="18" width="14" height="14" rx="2" />
      <text x="33" y="28" fontSize="7" textAnchor="middle" fill="#4F7CFF" stroke="none" fontWeight="700">
        AI
      </text>
      <path d="M22 22h4" strokeDasharray="2 2" />
    </Base>
  ),
  UsageTracking: (props) => (
    <Base {...props}>
      <rect x="6" y="8" width="16" height="12" rx="2" />
      <circle cx="10" cy="12" r="1" fill="#4F7CFF" />
      <circle cx="14" cy="12" r="1" fill="#FFB84D" />
      <path d="M8 30l6-7 5 4 9-10" stroke="#FFB84D" />
      <circle cx="28" cy="17" r="1.4" fill="#FFB84D" />
      <path d="M6 38h36" opacity="0.3" />
    </Base>
  ),
  RoyaltyFlow: (props) => (
    <Base {...props}>
      <circle cx="24" cy="24" r="7" stroke="#FFB84D" />
      <path d="M24 20v8M26.3 22.1c0-1.1-1-2-2.3-2s-2.3.8-2.3 1.8c0 2.7 4.6 1.2 4.6 3.8 0 1.1-1 1.9-2.3 1.9s-2.3-.7-2.3-1.9" stroke="#FFB84D" />
      <circle cx="10" cy="12" r="4" />
      <circle cx="38" cy="12" r="4" />
      <circle cx="10" cy="36" r="4" />
      <circle cx="38" cy="36" r="4" />
      <path d="M13 15l7 6M35 15l-7 6M13 33l7-6M35 33l-7-6" strokeDasharray="1 3" />
    </Base>
  ),
  Ecosystem: (props) => (
    <Base {...props}>
      <path d="M24 8L34 14V26L24 32L14 26V14L24 8Z" />
      <circle cx="24" cy="20" r="3.5" fill="#0B0F1A" />
      <path d="M24 22.5v3M22.3 25.5h3.4" />
      <circle cx="8" cy="10" r="4" />
      <circle cx="40" cy="10" r="4" />
      <circle cx="8" cy="38" r="4" />
      <circle cx="40" cy="38" r="4" />
      <path d="M11.5 12.5L18 16M36.5 12.5L30 16M11.5 35.5L18 28M36.5 35.5L30 28" strokeDasharray="1 3" opacity="0.6" />
    </Base>
  ),
};

export default FeatureIcons;