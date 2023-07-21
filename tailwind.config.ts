import defaultTheme from "tailwindcss/defaultTheme";
import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        lobster: ["Lobster", "cursive"],
        poppins: ["Poppins", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        "black-transparent": "rgba(0, 0, 0, 0.3)",
        influencer: "#FD3A84",
        gray1: "#939393",
        gray2: "#888888",
        gray3: "#D9D9D9",
        gray4: "#9F9F9F",
        white1: "#F2F2F2",
        "shadow-gray": "#D1D1D1",
        "influencer-light": "#ffabcb",
        "influencer-dark": "#fa2877",
        "influencer-green": "#64EA9E",
        "influencer-green-light": "#fafdfb",
        "influencer-green-dark": "#67E09B",
        "light-red": "#F8F4F4",
        boxShadow: "#64646f80",
      },
      screens: {
        xs: "300px",
        "3xl": "1900px",
        ...defaultTheme.screens,
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
} satisfies Config;
