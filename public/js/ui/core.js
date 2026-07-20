// Shared DOM refs, the top-level render dispatcher, and small helpers every view needs.

const ui = {
  app: null,
  header: null,
  tabs: null
};

const KANA_KEYBOARD_COLS = 5;
const KANA_KEYBOARD_ROWS = 5;
const KANA_KEYBOARD_PAGE_SIZE = KANA_KEYBOARD_COLS * KANA_KEYBOARD_ROWS;

function isMobileKanaKeyboard() {
  return window.matchMedia('(max-width: 640px)').matches;
}

function cacheDomElements() {
  ui.app = document.getElementById('app');
  ui.header = document.querySelector('.header');
  ui.tabs = document.querySelectorAll('.tab');
}

function clearApp() {
  ui.app.innerHTML = '';
}

function updateHeaderVisibility(activeView) {
  ui.header.hidden = activeView === 'quiz';
  document.body.classList.toggle('is-quiz', activeView === 'quiz');
}

// Full re-render: wipes #app and rebuilds whichever view is active. No diffing.
function render(state) {
  updateHeaderVisibility(state.activeView);
  clearApp();

  if (state.activeView === 'quiz') {
    renderQuiz(state);

    if (state.showQuitConfirm) {
      renderQuitConfirmation();
    }

    return;
  }

  if (state.activeView === 'gallery') {
    renderGalleryPage(state);
    return;
  }

  if (state.activeView === 'bombRushSetup') {
    renderBombRushSetup(state);
    return;
  }

  if (state.activeView === 'settings') {
    renderSettingsPage(state);
    return;
  }

  if (state.activeView === 'about') {
    renderAboutPage(state);
    return;
  }

  renderPath(state);
}

function isTypedQuestion(question) {
  return question.type === 'word_spelling' || question.type === 'romaji_to_kana';
}

function isTypedAnswerWrong(question) {
  return isTypedQuestion(question) && question.answerStatus === 'incorrect';
}

function isTypedAnswered(question) {
  return isTypedQuestion(question) && !!question.answerStatus;
}

function updateActiveTab(activeScript) {
  ui.tabs.forEach((tab) => {
    const isActive = tab.dataset.script === activeScript;
    tab.classList.toggle('active', isActive);
  });
}

// Not wired up to any celebration event yet, but kept ready for when it is.
function launchConfetti() {
  if (typeof ConfettiGenerator !== 'function') {
    return;
  }

  let canvas = document.getElementById('confetti-canvas');

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '250';
    document.body.appendChild(canvas);
  }

  const confettiSettings = {
    target: 'confetti-canvas',
    max: 150,
    size: 1,
    rotate: true,
    props: ['circle', 'square', 'triangle', 'line'],
    colors: ['#ff5252', '#ffb74d', '#81c784', '#64b5f6', '#ba68c8']
  };

  const confetti = new ConfettiGenerator(confettiSettings);
  confetti.render();

  setTimeout(() => {
    confetti.clear();
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  }, 2500);
}
