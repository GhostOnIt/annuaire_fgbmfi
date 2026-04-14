/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf9ed',
          100: '#faf0d0',
          200: '#f5e0a0',
          300: '#edcc6a',
          400: '#e6b83d',
          500: '#d4a017',
          600: '#b8860b',
          700: '#96690d',
          800: '#7a5312',
          900: '#654415',
        },
        dark: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
      },
    },
  },
  plugins: [],
};
