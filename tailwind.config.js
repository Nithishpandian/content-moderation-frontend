/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        swissnow: ["SwissNow", "sans-serif"], // Define SwissNow font
        inter: ["Inter", "sans-serif"], // Define SwissNow font
        lexend: ["Lexend", "sans-serif"], // Define SwissNow font

      },
    },
  },
  plugins: [],
};
