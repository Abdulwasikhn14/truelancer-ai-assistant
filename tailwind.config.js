/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#0284C7',
        cyan: '#38BDF8',
        secondary: '#0EA5E9',
        accent: '#38BDF8',
        neon: '#0284C7',
        surface: {
          DEFAULT: '#ffffff',
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
        },
        dark: {
          DEFAULT: '#080B14',
          100: '#0D1117',
          200: '#111827',
          300: '#1C2333',
          400: '#243044',
        },
        card: '#0D1117',
        border: '#1C2333',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0284C7, #38BDF8)',
        'gradient-cool': 'linear-gradient(135deg, #0284C7, #0EA5E9)',
        'gradient-warm': 'linear-gradient(135deg, #38BDF8, #0284C7)',
      },
      boxShadow: {
        'glow-sm':  '0 0 15px rgba(2,132,199,0.15)',
        'glow':     '0 0 30px rgba(2,132,199,0.2)',
        'glow-lg':  '0 0 60px rgba(2,132,199,0.25)',
        'glow-cyan': '0 0 30px rgba(56,189,248,0.2)',
      },
    },
  },
  plugins: [],
}
