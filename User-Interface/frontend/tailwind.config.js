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
        accent: 'var(--accent-color)',
        neutral: {
          DEFAULT: '#e5e7eb',
          light: '#f3f4f6',
          dark: '#6b7280',
        },
        text: '#111827',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}