/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design token colors
        'ink-black': '#17191c',
        'paper-white': '#ffffff',
        'mist-gray': '#f2f2f3',
        'fog-white': '#fafafb',
        'slate-gray': '#777b86',
        'ash-gray': '#979799',
        'smoke-gray': '#a3a6af',
        'blush-peach': '#fbe1d1',
        'sienna-brown': '#5d2a1a',

        // Theme Semantic mappings
        'primary-text': '#17191c',
        'secondary-text': '#a3a6af',
        'primary-gray': '#777b86',
        'primary-background': '#ffffff',
        'secondary-background': '#fafafb',
        'light-gray': '#f7f7f8',
        'dark-gray': '#4c4c4c',

        // Transparencies
        'trans-5': 'rgba(4, 23, 43, 0.05)',
        'trans-10': 'rgba(10, 23, 43, 0.10)',
        'trans-15': 'rgba(14, 23, 43, 0.15)',
        'trans-20': 'rgba(14, 23, 43, 0.20)',
        'trans-25': 'rgba(14, 23, 43, 0.25)',
        'trans-50': 'rgba(14, 23, 43, 0.50)',
        'trans-blue-10': 'rgba(47, 111, 229, 0.11)',
      },
      fontFamily: {
        serif: ['Signifier', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['Sohne', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        sohne: ['Sohne', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        signifier: ['Signifier', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      fontWeight: {
        normal: '400',
        book: '430',
        w450: '450',
        w480: '480',
        medium: '500',
        semibold: '600',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '2xl-2': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        subtle: 'oklab(0 0 0 / 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.08) 0px 4px 24px 0px',
        'subtle-2': 'oklab(0 0 0 / 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 8px 40px 0px',
        'subtle-3': 'rgba(4, 23, 43, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px',
      },
      keyframes: {
        carousel: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'arrow-slide': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(3px)' },
        },
        'fade-in-y': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        carousel: 'carousel 32s linear infinite',
        'arrow-slide': 'arrow-slide 0.6s ease-in-out infinite',
        'fade-in-y': 'fade-in-y 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}
