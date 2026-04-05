import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./assets/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          primary: "var(--ink-primary)",
          secondary: "var(--ink-secondary)",
          tertiary: "var(--ink-tertiary)",
          inverted: "var(--ink-inverted)",
        },
        bg: {
          base: "var(--bg-base)",
          surface: "var(--bg-surface)",
          sunken: "var(--bg-sunken)",
        },
        pulse: {
          DEFAULT: "var(--accent)",
          light: "var(--accent-light)",
          hover: "var(--accent-hover)",
          glow: "var(--accent-glow)",
        },
        danger: "var(--danger)",
        warning: "var(--warning)",
        border: {
          subtle: "var(--border-subtle)",
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(800%)" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "pulse-ring":
          "pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite",
        scan: "scan 2s ease-in-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        shake: "shake 0.3s ease-in-out",
      },
      maxWidth: {
        page: "1280px",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "editorial-grid":
          "linear-gradient(to right, rgba(17,17,16,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,16,0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [animate],
};

export default config;
