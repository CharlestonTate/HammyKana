// Before the first lesson of each half-group (kana 1–5, words 6–10), preview every letter in the group.

function isGroupIntroLesson(lessonIndex) {
  return lessonIndex === 0 || lessonIndex === 5;
}

function openGroupIntro(groupIndex, lessonIndex) {
  state.groupIntro = { groupIndex, lessonIndex };
  state.activeView = 'groupIntro';
  render(state);
}

function closeGroupIntro() {
  state.groupIntro = null;
  state.activeView = 'path';
  render(state);
}

function beginLessonFromIntro() {
  const pending = state.groupIntro;
  if (!pending) {
    return;
  }

  state.groupIntro = null;
  startLesson(pending.groupIndex, pending.lessonIndex);
}

function getGroupCharacterEntries(trackId, groupIndex) {
  const group = getTrackData(trackId).groups.find((item) => item.index === groupIndex);
  if (!group) {
    return [];
  }

  const charList = getTrackData(trackId).kana;
  return group.kana
    .map((char) => charList.find((entry) => entry.kana === char))
    .filter(Boolean);
}

function renderGroupIntroPage(state) {
  const pending = state.groupIntro;
  if (!pending) {
    renderPath(state);
    return;
  }

  const trackId = state.activeScript;
  const entries = getGroupCharacterEntries(trackId, pending.groupIndex);
  const groupTitle = getGroupTitle(getTrackData(trackId).groups[pending.groupIndex]);
  const isWordSet = pending.lessonIndex >= 5;

  const page = document.createElement('section');
  page.className = 'group-intro-page';

  const topBar = document.createElement('div');
  topBar.className = 'group-intro-top';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'header-button';
  backButton.textContent = 'Back';
  backButton.addEventListener('click', () => {
    playSfx('click');
    closeGroupIntro();
  });
  topBar.appendChild(backButton);

  const heading = document.createElement('h2');
  heading.className = 'group-intro-heading';
  heading.textContent = isWordSet ? 'Letters for this word set' : 'New letters';
  topBar.appendChild(heading);

  page.appendChild(topBar);

  const subtitle = document.createElement('p');
  subtitle.className = 'group-intro-subtitle';
  subtitle.textContent = isWordSet
    ? `Group ${pending.groupIndex + 1}: ${groupTitle} — tap a card to hear it, then start the lesson.`
    : `Group ${pending.groupIndex + 1}: ${groupTitle} — learn the sound of each letter before the quiz.`;
  page.appendChild(subtitle);

  const grid = document.createElement('div');
  grid.className = 'group-intro-grid';

  entries.forEach((entry) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'group-intro-card';

    const glyph = document.createElement('span');
    glyph.className = 'group-intro-glyph';
    glyph.textContent = entry.kana;
    card.appendChild(glyph);

    const roman = document.createElement('span');
    roman.className = 'group-intro-roman';
    roman.textContent = entry.romaji;
    card.appendChild(roman);

    const hint = document.createElement('span');
    hint.className = 'group-intro-speak-hint';
    hint.textContent = 'Tap to hear';
    card.appendChild(hint);

    card.addEventListener('click', () => {
      playSfx('click');
      speakCharacterEntry(entry, trackId);
    });

    grid.appendChild(card);
  });

  page.appendChild(grid);

  const startButton = document.createElement('button');
  startButton.type = 'button';
  startButton.className = 'check-button group-intro-start';
  startButton.textContent = isWordSet ? 'Start word lessons' : 'Start lesson';
  startButton.addEventListener('click', () => {
    playSfx('click');
    stopSpeech();
    beginLessonFromIntro();
  });
  page.appendChild(startButton);

  ui.app.appendChild(page);
}
