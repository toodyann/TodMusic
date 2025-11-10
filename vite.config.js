import { defineConfig } from 'vite';

export default defineConfig({
  base: '/TodMusic/',
  server: {
    port: 3003,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
});
