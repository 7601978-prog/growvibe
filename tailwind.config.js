/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%':       { transform: 'translateX(-6px)' },
          '30%':       { transform: 'translateX(6px)' },
          '45%':       { transform: 'translateX(-5px)' },
          '60%':       { transform: 'translateX(5px)' },
          '75%':       { transform: 'translateX(-3px)' },
          '90%':       { transform: 'translateX(3px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(217,119,87,0)' },
          '30%':       { boxShadow: '0 0 0 6px rgba(217,119,87,0.25)' },
          '70%':       { boxShadow: '0 0 0 4px rgba(217,119,87,0.15)' },
        },
      },
      animation: {
        shake: 'shake 0.7s ease-in-out',
        glow:  'glow 1.2s ease-in-out',
      },
    },
  },
  plugins: [],
}
