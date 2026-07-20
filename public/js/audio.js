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

// Mobile browsers start the context suspended until a user gesture.
function unlockAudioContext() {
  const context = getAudioContext();

  if (context.state === 'suspended') {
    context.resume();
  }
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

  document.addEventListener('pointerdown', unlockAudioContext, { once: true });
  document.addEventListener('keydown', unlockAudioContext, { once: true });
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

// i love making these
function playSfx(name) {
  const buffer = soundBuffers[name];

  if (!buffer) {
    console.warn(`Sound not ready yet: ${name}`);
    return;
  }

  const volume = getSfxVolume();

  if (volume <= 0) {
    return;
  }

  const context = getAudioContext();
  const source = context.createBufferSource();
  source.buffer = buffer;

  const gainNode = context.createGain();
  gainNode.gain.value = volume;

  source.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(0);
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
