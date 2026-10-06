const KATAKANA_GROUPS = [
  { index: 0, kana: ['ア', 'イ', 'ウ', 'エ', 'オ'] },
  { index: 1, kana: ['カ', 'キ', 'ク', 'ケ', 'コ'] },
  { index: 2, kana: ['サ', 'シ', 'ス', 'セ', 'ソ'] },
  { index: 3, kana: ['タ', 'チ', 'ツ', 'テ', 'ト'] },
  { index: 4, kana: ['ナ', 'ニ', 'ヌ', 'ネ', 'ノ'] },
  { index: 5, kana: ['ハ', 'ヒ', 'フ', 'ヘ', 'ホ'] },
  { index: 6, kana: ['マ', 'ミ', 'ム', 'メ', 'モ'] },
  { index: 7, kana: ['ヤ', 'ユ', 'ヨ', 'ラ', 'リ'] },
  { index: 8, kana: ['ル', 'レ', 'ロ', 'ワ', 'ヲ'] },
  { index: 9, kana: ['ン'] },

  // ----- stage 2: dakuten (゛) -----
  { index: 10, kana: ['ガ', 'ギ', 'グ', 'ゲ', 'ゴ'] },
  { index: 11, kana: ['ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'] },
  { index: 12, kana: ['ダ', 'ヂ', 'ヅ', 'デ', 'ド'] },
  { index: 13, kana: ['バ', 'ビ', 'ブ', 'ベ', 'ボ'] },

  // ----- stage 3: handakuten (゜) -----
  { index: 14, kana: ['パ', 'ピ', 'プ', 'ペ', 'ポ'] },

  // ----- stage 4: combination kana -----
  { index: 15, kana: ['キャ', 'キュ', 'キョ'] },
  { index: 16, kana: ['シャ', 'シュ', 'ショ'] },
  { index: 17, kana: ['チャ', 'チュ', 'チョ'] },
  { index: 18, kana: ['ニャ', 'ニュ', 'ニョ'] },
  { index: 19, kana: ['ヒャ', 'ヒュ', 'ヒョ'] },
  { index: 20, kana: ['ミャ', 'ミュ', 'ミョ'] },
  { index: 21, kana: ['リャ', 'リュ', 'リョ'] },
  { index: 22, kana: ['ギャ', 'ギュ', 'ギョ'] },
  { index: 23, kana: ['ジャ', 'ジュ', 'ジョ'] },
  { index: 24, kana: ['ビャ', 'ビュ', 'ビョ'] },
  { index: 25, kana: ['ピャ', 'ピュ', 'ピョ'] }
];

const KATAKANA = [
  // group 0 — アイウエオ
  { kana: 'ア', romaji: 'a', group: 0 },
  { kana: 'イ', romaji: 'i', group: 0 },
  { kana: 'ウ', romaji: 'u', group: 0 },
  { kana: 'エ', romaji: 'e', group: 0 },
  { kana: 'オ', romaji: 'o', group: 0 },

  // group 1 — カキクケコ
  { kana: 'カ', romaji: 'ka', group: 1 },
  { kana: 'キ', romaji: 'ki', group: 1 },
  { kana: 'ク', romaji: 'ku', group: 1 },
  { kana: 'ケ', romaji: 'ke', group: 1 },
  { kana: 'コ', romaji: 'ko', group: 1 },

  // group 2 — サシスセソ
  { kana: 'サ', romaji: 'sa', group: 2 },
  { kana: 'シ', romaji: 'shi', group: 2 },
  { kana: 'ス', romaji: 'su', group: 2 },
  { kana: 'セ', romaji: 'se', group: 2 },
  { kana: 'ソ', romaji: 'so', group: 2 },

  // group 3 — タチツテト
  { kana: 'タ', romaji: 'ta', group: 3 },
  { kana: 'チ', romaji: 'chi', group: 3 },
  { kana: 'ツ', romaji: 'tsu', group: 3 },
  { kana: 'テ', romaji: 'te', group: 3 },
  { kana: 'ト', romaji: 'to', group: 3 },

  // group 4 — ナニヌネノ
  { kana: 'ナ', romaji: 'na', group: 4 },
  { kana: 'ニ', romaji: 'ni', group: 4 },
  { kana: 'ヌ', romaji: 'nu', group: 4 },
  { kana: 'ネ', romaji: 'ne', group: 4 },
  { kana: 'ノ', romaji: 'no', group: 4 },

  // group 5 — ハヒフヘホ
  { kana: 'ハ', romaji: 'ha', group: 5 },
  { kana: 'ヒ', romaji: 'hi', group: 5 },
  { kana: 'フ', romaji: 'fu', group: 5 },
  { kana: 'ヘ', romaji: 'he', group: 5 },
  { kana: 'ホ', romaji: 'ho', group: 5 },

  // group 6 — マミムメモ
  { kana: 'マ', romaji: 'ma', group: 6 },
  { kana: 'ミ', romaji: 'mi', group: 6 },
  { kana: 'ム', romaji: 'mu', group: 6 },
  { kana: 'メ', romaji: 'me', group: 6 },
  { kana: 'モ', romaji: 'mo', group: 6 },

  // group 7 — ヤユヨラリ
  { kana: 'ヤ', romaji: 'ya', group: 7 },
  { kana: 'ユ', romaji: 'yu', group: 7 },
  { kana: 'ヨ', romaji: 'yo', group: 7 },
  { kana: 'ラ', romaji: 'ra', group: 7 },
  { kana: 'リ', romaji: 'ri', group: 7 },

  // group 8 — ルレロワヲ
  { kana: 'ル', romaji: 'ru', group: 8 },
  { kana: 'レ', romaji: 're', group: 8 },
  { kana: 'ロ', romaji: 'ro', group: 8 },
  { kana: 'ワ', romaji: 'wa', group: 8 },
  { kana: 'ヲ', romaji: 'wo', group: 8 },

  // group 9 — ン
  { kana: 'ン', romaji: 'n', group: 9 },

  // ----- stage 2: dakuten (゛) -----

  // group 10 — ガギグゲゴ
  { kana: 'ガ', romaji: 'ga', group: 10 },
  { kana: 'ギ', romaji: 'gi', group: 10 },
  { kana: 'グ', romaji: 'gu', group: 10 },
  { kana: 'ゲ', romaji: 'ge', group: 10 },
  { kana: 'ゴ', romaji: 'go', group: 10 },

  // group 11 — ザジズゼゾ
  { kana: 'ザ', romaji: 'za', group: 11 },
  { kana: 'ジ', romaji: 'ji', group: 11 },
  { kana: 'ズ', romaji: 'zu', group: 11 },
  { kana: 'ゼ', romaji: 'ze', group: 11 },
  { kana: 'ゾ', romaji: 'zo', group: 11 },

  // group 12 — ダヂヅデド
  { kana: 'ダ', romaji: 'da', group: 12 },
  { kana: 'ヂ', romaji: 'dji', group: 12 },
  { kana: 'ヅ', romaji: 'dzu', group: 12 },
  { kana: 'デ', romaji: 'de', group: 12 },
  { kana: 'ド', romaji: 'do', group: 12 },

  // group 13 — バビブベボ
  { kana: 'バ', romaji: 'ba', group: 13 },
  { kana: 'ビ', romaji: 'bi', group: 13 },
  { kana: 'ブ', romaji: 'bu', group: 13 },
  { kana: 'ベ', romaji: 'be', group: 13 },
  { kana: 'ボ', romaji: 'bo', group: 13 },

  // ----- stage 3: handakuten (゜) -----

  // group 14 — パピプペポ
  { kana: 'パ', romaji: 'pa', group: 14 },
  { kana: 'ピ', romaji: 'pi', group: 14 },
  { kana: 'プ', romaji: 'pu', group: 14 },
  { kana: 'ペ', romaji: 'pe', group: 14 },
  { kana: 'ポ', romaji: 'po', group: 14 },

  // ----- stage 4: combination kana -----

  // group 15 — キャキュキョ
  { kana: 'キャ', romaji: 'kya', group: 15 },
  { kana: 'キュ', romaji: 'kyu', group: 15 },
  { kana: 'キョ', romaji: 'kyo', group: 15 },

  // group 16 — シャシュショ
  { kana: 'シャ', romaji: 'sha', group: 16 },
  { kana: 'シュ', romaji: 'shu', group: 16 },
  { kana: 'ショ', romaji: 'sho', group: 16 },

  // group 17 — チャチュチョ
  { kana: 'チャ', romaji: 'cha', group: 17 },
  { kana: 'チュ', romaji: 'chu', group: 17 },
  { kana: 'チョ', romaji: 'cho', group: 17 },

  // group 18 — ニャニュニョ
  { kana: 'ニャ', romaji: 'nya', group: 18 },
  { kana: 'ニュ', romaji: 'nyu', group: 18 },
  { kana: 'ニョ', romaji: 'nyo', group: 18 },

  // group 19 — ヒャヒュヒョ
  { kana: 'ヒャ', romaji: 'hya', group: 19 },
  { kana: 'ヒュ', romaji: 'hyu', group: 19 },
  { kana: 'ヒョ', romaji: 'hyo', group: 19 },

  // group 20 — ミャミュミョ
  { kana: 'ミャ', romaji: 'mya', group: 20 },
  { kana: 'ミュ', romaji: 'myu', group: 20 },
  { kana: 'ミョ', romaji: 'myo', group: 20 },

  // group 21 — リャリュリョ
  { kana: 'リャ', romaji: 'rya', group: 21 },
  { kana: 'リュ', romaji: 'ryu', group: 21 },
  { kana: 'リョ', romaji: 'ryo', group: 21 },

  // group 22 — ギャギュギョ
  { kana: 'ギャ', romaji: 'gya', group: 22 },
  { kana: 'ギュ', romaji: 'gyu', group: 22 },
  { kana: 'ギョ', romaji: 'gyo', group: 22 },

  // group 23 — ジャジュジョ
  { kana: 'ジャ', romaji: 'ja', group: 23 },
  { kana: 'ジュ', romaji: 'ju', group: 23 },
  { kana: 'ジョ', romaji: 'jo', group: 23 },

  // group 24 — ビャビュビョ
  { kana: 'ビャ', romaji: 'bya', group: 24 },
  { kana: 'ビュ', romaji: 'byu', group: 24 },
  { kana: 'ビョ', romaji: 'byo', group: 24 },

  // group 25 — ピャピュピョ
  { kana: 'ピャ', romaji: 'pya', group: 25 },
  { kana: 'ピュ', romaji: 'pyu', group: 25 },
  { kana: 'ピョ', romaji: 'pyo', group: 25 }
];