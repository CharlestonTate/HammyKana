// Saving/loading progress: localStorage persistence, JSON backup download/import,
// console-accessible debug helpers, and the settings-page input handlers.

function persistProgress() {
  saveProgress({
    settings: state.settings,
    hiragana: state.progress.hiragana,
    katakana: state.progress.katakana
  });
}

function resetHammyKanaProgress() {
  localStorage.removeItem(STORAGE_KEY);
  console.log('HammyKana progress wiped. Reloading.');
  window.location.reload();
}

function viewCurrentProgress() {
  const saved = loadProgress();
  console.log('Current HammyKana progress:', saved);
  return saved;
}

// Console testing helper: jumps a script straight to "about to start group G, lesson L",
// mastering every group before it and completing every lesson before L in group G.
// group/lesson are 1-indexed to match what's shown on screen (group 1, lesson 1-10).
function setScriptProgress(script, group, lesson) {
  const groupIndex = group - 1;
  const lessonIndex = lesson - 1;

  if (groupIndex < 0 || groupIndex >= GROUP_COUNT) {
    console.warn(`group must be between 1 and ${GROUP_COUNT}.`);
    return;
  }

  if (lessonIndex < 0 || lessonIndex >= LESSONS_PER_GROUP) {
    console.warn(`lesson must be between 1 and ${LESSONS_PER_GROUP}.`);
    return;
  }

  const scriptProgress = createDefaultScriptProgress();

  for (let priorGroup = 0; priorGroup < groupIndex; priorGroup++) {
    for (let l = 0; l < LESSONS_PER_GROUP; l++) {
      markLessonComplete(scriptProgress, priorGroup, l);
    }
  }

  for (let l = 0; l < lessonIndex; l++) {
    markLessonComplete(scriptProgress, groupIndex, l);
  }

  state.progress[script] = scriptProgress;
  state.activeScript = script;
  state.activeView = 'path';
  state.quiz = null;
  state.scrollToCurrentLesson = true;

  persistProgress();
  updateActiveTab(script);
  render(state);

  console.log(`${script}: set to group ${group}, lesson ${lesson}.`);
}

function set_hiragana(group, lesson) {
  setScriptProgress('hiragana', group, lesson);
}

function set_katakana(group, lesson) {
  setScriptProgress('katakana', group, lesson);
}

function downloadProgressBackup() {
  downloadProgressFile(state.settings, state.progress);
}

function applyImportedProgress(imported) {
  state.settings = imported.settings;
  state.progress = {
    hiragana: imported.hiragana,
    katakana: imported.katakana
  };
  window.currentProgress = state;
  setMusicVolume(state.settings.musicVolume);
  persistProgress();
  render(state);
}

async function importProgressFromFile(file) {
  let parsed;

  try {
    const text = await file.text();
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error('Could not read progress file. Make sure it is a valid HammyKana backup.');
  }

  return parseImportedProgress(parsed);
}

function onMusicVolumeChange(event) {
  state.settings.musicVolume = Number(event.target.value) / 100;
  setMusicVolume(state.settings.musicVolume);
  persistProgress();
}

function onSfxVolumeChange(event) {
  state.settings.sfxVolume = Number(event.target.value) / 100;
  persistProgress();
}

function onShowRomajiChange(event) {
  state.settings.showRomaji = event.target.checked;
  persistProgress();

  if (state.activeView === 'gallery') {
    render(state);
  }
}
