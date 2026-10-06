// The quiz shell: top bar (progress/timer), prompt, feedback, and the complete/quit screens.
// Keyboard-driven question types (spelling/typing) render themselves in quiz-keyboard.js.

function formatBombRushTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function createBombRushTimer(quiz) {
  const timer = document.createElement('div');
  timer.className = 'bomb-rush-timer';
  timer.setAttribute('role', 'timer');
  timer.setAttribute('aria-live', 'polite');
  timer.textContent = formatBombRushTime(quiz.remainingSeconds);
  timer.classList.toggle('bomb-rush-timer-urgent', !quiz.countUp && quiz.remainingSeconds <= 10);
  return timer;
}

// Updates the timer badge in place on each tick instead of calling render(state),
// which would tear down and rebuild the whole quiz view (including any keyboard
// mid-collapse-animation) every second.
function updateBombRushTimerDisplay(quiz) {
  const timerEl = document.querySelector('.bomb-rush-timer');

  if (!timerEl) {
    return;
  }

  timerEl.textContent = formatBombRushTime(quiz.remainingSeconds);
  timerEl.classList.toggle('bomb-rush-timer-urgent', !quiz.countUp && quiz.remainingSeconds <= 10);
}

function renderQuiz(state) {
  const quiz = state.quiz;
  const question = getCurrentQuestion(quiz);
  const progress = getQuizProgress(quiz);
  const container = document.createElement('section');
  container.className = 'quiz-view';

  const topBar = document.createElement('div');
  topBar.className = 'quiz-top';

  const quitButton = document.createElement('button');
  quitButton.type = 'button';
  quitButton.className = 'quiz-quit';
  quitButton.setAttribute('aria-label', 'Quit lesson');
  quitButton.textContent = '×';
  quitButton.addEventListener('click', () => {
    requestQuitQuiz();
  });
  topBar.appendChild(quitButton);

  if (quiz.mode === 'bomb_rush') {
    topBar.appendChild(createBombRushTimer(quiz));
  } else {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuenow', String(progress.current));
    progressBar.setAttribute('aria-valuemin', '1');
    progressBar.setAttribute('aria-valuemax', String(progress.total));

    const progressFill = document.createElement('div');
    progressFill.className = 'progress-bar-fill';
    progressFill.style.width = `${(progress.current / progress.total) * 100}%`;
    progressBar.appendChild(progressFill);
    topBar.appendChild(progressBar);
  }

  container.appendChild(topBar);

  if (isQuizComplete(quiz)) {
    renderQuizComplete(container, state);
    ui.app.appendChild(container);
    return;
  }

  const prompt = document.createElement('div');
  prompt.className = 'quiz-prompt';
  prompt.textContent = question.prompt;
  container.appendChild(prompt);

  if (isTypedQuestion(question)) {
    renderSpellingQuestion(container, state, question);
  } else {
    renderMultipleChoiceAnswers(container, state, question);
  }

  const feedback = document.createElement('p');
  feedback.className = 'quiz-feedback';

  if (question.answerStatus) {
    feedback.textContent = question.answerStatus === 'correct' ? 'Correct!' : 'Incorrect';
    feedback.classList.toggle('correct', question.answerStatus === 'correct');
    feedback.classList.toggle('wrong', question.answerStatus === 'incorrect');
    feedback.hidden = false;
  } else {
    feedback.hidden = true;
  }

  container.appendChild(feedback);

  if (isTypedQuestion(question) && question.answerStatus === 'correct' && question.meaning) {
    const meaning = document.createElement('p');
    meaning.className = 'word-meaning';
    meaning.textContent = `Meaning: ${question.meaning}`;
    container.appendChild(meaning);

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'check-button';
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      continueAfterCorrect(state);
    });
    container.appendChild(nextButton);
  }

  if (question.answerStatus === 'incorrect') {
    const continueButton = document.createElement('button');
    continueButton.type = 'button';
    continueButton.className = 'check-button';
    continueButton.textContent = 'Continue';
    continueButton.addEventListener('click', () => {
      continueAfterIncorrect(state);
    });
    container.appendChild(continueButton);
  }

  ui.app.appendChild(container);

  if (isTypedAnswered(question)) {
    const keyboardEl = container.querySelector('.keyboard');
    if (keyboardEl) {
      collapseKeyboard(keyboardEl);
    }
  }
}

function renderMultipleChoiceAnswers(container, state, question) {
  const answers = document.createElement('div');
  answers.className = 'answer-grid';

  question.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-button';
    button.textContent = option;

    if (question.answerStatus === 'incorrect' || question.answerStatus === 'correct') {
      button.disabled = true;
      button.classList.add('disabled-answer');

      if (option === question.answer) {
        button.classList.add('correct-answer');
      }

      if (question.answerStatus === 'incorrect' && option === question.selectedAnswer && option !== question.answer) {
        button.classList.add('wrong-answer');
      }
    }

    button.addEventListener('click', () => {
      if (question.answerStatus !== 'incorrect' && question.answerStatus !== 'correct') {
        submitAnswer(state, question, option);
      }
    });

    answers.appendChild(button);
  });

  container.appendChild(answers);
}

function renderQuizComplete(container, state) {
  const isBombRushQuiz = state.quiz && state.quiz.mode === 'bomb_rush';
  const wrapper = document.createElement('div');
  wrapper.className = 'quiz-complete-wrapper';

  const message = document.createElement('p');
  message.className = 'quiz-complete';
  message.textContent = isBombRushQuiz ? "Time's Up!" : 'Lesson complete!';
  wrapper.appendChild(message);

  if (isBombRushQuiz) {
    const score = document.createElement('p');
    score.className = 'quiz-score';
    score.textContent = `Score: ${state.quiz.correctCount} / ${state.quiz.currentIndex}`;
    wrapper.appendChild(score);
  }

  const continueButton = document.createElement('button');
  continueButton.type = 'button';
  continueButton.className = 'check-button';
  continueButton.textContent = 'Continue';
  continueButton.addEventListener('click', () => {
    playSfx('click');
    exitQuiz();
  });
  wrapper.appendChild(continueButton);

  container.appendChild(wrapper);
}

function renderQuitConfirmation() {
  const overlay = document.createElement('div');
  overlay.className = 'quit-confirm';

  const card = document.createElement('div');
  card.className = 'quit-confirm-card';

  const heading = document.createElement('h3');
  heading.textContent = 'Quit this lesson?';
  card.appendChild(heading);

  const message = document.createElement('p');
  message.textContent = 'Your progress in this session will be lost.';
  card.appendChild(message);

  const controls = document.createElement('div');
  controls.className = 'quit-confirm-actions';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'header-button';
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => {
    cancelQuitQuiz();
  });

  const quitButton = document.createElement('button');
  quitButton.type = 'button';
  quitButton.className = 'check-button';
  quitButton.textContent = 'Quit';
  quitButton.addEventListener('click', () => {
    playSfx('click');
    exitQuiz();
  });

  controls.appendChild(cancelButton);
  controls.appendChild(quitButton);
  card.appendChild(controls);
  overlay.appendChild(card);

  ui.app.appendChild(overlay);
}
