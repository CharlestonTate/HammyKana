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

function getNKana(script) {
  return script === 'katakana' ? 'ン' : 'ん';
}

function getSokuon(script) {
  return script === 'katakana' ? 'ッ' : 'っ';
}

function consumeOneSyllable(remaining, script) {
  const { map, keys } = getRomajiMaps(script);
  const sokuon = getSokuon(script);
  const nKana = getNKana(script);

  if (!remaining) {
    return null;
  }

  if (remaining.startsWith('xtu') || remaining.startsWith('ltu')) {
    return { kana: sokuon, rest: remaining.slice(3) };
  }

  if (
    remaining.length >= 2 &&
    remaining[0] === remaining[1] &&
    isRomajiConsonant(remaining[0]) &&
    remaining[0] !== 'n'
  ) {
    return { kana: sokuon, rest: remaining.slice(1) };
  }

  if (remaining[0] === 'n') {
    if (remaining.length === 1) {
      return null;
    }

    if (remaining[1] === 'n') {
      return { kana: nKana, rest: remaining.slice(2) };
    }

    if (remaining[1] === '\'') {
      return { kana: nKana, rest: remaining.slice(2) };
    }

    const next = remaining[1];
    if (isRomajiConsonant(next) && next !== 'y') {
      return { kana: nKana, rest: remaining.slice(1) };
    }
  }

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (remaining.startsWith(key)) {
      return { kana: map[key], rest: remaining.slice(key.length) };
    }
  }

  return null;
}

function flushRomajiConvert(buffer, script) {
  let committed = '';
  let remaining = buffer;

  while (remaining.length > 0) {
    const step = consumeOneSyllable(remaining, script);
    if (!step) {
      break;
    }

    committed += step.kana;
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

function processRomajiInput({ buffer, guess, key, script }) {
  const letter = String(key || '').toLowerCase();

  if (!letter.match(/^[a-z]$/)) {
    return { buffer, guess };
  }

  const combined = buffer + letter;
  const converted = flushRomajiConvert(combined, script);

  return {
    buffer: converted.buffer,
    guess: guess + converted.committed
  };
}

function processRomajiBackspace({ buffer, guess }) {
  if (buffer.length > 0) {
    return {
      buffer: buffer.slice(0, -1),
      guess
    };
  }

  if (guess.length === 0) {
    return { buffer, guess };
  }

  return {
    buffer: '',
    guess: [...guess].slice(0, -1).join('')
  };
}

function isRomajiInputComplete({ buffer, guess }) {
  return buffer === '' && guess.length > 0;
}

function getRomajiCandidates(buffer, script) {
  if (!buffer) {
    return [];
  }

  const { map, keys } = getRomajiMaps(script);
  const sokuon = getSokuon(script);
  const nKana = getNKana(script);
  const seen = new Set();
  const candidates = [];

  function add(kana) {
    if (kana && !seen.has(kana)) {
      seen.add(kana);
      candidates.push(kana);
    }
  }

  const flushed = flushRomajiConvert(buffer, script);
  if (flushed.committed) {
    add(flushed.committed);
  }

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

  return candidates.slice(0, 9);
}

function applyRomajiCandidate({ buffer, guess, candidateKana, script }) {
  const { map, keys } = getRomajiMaps(script);

  if (map[buffer] === candidateKana) {
    return { guess: guess + candidateKana, buffer: '' };
  }

  const prefixKeys = keys
    .filter((key) => map[key] === candidateKana && key.startsWith(buffer))
    .sort((a, b) => a.length - b.length);

  if (prefixKeys.length > 0) {
    return { guess: guess + candidateKana, buffer: '' };
  }

  const flushed = flushRomajiConvert(buffer, script);
  if (flushed.committed === candidateKana) {
    return { guess: guess + flushed.committed, buffer: flushed.buffer };
  }

  return { guess: guess + candidateKana, buffer: '' };
}

function finalizeRomajiInput({ buffer, guess, script }) {
  const flushed = flushTrailingN(buffer, guess, script);
  const converted = flushRomajiConvert(flushed.buffer, script);

  return {
    buffer: converted.buffer,
    guess: flushed.guess + converted.committed
  };
}
