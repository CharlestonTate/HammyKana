// this entire file was vibe coded and formatted by chat that's why it's so bad

function bindEvents() {
  document.getElementById('gallery-button').addEventListener('click', openGallery);
  document.getElementById('about-button').addEventListener('click', openAbout);
  document.getElementById('settings-button').addEventListener('click', openSettings);

  ui.tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      switchScript(tab.dataset.script);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (window.hammy && typeof hammy.closeCenterStage === 'function' && hammy.closeCenterStage()) {
        return;
      }

      if (window.hammy && typeof hammy.closePlayPen === 'function' && hammy.closePlayPen()) {
        return;
      }

      if (window.kanaDictionary && typeof kanaDictionary.close === 'function' && kanaDictionary.close()) {
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

      if (state.activeView === 'bombRushSetup') {
        closeBombRushSetup();
        return;
      }

      if (state.activeView === 'about') {
        state.activeView = 'path';
        render(state);
        return;
      }

      if (state.activeView === 'settings') {
        closeSettings();
      }

      return;
    }

    handleQuizContinueKey(event);
    handleQuizTyping(event);
  });
}

function handleQuizTyping(event) {
  if (state.activeView !== 'quiz' || !state.quiz) {
    return;
  }

  const question = getCurrentQuestion(state.quiz);

  if (!question || question.answerStatus) {
    return;
  }

  if (question.type === 'romaji_to_kana') {
    if (event.target && event.target.classList.contains('romaji-kana-input')) {
      return;
    }

    handleRomajiKanaTyping(event, state, question);
    return;
  }

  if (question.type !== 'word_spelling') {
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
