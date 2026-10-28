// English “sounds like” hints from public/data/pronunciation/*.json

const PRONUNCIATION_HINTS = {
  hiragana: {},
  katakana: {},
  telugu: {}
};

function getPronunciationHint(trackId, char, romaji) {
  const table = PRONUNCIATION_HINTS[trackId] || {};
  if (char && table[char]) {
    return table[char];
  }

  if (romaji) {
    return `${romaji} (English hint coming soon)`;
  }

  return '';
}

async function loadPronunciationHints() {
  const tracks = Object.keys(PRONUNCIATION_HINTS);

  await Promise.all(
    tracks.map(async (trackId) => {
      try {
        const response = await fetch(assetUrl(`data/pronunciation/${trackId}.json`));
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        PRONUNCIATION_HINTS[trackId] = await response.json();
      } catch (error) {
        console.warn(`Could not load pronunciation hints for ${trackId}:`, error);
        PRONUNCIATION_HINTS[trackId] = {};
      }
    })
  );
}
