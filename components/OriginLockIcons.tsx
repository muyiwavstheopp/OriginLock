// OriginLock icon set — minimal line icons, 24x24 viewBox
// Usage: <Icons.Wallet className="w-6 h-6 text-blue-400" />
// Stroke inherits from `currentColor`, so color with Tailwind text-* classes.

import React, { SVGProps } from "react";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, className, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg {...base} className={className} {...props}>
      {children}
    </svg>
  );
}

export const Icons: Record<string, (props: IconProps) => React.JSX.Element> = {
  Wallet: (props) => (
    <IconBase {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-4M3 7l4-3h9" />
      <rect x="15" y="11" width="6" height="5" rx="1" />
      <circle cx="17.5" cy="13.5" r="0.6" fill="currentColor" />
    </IconBase>
  ),
  Creator: (props) => (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
      <path d="M17 5.5l1.5 1.5L21 4.5" />
    </IconBase>
  ),
  Dataset: (props) => (
    <IconBase {...props}>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
      <path d="M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
    </IconBase>
  ),
  AIModel: (props) => (
    <IconBase {...props}>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M9.5 4v3M14.5 4v3M9.5 17v3M14.5 17v3M4 9.5h3M4 14.5h3M17 9.5h3M17 14.5h3" />
      <text x="12" y="13.5" fontSize="5.5" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="600">
        AI
      </text>
    </IconBase>
  ),
  License: (props) => (
    <IconBase {...props}>
      <path d="M6 2.5h9l4 4V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" />
      <path d="M15 2.5V7h4" />
      <path d="M9 13.5l1.8 1.8L15 11.5" />
    </IconBase>
  ),
  Shield: (props) => (
    <IconBase {...props}>
      <path d="M12 2.5l7.5 3v6c0 5.2-3.3 8.5-7.5 10-4.2-1.5-7.5-4.8-7.5-10v-6l7.5-3z" />
    </IconBase>
  ),
  Fingerprint: (props) => (
    <IconBase {...props}>
      <path d="M9.5 20.8C8.3 18.5 8 16 8 13v-2.5a4 4 0 0 1 8 0V13" />
      <path d="M12 8.5a2.2 2.2 0 0 0-2.2 2.2v3.3c0 2 .4 4 1.4 5.7" />
      <path d="M14.2 10.7v3c0 2.3.5 3.8 1.5 5.3" />
      <path d="M6 10.5c0-3 2.5-5.5 6-5.5s6 2.5 6 5.5" />
      <path d="M4.5 12.5v.5c0 2.6.6 5 1.8 7" />
    </IconBase>
  ),
  Analytics: (props) => (
    <IconBase {...props}>
      <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />
    </IconBase>
  ),
  Royalty: (props) => (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M14.5 9.2c0-1.2-1.1-2.2-2.5-2.2s-2.5.9-2.5 2c0 3 5 1.3 5 4.2 0 1.2-1.1 2-2.5 2s-2.5-.8-2.5-2" />
    </IconBase>
  ),
  Blockchain: (props) => (
    <IconBase {...props}>
      <rect x="3" y="9" width="6" height="6" rx="1" />
      <rect x="15" y="9" width="6" height="6" rx="1" />
      <rect x="9" y="3" width="6" height="6" rx="1" />
      <path d="M9 12h6M11 9l1-3M13 9l-1-3" />
    </IconBase>
  ),
  Contract: (props) => (
    <IconBase {...props}>
      <path d="M6 2.5h9l4 4V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" />
      <path d="M15 2.5V7h4" />
      <path d="M8 17.5l2-2 2 1 3-3" />
      <path d="M15.5 13.5l-.4 1.4-1.4.4" />
    </IconBase>
  ),
  Search: (props) => (
    <IconBase {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.5-4.5" />
    </IconBase>
  ),
  Notification: (props) => (
    <IconBase {...props}>
      <path d="M12 3.5c-3 0-5 2.2-5 5.2v3l-2 3.5h14l-2-3.5v-3c0-3-2-5.2-5-5.2z" />
      <path d="M10 18.5a2 2 0 0 0 4 0" />
    </IconBase>
  ),
  Settings: (props) => (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.6 1H20a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.6 1z" />
    </IconBase>
  ),
  User: (props) => (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </IconBase>
  ),
  API: (props) => (
    <IconBase {...props}>
      <path d="M8 4L3 12l5 8M16 4l5 8-5 8" />
    </IconBase>
  ),
  Database: (props) => (
    <IconBase {...props}>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
      <path d="M4.5 5.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6" />
      <path d="M4.5 11.5v6c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-6" />
    </IconBase>
  ),
  Globe: (props) => (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
    </IconBase>
  ),
};

export default Icons;