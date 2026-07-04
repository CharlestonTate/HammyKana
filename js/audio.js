const SOUND_MAP = {
  correct: 'hammy.wav',
  wrong: 'quit.wav',
  complete: 'money.wav',
  click: 'select.wav'
};
const sounds = {};
let musicElement = null;

function preloadSounds() {
  Object.entries(SOUND_MAP).forEach(([name, file]) => {
    const audio = new Audio(`sfx/${file}`);
    audio.preload = 'auto';

    audio.addEventListener('error', () => {
      console.warn(`Could not preload sfx/${file}`);
      sounds[name] = null;
    }, { once: true });

    sounds[name] = audio;
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

function playSfx(name) {
  const sound = sounds[name];

  if (!sound) {
    console.warn(`Sound not found: ${name}`);
    return;
  }

  const volume = getSfxVolume();

  if (volume <= 0) {
    return;
  }

  const clone = sound.cloneNode();
  clone.volume = volume;
  clone.play().catch((error) => {
    console.warn(`Could not play sound ${name}:`, error);
  });
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
