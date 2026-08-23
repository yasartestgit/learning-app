import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    // Mirrors tsconfig.json's "@/*" -> "./src/*" — Vitest uses Vite's own
    // module resolution, not tsconfig, so this needs to be declared separately.
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
  },
})
