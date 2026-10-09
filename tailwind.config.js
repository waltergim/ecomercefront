export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ml: {
          yellow: '#FFE600',
          yellowDark: '#F2D900',
          blue: '#3483FA',
          blueDark: '#2968C8',
          blueLight: '#E3EDFB',
          bg: '#EBEBEB',
          text: '#333333',
          muted: '#666666',
          line: '#E5E5E5',
          green: '#00A650',
          red: '#F23D4F',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0,0,0,.08)',
        hover: '0 8px 28px 0 rgba(0,0,0,.15)',
        panel: '0 1px 4px 0 rgba(0,0,0,.12)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pop: {
          '0%': { transform: 'scale(.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeUp: 'fadeUp .35s ease-out both',
        pop: 'pop .18s ease-out both',
        shimmer: 'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
}
