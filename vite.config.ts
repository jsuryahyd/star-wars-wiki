import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/star-wars-wiki/' : '/',
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: { vi: true },
    setupFiles: ["fake-indexeddb/auto", './src/test-utils/setupTests.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
}));
