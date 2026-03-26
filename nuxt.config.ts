// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from '@primeuix/themes/aura'
import {definePreset} from "@primeuix/styled";
const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a'
        }
      },
      dark: {
        surface: {
          0: '#000000',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '{slate.600}',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '{slate.900}',
          950: '{slate.950}'
        }
      }
    }
  }
});

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      style: [
        { innerHTML: 'html, body { margin: 0; padding: 0; background: #030712; }' }
      ]
    }
  },

  ssr: false,

  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/test-utils',
    'nuxt-mdi'
  ],
  build: {
    transpile: ['primevue'], // Ensure PrimeVue files are transpiled
  },
  primevue: {
    options: {
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark'
        }
      },
      components: {
        include: ['ConfirmDialog']
      }
    }
  },
  css: [
    '@/assets/styles/main.scss'
  ]


})
