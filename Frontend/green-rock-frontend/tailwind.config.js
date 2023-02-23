/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'light': {
          0: '#FFFFFF',
          400: '#DCDCDC',
          500: '#BEBEBE'
        },
        'dark': {
          300: '#646464',
          400: '#464646',
          500: '#3C3C3C',
          600: '#323232',
          700: '#282828',
          800: '#1E1E1E',
          900: '#141414',
        },
        'primary': '#FFD78A',
        'secondary': '#F4902D',
      },
    },
  },
  plugins: [],
}
