import type { Config } from "tailwindcss";

// NOTE: This project runs Tailwind v4, which does NOT read this file for colors/theme
// by default (v4 is CSS-first). The actual source of truth for the color palette
// (primary/secondary/ink) and fonts is the `@theme inline { ... }` block in
// src/app/globals.css — keep both in sync if you change the palette, or this file
// will silently have no effect and any custom utility classes will fail to compile.

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        // Primary: deep clinical teal — trust, calm, medical without being cold
        primary: {
          50: "#f0f9f8",
          100: "#daf1ee",
          200: "#b6e3dd",
          300: "#87cec4",
          400: "#54b0a4",
          500: "#34968a",
          600: "#25786f",
          700: "#20605a",
          800: "#1d4d49",
          900: "#1a413e",
        },
        // Secondary: soft sage green — growth, wellness, secondary actions
        secondary: {
          50: "#f4f8f2",
          100: "#e5f0e0",
          200: "#cce1c3",
          300: "#a9cb9a",
          400: "#83b06f",
          500: "#63924f",
          600: "#4c743d",
          700: "#3d5c33",
          800: "#334a2c",
          900: "#2b3e26",
        },
        // Ink: warm-neutral text/background scale, softer than pure slate
        ink: {
          50: "#f6f8f7",
          100: "#eaeeec",
          200: "#d3dbd7",
          300: "#aebab3",
          400: "#82938a",
          500: "#65766c",
          600: "#505e56",
          700: "#414c46",
          800: "#37403b",
          900: "#232a26",
        },
      },
      spacing: {
        "touch-md": "2.75rem",
        "touch-lg": "3rem",
      },
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      boxShadow: {
        "elevation-1": "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        "elevation-2": "0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)",
        "elevation-3": "0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)",
        "elevation-4": "0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        xs: "0.25rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 300ms ease-out",
        "slide-in": "slideInLeft 300ms ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      transitionDuration: {
        fast: "150ms",
        base: "200ms",
        slow: "300ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
export default config;
