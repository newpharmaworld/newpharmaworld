/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0B8F87', // Primary Medical Teal
          700: '#09736D',
          800: '#0E5C57',
          900: '#134E48',
          950: '#042F2E',
        },
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#102A43', // Secondary Dark Navy
          950: '#0B1C2E',
        },
        surface: {
          bg: '#F5FAFA',
          card: '#FFFFFF',
          muted: '#F8FAFC',
          border: '#E2E8F0',
        },
        clinical: {
          dark: '#1F2937',
          muted: '#64748B',
          light: '#94A3B8',
          accent: '#0B8F87',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(16, 42, 67, 0.06), 0 1px 4px -1px rgba(16, 42, 67, 0.04)',
        'card-hover': '0 12px 24px -6px rgba(11, 143, 135, 0.12), 0 4px 8px -2px rgba(16, 42, 67, 0.06)',
        'modal': '0 25px 50px -12px rgba(16, 42, 67, 0.25)',
      },
    },
  },
  plugins: [],
}
