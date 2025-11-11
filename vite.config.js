import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/TodMusic/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'aboutUs.html'),
        support: resolve(__dirname, 'supportService.html'),
      },
    },
  },
});