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
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        navy: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          bg:      '#FFFFFF',
          card:    '#F8FAFC',
          border:  '#E2E8F0',
          text:    '#0F172A',
          muted:   '#64748B',
        }
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        heading: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'card':   '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.14)',
        'glow':   '0 0 20px rgba(245,158,11,0.3)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:   { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp:  { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
        slideDown:{ '0%': { transform: 'translateY(-20px)', opacity: 0 },'100%': { transform: 'translateY(0)', opacity: 1 } },
      },
      backgroundImage: {
        'hero-gradient':    'linear-gradient(135deg, #FFFFFF 0%, #f0f9ff 50%, #FFFFFF 100%)',
        'card-gradient':    'linear-gradient(145deg, #F8FAFC, #FFFFFF)',
        'gold-gradient':    'linear-gradient(135deg, #4ade80, #16a34a)',
        'glass':            'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))',
      },
    },
  },
  plugins: [],
}
