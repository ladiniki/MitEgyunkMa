/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        light: {
          background: '#FFEED7',
          primary: '#FFF8EE',
          secondary: '#FFFFFF',
          tertiary: '#D9641E',
          accent: '#41423A'
        },
        dark: {
          background: '#1F1D1B',
          primary: '#2A2725',
          secondary: '#332F2D',
          tertiary: '#FF8B3E',
          accent: '#FFE0C2'
        }
      },
      fontFamily: {
        'primary': ['Josefin Sans', 'sans-serif']
      },
    },
  },
  plugins: [],
}