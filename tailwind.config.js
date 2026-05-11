/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'telkom-red': '#E31E24',
        'telkom-gray': '#8B7355',
      }
    },
  },
  plugins: [],
}
