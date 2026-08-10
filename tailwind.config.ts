import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Verde Oliva: fondo de las fotos y el logo — color rector del sitio
        oliva: {
          DEFAULT: '#656B4A',
          light: '#8A9160',
          dark: '#4A5038',
        },
        // Azul Lago Embalse — primario para nav, header, titulares
        lago: {
          DEFAULT: '#2E5266',
          light: '#3A6680',
          dark: '#1E3A4A',
        },
        // Gris Piedra — textos secundarios, bordes
        piedra: {
          DEFAULT: '#8C8478',
          light: '#A8A09A',
          dark: '#6B6460',
        },
        // Arena de Playa — fondo cálido del sitio
        arena: {
          DEFAULT: '#EDE4D3',
          dark: '#D4C9B0',
        },
        // Ámbar Atardecer — EXCLUSIVO para CTAs principales
        ambar: {
          DEFAULT: '#C97B3D',
          light: '#D99050',
          dark: '#A86030',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-bricolage)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
