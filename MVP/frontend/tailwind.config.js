/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#175CD3',
        'primary-dark': '#1849A9',
        navy: '#101828',
        slate: '#475467',
        muted: '#667085',
        border: '#E4E7EC',
        surface: '#F8FAFC',
        'status-green-bg': '#DCFCE7',
        'status-green-text': '#16803C',
        'status-amber-bg': '#FEF3C7',
        'status-amber-text': '#DC6803',
        'status-red-bg': '#FEE2E2',
        'status-red-text': '#B42318',
        'status-blue-bg': '#EFF6FF',
        'status-blue-text': '#175CD3',
      },
      fontFamily: {
        sora: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16,24,40,0.08)',
        dropdown: '0 4px 16px rgba(16,24,40,0.12)',
      },
    },
  },
  plugins: [],
}
