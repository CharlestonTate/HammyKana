// Telugu vocabulary keyed by requiredGroup (same semantics as Japanese words).

WORDS.telugu = [
  // group 0 — vowels అ ఆ ఇ ఈ ఉ
  { kana: 'అఆ', romaji: 'aaa', meaning: 'a and aa (practice)', requiredGroup: 0 },
  { kana: 'అఇ', romaji: 'ai', meaning: 'a and i (practice)', requiredGroup: 0 },
  { kana: 'ఇఈ', romaji: 'iii', meaning: 'i and ii (practice)', requiredGroup: 0 },
  { kana: 'ఉఅ', romaji: 'ua', meaning: 'u and a (practice)', requiredGroup: 0 },
  { kana: 'ఆఇ', romaji: 'aai', meaning: 'aa and i (practice)', requiredGroup: 0 },
  { kana: 'అఉ', romaji: 'au', meaning: 'a and u (practice)', requiredGroup: 0 },
  { kana: 'ఇఅ', romaji: 'ia', meaning: 'i and a (practice)', requiredGroup: 0 },
  { kana: 'ఉఇ', romaji: 'ui', meaning: 'u and i (practice)', requiredGroup: 0 },

  // group 1 — ఊ ఋ ఎ ఏ ఐ
  { kana: 'ఎఅ', romaji: 'ea', meaning: 'e and a (practice)', requiredGroup: 1 },
  { kana: 'ఐఅ', romaji: 'aia', meaning: 'ai and a (practice)', requiredGroup: 1 },
  { kana: 'ఊఅ', romaji: 'uua', meaning: 'uu and a (practice)', requiredGroup: 1 },
  { kana: 'ఏఇ', romaji: 'eei', meaning: 'ee and i (practice)', requiredGroup: 1 },
  { kana: 'ఋఅ', romaji: 'rua', meaning: 'ru and a (practice)', requiredGroup: 1 },
  { kana: 'ఎఏ', romaji: 'eee', meaning: 'e and ee (practice)', requiredGroup: 1 },

  // group 2 — ఒ ఓ ఔ
  { kana: 'ఒఅ', romaji: 'oa', meaning: 'o and a (practice)', requiredGroup: 2 },
  { kana: 'ఓఇ', romaji: 'ooi', meaning: 'oo and i (practice)', requiredGroup: 2 },
  { kana: 'ఔఅ', romaji: 'aua', meaning: 'au and a (practice)', requiredGroup: 2 },
  { kana: 'ఒఓ', romaji: 'ooo', meaning: 'o and oo (practice)', requiredGroup: 2 },

  // group 3 — ka row
  { kana: 'క', romaji: 'ka', meaning: 'ka (syllable)', requiredGroup: 3 },
  { kana: 'అక', romaji: 'aka', meaning: 'aka (practice)', requiredGroup: 3 },
  { kana: 'కఅ', romaji: 'kaa', meaning: 'ka and a (practice)', requiredGroup: 3 },
  { kana: 'ఇక', romaji: 'ika', meaning: 'i + ka (practice)', requiredGroup: 3 },
  { kana: 'కఇ', romaji: 'kai', meaning: 'ka and i (practice)', requiredGroup: 3 },
  { kana: 'ఉక', romaji: 'uka', meaning: 'u + ka (practice)', requiredGroup: 3 },
  { kana: 'గఅ', romaji: 'gaa', meaning: 'ga and a (practice)', requiredGroup: 3 },
  { kana: 'అగ', romaji: 'aga', meaning: 'a + ga (practice)', requiredGroup: 3 },

  // group 4 — ca row
  { kana: 'చ', romaji: 'ca', meaning: 'ca (syllable)', requiredGroup: 4 },
  { kana: 'అచ', romaji: 'aca', meaning: 'a + ca (practice)', requiredGroup: 4 },
  { kana: 'జఅ', romaji: 'jaa', meaning: 'ja and a (practice)', requiredGroup: 4 },
  { kana: 'ఇచ', romaji: 'ica', meaning: 'i + ca (practice)', requiredGroup: 4 },
  { kana: 'చఇ', romaji: 'cai', meaning: 'ca and i (practice)', requiredGroup: 4 },
  { kana: 'అజ', romaji: 'aja', meaning: 'a + ja (practice)', requiredGroup: 4 },

  // group 5 — retroflex row
  { kana: 'ట', romaji: 'Ta', meaning: 'Ta (syllable)', requiredGroup: 5 },
  { kana: 'అట', romaji: 'aTa', meaning: 'a + Ta (practice)', requiredGroup: 5 },
  { kana: 'డఅ', romaji: 'Daa', meaning: 'Da and a (practice)', requiredGroup: 5 },
  { kana: 'టఇ', romaji: 'Tai', meaning: 'Ta and i (practice)', requiredGroup: 5 },
  { kana: 'ణఅ', romaji: 'Naa', meaning: 'Na and a (practice)', requiredGroup: 5 },

  // group 6 — dental row
  { kana: 'త', romaji: 'ta', meaning: 'ta (syllable)', requiredGroup: 6 },
  { kana: 'తల', romaji: 'tala', meaning: 'head', requiredGroup: 6 },
  { kana: 'న', romaji: 'na', meaning: 'na (syllable)', requiredGroup: 6 },
  { kana: 'నఈ', romaji: 'naii', meaning: 'na and ii (practice)', requiredGroup: 6 },
  { kana: 'ద', romaji: 'da', meaning: 'da (syllable)', requiredGroup: 6 },
  { kana: 'అత', romaji: 'ata', meaning: 'a + ta (practice)', requiredGroup: 6 },
  { kana: 'తఅ', romaji: 'taa', meaning: 'ta and a (practice)', requiredGroup: 6 },
  { kana: 'నఅ', romaji: 'naa', meaning: 'na and a (practice)', requiredGroup: 6 },

  // group 7 — pa row
  { kana: 'ప', romaji: 'pa', meaning: 'pa (syllable)', requiredGroup: 7 },
  { kana: 'మ', romaji: 'ma', meaning: 'ma (syllable)', requiredGroup: 7 },
  { kana: 'అమ', romaji: 'ama', meaning: 'a + ma (practice)', requiredGroup: 7 },
  { kana: 'మఅ', romaji: 'maa', meaning: 'ma and a (practice)', requiredGroup: 7 },
  { kana: 'పఅ', romaji: 'paa', meaning: 'pa and a (practice)', requiredGroup: 7 },
  { kana: 'అప', romaji: 'apa', meaning: 'a + pa (practice)', requiredGroup: 7 },
  { kana: 'బఅ', romaji: 'baa', meaning: 'ba and a (practice)', requiredGroup: 7 },

  // group 8 — ya row
  { kana: 'ర', romaji: 'ra', meaning: 'ra (syllable)', requiredGroup: 8 },
  { kana: 'ల', romaji: 'la', meaning: 'la (syllable)', requiredGroup: 8 },
  { kana: 'వ', romaji: 'va', meaning: 'va (syllable)', requiredGroup: 8 },
  { kana: 'రఅ', romaji: 'raa', meaning: 'ra and a (practice)', requiredGroup: 8 },
  { kana: 'లఅ', romaji: 'laa', meaning: 'la and a (practice)', requiredGroup: 8 },
  { kana: 'వఅ', romaji: 'vaa', meaning: 'va and a (practice)', requiredGroup: 8 },
  { kana: 'యఅ', romaji: 'yaa', meaning: 'ya and a (practice)', requiredGroup: 8 },
  { kana: 'అర', romaji: 'ara', meaning: 'a + ra (practice)', requiredGroup: 8 },

  // group 9 — sa row
  { kana: 'స', romaji: 'sa', meaning: 'sa (syllable)', requiredGroup: 9 },
  { kana: 'హ', romaji: 'ha', meaning: 'ha (syllable)', requiredGroup: 9 },
  { kana: 'సఅ', romaji: 'saa', meaning: 'sa and a (practice)', requiredGroup: 9 },
  { kana: 'హఅ', romaji: 'haa', meaning: 'ha and a (practice)', requiredGroup: 9 },
  { kana: 'అస', romaji: 'asa', meaning: 'a + sa (practice)', requiredGroup: 9 },
  { kana: 'శఅ', romaji: 'shaa', meaning: 'sha and a (practice)', requiredGroup: 9 },
  { kana: 'షఅ', romaji: 'Shaa', meaning: 'Sha and a (practice)', requiredGroup: 9 }
];
