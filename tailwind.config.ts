import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#080B1F",        // near-black base
        indigo: {
          deep: "#0B0F2B",     // background start
          mid: "#141A45",      // background mid
        },
        signal: "#4F7CFF",     // primary electric blue accent
        seal: "#FFB84D",       // lock/gold accent, used sparingly
        mist: "#F5F7FF",       // light insert panels (waitlist bar)
        fog: "#A9B0D6",        // muted body text on dark
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(120% 120% at 50% 0%, #1B2154 0%, #0B0F2B 45%, #080B1F 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(10, 14, 40, 0.45)",
      },
      borderRadius: {
        frame: "28px",
      },
    },
  },
  plugins: [],
};
export default config;