/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        console: {
          bg: '#0B0F1A',
          panel: '#131A2A',
          panel2: '#1A2236',
          border: '#252E45',
          text: '#E4E7EF',
          muted: '#8891A8',
        },
        signal: {
          cyan: '#4FD1C5',
          amber: '#F2B441',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(79,209,197,0.15), 0 8px 30px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
}
