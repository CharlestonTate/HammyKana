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

function getWordsForGroup(script, groupIndex) {
  return WORDS[script].filter((word) => word.requiredGroup === groupIndex);
}

function buildKanaToRomajiQuestion(kanaEntry, distractors) {
  const options = shuffleArray([kanaEntry.romaji, ...distractors.map((d) => d.romaji)]);

  return {
    type: 'kana_to_romaji',
    prompt: kanaEntry.kana,
    answer: kanaEntry.romaji,
    options,
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
    return buildKanaToRomajiQuestion(kanaEntry, distractors);
  });
}

function buildWordSpellingQuestion(word) {
  return {
    type: 'word_spelling',
    prompt: word.kana,
    answer: word.romaji,
    guess: '',
    meaning: word.meaning,
    requeued: false
  };
}

function buildRomajiToKanaQuestion(word) {
  return {
    type: 'romaji_to_kana',
    prompt: makeSpacedRomaji(word.romaji),
    answer: word.kana,
    guess: '',
    meaning: word.meaning,
    groupIndex: word.requiredGroup,
    requeued: false
  };
}

function buildWordQuestions(script, groupIndex, lessonIndex) {
  const groupWords = getWordsForGroup(script, groupIndex);
  const priorWords = WORDS[script].filter((word) => word.requiredGroup < groupIndex);
  const wordPool = groupWords.length > 0 ? groupWords : priorWords.slice(-10);
  const sampleWords = pickRandomSample(wordPool, WORD_QUESTION_COUNT);

  return shuffleArray(
    sampleWords.map((word) => {
      const useKanaKeyboard = Math.random() < 0.4;
      return useKanaKeyboard
        ? buildRomajiToKanaQuestion(word)
        : buildWordSpellingQuestion(word);
    })
  );
}

function buildQuestions(script, groupIndex, lessonIndex) {
  if (lessonIndex < 5) {
    return buildKanaQuestions(script, groupIndex);
  }

  return buildWordQuestions(script, groupIndex, lessonIndex);
}

function getBombRushMaxGroup(scriptProgress) {
  const currentLesson = getCurrentLesson(scriptProgress);
  return currentLesson.groupIndex;
}

function buildBombRushQuestions(script, scriptProgress) {
  const masteredKana = getMasteredKana(script, scriptProgress);
  const maxMasteredGroup = masteredKana.reduce(
    (groupIndex, entry) => Math.max(groupIndex, entry.group),
    -1
  );

  if (masteredKana.length === 0) {
    return [];
  }

  const kanaQuestions = masteredKana.map((kanaEntry) => {
    const distractors = pickDistractors(script, kanaEntry.group, kanaEntry, 3);
    return buildKanaToRomajiQuestion(kanaEntry, distractors);
  });

  const availableWords = WORDS[script].filter(
    (word) => word.requiredGroup <= maxMasteredGroup
  );
  const wordQuestions = availableWords.map((word) => {
    const useKanaKeyboard = Math.random() < 0.5;
    return useKanaKeyboard
      ? buildRomajiToKanaQuestion(word)
      : buildWordSpellingQuestion(word);
  });

  const questions = [...kanaQuestions, ...wordQuestions];
  return shuffleArray(questions);
}

function getAllKanaForGallery(script) {
  const data = getScriptData(script);
  return data.kana;
}
