/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f7faff",
        paper: "#ffffff",
        ink: "#172033",
        muted: "#64748b",
        line: "#dbe6f5",
        teal: { DEFAULT: "#2563eb", dark: "#1d4ed8" },
        saffron: "#f59e0b",
        rose: "#e11d48"
      },
      boxShadow: {
        card: "0 18px 45px rgba(37, 99, 235, 0.14)",
        btn: "0 10px 24px rgba(37, 99, 235, 0.24)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
