// Root-absolute URLs so /japanese/ and /telugu/ share the same public/ assets.

function assetUrl(relativePath) {
  const path = String(relativePath || '').replace(/^\//, '');
  return `/${path}`;
}
