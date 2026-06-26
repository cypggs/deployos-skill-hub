import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          cyan: "#00f3ff",
          purple: "#bc13fe",
          pink: "#ff0080",
          green: "#00ff9d",
          yellow: "#fcee0a",
        },
        glass: "rgba(10, 10, 20, 0.65)",
      },
      fontFamily: {
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan": "scan 4s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px #00f3ff, 0 0 10px #00f3ff" },
          "100%": { boxShadow: "0 0 20px #00f3ff, 0 0 40px #00f3ff" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
