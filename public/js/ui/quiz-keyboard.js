// On-screen keyboards for typed answers: QWERTY (word spelling) and romaji-to-kana input.

function appendKanaToGuess(question, kanaChar) {
  if (question.answerStatus) {
    return;
  }

  question.guess = (question.guess || '') + kanaChar;
  question.romajiBuffer = '';
  question.romajiTyped = '';
  question.romajiCandidateIndex = 0;
}

function getRomajiTargetKana(question) {
  if (question.type === 'kana_typing') {
    return question.answer;
  }

  return undefined;
}

function applyRomajiBackspace(question) {
  const script = question.script;
  const result = processRomajiBackspace({
    buffer: question.romajiBuffer || '',
    guess: question.guess || '',
    romajiTyped: question.romajiTyped || '',
    script,
    targetKana: getRomajiTargetKana(question)
  });
  question.romajiBuffer = result.buffer;
  question.guess = result.guess;
  question.romajiTyped = result.romajiTyped || '';
  question.romajiCandidateIndex = 0;
}

function canSubmitRomajiKana(question) {
  return isRomajiInputComplete({
    buffer: question.romajiBuffer || '',
    guess: question.guess || ''
  });
}

function canSubmitDictionaryKana(question) {
  return (question.guess || '').length > 0;
}

function getRomajiInputDisplayValue(guess, romajiBuffer) {
  return (guess || '') + (romajiBuffer || '');
}

function applyRomajiCandidateToQuestion(question, candidateKana, script) {
  const result = applyRomajiCandidate({
    buffer: question.romajiBuffer || '',
    guess: question.guess || '',
    candidateKana,
    script,
    romajiTyped: question.romajiTyped || '',
    targetKana: getRomajiTargetKana(question)
  });
  question.romajiBuffer = result.buffer;
  question.guess = result.guess;
  question.romajiTyped = result.romajiTyped || '';
  question.romajiCandidateIndex = 0;
}

function getRomajiCandidateList(question, script) {
  const buffer = question.romajiBuffer || '';
  if (!buffer) {
    return [];
  }

  return getRomajiCandidates(buffer, script, question.guess || '');
}

function syncRomajiCandidateIndex(question, candidates) {
  if (!candidates.length) {
    question.romajiCandidateIndex = 0;
    return;
  }

  const index = question.romajiCandidateIndex ?? 0;
  question.romajiCandidateIndex = Math.min(Math.max(0, index), candidates.length - 1);
}

function acceptRomajiCandidate(question, state) {
  const script = question.script || state.activeScript;
  const candidates = getRomajiCandidateList(question, script);
  if (!candidates.length) {
    return false;
  }

  syncRomajiCandidateIndex(question, candidates);
  applyRomajiCandidateToQuestion(question, candidates[question.romajiCandidateIndex], script);
  return true;
}

function renderRomajiCandidates(wrap, question, state) {
  const script = question.script || state.activeScript;
  const candidates = getRomajiCandidateList(question, script);
  if (candidates.length === 0) {
    return;
  }

  syncRomajiCandidateIndex(question, candidates);
  const selectedIndex = question.romajiCandidateIndex;

  const list = document.createElement('ul');
  list.className = 'romaji-kana-candidates';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', 'Kana suggestions');
  list.setAttribute('aria-activedescendant', `romaji-candidate-${selectedIndex}`);

  candidates.forEach((kana, index) => {
    const item = document.createElement('li');
    item.className = 'romaji-kana-candidate';
    item.setAttribute('role', 'presentation');

    const button = document.createElement('button');
    button.type = 'button';
    button.id = `romaji-candidate-${index}`;
    button.className = 'romaji-kana-candidate-button';
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', index === selectedIndex ? 'true' : 'false');
    button.textContent = kana;

    if (index === selectedIndex) {
      button.classList.add('is-active');
    }

    button.addEventListener('mouseenter', () => {
      question.romajiCandidateIndex = index;
      list.querySelectorAll('.romaji-kana-candidate-button').forEach((node, nodeIndex) => {
        node.classList.toggle('is-active', nodeIndex === index);
        node.setAttribute('aria-selected', nodeIndex === index ? 'true' : 'false');
      });
      list.setAttribute('aria-activedescendant', `romaji-candidate-${index}`);
    });

    button.addEventListener('click', () => {
      question.romajiCandidateIndex = index;
      acceptRomajiCandidate(question, state);
      render(state);
    });

    item.appendChild(button);
    list.appendChild(item);
  });

  wrap.appendChild(list);

  requestAnimationFrame(() => {
    const active = list.querySelector('.romaji-kana-candidate-button.is-active');
    active?.scrollIntoView({ block: 'nearest' });
  });
}

function renderDictionaryKanaAnswerField(container, state, question, answered) {
  const guess = question.guess || '';
  const wrap = document.createElement('div');
  wrap.className = 'romaji-kana-input-wrap';

  const display = document.createElement('div');
  display.className = 'kana-guess-display';
  display.setAttribute('aria-label', 'Your kana answer');
  display.setAttribute('aria-live', 'polite');

  if (answered) {
    display.textContent = question.selectedAnswer || guess;
    display.classList.add(
      question.answerStatus === 'correct' ? 'kana-guess-display-correct' : 'kana-guess-display-wrong'
    );
  } else {
    display.textContent = guess;
    display.classList.toggle('is-empty', !guess);
  }

  wrap.appendChild(display);
  container.appendChild(wrap);
}

function renderRomajiKanaInputField(container, state, question, answered) {
  const guess = question.guess || '';
  const romajiBuffer = question.romajiBuffer || '';
  const wrap = document.createElement('div');
  wrap.className = 'romaji-kana-input-wrap';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'romaji-kana-input';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocapitalize', 'off');
  input.setAttribute('spellcheck', 'false');
  input.setAttribute('inputmode', 'latin');
  input.setAttribute('aria-label', 'Type romaji to write kana');
  input.value = answered ? (question.selectedAnswer || guess) : getRomajiInputDisplayValue(guess, romajiBuffer);

  wrap.appendChild(input);

  if (answered) {
    input.readOnly = true;
    input.classList.add(
      question.answerStatus === 'correct' ? 'romaji-kana-input-correct' : 'romaji-kana-input-wrong'
    );
  } else {
    input.addEventListener('keydown', (event) => {
      handleRomajiKanaTyping(event, state, question);
      event.stopPropagation();
    });
    input.addEventListener('input', () => {
      input.value = getRomajiInputDisplayValue(question.guess, question.romajiBuffer);
    });

    renderRomajiCandidates(wrap, question, state);
  }

  container.appendChild(wrap);

  if (!answered) {
    requestAnimationFrame(() => {
      input.focus();
    });
  }
}

function handleDictionaryKanaTyping(event, state, question) {
  if (!question || question.answerStatus) {
    return;
  }

  const script = question.script || state.activeScript;

  if (event.key === 'Backspace') {
    event.preventDefault();
    question.guess = removeLastKanaSegment(question.guess || '', script);
    render(state);
    return;
  }

  if (event.key === 'Enter') {
    if (canSubmitDictionaryKana(question)) {
      event.preventDefault();
      submitAnswer(state, question, question.guess);
    }
  }
}

function handleRomajiKanaTyping(event, state, question) {
  if (!question || question.answerStatus) {
    return;
  }

  const script = question.script || state.activeScript;

  if (event.key === 'Backspace') {
    event.preventDefault();
    applyRomajiBackspace(question);
    render(state);
    return;
  }

  const candidates = getRomajiCandidateList(question, script);

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    if (candidates.length > 0) {
      event.preventDefault();
      syncRomajiCandidateIndex(question, candidates);
      const step = event.key === 'ArrowDown' ? 1 : -1;
      question.romajiCandidateIndex =
        (question.romajiCandidateIndex + step + candidates.length) % candidates.length;
      render(state);
    }

    return;
  }

  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Tab') {
    if (candidates.length > 0) {
      event.preventDefault();
      acceptRomajiCandidate(question, state);
      render(state);
      return;
    }

    if (event.key !== 'Enter') {
      return;
    }

    if (question.romajiBuffer) {
      const finalized = finalizeRomajiInput({
        buffer: question.romajiBuffer || '',
        guess: question.guess || '',
        script,
        romajiTyped: question.romajiTyped || '',
        targetKana: getRomajiTargetKana(question)
      });
      question.romajiBuffer = finalized.buffer;
      question.guess = finalized.guess;
    }

    if (canSubmitRomajiKana(question)) {
      event.preventDefault();
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

  event.preventDefault();

  const result = processRomajiInput({
    buffer: question.romajiBuffer || '',
    guess: question.guess || '',
    key: letter,
    script,
    romajiTyped: question.romajiTyped || '',
    targetKana: getRomajiTargetKana(question)
  });
  question.romajiBuffer = result.buffer;
  question.guess = result.guess;
  question.romajiTyped = result.romajiTyped || '';
  question.romajiCandidateIndex = 0;
  render(state);
}

function collapseKeyboard(keyboard) {
  keyboard.style.maxHeight = `${keyboard.scrollHeight}px`;
  keyboard.offsetHeight;

  requestAnimationFrame(() => {
    keyboard.style.maxHeight = '0px';
    keyboard.classList.add('keyboard-fade-out');
  });
}

function getAnswerRevealParts(question) {
  if (question.type === 'romaji_to_kana' || question.type === 'kana_typing') {
    const romaji =
      question.referenceRomaji ||
      (question.type === 'romaji_to_kana' ? question.prompt.replace(/\s+/g, '') : '');

    return { kana: question.answer, romaji };
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
  const answered = question.answerStatus !== undefined;
  const isRomajiToKana = question.type === 'romaji_to_kana';
  const isKanaTyping = question.type === 'kana_typing';

  if (isRomajiToKana) {
    const hint = document.createElement('p');
    hint.className = 'quiz-hint';
    hint.textContent =
      'Use the Kana Dictionary (^^ tab below) to build the word. Backspace removes the last kana; Enter submits.';
    container.appendChild(hint);
    renderDictionaryKanaAnswerField(container, state, question, answered);
  } else if (isKanaTyping) {
    const hint = document.createElement('p');
    hint.className = 'quiz-hint';
    hint.textContent =
      'Type romaji to write the kana shown above. Use ↑↓ for suggestions, Enter to confirm.';
    container.appendChild(hint);
    renderRomajiKanaInputField(container, state, question, answered);
  } else {
    const guess = question.guess || '';
    const spelling = document.createElement('div');
    spelling.className = 'spelling-row';

    for (let i = 0; i < question.answer.length; i++) {
      const cell = document.createElement('span');
      cell.className = 'spelling-cell';
      cell.textContent = (guess[i] || '').toUpperCase();

      if (answered) {
        if (question.answerStatus === 'correct') {
          cell.classList.add('spelling-correct');
        } else if (question.selectedAnswer) {
          const selectedChars = [...question.selectedAnswer];
          if (selectedChars[i] === [...question.answer][i]) {
            cell.classList.add('spelling-correct');
          } else {
            cell.classList.add('spelling-wrong');
          }
        }
      }

      spelling.appendChild(cell);
    }

    container.appendChild(spelling);
  }

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

    if (isRomajiToKana) {
      question.guess = removeLastKanaSegment(question.guess || '', question.script || state.activeScript);
    } else if (isKanaTyping) {
      applyRomajiBackspace(question);
    } else {
      question.guess = question.guess.slice(0, -1);
    }

    render(state);
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'button';
  submitButton.className = 'keyboard-key keyboard-action';
  submitButton.textContent = 'Enter';
  submitButton.disabled = isRomajiToKana
    ? !canSubmitDictionaryKana(question) || answered
    : isKanaTyping
      ? !canSubmitRomajiKana(question) || answered
      : question.guess.length !== question.answer.length || answered;
  submitButton.addEventListener('click', () => {
    if (answered) {
      return;
    }

    if (isRomajiToKana) {
      if (canSubmitDictionaryKana(question)) {
        submitAnswer(state, question, question.guess);
      }

      return;
    }

    if (isKanaTyping) {
      if (question.romajiBuffer) {
        const finalized = finalizeRomajiInput({
          buffer: question.romajiBuffer || '',
          guess: question.guess || '',
          script: question.script || state.activeScript,
          romajiTyped: question.romajiTyped || '',
          targetKana: getRomajiTargetKana(question)
        });
        question.romajiBuffer = finalized.buffer;
        question.guess = finalized.guess;
      }

      if (canSubmitRomajiKana(question)) {
        submitAnswer(state, question, question.guess);
      }

      return;
    }

    if (question.guess.length === question.answer.length) {
      submitAnswer(state, question, question.guess);
    }
  });

  actionRow.appendChild(backButton);
  actionRow.appendChild(submitButton);
  keyboard.appendChild(actionRow);
  container.appendChild(keyboard);
}
