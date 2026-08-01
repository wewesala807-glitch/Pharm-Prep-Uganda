import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1A56DB",
        accentGreen: "#16A34A",
        accentGold: "#F59E0B",
        bg: "#F8FAFC",
        border: "#E2E8F0",
        dark: "#0F172A",
        muted: "#94A3B8",
        premium: "#7C3AED",
        easy: "#16A34A",
        medium: "#F59E0B",
        hard: "#DC2626",
      },
      fontFamily: {
        heading: ["var(--font-sora)", "sans-serif"],
        serif: ["var(--font-source-serif)", "serif"],
        ui: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
        "card-hover": "0 10px 25px rgba(15, 23, 42, 0.10)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
