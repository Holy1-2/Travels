import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#15473A',
        pine: '#256B57',
        fern: '#6E9684',
        gold: '#BE5B3F',
        sunflower: '#E7C2B2',
        sandstone: '#EEE7DD',
        soft: '#F7F7F5',
        mist: '#F2F2EE',
        ink: '#1B1B19',
        mute: '#6D6D66',
        line: '#E8E8E2',
        clay: '#AC3D2A',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        // Legacy alias — display headings should always be the clean sans.
        serif: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(27, 27, 25, 0.04), 0 6px 20px -14px rgba(27, 27, 25, 0.14)',
        lift: '0 10px 34px -18px rgba(27, 27, 25, 0.22)',
        nav: '0 1px 0 rgba(27, 27, 25, 0.06)',
        search: '0 3px 12px rgba(27, 27, 25, 0.07), 0 16px 38px -26px rgba(27, 27, 25, 0.22)',
        gold: '0 10px 28px -18px rgba(190, 91, 63, 0.45)',
      },
      maxWidth: {
        wrap: '1216px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.28)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '100%': { transform: 'translate3d(0,-14px,0) scale(1.04)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pop: 'pop 0.45s ease-out',
        shimmer: 'shimmer 2.4s linear infinite',
        drift: 'drift 14s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};

export default config;
