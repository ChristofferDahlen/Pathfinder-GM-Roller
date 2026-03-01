// https://nuxt.com/docs/api/configuration/nuxt-config

import Aura from '@primeuix/themes/aura'
import {definePreset} from "@primeuix/styled";
definePreset(Aura, {
  semantic: {
    light: {
      surface: {
        0: '#ffffff',
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
      },
      primary: {
        color: '{primary.500}',
        contrastColor: '#ffffff',
        hoverColor: '{primary.600}',
        activeColor: '{primary.700}'
      },
      highlight: {
        background: '{primary.100}',
        focusBackground: '{primary.100}',
        color: '{primary.700}',
        focusColor: '{primary.800}'
      },
    },
    dark: {
      surface: {
        0: '#00000',
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
      },
      primary: {
        darkMode: true,
        color: '{primary.400}',
        contrastColor: '{surface.900}',
        hoverColor: '{primary.300}',
        activeColor: '{primary.200}'
      },
      highlight: {
        background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
        focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
        color: 'rgba(255,255,255,.87)',
        focusColor: 'rgba(255,255,255,.87)'
      }
    }
  }
});

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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
          preset: Aura
      },
      components: {
        include: ['ConfirmDialog']
      }
    }
  },
  css: [
  ]


})
