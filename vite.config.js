// HammyKana has no JS modules/bundling to do - it's plain global scripts loaded in
// order by index.html. Everything they need (css/, data/, js/, hammy.js, img/, sfx/)
// lives in public/, which Vite copies to dist/ as-is. This config just makes the
// build output explicit; Vite's defaults already do the rest.
export default {
  build: {
    outDir: 'dist'
  }
};
