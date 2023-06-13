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
        "shadow-gray": "#D1D1D1",
        "influencer-green": "#97FCC3",
        "border-white": "#F2F2F2",
        "light-red": "#F8F4F4",
      },
    },
  },
  plugins: [],
} satisfies Config;
