// Course picker at / — no course SFX here; nexton plays on the language pages only.

const HUB_MASCOT_IDLE_MS = 150;

function startHubMascotFlip() {
  const img = document.querySelector('.course-hub-mascot');
  if (!img) {
    return;
  }

  const frames = [assetUrl('img/idle1.png'), assetUrl('img/idle2.png')];
  let frameIndex = 0;

  setInterval(() => {
    frameIndex = (frameIndex + 1) % frames.length;
    img.src = frames[frameIndex];
  }, HUB_MASCOT_IDLE_MS);
}

document.addEventListener('DOMContentLoaded', () => {
  preloadSounds();
  startHubMascotFlip();

  document.querySelectorAll('[data-course-entry]').forEach((link) => {
    link.addEventListener('click', () => {
      playSfx('click');
    });
  });
});
