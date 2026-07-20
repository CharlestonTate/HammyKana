// View switching: tabs, gallery/settings/about/bomb-rush-setup open+close, and quiz quit confirm.

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

function openBombRushSetup() {
  state.bombRushError = '';
  state.activeView = 'bombRushSetup';
  render(state);
}

function closeBombRushSetup() {
  state.activeView = 'gallery';
  render(state);
}

function openAbout() {
  state.activeView = 'about';
  render(state);
}

function requestQuitQuiz() {
  state.showQuitConfirm = true;
  render(state);
}

function exitQuiz() {
  stopBombRushTimer();
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
