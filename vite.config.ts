import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: {vi: true},
    setupFiles: ['./src/test-utils/setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
