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
      animation: {
        bubble1: 'bubble1 6s ease-in-out infinite',
        bubble2: 'bubble2 8s ease-in-out infinite',
        bubble3: 'bubble3 7s ease-in-out infinite',
      },
      keyframes: {
        bubble1: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-15px, -15px) scale(1.1)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        bubble2: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(20px, -20px) scale(0.95)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        bubble3: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(-10px, 15px) scale(1.05)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}