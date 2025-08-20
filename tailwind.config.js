/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'base-100': '#1d232a',
        'base-200': '#272e39',
        'base-300': '#3d4451',
        'content': '#a6adbb',
        'brand-primary': '#38bdf8',
        'brand-secondary': '#67e8f9',
      }
    },
  },
  plugins: [],
}
