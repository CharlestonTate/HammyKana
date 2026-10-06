// Builds quiz question sets: kana recognition, word spelling/typing, and Bomb Rush pools.

const KANA_QUESTION_COUNT = 8;
const WORD_QUESTION_COUNT = 8;

function shuffleArray(items) {
  const copy = items.slice();

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy;
}

function pickRandomItems(items, count, exclude) {
  const pool = items.filter((item) => item !== exclude);
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, count);
}

function pickDistractors(script, groupIndex, kanaEntry, count) {
  const groupKana = getGroupKana(script, groupIndex);
  const sameGroup = pickRandomItems(groupKana, count, kanaEntry);

  if (sameGroup.length >= count) {
    return sameGroup;
  }

  const priorKana = getAvailableKana(script, groupIndex - 1);
  const extra = pickRandomItems(priorKana, count - sameGroup.length, kanaEntry);
  return sameGroup.concat(extra);
}

function getGroupKana(script, groupIndex) {
  const data = getScriptData(script);
  return data.kana.filter((entry) => entry.group === groupIndex);
}

function getAvailableKana(script, maxGroupIndex) {
  const data = getScriptData(script);
  return data.kana.filter((entry) => entry.group <= maxGroupIndex);
}

function getTypableKana(script, maxGroupIndex) {
  return getAvailableKana(script, maxGroupIndex);
}

function getTypableCharSet(script, maxGroupIndex) {
  const chars = new Set();
  getTypableKana(script, maxGroupIndex).forEach((entry) => {
    [...entry.kana].forEach((char) => chars.add(char));
  });
  return chars;
}

function segmentWordKana(kanaString, script) {
  const entries = getScriptData(script).kana.slice().sort((a, b) => b.kana.length - a.kana.length);
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

function isWordTypableAtGroup(word, script, maxGroupIndex) {
  const segments = segmentWordKana(word.kana, script);
  if (!segments) {
    return false;
  }

  const typable = new Set(getTypableKana(script, maxGroupIndex).map((entry) => entry.kana));
  return segments.every((segment) => typable.has(segment.kana));
}

function computeWordRequiredGroup(word, script) {
  const segments = segmentWordKana(word.kana, script);
  if (!segments) {
    return Infinity;
  }

  return segments.reduce((maxGroup, segment) => Math.max(maxGroup, segment.group), 0);
}

function getWordsForGroup(script, groupIndex) {
  return WORDS[script].filter((word) => word.requiredGroup === groupIndex);
}

function buildKanaToRomajiQuestion(kanaEntry, distractors, script) {
  const options = shuffleArray([kanaEntry.romaji, ...distractors.map((d) => d.romaji)]);

  return {
    type: 'kana_to_romaji',
    prompt: kanaEntry.kana,
    answer: kanaEntry.romaji,
    options,
    script,
    requeued: false
  };
}

function pickRandomSample(items, count) {
  const shuffled = shuffleArray(items);
  const result = [];
  let index = 0;

  while (result.length < count && shuffled.length > 0) {
    result.push(shuffled[index % shuffled.length]);
    index += 1;
  }

  return result;
}

function makeSpacedRomaji(romaji) {
  return romaji.split('').join(' ');
}

function buildKanaQuestions(script, groupIndex) {
  const groupKana = getGroupKana(script, groupIndex);
  const sampleKana = pickRandomSample(groupKana, KANA_QUESTION_COUNT);

  return sampleKana.map((kanaEntry) => {
    const distractors = pickDistractors(script, groupIndex, kanaEntry, 3);
    return buildKanaToRomajiQuestion(kanaEntry, distractors, script);
  });
}

function buildWordSpellingQuestion(word, script) {
  return {
    type: 'word_spelling',
    prompt: word.kana,
    answer: word.romaji,
    guess: '',
    meaning: word.meaning,
    script,
    requeued: false
  };
}

function buildRomajiToKanaQuestion(word, script) {
  return {
    type: 'romaji_to_kana',
    prompt: makeSpacedRomaji(word.romaji),
    answer: word.kana,
    guess: '',
    romajiBuffer: '',
    romajiTyped: '',
    romajiCandidateIndex: 0,
    meaning: word.meaning,
    groupIndex: word.requiredGroup,
    script,
    requeued: false
  };
}

function filterTypableWords(words, script, maxGroupIndex) {
  return words.filter((word) => isWordTypableAtGroup(word, script, maxGroupIndex));
}

function buildWordQuestions(script, groupIndex, lessonIndex) {
  const groupWords = filterTypableWords(getWordsForGroup(script, groupIndex), script, groupIndex);
  const priorWords = filterTypableWords(
    WORDS[script].filter((word) => word.requiredGroup < groupIndex),
    script,
    groupIndex
  );
  const wordPool = groupWords.length > 0 ? groupWords : priorWords.slice(-10);
  const sampleWords = pickRandomSample(wordPool, WORD_QUESTION_COUNT);

  return shuffleArray(
    sampleWords.map((word) => {
      const useKanaKeyboard = Math.random() < 0.4;
      return useKanaKeyboard
        ? buildRomajiToKanaQuestion(word, script)
        : buildWordSpellingQuestion(word, script);
    })
  );
}

function buildQuestions(script, groupIndex, lessonIndex) {
  if (lessonIndex < 5) {
    return buildKanaQuestions(script, groupIndex);
  }

  return buildWordQuestions(script, groupIndex, lessonIndex);
}

const BOMB_RUSH_MIN_QUESTIONS = 200;

function getBombRushScripts(scriptFilter) {
  if (scriptFilter === 'hiragana' || scriptFilter === 'katakana') {
    return [scriptFilter];
  }

  return ['hiragana', 'katakana'];
}

function buildBombRushPoolForScript(script, scriptProgress) {
  const masteredKana = getMasteredKana(script, scriptProgress);
  const maxMasteredGroup = masteredKana.reduce(
    (groupIndex, entry) => Math.max(groupIndex, entry.group),
    -1
  );

  const kanaQuestions = masteredKana.map((kanaEntry) => {
    const distractors = pickDistractors(script, kanaEntry.group, kanaEntry, 3);
    return buildKanaToRomajiQuestion(kanaEntry, distractors, script);
  });

  const availableWords = filterTypableWords(
    WORDS[script].filter((word) => word.requiredGroup <= maxMasteredGroup),
    script,
    maxMasteredGroup
  );
  const wordQuestions = availableWords.map((word) => {
    const useKanaKeyboard = Math.random() < 0.5;
    return useKanaKeyboard
      ? buildRomajiToKanaQuestion(word, script)
      : buildWordSpellingQuestion(word, script);
  });

  return { kanaQuestions, wordQuestions };
}

function buildBombRushQuestions(filters, progress) {
  const scripts = getBombRushScripts(filters.script);
  let kanaQuestions = [];
  let wordQuestions = [];

  scripts.forEach((script) => {
    const pool = buildBombRushPoolForScript(script, progress[script]);
    kanaQuestions = kanaQuestions.concat(pool.kanaQuestions);
    wordQuestions = wordQuestions.concat(pool.wordQuestions);
  });

  let basePool;
  if (filters.questionType === 'kana') {
    basePool = kanaQuestions;
  } else if (filters.questionType === 'typing') {
    basePool = wordQuestions;
  } else {
    basePool = kanaQuestions.concat(wordQuestions);
  }

  if (basePool.length === 0) {
    return [];
  }

  let questions = [];
  while (questions.length < BOMB_RUSH_MIN_QUESTIONS) {
    questions = questions.concat(shuffleArray(basePool));
  }

  return questions;
}

function getAllKanaForGallery(script) {
  const data = getScriptData(script);
  return data.kana;
}
