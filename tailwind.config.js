/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00E5FF", // Neon Cyan
        "primary-dark": "#00B3CC", // Darker Cyan
        "primary-light": "#66EDFF", // Light Cyan
        "surface-dark": "#050505", // Almost Black
        "surface": "#121212", // Dark Gray
        "surface-light": "#1E1E1E", // Slightly Lighter Gray
      },
    },
  },
  plugins: [],
};
