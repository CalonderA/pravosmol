/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0B', // фон страницы — тёплый графит, почти чёрный
        coal: '#101012', // панели поверх фона
        graphite: '#161619', // приподнятые блоки
        smoke: '#1E1E22', // ховеры, вводы
        gold: {
          DEFAULT: '#C6A15B', // шампанское золото
          soft: '#D9BC85',
          bright: '#EDDCB0',
          deep: '#8C6F3A',
        },
        cream: '#F1ECE2', // молочные секции
        ivory: '#E6DECD',
        fog: '#98948B', // приглушённый текст на тёмном
        smokeLight: '#B9B4AA',
        onyx: '#2A2724', // текст на кремовом
        clay: '#6E675B', // вторичный текст на кремовом
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        registry: '0.32em',
        wide2: '0.18em',
      },
      maxWidth: {
        shell: '84rem',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        'gold-sheen':
          'linear-gradient(105deg, #8C6F3A 0%, #C6A15B 32%, #EDDCB0 50%, #C6A15B 68%, #8C6F3A 100%)',
        'hero-veil':
          'linear-gradient(100deg, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.55) 42%, rgba(10,10,11,0.18) 68%, rgba(10,10,11,0.05) 100%)',
      },
    },
  },
  plugins: [],
};
