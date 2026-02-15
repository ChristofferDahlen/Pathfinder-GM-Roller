/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

export default {
  content: [
    './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}', // PrimeVue components
    './node_modules/tailwindcss-primeui/**/*.js', // PrimeUI classes
    './app/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
    },
  },
  plugins: [PrimeUI]
}

