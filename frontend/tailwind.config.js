/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F9F5',
          100: '#E2F2E9',
          200: '#C1E4D0',
          300: '#91CFAe',
          400: '#5CB488',
          500: '#138A5B', // Primary Emerald Green
          600: '#0E734A',
          700: '#0B5C3B',
          800: '#0B4A30',
          900: '#093D28',
          950: '#042216',
        },
        ocean: {
          500: '#0F766E', // Oceanic Teal
          600: '#0D645D',
        },
        limeAccent: {
          400: '#B8F34A', // High-energy Lime highlight
          500: '#A3E332',
        },
        darkSurface: {
          canvas: '#0B110F',
          card: '#141E19',
          elevated: '#1B2922',
          muted: '#202F27',
          border: '#293B31',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Noto Sans Sinhala', 'Noto Sans Tamil', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
