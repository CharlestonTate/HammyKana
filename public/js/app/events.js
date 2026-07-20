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
