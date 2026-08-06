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
          light: "#f7f9fc",
          dark: "#0b1120",
        },
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(51,102,255,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(51,102,255,0.1), transparent 35%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
