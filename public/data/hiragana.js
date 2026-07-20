const HIRAGANA_GROUPS = [
  { index: 0, kana: ['あ', 'い', 'う', 'え', 'お'] },
  { index: 1, kana: ['か', 'き', 'く', 'け', 'こ'] },
  { index: 2, kana: ['さ', 'し', 'す', 'せ', 'そ'] },
  { index: 3, kana: ['た', 'ち', 'つ', 'て', 'と'] },
  { index: 4, kana: ['な', 'に', 'ぬ', 'ね', 'の'] },
  { index: 5, kana: ['は', 'ひ', 'ふ', 'へ', 'ほ'] },
  { index: 6, kana: ['ま', 'み', 'む', 'め', 'も'] },
  { index: 7, kana: ['や', 'ゆ', 'よ', 'ら', 'り'] },
  { index: 8, kana: ['る', 'れ', 'ろ', 'わ', 'を'] },
  { index: 9, kana: ['ん'] },

  // ----- stage 2: dakuten (゛) -----
  { index: 10, kana: ['が', 'ぎ', 'ぐ', 'げ', 'ご'] },
  { index: 11, kana: ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'] },
  { index: 12, kana: ['だ', 'ぢ', 'づ', 'で', 'ど'] },
  { index: 13, kana: ['ば', 'び', 'ぶ', 'べ', 'ぼ'] },

  // ----- stage 3: handakuten (゜) -----
  { index: 14, kana: ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'] },

  // ----- stage 4: combination kana (small ゃゅょ) -----
  { index: 15, kana: ['きゃ', 'きゅ', 'きょ'] },
  { index: 16, kana: ['しゃ', 'しゅ', 'しょ'] },
  { index: 17, kana: ['ちゃ', 'ちゅ', 'ちょ'] },
  { index: 18, kana: ['にゃ', 'にゅ', 'にょ'] },
  { index: 19, kana: ['ひゃ', 'ひゅ', 'ひょ'] },
  { index: 20, kana: ['みゃ', 'みゅ', 'みょ'] },
  { index: 21, kana: ['りゃ', 'りゅ', 'りょ'] },
  { index: 22, kana: ['ぎゃ', 'ぎゅ', 'ぎょ'] },
  { index: 23, kana: ['じゃ', 'じゅ', 'じょ'] },
  { index: 24, kana: ['びゃ', 'びゅ', 'びょ'] },
  { index: 25, kana: ['ぴゃ', 'ぴゅ', 'ぴょ'] }
];

const HIRAGANA = [
  // group 0 — あいうえお
  { kana: 'あ', romaji: 'a', group: 0 },
  { kana: 'い', romaji: 'i', group: 0 },
  { kana: 'う', romaji: 'u', group: 0 },
  { kana: 'え', romaji: 'e', group: 0 },
  { kana: 'お', romaji: 'o', group: 0 },

  // group 1 — かきくけこ
  { kana: 'か', romaji: 'ka', group: 1 },
  { kana: 'き', romaji: 'ki', group: 1 },
  { kana: 'く', romaji: 'ku', group: 1 },
  { kana: 'け', romaji: 'ke', group: 1 },
  { kana: 'こ', romaji: 'ko', group: 1 },

  // group 2 — さしすせそ
  { kana: 'さ', romaji: 'sa', group: 2 },
  { kana: 'し', romaji: 'shi', group: 2 },
  { kana: 'す', romaji: 'su', group: 2 },
  { kana: 'せ', romaji: 'se', group: 2 },
  { kana: 'そ', romaji: 'so', group: 2 },

  // group 3 — たちつてと
  { kana: 'た', romaji: 'ta', group: 3 },
  { kana: 'ち', romaji: 'chi', group: 3 },
  { kana: 'つ', romaji: 'tsu', group: 3 },
  { kana: 'て', romaji: 'te', group: 3 },
  { kana: 'と', romaji: 'to', group: 3 },

  // group 4 — なにぬねの
  { kana: 'な', romaji: 'na', group: 4 },
  { kana: 'に', romaji: 'ni', group: 4 },
  { kana: 'ぬ', romaji: 'nu', group: 4 },
  { kana: 'ね', romaji: 'ne', group: 4 },
  { kana: 'の', romaji: 'no', group: 4 },

  // group 5 — はひふへほ
  { kana: 'は', romaji: 'ha', group: 5 },
  { kana: 'ひ', romaji: 'hi', group: 5 },
  { kana: 'ふ', romaji: 'fu', group: 5 },
  { kana: 'へ', romaji: 'he', group: 5 },
  { kana: 'ほ', romaji: 'ho', group: 5 },

  // group 6 — まみむめも
  { kana: 'ま', romaji: 'ma', group: 6 },
  { kana: 'み', romaji: 'mi', group: 6 },
  { kana: 'む', romaji: 'mu', group: 6 },
  { kana: 'め', romaji: 'me', group: 6 },
  { kana: 'も', romaji: 'mo', group: 6 },

  // group 7 — やゆよらり
  { kana: 'や', romaji: 'ya', group: 7 },
  { kana: 'ゆ', romaji: 'yu', group: 7 },
  { kana: 'よ', romaji: 'yo', group: 7 },
  { kana: 'ら', romaji: 'ra', group: 7 },
  { kana: 'り', romaji: 'ri', group: 7 },

  // group 8 — るれろわを
  { kana: 'る', romaji: 'ru', group: 8 },
  { kana: 'れ', romaji: 're', group: 8 },
  { kana: 'ろ', romaji: 'ro', group: 8 },
  { kana: 'わ', romaji: 'wa', group: 8 },
  { kana: 'を', romaji: 'wo', group: 8 },

  // group 9 — ん
  { kana: 'ん', romaji: 'n', group: 9 },

  // ----- stage 2: dakuten (゛) -----

  // group 10 — がぎぐげご
  { kana: 'が', romaji: 'ga', group: 10 },
  { kana: 'ぎ', romaji: 'gi', group: 10 },
  { kana: 'ぐ', romaji: 'gu', group: 10 },
  { kana: 'げ', romaji: 'ge', group: 10 },
  { kana: 'ご', romaji: 'go', group: 10 },

  // group 11 — ざじずぜぞ
  { kana: 'ざ', romaji: 'za', group: 11 },
  { kana: 'じ', romaji: 'ji', group: 11 },
  { kana: 'ず', romaji: 'zu', group: 11 },
  { kana: 'ぜ', romaji: 'ze', group: 11 },
  { kana: 'ぞ', romaji: 'zo', group: 11 },

  // group 12 — だぢづでど
  { kana: 'だ', romaji: 'da', group: 12 },
  { kana: 'ぢ', romaji: 'dji', group: 12 },
  { kana: 'づ', romaji: 'dzu', group: 12 },
  { kana: 'で', romaji: 'de', group: 12 },
  { kana: 'ど', romaji: 'do', group: 12 },

  // group 13 — ばびぶべぼ
  { kana: 'ば', romaji: 'ba', group: 13 },
  { kana: 'び', romaji: 'bi', group: 13 },
  { kana: 'ぶ', romaji: 'bu', group: 13 },
  { kana: 'べ', romaji: 'be', group: 13 },
  { kana: 'ぼ', romaji: 'bo', group: 13 },

  // ----- stage 3: handakuten (゜) -----

  // group 14 — ぱぴぷぺぽ
  { kana: 'ぱ', romaji: 'pa', group: 14 },
  { kana: 'ぴ', romaji: 'pi', group: 14 },
  { kana: 'ぷ', romaji: 'pu', group: 14 },
  { kana: 'ぺ', romaji: 'pe', group: 14 },
  { kana: 'ぽ', romaji: 'po', group: 14 },

  // ----- stage 4: combination kana (small ゃゅょ) -----

  // group 15 — きゃきゅきょ
  { kana: 'きゃ', romaji: 'kya', group: 15 },
  { kana: 'きゅ', romaji: 'kyu', group: 15 },
  { kana: 'きょ', romaji: 'kyo', group: 15 },

  // group 16 — しゃしゅしょ
  { kana: 'しゃ', romaji: 'sha', group: 16 },
  { kana: 'しゅ', romaji: 'shu', group: 16 },
  { kana: 'しょ', romaji: 'sho', group: 16 },

  // group 17 — ちゃちゅちょ
  { kana: 'ちゃ', romaji: 'cha', group: 17 },
  { kana: 'ちゅ', romaji: 'chu', group: 17 },
  { kana: 'ちょ', romaji: 'cho', group: 17 },

  // group 18 — にゃにゅにょ
  { kana: 'にゃ', romaji: 'nya', group: 18 },
  { kana: 'にゅ', romaji: 'nyu', group: 18 },
  { kana: 'にょ', romaji: 'nyo', group: 18 },

  // group 19 — ひゃひゅひょ
  { kana: 'ひゃ', romaji: 'hya', group: 19 },
  { kana: 'ひゅ', romaji: 'hyu', group: 19 },
  { kana: 'ひょ', romaji: 'hyo', group: 19 },

  // group 20 — みゃみゅみょ
  { kana: 'みゃ', romaji: 'mya', group: 20 },
  { kana: 'みゅ', romaji: 'myu', group: 20 },
  { kana: 'みょ', romaji: 'myo', group: 20 },

  // group 21 — りゃりゅりょ
  { kana: 'りゃ', romaji: 'rya', group: 21 },
  { kana: 'りゅ', romaji: 'ryu', group: 21 },
  { kana: 'りょ', romaji: 'ryo', group: 21 },

  // group 22 — ぎゃぎゅぎょ
  { kana: 'ぎゃ', romaji: 'gya', group: 22 },
  { kana: 'ぎゅ', romaji: 'gyu', group: 22 },
  { kana: 'ぎょ', romaji: 'gyo', group: 22 },

  // group 23 — じゃじゅじょ
  { kana: 'じゃ', romaji: 'ja', group: 23 },
  { kana: 'じゅ', romaji: 'ju', group: 23 },
  { kana: 'じょ', romaji: 'jo', group: 23 },

  // group 24 — びゃびゅびょ
  { kana: 'びゃ', romaji: 'bya', group: 24 },
  { kana: 'びゅ', romaji: 'byu', group: 24 },
  { kana: 'びょ', romaji: 'byo', group: 24 },

  // group 25 — ぴゃぴゅぴょ
  { kana: 'ぴゃ', romaji: 'pya', group: 25 },
  { kana: 'ぴゅ', romaji: 'pyu', group: 25 },
  { kana: 'ぴょ', romaji: 'pyo', group: 25 }
];