/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        show: {
          from: {
            transform: "scale(0)",
            opacity: "0.5",
          },
        },
      },
      animation: {
        show: "show ease-in-out 200ms",
      },
    },
  },
  plugins: [],
};
