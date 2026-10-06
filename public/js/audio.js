// Web Audio SFX playback, plus an HTMLAudio helper for background music.

const SOUND_MAP = {
  correct: 'hammy.wav',
  wrong: 'quit.wav',
  complete: 'money.wav',
  click: 'select.wav',
  finish: 'finish.wav'
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

  fetch(`sfx/${file}`)
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

  const audio = new Audio(`sfx/${file}`);
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
