import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    name: 'unit',
    include: ['./test/unit/*.test.ts'],
    environment: 'happy-dom',
    globals: true
  },
})
