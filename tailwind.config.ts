import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lobster: ["Lobster", "cursive"],
        poppins: ["Poppins", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      colors: {
        influencer: "#FD3A84",
        gray1: "#939393",
        gray2: "#888888",
        "influencer-green": "#97FCC3",
      },
    },
  },
  plugins: [],
} satisfies Config;
