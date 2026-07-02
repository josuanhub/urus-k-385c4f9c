/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          50:  '#f0efff',
          100: '#e3e1ff',
          200: '#cbc8ff',
          300: '#aaa5ff',
          400: '#8880ff',
          500: '#6C63FF',
          600: '#5a50f5',
          700: '#4a40db',
          800: '#3c34b0',
          900: '#322d8a',
        },
        accent: {
          DEFAULT: '#00D4AA',
          50:  '#e6fff9',
          100: '#b3fff0',
          200: '#66ffe0',
          300: '#1affd0',
          400: '#00e6b8',
          500: '#00D4AA',
          600: '#00b890',
          700: '#009876',
          800: '#007a5e',
          900: '#005c47',
        },
        surface: {
          DEFAULT: '#1A1A2E',
          50:  '#f0f0f7',
          100: '#d8d8ec',
          200: '#b0b0d9',
          300: '#8888c6',
          400: '#5555a8',
          500: '#2e2e5e',
          600: '#252548',
          700: '#1A1A2E',
          800: '#12121f',
          900: '#0d0d17',
        },
        base: {
          DEFAULT: '#0A0A0F',
          50:  '#e8e8ea',
          100: '#c5c5cb',
          200: '#9e9ea8',
          300: '#777785',
          400: '#555566',
          500: '#333347',
          600: '#1f1f2e',
          700: '#141419',
          800: '#0A0A0F',
          900: '#050508',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6C63FF 0%, #00D4AA 100%)',
        'gradient-dark':  'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 100%)',
      },
      boxShadow: {
        'primary': '0 0 20px rgba(108, 99, 255, 0.35)',
        'accent':  '0 0 20px rgba(0, 212, 170, 0.35)',
        'glow':    '0 0 40px rgba(108, 99, 255, 0.2)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};