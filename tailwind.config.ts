import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'highlight-fade': {
          '0%': {
            backgroundColor: 'hsl(265 89% 80% / 0.2)',
            borderColor: 'hsl(265 89% 70%)',
          },
          '100%': {
            backgroundColor: 'transparent',
            borderColor: 'hsl(var(--border))',
          },
        },
      },
      animation: {
        'highlight-jobify': 'highlight-fade 4s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;
