// The single mutable app state, and startup wiring.

const state = {
  activeScript: 'hiragana',
  activeView: 'path',
  settings: createDefaultSettings(),
  progress: {
    hiragana: createDefaultScriptProgress(),
    katakana: createDefaultScriptProgress()
  },
  quiz: null,
  showQuitConfirm: false,
  lessonCompleteCelebrated: false,
  scrollToCurrentLesson: false,
  justMasteredGroup: null,
  bombRushSetup: {
    seconds: 60,
    script: 'all',
    questionType: 'all'
  },
  bombRushError: ''
};

function initApp() {
  cacheDomElements();

  const saved = loadProgress();
  state.settings = saved.settings;
  state.progress = {
    hiragana: saved.hiragana,
    katakana: saved.katakana
  };
  window.currentProgress = state;

  window.resetHammyKanaProgress = resetHammyKanaProgress;
  window.resetProgress = resetHammyKanaProgress;
  window.viewCurrentProgress = viewCurrentProgress;
  window.set_hiragana = set_hiragana;
  window.set_katakana = set_katakana;

  preloadSounds();
  if (typeof hammy !== 'undefined' && typeof hammy.init === 'function') {
    hammy.init();
  }
  bindEvents();
  render(state);
}

document.addEventListener('DOMContentLoaded', initApp);
