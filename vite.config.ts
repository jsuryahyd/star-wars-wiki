import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
// https://vite.dev/config/
export default defineConfig({
  base: '/star-wars-wiki/', // Set base to your repo name for GitHub Pages
  plugins: [react(),tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: {vi: true},
    setupFiles: ["fake-indexeddb/auto", './src/test-utils/setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
