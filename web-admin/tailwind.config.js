/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["class", ".theme-dark"],
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
    themes: false, // Disable default themes to rely on our CSS variables
    base: true,
    utils: true,
    logs: false,
  },
};
