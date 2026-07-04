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
  scrollToCurrentLesson: false
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

  preloadSounds();
  if (typeof hammy !== 'undefined' && typeof hammy.init === 'function') {
    hammy.init();
  }
  bindEvents();
  render(state);
}

function bindEvents() {
  document.getElementById('gallery-button').addEventListener('click', openGallery);
  document.getElementById('settings-button').addEventListener('click', openSettings);

  ui.tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchScript(tab.dataset.script);
    });
  });

  const hammyShell = document.querySelector('.hammy-shell');
  if (hammyShell) {
    hammyShell.addEventListener('click', () => {
      if (state.activeView === 'quiz' || state.activeView === 'gallery') {
        return;
      }

      if (window.hammy && typeof hammy.openPlayPen === 'function') {
        hammy.openPlayPen();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (window.hammy && typeof hammy.closePlayPen === 'function' && hammy.closePlayPen()) {
        return;
      }

      if (state.showQuitConfirm) {
        cancelQuitQuiz();
        return;
      }

      if (state.activeView === 'quiz') {
        requestQuitQuiz();
        return;
      }

      if (state.activeView === 'gallery') {
        closeGallery();
        return;
      }

      if (state.activeView === 'settings') {
        closeSettings();
      }

      return;
    }

    handleQuizTyping(event);
  });
}

function handleQuizTyping(event) {
  if (state.activeView !== 'quiz' || !state.quiz) {
    return;
  }

  const question = getCurrentQuestion(state.quiz);

  if (!question || question.type !== 'word_spelling' || question.answerStatus) {
    return;
  }

  if (event.key === 'Backspace') {
    question.guess = (question.guess || '').slice(0, -1);
    render(state);
    return;
  }

  if (event.key === 'Enter') {
    if ((question.guess || '').length === question.answer.length) {
      submitAnswer(state, question, question.guess);
    }
    return;
  }

  if (event.key.length !== 1) {
    return;
  }

  const letter = event.key.toLowerCase();
  if (!letter.match(/^[a-z]$/)) {
    return;
  }

  if ((question.guess || '').length < question.answer.length) {
    question.guess = (question.guess || '') + letter;
    render(state);
  }
}

function persistProgress() {
  saveProgress({
    settings: state.settings,
    hiragana: state.progress.hiragana,
    katakana: state.progress.katakana
  });
}

function switchScript(script) {
  if (state.activeScript === script) {
    return;
  }

  playSfx('click');
  state.activeScript = script;

  if (state.activeView !== 'gallery') {
    state.activeView = 'path';
  }

  updateActiveTab(script);
  render(state);
}

function startLesson(groupIndex, lessonIndex) {
  const questions = buildQuestions(state.activeScript, groupIndex, lessonIndex);
  state.quiz = createQuizState(groupIndex, lessonIndex, questions, 'lesson');
  state.activeView = 'quiz';
  render(state);
}

function startBombRush(script) {
  const scriptProgress = state.progress[script];
  const questions = buildBombRushQuestions(script, scriptProgress);
  state.quiz = createQuizState(null, null, questions, 'bomb_rush');
  state.activeView = 'quiz';
  render(state);
}

function requestQuitQuiz() {
  state.showQuitConfirm = true;
  render(state);
}

function exitQuiz() {
  state.showQuitConfirm = false;
  state.scrollToCurrentLesson = !!(
    state.quiz &&
    state.quiz.mode === 'lesson' &&
    isQuizComplete(state.quiz)
  );
  state.quiz = null;
  state.activeView = 'path';
  render(state);
}

function submitAnswer(appState, question, userAnswer) {
  const isCorrect = checkAnswer(question, userAnswer);

  question.selectedAnswer = userAnswer;
  question.answerStatus = isCorrect ? 'correct' : 'incorrect';

  if (isCorrect) {
    appState.quiz.correctCount += 1;
    playSfx('correct');
    if (window.hammy && typeof hammy.speak === 'function') {
      hammy.speak('positive');
    }
    render(appState);

    if (question.type !== 'word_spelling' && question.type !== 'romaji_to_kana') {
      setTimeout(() => {
        advanceQuiz(appState.quiz);

        if (isQuizComplete(appState.quiz)) {
          handleQuizCompletion(appState);
        }

        render(appState);
      }, 400);
    }
    return;
  }

  playSfx('wrong');
  if (window.hammy && typeof hammy.speak === 'function') {
    hammy.speak('encouragement');
  }

  if (appState.quiz.mode === 'bomb_rush') {
    render(appState);
    return;
  }

  const repeatQuestion = cloneQuizQuestion(question);
  appState.quiz.questions.push(repeatQuestion);
  render(appState);
}

function cloneQuizQuestion(question) {
  return {
    ...question,
    guess: '',
    selectedAnswer: undefined,
    answerStatus: undefined,
    requeued: false
  };
}

function continueAfterIncorrect(state) {
  const quiz = state.quiz;
  const currentQuestion = quiz.questions[quiz.currentIndex];

  currentQuestion.answerStatus = undefined;
  currentQuestion.selectedAnswer = undefined;
  currentQuestion.guess = '';

  advanceQuiz(quiz);

  if (isQuizComplete(quiz)) {
    handleQuizCompletion(state);
  }

  render(state);
}

function continueAfterCorrect(state) {
  const quiz = state.quiz;

  advanceQuiz(quiz);

  if (isQuizComplete(quiz)) {
    handleQuizCompletion(state);
  }

  render(state);
}

function isBombRush(quiz) {
  return quiz && quiz.mode === 'bomb_rush';
}

function handleQuizCompletion(appState) {
  if (isBombRush(appState.quiz)) {
    playSfx('complete');
    state.lessonCompleteCelebrated = false;
    return;
  }

  finishLesson(appState);
}

function finishLesson(appState) {
  const scriptProgress = appState.progress[appState.activeScript];
  markLessonComplete(
    scriptProgress,
    appState.quiz.groupIndex,
    appState.quiz.lessonIndex
  );
  playSfx('complete');
  state.lessonCompleteCelebrated = false;
  persistProgress();
}

function openGallery() {
  playSfx('click');
  state.activeView = 'gallery';
  render(state);
}

function closeGallery() {
  state.activeView = 'path';
  render(state);
}

function openSettings() {
  playSfx('click');
  state.activeView = 'settings';
  render(state);
}

function closeSettings() {
  playSfx('click');
  state.activeView = 'path';
  render(state);
}

function cancelQuitQuiz() {
  state.showQuitConfirm = false;
  render(state);
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

document.addEventListener('DOMContentLoaded', initApp);
