/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          light: '#5A7FC0',
          DEFAULT: '#4A6FA5',
          dark: '#3A5A8C',
        },
        secondary: {
          light: '#6D82B6',
          DEFAULT: '#5D72A6',
          dark: '#4D6296',
        },
        accent: {
          light: '#6BDCE9',
          DEFAULT: '#5BCCD9',
          dark: '#4BBCC9',
        },
        background: {
          light: '#FFFFFF',
          DEFAULT: '#F5F7FA',
          dark: '#EDF2F7',
        },
        // Dark mode colors
        dark: {
          background: {
            light: '#1e1e1e',
            DEFAULT: '#121212',
            dark: '#0a0a0a',
          },
          surface: {
            light: '#2d2d2d',
            DEFAULT: '#1d1d1d',
            dark: '#171717',
          },
          border: '#2e2e2e',
          text: {
            primary: '#FFFFFF',
            secondary: '#A0AEC0',
            muted: '#718096',
          },
        },
        // Common colors
        success: '#48BB78',
        warning: '#ED8936',
        error: '#F56565',
        info: '#4299E1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'smooth': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'smooth-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
} 