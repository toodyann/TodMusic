import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/TodMusic/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'html/aboutUs.html'),
        support: resolve(__dirname, 'html/supportService.html'),
        acct: resolve(__dirname, 'html/acct.html'),
        adveresting: resolve(__dirname, 'html/advertising.html'),
        subscription: resolve(__dirname, 'html/subscription.html'),
        faq: resolve(__dirname, 'html/information.html'),
        vacancies: resolve(__dirname, 'html/vacancies.html'),
      },
    },
  },
});