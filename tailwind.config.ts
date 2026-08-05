import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        lavender: {
          50: "#F5F3FF",
          100: "#EDE7FF",
          200: "#D9CCFF",
          300: "#C2AEFF",
          400: "#A98AFA",
          500: "#8F6AF0",
          600: "#7550D6",
        },
        blush: {
          50: "#FFF4F8",
          100: "#FFE4EF",
          200: "#FFC9DE",
          300: "#FFA9CB",
          400: "#FF87B6",
          500: "#F76BA0",
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
        soft: "0 8px 30px rgba(143, 106, 240, 0.12)",
        glass: "0 8px 32px rgba(143, 106, 240, 0.15)",
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
