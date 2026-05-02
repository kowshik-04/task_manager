/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f5f7fb',
        card: '#ffffff',
        accent: '#4c7cf0',
        accentSoft: '#eaf0ff',
        textMain: '#263043',
        textMuted: '#6f7a8f'
      },
      borderRadius: {
        soft: '1rem',
        panel: '1.25rem'
      },
      transitionTimingFunction: {
        smooth: 'ease'
      },
      boxShadow: {
        soft: '0 6px 20px rgba(45, 65, 95, 0.06)'
      }
    }
  },
  plugins: []
};
