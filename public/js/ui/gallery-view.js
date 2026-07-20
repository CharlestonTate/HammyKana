// Kana gallery: every character in a script, revealed once its group is mastered.

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
    openBombRushSetup();
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
