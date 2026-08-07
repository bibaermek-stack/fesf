import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd2ff",
          300: "#8fb4ff",
          400: "#5c8dff",
          500: "#3366ff",
          600: "#1f47e6",
          700: "#1a39b8",
          800: "#1a3391",
          900: "#1a2f73",
          950: "#0f1a45",
        },
        surface: {
          light: "#f5f7fa",
          dark: "#0b1120",
        },
      },
      // A named scale, so headings and data stop being ad-hoc text-2xl/text-sm
      // picks. Kazakh Cyrillic sets taller than Latin, hence the roomy leading.
      fontSize: {
        display: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "800" }],
        h1: ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" }],
        h2: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" }],
        h3: ["1rem", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["0.9375rem", { lineHeight: "1.6" }],
        // All-caps section labels.
        label: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.06em", fontWeight: "700" }],
        micro: ["0.6875rem", { lineHeight: "1.45" }],
        // Large readouts: a single figure carrying a card.
        data: ["1.75rem", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" }],
        "data-sm": ["1.125rem", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "700" }],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(15, 23, 42, 0.04)",
        raised: "0 8px 24px rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
