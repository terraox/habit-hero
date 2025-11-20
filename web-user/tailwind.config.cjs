/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        muted: "var(--muted)",
        text: "var(--text)",
        primary: "var(--primary)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false, // We control themes via CSS variables
    logs: false,
  },
};
