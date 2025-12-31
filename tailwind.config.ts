import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        'fade-to-white': {
          // Begint bij een hele lichte versie van jouw paars
          '0%': {
            backgroundColor: 'hsl(265 89% 95%)',
            borderColor: 'hsl(265 89% 80%)',
          },
          '100%': {
            backgroundColor: '#ffffff',
            borderColor: 'hsl(var(--border))',
          },
        },
      },
      animation: {
        'highlight-jobify': 'fade-to-white 4s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
export default config
