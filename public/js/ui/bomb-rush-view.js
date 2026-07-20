// Bomb Rush setup screen: pick a time limit, script, and question type before starting.

const BOMB_RUSH_TIME_OPTIONS = [
  { value: 60, label: '1 Minute' },
  { value: 300, label: '5 Minutes' },
  { value: 'infinite', label: 'Infinite' }
];

const BOMB_RUSH_SCRIPT_OPTIONS = [
  { value: 'all', label: 'All Scripts' },
  { value: 'hiragana', label: 'Hiragana Only' },
  { value: 'katakana', label: 'Katakana Only' }
];

const BOMB_RUSH_QUESTION_TYPE_OPTIONS = [
  { value: 'all', label: 'All Questions' },
  { value: 'kana', label: 'Kana Recognition' },
  { value: 'typing', label: 'Typing Only' }
];

function createBombRushOptionGroup(title, options, selectedValue, onSelect) {
  const section = document.createElement('div');
  section.className = 'bomb-rush-section';

  const heading = document.createElement('h3');
  heading.className = 'bomb-rush-section-title';
  heading.textContent = title;
  section.appendChild(heading);

  const group = document.createElement('div');
  group.className = 'bomb-rush-options';

  options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'bomb-rush-option';
    button.textContent = option.label;
    button.classList.toggle('selected', option.value === selectedValue);
    button.addEventListener('click', () => {
      playSfx('click');
      onSelect(option.value);
    });
    group.appendChild(button);
  });

  section.appendChild(group);
  return section;
}

function renderBombRushSetup(state) {
  const setup = state.bombRushSetup;
  const page = document.createElement('section');
  page.className = 'bomb-rush-setup-page';

  const topBar = document.createElement('div');
  topBar.className = 'settings-top';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'header-button';
  backButton.textContent = 'Back';
  backButton.addEventListener('click', () => {
    playSfx('click');
    closeBombRushSetup();
  });
  topBar.appendChild(backButton);

  const title = document.createElement('h2');
  title.className = 'settings-title';
  title.textContent = 'Bomb Rush';
  topBar.appendChild(title);

  page.appendChild(topBar);

  const body = document.createElement('div');
  body.className = 'bomb-rush-body';

  body.appendChild(createBombRushOptionGroup('Time Limit', BOMB_RUSH_TIME_OPTIONS, setup.seconds, (value) => {
    setup.seconds = value;
    state.bombRushError = '';
    render(state);
  }));

  body.appendChild(createBombRushOptionGroup('Script', BOMB_RUSH_SCRIPT_OPTIONS, setup.script, (value) => {
    setup.script = value;
    state.bombRushError = '';
    render(state);
  }));

  body.appendChild(createBombRushOptionGroup('Question Types', BOMB_RUSH_QUESTION_TYPE_OPTIONS, setup.questionType, (value) => {
    setup.questionType = value;
    state.bombRushError = '';
    render(state);
  }));

  const startButton = document.createElement('button');
  startButton.type = 'button';
  startButton.className = 'check-button bomb-rush-start-button';
  startButton.textContent = 'Start Bomb Rush';
  startButton.addEventListener('click', () => {
    playSfx('click');
    startBombRush({
      seconds: setup.seconds,
      script: setup.script,
      questionType: setup.questionType
    });
  });
  body.appendChild(startButton);

  if (state.bombRushError) {
    const error = document.createElement('p');
    error.className = 'bomb-rush-error';
    error.textContent = state.bombRushError;
    body.appendChild(error);
  }

  page.appendChild(body);
  ui.app.appendChild(page);
}
