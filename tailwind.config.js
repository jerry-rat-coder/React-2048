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
        rotateSpin: {
          to: {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        show: "show ease-in-out 100ms",
        rotateSpin: "rotateSpin ease-in-out 100ms infinite",
      },
    },
  },
  plugins: [],
};
