type TokenKind = "image" | "audio" | "document" | "code";

const ICON_PATHS: Record<TokenKind, JSX.Element> = {
  image: (
    <>
      <rect x="10" y="12" width="20" height="16" rx="2" stroke="white" strokeWidth="1.6" />
      <circle cx="15.5" cy="17.5" r="1.6" fill="white" />
      <path d="M10 24l6-6 4 4 4-5 6 7" stroke="white" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    </>
  ),
  audio: (
    <path
      d="M8 20h3l4-6v12l-4-6H8v0zM19 15a6 6 0 010 10M22.5 12a10 10 0 010 16"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
  document: (
    <>
      <path d="M13 8h9l5 5v15a2 2 0 01-2 2H13a2 2 0 01-2-2V10a2 2 0 012-2z" stroke="white" strokeWidth="1.6" fill="none" />
      <path d="M22 8v5h5" stroke="white" strokeWidth="1.6" fill="none" />
      <path d="M14.5 20.5h11M14.5 24.5h11" stroke="white" strokeWidth="1.4" />
    </>
  ),
  code: (
    <path
      d="M15 13l-6 7 6 7M25 13l6 7-6 7M21 11l-2 20"
      stroke="white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
};

export default function FingerprintToken({
  kind,
  size = 84,
  className = "",
}: {
  kind: TokenKind;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 40 40" width={size} height={size} className="drop-shadow-[0_8px_20px_rgba(79,124,255,0.35)]">
        <defs>
          <radialGradient id={`glass-${kind}`} cx="35%" cy="25%" r="80%">
            <stop offset="0%" stopColor="#3B4A9C" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#1B2154" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0B0F2B" stopOpacity="0.9" />
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="19" fill={`url(#glass-${kind})`} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <g opacity="0.95">{ICON_PATHS[kind]}</g>
      </svg>
      {/* lock badge */}
      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-seal shadow-glass">
        <svg viewBox="0 0 12 12" width="8" height="8">
          <rect x="2.5" y="5.2" width="7" height="5" rx="1" fill="#080B1F" />
          <path d="M4 5.2V3.6a2 2 0 014 0v1.6" stroke="#080B1F" strokeWidth="1.1" fill="none" />
        </svg>
      </div>
    </div>
  );
}