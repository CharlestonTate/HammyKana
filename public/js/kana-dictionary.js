// Kana Dictionary: unlocked kana picker during romaji_to_kana quiz questions only.

const kanaDictionary = {
  root: null,
  tab: null,
  backdrop: null,
  panel: null,
  searchInput: null,
  grid: null,
  modeHint: null,
  isOpen: false,
  searchQuery: '',
  appState: null,
  hoverCloseTimer: null,
  isMobile: false,
  mediaQuery: null,

  init() {
    if (this.root) {
      return;
    }

    this.mediaQuery = window.matchMedia('(max-width: 640px)');
    this.isMobile = this.mediaQuery.matches;
    this.mediaQuery.addEventListener('change', () => {
      this.isMobile = this.mediaQuery.matches;
      this.updateLayoutMode();
    });

    this.buildDom();
    this.bindEvents();
    window.kanaDictionary = this;
  },

  buildDom() {
    const root = document.createElement('div');
    root.className = 'kana-dictionary-root';
    root.hidden = true;

    const panel = document.createElement('aside');
    panel.className = 'kana-dictionary-panel';
    panel.setAttribute('aria-label', 'Kana dictionary');

    const handle = document.createElement('div');
    handle.className = 'kana-dictionary-handle';
    handle.setAttribute('aria-hidden', 'true');
    panel.appendChild(handle);

    const header = document.createElement('div');
    header.className = 'kana-dictionary-header';

    const title = document.createElement('h2');
    title.className = 'kana-dictionary-title';
    title.textContent = 'Kana Dictionary';
    header.appendChild(title);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'kana-dictionary-close';
    closeButton.setAttribute('aria-label', 'Close kana dictionary');
    closeButton.textContent = '×';
    header.appendChild(closeButton);

    panel.appendChild(header);

    this.modeHint = document.createElement('p');
    this.modeHint.className = 'kana-dictionary-mode-hint';
    panel.appendChild(this.modeHint);

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.className = 'kana-dictionary-search';
    searchInput.setAttribute('placeholder', 'Search kana or romaji…');
    searchInput.setAttribute('autocomplete', 'off');
    searchInput.setAttribute('autocapitalize', 'off');
    searchInput.setAttribute('spellcheck', 'false');
    panel.appendChild(searchInput);

    const grid = document.createElement('div');
    grid.className = 'kana-dictionary-grid';
    grid.setAttribute('role', 'list');
    panel.appendChild(grid);

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'kana-dictionary-tab';
    tab.setAttribute('aria-label', 'Open kana dictionary');
    tab.setAttribute('aria-expanded', 'false');
    tab.innerHTML = '<span class="kana-dictionary-tab-chevrons" aria-hidden="true">^^</span>';

    root.appendChild(panel);
    root.appendChild(tab);
    document.body.appendChild(root);

    this.root = root;
    this.tab = tab;
    this.panel = panel;
    this.searchInput = searchInput;
    this.grid = grid;
    this.closeButton = closeButton;
  },

  bindEvents() {
    this.tab.addEventListener('click', (event) => {
      event.stopPropagation();
      this.toggle();
    });

    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    this.searchInput.addEventListener('input', () => {
      this.searchQuery = this.searchInput.value;
      this.renderGrid();
    });

    this.searchInput.addEventListener('keydown', (event) => {
      event.stopPropagation();
    });

    const onHoverEnter = () => {
      if (this.isMobile) {
        return;
      }

      window.clearTimeout(this.hoverCloseTimer);
      this.open();
    };

    const onHoverLeave = (event) => {
      if (this.isMobile) {
        return;
      }

      const next = event.relatedTarget;
      if (next && (this.tab.contains(next) || this.panel.contains(next))) {
        return;
      }

      this.hoverCloseTimer = window.setTimeout(() => {
        this.close();
      }, 180);
    };

    this.tab.addEventListener('mouseenter', onHoverEnter);
    this.panel.addEventListener('mouseenter', onHoverEnter);
    this.tab.addEventListener('mouseleave', onHoverLeave);
    this.panel.addEventListener('mouseleave', onHoverLeave);

    document.addEventListener('pointerdown', (event) => {
      if (!this.isOpen || !this.root || this.root.hidden) {
        return;
      }

      if (this.root.contains(event.target)) {
        return;
      }

      this.close();
    });
  },

  updateLayoutMode() {
    if (!this.root) {
      return;
    }

    this.root.classList.toggle('is-mobile', this.isMobile);
  },

  isAvailable() {
    if (!this.appState || this.appState.activeView !== 'quiz' || !this.appState.quiz) {
      return false;
    }

    const question = getCurrentQuestion(this.appState.quiz);
    return Boolean(question && question.type === 'romaji_to_kana' && !question.answerStatus);
  },

  isInsertMode() {
    return this.isAvailable();
  },

  getDictionaryContext(state) {
    let script = state.activeScript;
    let questionGroup = null;

    if (state.activeView === 'quiz' && state.quiz) {
      const question = getCurrentQuestion(state.quiz);

      if (question && question.script) {
        script = question.script;
      }

      if (question) {
        questionGroup = question.groupIndex ?? state.quiz.groupIndex;
      }
    }

    const currentLesson = getCurrentLesson(state.progress[script]);
    const maxUnlockedGroup = currentLesson.groupIndex;
    const availableGroup =
      questionGroup != null ? Math.min(questionGroup, maxUnlockedGroup) : maxUnlockedGroup;

    return {
      script,
      entries: getTypableKana(script, availableGroup)
    };
  },

  filterEntries(entries, query) {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      return entries;
    }

    return entries.filter(
      (entry) => entry.kana.includes(trimmed) || entry.romaji.toLowerCase().includes(trimmed)
    );
  },

  renderGrid() {
    if (!this.appState || !this.grid) {
      return;
    }

    const { entries } = this.getDictionaryContext(this.appState);
    const filtered = this.filterEntries(entries, this.searchQuery);
    const showRomaji = this.appState.settings.showRomaji;

    this.grid.replaceChildren();

    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'kana-dictionary-empty';
      empty.textContent = 'No kana match your search.';
      this.grid.appendChild(empty);
      return;
    }

    filtered.forEach((entry) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'kana-dictionary-cell is-insertable';
      cell.setAttribute('role', 'listitem');

      const kanaEl = document.createElement('span');
      kanaEl.className = 'kana-dictionary-kana';
      kanaEl.textContent = entry.kana;
      cell.appendChild(kanaEl);

      if (showRomaji) {
        const romajiEl = document.createElement('span');
        romajiEl.className = 'kana-dictionary-romaji';
        romajiEl.textContent = entry.romaji;
        cell.appendChild(romajiEl);
      }

      cell.addEventListener('click', () => {
        this.insertKana(entry.kana);
      });

      this.grid.appendChild(cell);
    });
  },

  updateModeHint() {
    if (!this.modeHint) {
      return;
    }

    this.modeHint.textContent = 'Tap a kana to add it to your answer.';
    this.modeHint.hidden = false;
  },

  sync(state) {
    this.appState = state;
    this.updateLayoutMode();

    const shouldShow = this.isAvailable();
    this.root.hidden = !shouldShow;

    if (!shouldShow) {
      this.close();
      return;
    }

    if (this.searchInput && this.searchInput.value !== this.searchQuery) {
      this.searchInput.value = this.searchQuery;
    }

    this.updateModeHint();
    this.renderGrid();
    this.applyOpenState();
  },

  open() {
    if (this.isOpen || !this.root || this.root.hidden) {
      return;
    }

    this.isOpen = true;
    this.applyOpenState();
  },

  close() {
    if (!this.isOpen) {
      return false;
    }

    this.isOpen = false;
    this.applyOpenState();
    return true;
  },

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  applyOpenState() {
    if (!this.root) {
      return;
    }

    this.root.classList.toggle('is-open', this.isOpen);
    this.tab.setAttribute('aria-expanded', this.isOpen ? 'true' : 'false');
  },

  insertKana(kana) {
    if (!this.isInsertMode() || !this.appState) {
      return;
    }

    const question = getCurrentQuestion(this.appState.quiz);
    if (!question) {
      return;
    }

    if (typeof appendKanaToGuess === 'function') {
      appendKanaToGuess(question, kana);
    } else {
      question.guess = (question.guess || '') + kana;
      question.romajiBuffer = '';
      question.romajiCandidateIndex = 0;
    }

    playSfx('click');
    render(this.appState);
  }
};
