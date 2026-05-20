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
        background: '#0e1015',
        surface: '#161920',
        'surface-hover': '#1c1f27',
        border: '#2a2d37',
        'text-primary': '#e4e5e7',
        'text-secondary': '#8a8d95',
        primary: '#5e6ad2',
        'primary-hover': '#6b77e0',
        success: '#39d39c',
        warning: '#f0a030',
        danger: '#e5484d',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
