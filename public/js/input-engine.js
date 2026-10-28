// Dispatches typed Latin input to the Japanese romaji IME or Telugu transliteration IME.

function processLatinInput(params) {
  const trackId = params.trackId || params.script;
  const engine = getInputEngine(trackId);

  if (engine === 'telugu-latin') {
    return processTeluguInput(params);
  }

  return processRomajiInput({
    ...params,
    script: trackId
  });
}

function processLatinBackspace(params) {
  const trackId = params.trackId || params.script;
  const engine = getInputEngine(trackId);

  if (engine === 'telugu-latin') {
    return processTeluguBackspace(params);
  }

  return processRomajiBackspace({
    ...params,
    script: trackId
  });
}

function finalizeLatinInput(params) {
  const trackId = params.trackId || params.script;
  const engine = getInputEngine(trackId);

  if (engine === 'telugu-latin') {
    return finalizeTeluguInput(params);
  }

  return finalizeRomajiInput({
    ...params,
    script: trackId
  });
}

function isLatinInputComplete(params) {
  const trackId = params.trackId || params.script;
  const engine = getInputEngine(trackId);

  if (engine === 'telugu-latin') {
    return isTeluguInputComplete(params);
  }

  return isRomajiInputComplete(params);
}

function getLatinCandidates(buffer, trackId, guess) {
  const engine = getInputEngine(trackId);

  if (engine === 'telugu-latin') {
    return getTeluguCandidates(buffer, guess);
  }

  return getRomajiCandidates(buffer, trackId, guess);
}

function applyLatinCandidate(params) {
  const trackId = params.trackId || params.script;
  const engine = getInputEngine(trackId);

  if (engine === 'telugu-latin') {
    return applyTeluguCandidate(params);
  }

  return applyRomajiCandidate({
    ...params,
    script: trackId
  });
}

function romanizationToGlyphs(romanization, trackId, target) {
  if (getInputEngine(trackId) === 'telugu-latin') {
    return teluguStringToGlyphs(romanization, target);
  }

  return romajiStringToKana(romanization, trackId, target);
}

function isLatinTypingKey(key, trackId) {
  if (getInputEngine(trackId) === 'telugu-latin') {
    return /^[a-zA-Z]$/.test(key);
  }

  return /^[a-z]$/i.test(key);
}

function normalizeLatinTypingKey(key, trackId) {
  if (getInputEngine(trackId) === 'telugu-latin') {
    return key;
  }

  return key.toLowerCase();
}
