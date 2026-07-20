// Settings screen: volume/romaji toggles plus progress backup (download/load JSON).

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
  musicInput.addEventListener('input', onMusicVolumeChange);
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
  sfxInput.addEventListener('input', onSfxVolumeChange);
  sfxRow.appendChild(sfxLabel);
  sfxRow.appendChild(sfxInput);

  const romajiRow = document.createElement('label');
  romajiRow.className = 'settings-row settings-toggle';
  const romajiLabel = document.createElement('span');
  romajiLabel.textContent = 'Show Romaji';
  const romajiInput = document.createElement('input');
  romajiInput.type = 'checkbox';
  romajiInput.checked = state.settings.showRomaji;
  romajiInput.addEventListener('change', onShowRomajiChange);
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
