/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/context/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E40AF", // Deep blue (trust)
          dark: "#0F172A",    // Slate (professional)
        },
        accent: {
          DEFAULT: "#EA580C", // Warm orange (CTA)
        },
        neutral: {
          light: "#F8FAFC",
          DEFAULT: "#64748B",
          dark: "#334155",
        }
      },
    },
  },
  plugins: [],
}
