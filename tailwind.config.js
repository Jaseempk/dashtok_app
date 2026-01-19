/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary - Cyan/Teal
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00f5d4', // Main accent
          600: '#00d4b8',
          700: '#0891b2',
          800: '#155e75',
          900: '#164e63',
        },
        // Secondary - Orange (streaks)
        secondary: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        // Backgrounds
        background: {
          primary: '#0a0f1a',
          secondary: '#111827',
          tertiary: '#1f2937',
        },
        // Borders
        border: {
          subtle: '#1f2937',
          default: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrainsMono', 'monospace'],
      },
    },
  },
  plugins: [],
};
