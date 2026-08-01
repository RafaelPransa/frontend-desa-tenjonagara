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
          DEFAULT: '#2D4B37',
          hover: '#233B2B',
          light: '#3F664C',
          muted: '#E9EFEA'
        },
        secondary: {
          DEFAULT: '#7D5C4A',
          hover: '#664A3B',
          light: '#9E7761',
          muted: '#F5EFEA'
        },
        accent: {
          DEFAULT: '#D4A017',
          hover: '#B58810',
          light: '#E5B83B',
          muted: '#FCF7E8'
        },
        background: {
          DEFAULT: '#1A1C1A',
          card: '#242724',
          light: '#FAF7F2',
          paper: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif']
      }
    },
  },
  plugins: [],
}
