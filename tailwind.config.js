/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-yellow': '#FDF07A',
        'primary-red': '#D03F29',
      },
      fontFamily: {
        sans: ['PT Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}







