import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#fcfcfc', 
        surface: '#ffffff',    
        border: '#e5e7eb',
        primary: '#111827',     // Deep dark slate (Arc UI text color)
        muted: '#6b7280',       // Soft gray for paragraphs
        brand: {
          dark: '#1f2937',      // Primary Button background
          light: '#f9fafb',     // Secondary Button background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config