/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A6FA5',
        secondary: '#5D72A6',
        accent: '#5BCCD9',
        background: '#F5F7FA',
        darkText: '#2D3748',
        lightText: '#718096'
      }
    },
  },
  plugins: [],
} 