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

function renderAboutPage(state) {
  const aboutPage = document.createElement('section');
  aboutPage.className = 'about-page';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'about-back-button';
  backButton.textContent = 'Back to lessons';
  backButton.addEventListener('click', () => {
    state.activeView = 'path';
    render(state);
  });
  aboutPage.appendChild(backButton);

  const card = document.createElement('div');
  card.className = 'about-card';
  card.innerHTML = `
    <h1>HammyKana</h1>
    <p>Lead Dev: Tate Singleton</p>
    <p>Hamster: Cookie</p>
    <p>Person who named the hamster: Hannah Kas</p>
    <p>SFX: Stardew Valley</p>
    <p>Special Thanks: Grant Roos and Braden. Also my mom.</p>
    <p>Psalm 55</p>
    <p class="about-thanks">Thank you for learning with HammyKana!</p>
    <p class="about-thanks">This project will always be free.</p>
  `;
  aboutPage.appendChild(card);

  ui.app.appendChild(aboutPage);
}

function renderPath(state) {
  const scriptProgress = state.progress[state.activeScript];
  const groupData = getScriptData(state.activeScript);
  const current = getCurrentLesson(scriptProgress);
  const path = document.createElement('section');
  path.className = 'lesson-path';

  groupData.groups.forEach((group) => {
    const groupProgress = scriptProgress.groups[group.index];
    const groupUnlocked = isGroupUnlocked(scriptProgress, group.index);
    const groupEl = document.createElement('div');
    groupEl.className = 'lesson-group';

    if (groupProgress.mastered) {
      groupEl.classList.add('mastered');
    }

    if (!groupUnlocked) {
      groupEl.classList.add('locked');
    }

    const label = document.createElement('h2');
    label.className = 'lesson-group-label';
    label.textContent = getGroupTitle(group);
    groupEl.appendChild(label);

    const nodes = document.createElement('div');
    nodes.className = 'lesson-nodes';

    for (let lessonIndex = 0; lessonIndex < LESSONS_PER_GROUP; lessonIndex++) {
      const node = createLessonNode(
        state,
        group.index,
        lessonIndex,
        groupProgress,
        current,
        groupUnlocked
      );
      nodes.appendChild(node);
    }

    groupEl.appendChild(nodes);
    path.appendChild(groupEl);
  });

  ui.app.appendChild(path);

  if (state.scrollToCurrentLesson) {
    const nextLesson = getCurrentLesson(state.progress[state.activeScript]);
    const lessonId = `lesson-${nextLesson.groupIndex}-${nextLesson.lessonIndex}`;
    const targetNode = document.getElementById(lessonId);

    if (targetNode) {
      targetNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    state.scrollToCurrentLesson = false;
  }
}

function createLessonNode(state, groupIndex, lessonIndex, groupProgress, current, groupUnlocked) {
  const node = document.createElement('button');
  node.type = 'button';
  node.className = 'lesson-node';
  node.id = `lesson-${groupIndex}-${lessonIndex}`;
  node.textContent = String(lessonIndex + 1);

  const isComplete = groupProgress.lessons[lessonIndex];
  const isCurrent = current.groupIndex === groupIndex && current.lessonIndex === lessonIndex;
  const canStart = canStartLesson(state.progress[state.activeScript], groupIndex, lessonIndex);

  if (groupProgress.mastered) {
    node.classList.add('mastered');
  }

  if (isComplete) {
    node.classList.add('completed');
  }

  if (isCurrent && !isComplete && groupUnlocked) {
    node.classList.add('available');
  }

  if (!canStart) {
    node.classList.add('locked');
    node.disabled = true;
  }

  if (canStart) {
    node.addEventListener('click', () => {
      playSfx('click');
      startLesson(groupIndex, lessonIndex);
    });
  }

  return node;
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
  quitButton.textContent = '\u00d7';
  quitButton.addEventListener('click', () => {
    requestQuitQuiz();
  });
  topBar.appendChild(quitButton);

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

  if (question.type === 'word_spelling' || question.type === 'romaji_to_kana') {
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

  if ((question.type === 'word_spelling' || question.type === 'romaji_to_kana') && question.answerStatus === 'correct' && question.meaning) {
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
}

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

function createKanaKeyButton(kanaChar, question, answered, state) {
  const key = document.createElement('button');
  key.type = 'button';
  key.className = 'keyboard-key';
  key.textContent = kanaChar;
  key.disabled = answered;

  if (question.answerStatus === 'incorrect' && question.selectedAnswer) {
    if (question.answer.includes(kanaChar)) {
      key.classList.add('key-correct');
    } else if (question.selectedAnswer.includes(kanaChar)) {
      key.classList.add('key-wrong');
    }
  }

  key.addEventListener('click', () => {
    if (answered) {
      return;
    }

    if (question.guess.length < question.answer.length) {
      question.guess += kanaChar;
      render(state);
    }
  });

  return key;
}

function renderKanaKeyboardRows(keyboard, kanaChars, question, answered, state) {
  for (let i = 0; i < kanaChars.length; i += KANA_KEYBOARD_COLS) {
    const row = document.createElement('div');
    row.className = 'keyboard-row';
    const rowChars = kanaChars.slice(i, i + KANA_KEYBOARD_COLS);
    row.dataset.cols = String(rowChars.length);
    row.style.setProperty('--keyboard-cols', String(rowChars.length));

    rowChars.forEach((kanaChar) => {
      row.appendChild(createKanaKeyButton(kanaChar, question, answered, state));
    });

    keyboard.appendChild(row);
  }
}

function renderMobileKanaKeyboard(keyboard, kanaChars, question, answered, state) {
  if (typeof question.kanaPage !== 'number') {
    question.kanaPage = 0;
  }

  const totalPages = Math.max(1, Math.ceil(kanaChars.length / KANA_KEYBOARD_PAGE_SIZE));
  question.kanaPage = Math.min(Math.max(0, question.kanaPage), totalPages - 1);

  const start = question.kanaPage * KANA_KEYBOARD_PAGE_SIZE;
  const pageChars = kanaChars.slice(start, start + KANA_KEYBOARD_PAGE_SIZE);
  const grid = document.createElement('div');
  grid.className = 'kana-keyboard-grid';
  grid.style.setProperty('--kana-grid-cols', String(KANA_KEYBOARD_COLS));

  pageChars.forEach((kanaChar) => {
    grid.appendChild(createKanaKeyButton(kanaChar, question, answered, state));
  });

  keyboard.appendChild(grid);

  if (totalPages > 1) {
    const pagination = document.createElement('div');
    pagination.className = 'keyboard-pagination';

    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.className = 'keyboard-key keyboard-page-button';
    prevButton.textContent = '‹';
    prevButton.setAttribute('aria-label', 'Previous kana page');
    prevButton.disabled = question.kanaPage === 0;
    prevButton.addEventListener('click', () => {
      if (question.kanaPage > 0) {
        question.kanaPage -= 1;
        render(state);
      }
    });

    const pageLabel = document.createElement('span');
    pageLabel.className = 'keyboard-page-label';
    pageLabel.textContent = `${question.kanaPage + 1} / ${totalPages}`;

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'keyboard-key keyboard-page-button';
    nextButton.textContent = '›';
    nextButton.setAttribute('aria-label', 'Next kana page');
    nextButton.disabled = question.kanaPage >= totalPages - 1;
    nextButton.addEventListener('click', () => {
      if (question.kanaPage < totalPages - 1) {
        question.kanaPage += 1;
        render(state);
      }
    });

    pagination.appendChild(prevButton);
    pagination.appendChild(pageLabel);
    pagination.appendChild(nextButton);
    keyboard.appendChild(pagination);
  }
}

function renderSpellingQuestion(container, state, question) {
  const guess = question.guess || '';
  const answered = question.answerStatus !== undefined;

  if (question.type === 'romaji_to_kana') {
    const hint = document.createElement('p');
    hint.className = 'quiz-hint';
    hint.textContent = 'Type the kana characters that match this romaji:';
    container.appendChild(hint);
  }

  const spelling = document.createElement('div');
  spelling.className = 'spelling-row';

  for (let i = 0; i < question.answer.length; i++) {
    const cell = document.createElement('span');
    cell.className = 'spelling-cell';
    const letter = guess[i] || '';
    cell.textContent = letter.toUpperCase();

    if (answered) {
      if (question.answerStatus === 'correct') {
        cell.classList.add('spelling-correct');
      } else if (question.selectedAnswer) {
        if (question.selectedAnswer[i] === question.answer[i]) {
          cell.classList.add('spelling-correct');
        } else {
          cell.classList.add('spelling-wrong');
        }
      }
    }

    spelling.appendChild(cell);
  }

  container.appendChild(spelling);

  const keyboard = document.createElement('div');
  keyboard.className = 'keyboard';

  if (question.type === 'word_spelling') {
    ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].forEach((rowLetters) => {
      const row = document.createElement('div');
      row.className = 'keyboard-row';
      row.dataset.cols = String(rowLetters.length);
      row.style.setProperty('--keyboard-cols', String(rowLetters.length));

      rowLetters.split('').forEach((letter) => {
        const key = document.createElement('button');
        key.type = 'button';
        key.className = 'keyboard-key';
        key.textContent = letter.toUpperCase();
        key.disabled = answered;

        if (question.answerStatus === 'incorrect') {
          if (question.answer.includes(letter)) {
            key.classList.add('key-correct');
          } else if (question.selectedAnswer && question.selectedAnswer.includes(letter)) {
            key.classList.add('key-wrong');
          }
        }

        key.addEventListener('click', () => {
          if (answered) {
            return;
          }

          if (question.guess.length < question.answer.length) {
            question.guess += letter;
            render(state);
          }
        });

        row.appendChild(key);
      });

      keyboard.appendChild(row);
    });
  } else {
    const currentLesson = getCurrentLesson(state.progress[state.activeScript]);
    const maxUnlockedGroup = currentLesson.groupIndex;
    const questionGroup = question.groupIndex ?? state.quiz?.groupIndex ?? maxUnlockedGroup;
    const availableGroup = Math.min(questionGroup, maxUnlockedGroup);
    const kanaChars = getAvailableKana(state.activeScript, availableGroup).map((entry) => entry.kana);
    const label = document.createElement('div');
    label.className = 'keyboard-label';
    label.textContent = `${state.activeScript === 'hiragana' ? 'Hiragana' : 'Katakana'} keyboard`;
    container.appendChild(label);

    if (isMobileKanaKeyboard()) {
      renderMobileKanaKeyboard(keyboard, kanaChars, question, answered, state);
    } else {
      renderKanaKeyboardRows(keyboard, kanaChars, question, answered, state);
    }
  }

  const actionRow = document.createElement('div');
  actionRow.className = 'keyboard-row keyboard-action-row';
  actionRow.dataset.cols = '2';
  actionRow.style.setProperty('--keyboard-cols', '2');

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'keyboard-key keyboard-action';
  backButton.textContent = '⌫';
  backButton.addEventListener('click', () => {
    if (answered) {
      return;
    }

    question.guess = question.guess.slice(0, -1);
    render(state);
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'button';
  submitButton.className = 'keyboard-key keyboard-action';
  submitButton.textContent = 'Enter';
  submitButton.disabled = question.guess.length !== question.answer.length || answered;
  submitButton.addEventListener('click', () => {
    if (question.guess.length === question.answer.length && !answered) {
      submitAnswer(state, question, question.guess);
    }
  });

  actionRow.appendChild(backButton);
  actionRow.appendChild(submitButton);
  keyboard.appendChild(actionRow);
  container.appendChild(keyboard);
}

function renderQuizComplete(container, state) {
  const wrapper = document.createElement('div');
  wrapper.className = 'quiz-complete-wrapper';

  const message = document.createElement('p');
  message.className = 'quiz-complete';
  message.textContent = 'Lesson complete!';
  wrapper.appendChild(message);

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

  if (state.quiz && state.quiz.mode === 'bomb_rush') {
    const score = document.createElement('p');
    score.className = 'quiz-score';
    score.textContent = `Score: ${state.quiz.correctCount} / ${state.quiz.questions.length}`;
    wrapper.appendChild(score);
  }
}

function showFeedback(container, isCorrect) {
  const feedback = container.querySelector('.quiz-feedback');

  if (!feedback) {
    return;
  }

  feedback.hidden = false;
  feedback.textContent = isCorrect ? 'Correct!' : 'Incorrect';
  feedback.classList.toggle('correct', isCorrect);
  feedback.classList.toggle('wrong', !isCorrect);
}

function renderGalleryPage(state) {
  const script = state.activeScript;
  const scriptProgress = state.progress[script];
  const allKana = getAllKanaForGallery(script);
  const masteredSet = new Set(
    getMasteredKana(script, scriptProgress).map((entry) => entry.kana)
  );
  const scriptLabel = script === 'hiragana' ? 'Hiragana' : 'Katakana';
  const page = document.createElement('section');
  page.className = 'gallery-page';

  const topBar = document.createElement('div');
  topBar.className = 'gallery-top';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'header-button';
  backButton.textContent = 'Back';
  backButton.addEventListener('click', () => {
    playSfx('click');
    closeGallery();
  });
  topBar.appendChild(backButton);

  const title = document.createElement('h2');
  title.className = 'gallery-title';
  title.textContent = `${scriptLabel} Gallery`;
  topBar.appendChild(title);

  const bombRushButton = document.createElement('button');
  bombRushButton.type = 'button';
  bombRushButton.className = 'header-button';
  bombRushButton.textContent = 'Bomb Rush';
  bombRushButton.addEventListener('click', () => {
    playSfx('click');
    startBombRush(script);
  });
  topBar.appendChild(bombRushButton);

  page.appendChild(topBar);

  const grid = document.createElement('div');
  grid.className = 'gallery-grid';

  allKana.forEach((entry) => {
    const cell = document.createElement('div');
    cell.className = 'gallery-cell';

    if (masteredSet.has(entry.kana)) {
      cell.classList.add('unlocked');

      const kanaEl = document.createElement('span');
      kanaEl.className = 'gallery-kana';
      kanaEl.textContent = entry.kana;
      cell.appendChild(kanaEl);

      if (state.settings.showRomaji) {
        const romaji = document.createElement('span');
        romaji.className = 'gallery-romaji';
        romaji.textContent = entry.romaji;
        cell.appendChild(romaji);
      }
    } else {
      cell.classList.add('locked');
      cell.textContent = '?';
    }

    grid.appendChild(cell);
  });

  page.appendChild(grid);
  ui.app.appendChild(page);
}

function renderSettingsPage(state) {
  const page = document.createElement('section');
  page.className = 'settings-page';

  const topBar = document.createElement('div');
  topBar.className = 'settings-top';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'header-button';
  backButton.textContent = 'Back';
  backButton.addEventListener('click', () => {
    playSfx('click');
    closeSettings();
  });
  topBar.appendChild(backButton);

  const title = document.createElement('h2');
  title.className = 'settings-title';
  title.textContent = 'Settings';
  topBar.appendChild(title);

  page.appendChild(topBar);

  const body = document.createElement('div');
  body.className = 'settings-body';

  const musicRow = document.createElement('label');
  musicRow.className = 'settings-row';
  const musicLabel = document.createElement('span');
  musicLabel.textContent = 'Music Volume';
  const musicInput = document.createElement('input');
  musicInput.type = 'range';
  musicInput.min = '0';
  musicInput.max = '100';
  musicInput.value = String(Math.round(state.settings.musicVolume * 100));
  musicInput.addEventListener('input', (event) => {
    state.settings.musicVolume = Number(event.target.value) / 100;
    setMusicVolume(state.settings.musicVolume);
    persistProgress();
  });
  musicRow.appendChild(musicLabel);
  musicRow.appendChild(musicInput);

  const sfxRow = document.createElement('label');
  sfxRow.className = 'settings-row';
  const sfxLabel = document.createElement('span');
  sfxLabel.textContent = 'SFX Volume';
  const sfxInput = document.createElement('input');
  sfxInput.type = 'range';
  sfxInput.min = '0';
  sfxInput.max = '100';
  sfxInput.value = String(Math.round(state.settings.sfxVolume * 100));
  sfxInput.addEventListener('input', (event) => {
    state.settings.sfxVolume = Number(event.target.value) / 100;
    persistProgress();
  });
  sfxRow.appendChild(sfxLabel);
  sfxRow.appendChild(sfxInput);

  const romajiRow = document.createElement('label');
  romajiRow.className = 'settings-row settings-toggle';
  const romajiLabel = document.createElement('span');
  romajiLabel.textContent = 'Show Romaji';
  const romajiInput = document.createElement('input');
  romajiInput.type = 'checkbox';
  romajiInput.checked = state.settings.showRomaji;
  romajiInput.addEventListener('change', (event) => {
    state.settings.showRomaji = event.target.checked;
    persistProgress();

    if (state.activeView === 'gallery') {
      render(state);
    }
  });
  romajiRow.appendChild(romajiLabel);
  romajiRow.appendChild(romajiInput);

  body.appendChild(musicRow);
  body.appendChild(sfxRow);
  body.appendChild(romajiRow);

  const progressSection = document.createElement('div');
  progressSection.className = 'settings-section';

  const progressTitle = document.createElement('h3');
  progressTitle.className = 'settings-section-title';
  progressTitle.textContent = 'Progress';
  progressSection.appendChild(progressTitle);

  const progressNote = document.createElement('p');
  progressNote.className = 'settings-note';
  progressNote.textContent = 'Your progress saves automatically on this device. Download a backup to keep or transfer it.';
  progressSection.appendChild(progressNote);

  const progressActions = document.createElement('div');
  progressActions.className = 'settings-actions';

  const statusMessage = document.createElement('p');
  statusMessage.className = 'settings-status';
  statusMessage.hidden = true;

  function showSettingsStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `settings-status ${type}`;
    statusMessage.hidden = false;
  }

  const downloadButton = document.createElement('button');
  downloadButton.type = 'button';
  downloadButton.className = 'header-button settings-action-button';
  downloadButton.textContent = 'Download Progress';
  downloadButton.addEventListener('click', () => {
    playSfx('click');
    downloadProgressBackup();
    showSettingsStatus('Progress file downloaded.', 'success');
  });

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json,.json';
  fileInput.hidden = true;

  const loadButton = document.createElement('button');
  loadButton.type = 'button';
  loadButton.className = 'header-button settings-action-button';
  loadButton.textContent = 'Load Progress';
  loadButton.addEventListener('click', () => {
    playSfx('click');
    fileInput.click();
  });

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];

    if (!file) {
      return;
    }

    fileInput.value = '';

    try {
      const imported = await importProgressFromFile(file);
      const confirmed = window.confirm(
        'Load this progress file? Your current progress on this device will be replaced.'
      );

      if (!confirmed) {
        return;
      }

      applyImportedProgress(imported);
      showSettingsStatus('Progress loaded successfully.', 'success');
    } catch (error) {
      showSettingsStatus(error.message || 'Could not load progress file.', 'error');
    }
  });

  progressActions.appendChild(downloadButton);
  progressActions.appendChild(loadButton);
  progressActions.appendChild(fileInput);
  progressSection.appendChild(progressActions);
  progressSection.appendChild(statusMessage);
  body.appendChild(progressSection);

  page.appendChild(body);
  ui.app.appendChild(page);
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

function updateActiveTab(activeScript) {
  ui.tabs.forEach((tab) => {
    const isActive = tab.dataset.script === activeScript;
    tab.classList.toggle('active', isActive);
  });
}
