/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
          light: '#bfdbfe',
        },
        accent: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#a7f3d0',
        },
        neutral: {
          DEFAULT: '#e5e7eb',
          light: '#f3f4f6',
          dark: '#6b7280',
        },
        text: '#111827',
      },
    },
  },
  plugins: [],
}