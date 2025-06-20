// tailwind.config.ts
export default {
    theme: {
      extend: {
        keyframes: {
          'fade-in': {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' }
          },
          'slide-up': {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' }
          }
        },
        animation: {
          'fade-in': 'fade-in 0.6s ease-out forwards',
          'slide-up': 'slide-up 0.6s ease-out forwards'
        }
      }
    }
  }
  