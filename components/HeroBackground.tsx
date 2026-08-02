// Flowing particle-network hero background — SVG, scales to any container.
// Built as live code rather than a raster image: crisp at any resolution, tiny file size.

import React from "react";

interface HeroBackgroundProps {
  className?: string;
}

export default function HeroBackground({ className }: HeroBackgroundProps) {
  return (
    <svg
      viewBox="0 0 1440 720"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hero-wave-1" x1="0" y1="0" x2="1440" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFB84D" stopOpacity="0.55" />
          <stop offset="0.6" stopColor="#4F7CFF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4F7CFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-wave-2" x1="0" y1="200" x2="1440" y2="720" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4F7CFF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#4F7CFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hero-glow" cx="0.5" cy="0.35" r="0.6">
          <stop offset="0" stopColor="#4F7CFF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4F7CFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="720" fill="#0B0F1A" />
      <rect width="1440" height="720" fill="url(#hero-glow)" />

      {/* Flowing wave lines */}
      <path
        d="M-100 180C150 100 350 260 620 190C900 115 1050 260 1300 170C1400 135 1440 150 1540 130"
        stroke="url(#hero-wave-1)"
        strokeWidth="3.5"
      />
      <path
        d="M-100 240C180 170 400 320 650 250C920 175 1080 320 1340 230C1420 200 1460 210 1540 195"
        stroke="#FFB84D"
        strokeOpacity="0.55"
        strokeWidth="2"
      />
      <path
        d="M-100 420C200 500 420 340 700 410C960 475 1150 340 1400 430C1460 452 1500 440 1540 455"
        stroke="url(#hero-wave-2)"
        strokeWidth="1.6"
      />

      {/* Particle nodes scattered along the flow */}
      {[
        [140, 165], [310, 210], [470, 175], [640, 230], [820, 165],
        [980, 235], [1150, 175], [1300, 200], [1400, 150],
        [220, 460], [430, 400], [610, 445], [810, 395], [1000, 460],
        [1180, 400], [1350, 440],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={i % 3 === 0 ? 3.5 : 2.2}
          fill={i % 2 === 0 ? "#4F7CFF" : "#FFB84D"}
          opacity={0.9}
        />
      ))}

      {/* Faint hexagon mesh texture, lower-right */}
      <g opacity="0.06" stroke="#4F7CFF" strokeWidth="1">
        {Array.from({ length: 6 }).map((_, row) =>
          Array.from({ length: 8 }).map((_, col) => {
            const x = 900 + col * 60 + (row % 2 === 0 ? 0 : 30);
            const y = 420 + row * 52;
            return (
              <path
                key={`${row}-${col}`}
                d={`M${x} ${y - 18}L${x + 16} ${y - 9}V${y + 9}L${x} ${y + 18}L${x - 16} ${y + 9}V${y - 9}Z`}
              />
            );
          })
        )}
      </g>
    </svg>
  );
}