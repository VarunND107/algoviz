/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#08090c",
          900: "#0d0f14",
          850: "#12151c",
          800: "#181c26",
          700: "#232838",
          600: "#333a4f",
        },
        accent: {
          DEFAULT: "#6366f1",
          soft: "#818cf8",
          bright: "#a5b4fc",
        },
        success: "#34d399",
        danger: "#f87171",
        warn: "#fbbf24",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px 2px rgba(99, 102, 241, 0.35)",
      },
      keyframes: {
        pulseFast: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
      animation: {
        pulseFast: "pulseFast 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
