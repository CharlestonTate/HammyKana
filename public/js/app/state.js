// The single mutable app state, and startup wiring.

const bootConfig = getBootConfig();

const state = {
  courseId: bootConfig.courseId,
  activeScript: bootConfig.defaultTrack || getCourseConfig().defaultTrack,
  activeView: 'path',
  settings: createDefaultSettings(),
  progress: createDefaultProgress(),
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
  bombRushError: '',
  groupIntro: null
};

function initApp() {
  applyBootConfig();
  cacheDomElements();

  const saved = loadProgress();
  state.settings = saved.settings;
  state.progress = { tracks: saved.tracks };
  state.activeScript = bootConfig.defaultTrack || getCourseConfig().defaultTrack;
  window.currentProgress = state;

  window.resetHammyKanaProgress = resetHammyKanaProgress;
  window.resetProgress = resetHammyKanaProgress;
  window.viewCurrentProgress = viewCurrentProgress;
  window.set_hiragana = set_hiragana;
  window.set_katakana = set_katakana;
  window.set_telugu = set_telugu;

  updateActiveTab(state.activeScript);

  preloadSounds();
  if (typeof hammy !== 'undefined' && typeof hammy.init === 'function') {
    hammy.init();
  }
  if (typeof kanaDictionary !== 'undefined' && typeof kanaDictionary.init === 'function') {
    kanaDictionary.init();
  }
  bindEvents();

  loadPronunciationHints().then(() => {
    render(state);
    playCourseEnterSfx();
  });
}

document.addEventListener('DOMContentLoaded', initApp);
