import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Supports deployment to GitHub Pages (e.g. /new-pharma-world/) or custom domains / local dev
  base: process.env.VITE_BASE_PATH || './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
});
