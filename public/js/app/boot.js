// Applies per-page HAMMY_BOOT: course branding, header tabs, and default track.

function applyBootConfig() {
  const boot = getBootConfig();
  const course = getCourseConfig();

  document.title = boot.brandTitle || course.brandTitle;

  const nav = document.querySelector('.tab-nav');
  if (nav) {
    nav.innerHTML = '';
    const tracks =
      boot.tracks && boot.tracks.length
        ? boot.tracks.map((id) => {
            const meta = course.tracks.find((track) => track.id === id);
            return meta || { id, label: id };
          })
        : course.tracks;

    tracks.forEach((track) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tab';
      button.dataset.script = track.id;
      button.textContent = track.label;
      nav.appendChild(button);
    });

    nav.hidden = tracks.length <= 1;
  }

  const galleryButton = document.getElementById('gallery-button');
  if (galleryButton && boot.courseId === 'telugu') {
    galleryButton.setAttribute('aria-label', 'Open character gallery');
  }

  renderMainMenuLink();
}

function renderMainMenuLink() {
  const actions = document.querySelector('.header-actions');
  if (!actions) {
    return;
  }

  const existing = document.getElementById('main-menu-link');
  if (existing) {
    existing.remove();
  }

  const link = document.createElement('a');
  link.id = 'main-menu-link';
  link.className = 'header-button header-course-link';
  link.href = '/';
  link.textContent = 'Main menu';
  link.setAttribute('aria-label', 'Back to course selection');

  const aboutButton = document.getElementById('about-button');
  if (aboutButton) {
    actions.insertBefore(link, aboutButton);
  } else {
    actions.appendChild(link);
  }
}
