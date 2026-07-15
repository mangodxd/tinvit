import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '0px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',
        lg: '24px',
      },
    },
    extend: {
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      fontSize: {
        hero: ['60px', { lineHeight: '1.2', fontWeight: '700' }],
        display: ['40px', { lineHeight: '1.2', fontWeight: '600' }],
        title: ['30px', { lineHeight: '1.2', fontWeight: '500' }],
        heading: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        subheading: ['20px', { lineHeight: '1.3', fontWeight: '500' }],
        body: ['16px', { lineHeight: '1.6' }],
        caption: ['14px', { lineHeight: '1.4' }],
        small: ['12px', { lineHeight: '1.4' }],
      },
      colors: {
        primary: '#e53935',
        dark: '#0f172a',
        body: '#1f2937',
        meta: '#6b7280',
        page: '#f4f5f7',
        surface: '#ffffff',
        accent: '#f0f2f5',
        footer: '#1e293b',
        'footer-text': '#94a3b8',
        category: {
          politics: '#e53935',
          business: '#009688',
          tech: '#546e7a',
          health: '#f4511e',
          entertainment: '#ec008c',
          sports: '#0089ff',
          travel: '#f57f17',
          education: '#605ca8',
          lifestyle: '#43a047',
          food: '#ffab00',
        },
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
      },
      boxShadow: {
        card: '0 1px 10px 5px rgba(225, 225, 225, 0.5)',
        'card-accent': '0 1px 10px 5px rgba(229, 57, 53, 0.5)',
      },
      borderRadius: {
        none: '0px',
      },
      borderColor: {
        DEFAULT: '#dcdcdc',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-33.333%, 0, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        ticker: 'ticker 25s linear infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};

export default config;
