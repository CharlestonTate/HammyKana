// HammyKana: static global scripts in public/; Vite builds multi-page entries for / and /telugu/.
export default {
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        japanese: 'japanese/index.html',
        telugu: 'telugu/index.html'
      }
    }
  }
};
