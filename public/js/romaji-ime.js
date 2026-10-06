// Local romaji → kana IME built from the app's HIRAGANA / KATAKANA tables.

const ROMAJI_ALIASES = {
  shi: ['si'],
  chi: ['ti'],
  tsu: ['tu'],
  fu: ['hu'],
  ji: ['zi']
};

const ROMAJI_VOWELS = 'aeiou';
const ROMAJI_CONSONANTS = 'bcdfghjkmnpqrstvwxyz';

let hiraganaRomajiMap = null;
let katakanaRomajiMap = null;
let hiraganaKeysSorted = null;
let katakanaKeysSorted = null;

function isRomajiConsonant(char) {
  return ROMAJI_CONSONANTS.includes(char);
}

function buildRomajiMap(entries, script) {
  const map = Object.create(null);

  entries.forEach((entry) => {
    const key = entry.romaji.toLowerCase();
    map[key] = entry.kana;
  });

  Object.entries(ROMAJI_ALIASES).forEach(([canonical, aliases]) => {
    if (!map[canonical]) {
      return;
    }

    aliases.forEach((alias) => {
      map[alias] = map[canonical];
    });
  });

  const sokuon = script === 'katakana' ? 'ッ' : 'っ';
  map.xtu = sokuon;
  map.ltu = sokuon;

  const choonpu = script === 'katakana' ? 'ー' : 'ー';
  map.prolong = choonpu;
  map['-'] = choonpu;

  return map;
}

function buildSortedKeys(map) {
  return Object.keys(map).sort((a, b) => b.length - a.length);
}

function getRomajiMaps(script) {
  if (!hiraganaRomajiMap) {
    hiraganaRomajiMap = buildRomajiMap(HIRAGANA, 'hiragana');
    katakanaRomajiMap = buildRomajiMap(KATAKANA, 'katakana');
    hiraganaKeysSorted = buildSortedKeys(hiraganaRomajiMap);
    katakanaKeysSorted = buildSortedKeys(katakanaRomajiMap);
  }

  if (script === 'katakana') {
    return { map: katakanaRomajiMap, keys: katakanaKeysSorted };
  }

  return { map: hiraganaRomajiMap, keys: hiraganaKeysSorted };
}

function getScriptEntries(script) {
  return script === 'katakana' ? KATAKANA : HIRAGANA;
}

function getNKana(script) {
  return script === 'katakana' ? 'ン' : 'ん';
}

function getSokuon(script) {
  return script === 'katakana' ? 'ッ' : 'っ';
}

function getChoonpu(script) {
  return getRomajiMaps(script).map.prolong;
}

function getVowelKana(vowel, script) {
  return getRomajiMaps(script).map[vowel];
}

function segmentKanaString(kanaString, script) {
  const entries = getScriptEntries(script).slice().sort((a, b) => b.kana.length - a.kana.length);
  const segments = [];
  let index = 0;

  while (index < kanaString.length) {
    let matched = null;

    for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i];
      if (kanaString.startsWith(entry.kana, index)) {
        matched = entry;
        break;
      }
    }

    if (!matched) {
      return null;
    }

    segments.push(matched);
    index += matched.kana.length;
  }

  return segments;
}

function getLastSegmentVowel(kanaString, script) {
  const segments = segmentKanaString(kanaString, script);
  if (!segments || segments.length === 0) {
    return null;
  }

  const lastRomaji = segments[segments.length - 1].romaji;
  return lastRomaji[lastRomaji.length - 1];
}

function listConsumeSteps(remaining, script, committedKana) {
  const { map, keys } = getRomajiMaps(script);
  const sokuon = getSokuon(script);
  const nKana = getNKana(script);
  const choonpu = getChoonpu(script);
  const steps = [];
  const seen = new Set();

  function addStep(kana, rest) {
    const key = `${kana}\0${rest}`;
    if (!seen.has(key)) {
      seen.add(key);
      steps.push({ kana, rest });
    }
  }

  if (!remaining) {
    return steps;
  }

  if (remaining.startsWith('xtu') || remaining.startsWith('ltu')) {
    addStep(sokuon, remaining.slice(3));
  }

  if (
    remaining.length >= 2 &&
    remaining[0] === remaining[1] &&
    isRomajiConsonant(remaining[0]) &&
    remaining[0] !== 'n'
  ) {
    addStep(sokuon, remaining.slice(1));
  }

  if (remaining[0] === 'n') {
    if (remaining.length === 1) {
      return steps;
    }

    if (remaining[1] === 'n') {
      addStep(nKana, remaining.slice(2));
    } else if (remaining[1] === '\'') {
      addStep(nKana, remaining.slice(2));
    } else {
      const next = remaining[1];
      if (isRomajiConsonant(next) && next !== 'y') {
        addStep(nKana, remaining.slice(1));
      }
    }
  }

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (remaining.startsWith(key)) {
      addStep(map[key], remaining.slice(key.length));
    }
  }

  if (remaining.length >= 1 && ROMAJI_VOWELS.includes(remaining[0])) {
    const vowel = remaining[0];
    const vowelKana = getVowelKana(vowel, script);

    if (vowelKana) {
      const lastVowel = getLastSegmentVowel(committedKana, script);
      if (lastVowel === vowel) {
        addStep(choonpu, remaining.slice(1));
      }
    }
  }

  return steps;
}

function collectRomajiParses(romaji, script) {
  const normalized = String(romaji || '').toLowerCase();
  const results = [];

  function walk(remaining, committedKana) {
    if (remaining === '') {
      results.push(committedKana);
      return;
    }

    const steps = listConsumeSteps(remaining, script, committedKana);
    if (steps.length === 0) {
      if (remaining === 'n') {
        results.push(committedKana + getNKana(script));
      }
      return;
    }

    steps.forEach((step) => {
      walk(step.rest, committedKana + step.kana);
    });
  }

  walk(normalized, '');
  return results;
}

function pickBestParse(parses, targetKana) {
  if (parses.length === 0) {
    return '';
  }

  if (targetKana) {
    const exact = parses.filter((parse) => parse === targetKana);
    if (exact.length > 0) {
      return exact[0];
    }

    const targetHasChoonpu = targetKana.includes('ー');
    const filtered = targetHasChoonpu
      ? parses.filter((parse) => parse.includes('ー'))
      : parses.filter((parse) => !parse.includes('ー'));

    if (filtered.length > 0) {
      const prefixMatches = filtered.filter((parse) => targetKana.startsWith(parse));
      if (prefixMatches.length > 0) {
        return prefixMatches.sort((a, b) => b.length - a.length)[0];
      }
    }

    const prefixMatches = parses.filter((parse) => targetKana.startsWith(parse));
    if (prefixMatches.length > 0) {
      return prefixMatches.sort((a, b) => b.length - a.length)[0];
    }
  }

  if (parses.length === 1) {
    return parses[0];
  }

  return parses.sort((a, b) => b.length - a.length)[0];
}

function romajiStringToKana(romaji, script, targetKana) {
  const parses = collectRomajiParses(romaji, script);
  return pickBestParse(parses, targetKana);
}

function romajiToKanaState(romaji, script, targetKana) {
  const normalized = String(romaji || '').toLowerCase();
  let bestGuess = '';
  let bestLength = 0;

  for (let length = 1; length <= normalized.length; length += 1) {
    const prefix = normalized.slice(0, length);
    const parse = pickBestParse(collectRomajiParses(prefix, script), targetKana);

    if (!parse) {
      continue;
    }

    if (targetKana) {
      if (targetKana.startsWith(parse)) {
        bestGuess = parse;
        bestLength = length;
      }
    } else {
      bestGuess = parse;
      bestLength = length;
    }
  }

  return {
    guess: bestGuess,
    buffer: normalized.slice(bestLength)
  };
}

function consumeOneSyllable(remaining, script, committedKana) {
  const steps = listConsumeSteps(remaining, script, committedKana || '');
  if (steps.length === 0) {
    return null;
  }

  return steps[0];
}

function flushRomajiConvert(buffer, script, committedKana) {
  let committed = '';
  let remaining = buffer;
  let currentKana = committedKana || '';

  while (remaining.length > 0) {
    const step = consumeOneSyllable(remaining, script, currentKana);
    if (!step) {
      break;
    }

    committed += step.kana;
    currentKana += step.kana;
    remaining = step.rest;
  }

  return { committed, buffer: remaining };
}

function flushTrailingN(buffer, guess, script) {
  if (buffer !== 'n') {
    return { buffer, guess };
  }

  return {
    buffer: '',
    guess: guess + getNKana(script)
  };
}

function processRomajiInput({ buffer, guess, key, script, targetKana, romajiTyped }) {
  const letter = String(key || '').toLowerCase();

  if (!letter.match(/^[a-z]$/)) {
    return { buffer, guess, romajiTyped: romajiTyped || '' };
  }

  const combinedRomaji = (romajiTyped ?? buffer) + letter;
  const state = romajiToKanaState(combinedRomaji, script, targetKana);

  return {
    buffer: state.buffer,
    guess: state.guess,
    romajiTyped: combinedRomaji
  };
}

function processRomajiBackspace({ buffer, guess, romajiTyped, script, targetKana }) {
  if (romajiTyped && romajiTyped.length > 0) {
    const nextTyped = romajiTyped.slice(0, -1);
    const state = romajiToKanaState(nextTyped, script, targetKana);

    return {
      romajiTyped: nextTyped,
      buffer: state.buffer,
      guess: state.guess
    };
  }

  if (buffer.length > 0) {
    return {
      buffer: buffer.slice(0, -1),
      guess,
      romajiTyped: romajiTyped || ''
    };
  }

  if (guess.length === 0) {
    return { buffer, guess, romajiTyped: romajiTyped || '' };
  }

  return {
    buffer: '',
    guess: [...guess].slice(0, -1).join(''),
    romajiTyped: romajiTyped || ''
  };
}

function isRomajiInputComplete({ buffer, guess }) {
  return buffer === '' && guess.length > 0;
}

function getRomajiCandidates(buffer, script, guess) {
  if (!buffer) {
    return [];
  }

  const { map, keys } = getRomajiMaps(script);
  const sokuon = getSokuon(script);
  const nKana = getNKana(script);
  const choonpu = getChoonpu(script);
  const seen = new Set();
  const candidates = [];

  function add(kana) {
    if (kana && !seen.has(kana)) {
      seen.add(kana);
      candidates.push(kana);
    }
  }

  listConsumeSteps(buffer, script, guess || '').forEach((step) => {
    add(step.kana);
  });

  keys.forEach((key) => {
    if (key.startsWith(buffer)) {
      add(map[key]);
    }
  });

  if (buffer === 'n') {
    add(nKana);
  }

  if (
    buffer.length >= 2 &&
    buffer[0] === buffer[1] &&
    isRomajiConsonant(buffer[0]) &&
    buffer[0] !== 'n'
  ) {
    add(sokuon);
  }

  if (buffer.length === 1 && ROMAJI_VOWELS.includes(buffer[0])) {
    const lastVowel = getLastSegmentVowel(guess || '', script);
    if (lastVowel === buffer[0]) {
      add(choonpu);
    }
  }

  return candidates.slice(0, 9);
}

function applyRomajiCandidate({ buffer, guess, candidateKana, script, romajiTyped, targetKana }) {
  const { map, keys } = getRomajiMaps(script);

  if (map[buffer] === candidateKana) {
    return {
      guess: guess + candidateKana,
      buffer: '',
      romajiTyped: (romajiTyped || '') + buffer
    };
  }

  const prefixKeys = keys
    .filter((key) => map[key] === candidateKana && key.startsWith(buffer))
    .sort((a, b) => a.length - b.length);

  if (prefixKeys.length > 0) {
    const typed = (romajiTyped || '') + prefixKeys[0];
    const state = romajiToKanaState(typed, script, targetKana);
    return {
      guess: state.guess,
      buffer: state.buffer,
      romajiTyped: typed
    };
  }

  const flushed = flushRomajiConvert(buffer, script, guess);
  if (flushed.committed === candidateKana) {
    return {
      guess: guess + flushed.committed,
      buffer: flushed.buffer,
      romajiTyped: (romajiTyped || '') + buffer.slice(0, buffer.length - flushed.buffer.length)
    };
  }

  return {
    guess: guess + candidateKana,
    buffer: '',
    romajiTyped: romajiTyped || ''
  };
}

function finalizeRomajiInput({ buffer, guess, script, targetKana, romajiTyped }) {
  if (romajiTyped !== undefined && romajiTyped !== null && romajiTyped !== '') {
    return {
      buffer: '',
      guess: romajiStringToKana(romajiTyped, script, targetKana)
    };
  }

  const flushed = flushTrailingN(buffer, guess, script);
  const converted = flushRomajiConvert(flushed.buffer, script, flushed.guess);

  return {
    buffer: converted.buffer,
    guess: flushed.guess + converted.committed
  };
}

function verifyAllWordsRomajiRoundTrip() {
  const failures = [];

  ['hiragana', 'katakana'].forEach((script) => {
    WORDS[script].forEach((word) => {
      const converted = romajiStringToKana(word.romaji, script, word.kana);
      if (converted !== word.kana) {
        failures.push({ script, romaji: word.romaji, expected: word.kana, got: converted });
      }
    });
  });

  return failures;
}
