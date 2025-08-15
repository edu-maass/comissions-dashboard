/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Inter', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'Noto Sans', 'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol']
      },
      colors: {
        accent: {
          success: '#579369', // verde
          pending: '#AD6B4B', // terracota
        }
      },
      boxShadow: {
        soft: '0 6px 30px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
}
