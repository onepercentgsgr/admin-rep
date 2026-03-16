/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED', // Violet
          dark: '#6D28D9',
        },
        accent: {
          DEFAULT: '#06B6D4', // Cyan
          dark: '#0891B2',
        },
        bg: {
          DEFAULT: '#030712', // Very dark blue/gray
          card: '#111827',   // Slate 900
          input: '#1F2937',  // Slate 800
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
