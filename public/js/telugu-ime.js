// Latin transliteration → Telugu glyphs (ISO 15919-style keys from TELUGU table).

let teluguRomanMap = null;
let teluguKeysSorted = null;

function getTeluguMaps() {
  if (!teluguRomanMap) {
    teluguRomanMap = Object.create(null);

    TELUGU.forEach((entry) => {
      teluguRomanMap[entry.romaji] = entry.kana;
    });

    teluguKeysSorted = Object.keys(teluguRomanMap).sort((a, b) => b.length - a.length);
  }

  return { map: teluguRomanMap, keys: teluguKeysSorted };
}

function listTeluguConsumeSteps(remaining) {
  const { map, keys } = getTeluguMaps();
  const steps = [];
  const seen = new Set();

  function addStep(kana, rest) {
    const key = `${kana}\0${rest}`;
    if (!seen.has(key)) {
      seen.add(key);
      steps.push({ kana, rest });
    }
  }

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (remaining.startsWith(key)) {
      addStep(map[key], remaining.slice(key.length));
    }
  }

  return steps;
}

function collectTeluguParses(romanization) {
  const normalized = String(romanization || '');
  const results = [];

  function walk(remaining, committed) {
    if (remaining === '') {
      results.push(committed);
      return;
    }

    const steps = listTeluguConsumeSteps(remaining);
    if (steps.length === 0) {
      return;
    }

    steps.forEach((step) => {
      walk(step.rest, committed + step.kana);
    });
  }

  walk(normalized, '');
  return results;
}

function pickBestTeluguParse(parses, targetGlyphs) {
  if (parses.length === 0) {
    return '';
  }

  if (targetGlyphs) {
    const exact = parses.filter((parse) => parse === targetGlyphs);
    if (exact.length > 0) {
      return exact[0];
    }

    const prefixMatches = parses.filter((parse) => targetGlyphs.startsWith(parse));
    if (prefixMatches.length > 0) {
      return prefixMatches.sort((a, b) => b.length - a.length)[0];
    }
  }

  if (parses.length === 1) {
    return parses[0];
  }

  return parses.sort((a, b) => b.length - a.length)[0];
}

function teluguStringToGlyphs(romanization, targetGlyphs) {
  const parses = collectTeluguParses(romanization);
  return pickBestTeluguParse(parses, targetGlyphs);
}

function teluguToGlyphState(romanization, targetGlyphs) {
  const normalized = String(romanization || '');
  let bestGuess = '';
  let bestLength = 0;

  for (let length = 1; length <= normalized.length; length += 1) {
    const prefix = normalized.slice(0, length);
    const parse = pickBestTeluguParse(collectTeluguParses(prefix), targetGlyphs);

    if (!parse) {
      continue;
    }

    if (targetGlyphs) {
      if (targetGlyphs.startsWith(parse)) {
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

function processTeluguInput({ buffer, guess, key, targetKana, romajiTyped }) {
  const letter = String(key || '');

  if (!letter.match(/^[a-zA-Z]$/)) {
    return { buffer, guess, romajiTyped: romajiTyped || '' };
  }

  const combined = (romajiTyped ?? buffer) + letter;
  const state = teluguToGlyphState(combined, targetKana);

  return {
    buffer: state.buffer,
    guess: state.guess,
    romajiTyped: combined
  };
}

function processTeluguBackspace({ buffer, guess, romajiTyped, targetKana }) {
  if (romajiTyped && romajiTyped.length > 0) {
    const nextTyped = romajiTyped.slice(0, -1);
    const state = teluguToGlyphState(nextTyped, targetKana);

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

function isTeluguInputComplete({ buffer, guess }) {
  return buffer === '' && guess.length > 0;
}

function getTeluguCandidates(buffer, guess) {
  if (!buffer) {
    return [];
  }

  const { map, keys } = getTeluguMaps();
  const seen = new Set();
  const candidates = [];

  keys.forEach((key) => {
    if (!buffer.startsWith(key)) {
      return;
    }

    const kana = map[key];
    if (seen.has(kana)) {
      return;
    }

    seen.add(kana);
    candidates.push(kana);
  });

  return candidates;
}

function applyTeluguCandidate({ buffer, guess, candidateKana, romajiTyped, targetKana }) {
  const { map, keys } = getTeluguMaps();

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
    const state = teluguToGlyphState(typed, targetKana);
    return {
      guess: state.guess,
      buffer: state.buffer,
      romajiTyped: typed
    };
  }

  return {
    guess: guess + candidateKana,
    buffer: '',
    romajiTyped: romajiTyped || ''
  };
}

function finalizeTeluguInput({ buffer, guess, targetKana, romajiTyped }) {
  if (romajiTyped !== undefined && romajiTyped !== null && romajiTyped !== '') {
    return {
      buffer: '',
      guess: teluguStringToGlyphs(romajiTyped, targetKana)
    };
  }

  if (buffer) {
    return {
      buffer: '',
      guess: guess + teluguStringToGlyphs(buffer, targetKana)
    };
  }

  return { buffer, guess };
}

function verifyAllWordsTeluguRoundTrip() {
  const failures = [];

  if (!WORDS.telugu) {
    return failures;
  }

  WORDS.telugu.forEach((word) => {
    const converted = teluguStringToGlyphs(word.romaji, word.kana);
    if (converted !== word.kana) {
      failures.push({
        script: 'telugu',
        romaji: word.romaji,
        expected: word.kana,
        got: converted
      });
    }
  });

  return failures;
}
