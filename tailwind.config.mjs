/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        surface: {
          black: '#09090b',
          950: '#09090b',
          900: '#18181b',
          800: '#27272a',
          700: '#3f3f46',
          500: '#7a7a82',
          400: '#a1a1aa',
          200: '#e4e4e7',
          50: '#fafafa',
          white: '#fafafa',
        },
        accent: {
          DEFAULT: '#6366f1',
          muted: '#818cf8',
          dim: '#6366f118',
          ondark: '#a5b4fc',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'ui-serif', 'Georgia', 'serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        pill: '999px',
        input: '8px',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        micro: '150ms',
        base: '300ms',
        reveal: '600ms',
      },
    },
  },
};
