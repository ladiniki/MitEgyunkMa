/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light:{
          background: '#FFEED7',
          primary: '#FFF8EE',
          secondary: '#FFFFFF',
          tertiary: '#D9641E',
          accent: '#41423A'
        },
      },
      fontFamily: {
        'primary': ['Josefin Sans', 'sans-serif']
      },
    },
  },
  plugins: [],
}