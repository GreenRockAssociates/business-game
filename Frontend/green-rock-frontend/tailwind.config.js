/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'light': '#DFD5D5',
        'dark': {
          500: '#4E455E',
          600: '#443D52',
          700: '#3A3446',
        }
      },
    },
  },
  plugins: [],
}
