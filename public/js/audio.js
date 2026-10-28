// Web Audio SFX playback, plus an HTMLAudio helper for background music.

const SOUND_MAP = {
  correct: 'hammy.wav',
  wrong: 'quit.wav',
  complete: 'money.wav',
  click: 'select.wav',
  finish: 'finish.wav',
  enter: 'nexton.wav'
};
const soundBuffers = {};
let audioContext = null;
let musicElement = null;

// how the hell did I get this so good? audio context is a complete joke
function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContextClass();
  }

  return audioContext;
}

// Mobile browsers keep the context suspended until a user gesture unlocks it.
function unlockAudioContext() {
  const context = getAudioContext();

  if (!context || context.state === 'running') {
    return;
  }

  // iOS often needs a silent buffer during the gesture, not just resume().
  try {
    const buffer = context.createBuffer(1, 1, 22050);
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
  } catch (error) {
    // Ignore — resume alone may still work.
  }

  context.resume().catch(() => {});
}

function loadSound(name, file) {
  const context = getAudioContext();

  fetch(assetUrl(`sfx/${file}`))
    .then((response) => response.arrayBuffer())
    .then((data) => context.decodeAudioData(data))
    .then((buffer) => {
      soundBuffers[name] = buffer;
    })
    .catch((error) => {
      console.warn(`Could not preload sfx/${file}:`, error);
      soundBuffers[name] = null;
    });
}

function preloadSounds() {
  Object.entries(SOUND_MAP).forEach(([name, file]) => {
    loadSound(name, file);
  });

  ['pointerdown', 'touchstart', 'keydown'].forEach((eventName) => {
    document.addEventListener(eventName, unlockAudioContext, { passive: true, capture: true });
  });

  bindSpeechUnlock();
}

function getSfxVolume() {
  if (window.currentProgress && window.currentProgress.settings) {
    return window.currentProgress.settings.sfxVolume;
  }

  return 0.7;
}

function getMusicVolume() {
  if (window.currentProgress && window.currentProgress.settings) {
    return window.currentProgress.settings.musicVolume;
  }

  return 0.3;
}

function playSfxWithHtmlAudio(name, volume) {
  const file = SOUND_MAP[name];

  if (!file) {
    return;
  }

  const audio = new Audio(assetUrl(`sfx/${file}`));
  audio.volume = volume;
  audio.play().catch((error) => {
    console.warn(`Could not play sfx/${file}:`, error);
  });
}

// i love making these
function playSfx(name) {
  const volume = getSfxVolume();

  if (volume <= 0) {
    return;
  }

  unlockAudioContext();

  const buffer = soundBuffers[name];
  const context = getAudioContext();

  if (!buffer || !context) {
    playSfxWithHtmlAudio(name, volume);
    return;
  }

  const startPlayback = () => {
    const source = context.createBufferSource();
    source.buffer = buffer;

    const gainNode = context.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(context.destination);
    source.start(0);
  };

  if (context.state === 'suspended') {
    context.resume().then(startPlayback).catch(() => {
      playSfxWithHtmlAudio(name, volume);
    });
    return;
  }

  try {
    startPlayback();
  } catch (error) {
    playSfxWithHtmlAudio(name, volume);
  }
}

function setMusicVolume(volume) {
  if (musicElement) {
    musicElement.volume = volume;
  }
}

function playEnterSfx(onComplete) {
  const volume = getSfxVolume();
  if (volume <= 0) {
    if (typeof onComplete === 'function') {
      onComplete();
    }
    return;
  }

  unlockAudioContext();
  const file = SOUND_MAP.enter;
  const audio = new Audio(assetUrl(`sfx/${file}`));
  audio.volume = volume;

  const done = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  audio.addEventListener('ended', done, { once: true });
  audio.addEventListener('error', done, { once: true });
  audio.play().catch(done);
}

function playCourseEnterSfx() {
  playEnterSfx();
}

function startMusic(src) {
  if (musicElement) {
    musicElement.pause();
  }

  musicElement = new Audio(src);
  musicElement.loop = true;
  musicElement.volume = getMusicVolume();
  musicElement.play().catch((error) => {
    console.warn('Could not start background music:', error);
  });
}

// ----- Web Speech API (letter pronunciation in group intro, etc.) -----

const SPEECH_LANG_BY_TRACK = {
  telugu: 'te-IN',
  hiragana: 'ja-JP',
  katakana: 'ja-JP',
  japanese: 'ja-JP'
};

let speechVoicesCache = null;
let speechUnlockBound = false;

function isSpeechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function getSpeechLangForTrack(trackId) {
  return SPEECH_LANG_BY_TRACK[trackId] || 'ja-JP';
}

function refreshSpeechVoices() {
  if (!isSpeechSupported()) {
    return [];
  }

  speechVoicesCache = window.speechSynthesis.getVoices();
  return speechVoicesCache;
}

function pickSpeechVoice(lang) {
  const voices = speechVoicesCache || refreshSpeechVoices();
  const langPrefix = lang.split('-')[0];

  const exact = voices.find((voice) => voice.lang === lang);
  if (exact) {
    return exact;
  }

  const prefix = voices.find((voice) => voice.lang && voice.lang.startsWith(langPrefix));
  if (prefix) {
    return prefix;
  }

  return voices[0] || null;
}

function bindSpeechUnlock() {
  if (speechUnlockBound || !isSpeechSupported()) {
    return;
  }

  speechUnlockBound = true;

  const warmVoices = () => {
    refreshSpeechVoices();
  };

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.addEventListener('voiceschanged', warmVoices);
  }

  warmVoices();

  ['pointerdown', 'touchstart', 'keydown'].forEach((eventName) => {
    document.addEventListener(eventName, warmVoices, { passive: true, capture: true });
  });
}

function getSpeechVolume() {
  return getSfxVolume();
}

function speakText(text, trackId) {
  if (!isSpeechSupported() || !text) {
    return false;
  }

  bindSpeechUnlock();

  const lang = getSpeechLangForTrack(trackId);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.92;
  utterance.volume = Math.min(1, Math.max(0, getSpeechVolume()));

  const voice = pickSpeechVoice(lang);
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

function speakCharacterEntry(entry, trackId) {
  if (!entry || !entry.kana) {
    return false;
  }

  return speakText(entry.kana, trackId);
}

function stopSpeech() {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
