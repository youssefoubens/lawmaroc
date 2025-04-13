import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C3E50",
          light: "#3D566E",
          dark: "#1A252F",
        },
        secondary: {
          DEFAULT: "#E74C3C",
          light: "#EC7063",
          dark: "#CB4335",
        },
        accent: {
          DEFAULT: "#F39C12",
          light: "#F8C471",
          dark: "#D35400",
        },
      },
      fontFamily: {
        arabic: ["'Noto Sans Arabic'", "sans-serif"],
        sans: ["'Open Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;