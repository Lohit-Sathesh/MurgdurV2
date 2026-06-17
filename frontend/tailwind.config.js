/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'luxury-black': '#0a0a0a',
        'luxury-white': '#f5f0eb',
        'luxury-gray':  '#2a2a2a',
        'luxury-muted': '#888880',
      },
      fontFamily: {
        serif: ['LuxurySerif', 'serif'],
        sans:  ['LuxurySans', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.15em',
        wide:   '0.08em',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      keyframes: {
        kenburns: {
          '0%':   { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.12)' },
        },
      },
      animation: {
        kenburns: 'kenburns 12s ease-out forwards',
      },
    },
  },
  plugins: [],
}
