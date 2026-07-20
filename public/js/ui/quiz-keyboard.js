// On-screen keyboards for typed answers: QWERTY (word spelling) and kana (romaji-to-kana).

function collapseKeyboard(keyboard) {
  keyboard.style.maxHeight = `${keyboard.scrollHeight}px`;
  keyboard.offsetHeight; // force reflow so the max-height change below actually transitions

  requestAnimationFrame(() => {
    keyboard.style.maxHeight = '0px';
    keyboard.classList.add('keyboard-fade-out');
  });
}

function createKanaKeyButton(kanaChar, question, answered, state) {
  const key = document.createElement('button');
  key.type = 'button';
  key.className = 'keyboard-key';
  key.textContent = kanaChar;
  key.disabled = answered;

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

function getAnswerRevealParts(question) {
  if (question.type === 'romaji_to_kana') {
    return { kana: question.answer, romaji: question.prompt.replace(/\s+/g, '') };
  }

  return { kana: question.prompt, romaji: question.answer };
}

function createAnswerReveal(question) {
  const parts = getAnswerRevealParts(question);
  const reveal = document.createElement('div');
  reveal.className = 'answer-reveal';

  const kana = document.createElement('span');
  kana.className = 'answer-reveal-kana';
  kana.textContent = parts.kana;

  const romaji = document.createElement('span');
  romaji.className = 'answer-reveal-romaji';
  romaji.textContent = parts.romaji;

  reveal.appendChild(kana);
  reveal.appendChild(romaji);
  return reveal;
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

  if (isTypedAnswerWrong(question)) {
    container.appendChild(createAnswerReveal(question));
  }

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
    const questionScript = question.script || state.activeScript;
    const currentLesson = getCurrentLesson(state.progress[questionScript]);
    const maxUnlockedGroup = currentLesson.groupIndex;
    const questionGroup = question.groupIndex ?? state.quiz?.groupIndex ?? maxUnlockedGroup;
    const availableGroup = Math.min(questionGroup, maxUnlockedGroup);
    const kanaChars = getAvailableKana(questionScript, availableGroup).map((entry) => entry.kana);

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
