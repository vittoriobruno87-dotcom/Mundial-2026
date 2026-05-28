import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-bebas)', 'Bebas Neue', 'cursive'],
        body: ['var(--font-dm)', 'DM Sans', 'sans-serif'],
      },
      colors: {
        gold: '#F5A623',
        accent: '#00C853',
        surface: '#131929',
        surface2: '#1C2438',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.35s ease both',
        'pulse-dot': 'pulse 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
