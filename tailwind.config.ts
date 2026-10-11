import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: "rgb(var(--lavender-50) / <alpha-value>)",
          100: "rgb(var(--lavender-100) / <alpha-value>)",
          200: "rgb(var(--lavender-200) / <alpha-value>)",
          300: "rgb(var(--lavender-300) / <alpha-value>)",
          400: "rgb(var(--lavender-400) / <alpha-value>)",
          500: "rgb(var(--lavender-500) / <alpha-value>)",
          600: "rgb(var(--lavender-600) / <alpha-value>)",
        },
        blush: {
          50: "rgb(var(--blush-50) / <alpha-value>)",
          100: "rgb(var(--blush-100) / <alpha-value>)",
          200: "rgb(var(--blush-200) / <alpha-value>)",
          300: "rgb(var(--blush-300) / <alpha-value>)",
          400: "rgb(var(--blush-400) / <alpha-value>)",
          500: "rgb(var(--blush-500) / <alpha-value>)",
        },
        mint: {
          50: "#F0FBF6",
          100: "#DBF6E9",
          200: "#B8EED2",
          300: "#8FE3B8",
          400: "#63D69B",
        },
        babyblue: {
          50: "#F0F8FF",
          100: "#DCEFFF",
          200: "#B8DFFF",
          300: "#8FCCFF",
        },
        cream: {
          50: "#FFFDF8",
          100: "#FFF9EE",
        },
        sunny: {
          200: "#FFEFB0",
          300: "#FFE585",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      boxShadow: {
        soft: "0 8px 30px rgb(var(--accent-rgb) / 0.12)",
        glass: "0 8px 32px rgb(var(--accent-rgb) / 0.15)",
      },
      backdropBlur: {
        glass: "16px",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
