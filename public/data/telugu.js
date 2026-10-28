// Telugu script: vowels then consonant rows (ISO 15919-style romanization).
// Retroflex consonants use a leading capital letter (Ta, Tha, Da, Dha, Na).
// Palatal s (శ) = sha; retroflex s (ష) = Sha; dental s (స) = sa.

const TELUGU_GROUPS = [
  { index: 0, kana: ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ'] },
  { index: 1, kana: ['ఊ', 'ఋ', 'ఎ', 'ఏ', 'ఐ'] },
  { index: 2, kana: ['ఒ', 'ఓ', 'ఔ'] },
  { index: 3, kana: ['క', 'ఖ', 'గ', 'ఘ', 'ఙ'] },
  { index: 4, kana: ['చ', 'ఛ', 'జ', 'ఝ', 'ఞ'] },
  { index: 5, kana: ['ట', 'ఠ', 'డ', 'ఢ', 'ణ'] },
  { index: 6, kana: ['త', 'థ', 'ద', 'ధ', 'న'] },
  { index: 7, kana: ['ప', 'ఫ', 'బ', 'భ', 'మ'] },
  { index: 8, kana: ['య', 'ర', 'ల', 'వ', 'శ'] },
  { index: 9, kana: ['ష', 'స', 'హ', 'ళ', 'ఱ'] }
];

const TELUGU = [
  { kana: 'అ', romaji: 'a', group: 0 },
  { kana: 'ఆ', romaji: 'aa', group: 0 },
  { kana: 'ఇ', romaji: 'i', group: 0 },
  { kana: 'ఈ', romaji: 'ii', group: 0 },
  { kana: 'ఉ', romaji: 'u', group: 0 },

  { kana: 'ఊ', romaji: 'uu', group: 1 },
  { kana: 'ఋ', romaji: 'ru', group: 1 },
  { kana: 'ఎ', romaji: 'e', group: 1 },
  { kana: 'ఏ', romaji: 'ee', group: 1 },
  { kana: 'ఐ', romaji: 'ai', group: 1 },

  { kana: 'ఒ', romaji: 'o', group: 2 },
  { kana: 'ఓ', romaji: 'oo', group: 2 },
  { kana: 'ఔ', romaji: 'au', group: 2 },

  { kana: 'క', romaji: 'ka', group: 3 },
  { kana: 'ఖ', romaji: 'kha', group: 3 },
  { kana: 'గ', romaji: 'ga', group: 3 },
  { kana: 'ఘ', romaji: 'gha', group: 3 },
  { kana: 'ఙ', romaji: 'nga', group: 3 },

  { kana: 'చ', romaji: 'ca', group: 4 },
  { kana: 'ఛ', romaji: 'cha', group: 4 },
  { kana: 'జ', romaji: 'ja', group: 4 },
  { kana: 'ఝ', romaji: 'jha', group: 4 },
  { kana: 'ఞ', romaji: 'nya', group: 4 },

  { kana: 'ట', romaji: 'Ta', group: 5 },
  { kana: 'ఠ', romaji: 'Tha', group: 5 },
  { kana: 'డ', romaji: 'Da', group: 5 },
  { kana: 'ఢ', romaji: 'Dha', group: 5 },
  { kana: 'ణ', romaji: 'Na', group: 5 },

  { kana: 'త', romaji: 'ta', group: 6 },
  { kana: 'థ', romaji: 'tha', group: 6 },
  { kana: 'ద', romaji: 'da', group: 6 },
  { kana: 'ధ', romaji: 'dha', group: 6 },
  { kana: 'న', romaji: 'na', group: 6 },

  { kana: 'ప', romaji: 'pa', group: 7 },
  { kana: 'ఫ', romaji: 'pha', group: 7 },
  { kana: 'బ', romaji: 'ba', group: 7 },
  { kana: 'భ', romaji: 'bha', group: 7 },
  { kana: 'మ', romaji: 'ma', group: 7 },

  { kana: 'య', romaji: 'ya', group: 8 },
  { kana: 'ర', romaji: 'ra', group: 8 },
  { kana: 'ల', romaji: 'la', group: 8 },
  { kana: 'వ', romaji: 'va', group: 8 },
  { kana: 'శ', romaji: 'sha', group: 8 },

  { kana: 'ష', romaji: 'Sha', group: 9 },
  { kana: 'స', romaji: 'sa', group: 9 },
  { kana: 'హ', romaji: 'ha', group: 9 },
  { kana: 'ళ', romaji: 'La', group: 9 },
  { kana: 'ఱ', romaji: 'Ra', group: 9 }
];
