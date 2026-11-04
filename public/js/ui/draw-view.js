// Draw practice: stroke-order GIFs beside a blank pad, one set at a time.
// Animations are from kanji.gif (https://github.com/jcsirot/kanji.gif), CC BY-SA 3.0,
// generated from KanjiVG. ぽ has no GIF, so that one character stays a still diagram.

const STROKE_SVG_ONLY = new Set(['ぽ']);

function strokeAssetUrl(char) {
  const code = char.codePointAt(0).toString(16).padStart(5, '0');
  const extension = STROKE_SVG_ONLY.has(char) ? 'svg' : 'gif';
  return assetUrl(`strokes/${code}.${extension}`);
}

function renderDrawPage(state) {
  const page = document.createElement('section');
  page.className = 'draw-page';

  if (state.drawGroupIndex == null) {
    renderDrawSetList(state, page);
  } else {
    renderDrawSet(state, page);
  }

  ui.app.appendChild(page);
}

function renderDrawSetList(state, page) {
  const trackMeta = getCourseConfig().tracks.find((track) => track.id === state.activeScript);
  const scriptLabel = trackMeta ? trackMeta.label : state.activeScript;

  page.appendChild(createDrawTopBar('Draw', closeDraw));

  const note = document.createElement('p');
  note.className = 'draw-note';
  note.textContent = `Pick a ${scriptLabel} set. The animation shows the stroke order. Draw it on the pad.`;
  page.appendChild(note);

  const list = document.createElement('div');
  list.className = 'draw-sets';

  getTrackData(state.activeScript).groups.forEach((group) => {
    const entries = getGroupKana(state.activeScript, group.index);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'draw-set';

    const kana = document.createElement('span');
    kana.className = 'draw-set-kana';
    kana.textContent = entries.map((entry) => entry.kana).join('');

    const romaji = document.createElement('span');
    romaji.className = 'draw-set-romaji';
    romaji.textContent = entries.map((entry) => entry.romaji).join(' ');

    button.appendChild(kana);
    button.appendChild(romaji);
    button.addEventListener('click', () => openDrawSet(group.index));
    list.appendChild(button);
  });

  page.appendChild(list);
}

function renderDrawSet(state, page) {
  const entries = getGroupKana(state.activeScript, state.drawGroupIndex);

  if (!entries.length) {
    state.drawGroupIndex = null;
    renderDrawSetList(state, page);
    return;
  }

  page.appendChild(createDrawTopBar(entries.map((entry) => entry.kana).join(''), closeDrawSet));

  entries.forEach((entry) => {
    page.appendChild(createDrawCard(entry, state.settings.showRomaji));
  });
}

function createDrawTopBar(titleText, onBack) {
  const topBar = document.createElement('div');
  topBar.className = 'gallery-top';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'header-button';
  backButton.textContent = 'Back';
  backButton.addEventListener('click', onBack);
  topBar.appendChild(backButton);

  const title = document.createElement('h2');
  title.className = 'gallery-title';
  title.textContent = titleText;
  topBar.appendChild(title);

  return topBar;
}

function createDrawCard(entry, showRomaji) {
  const card = document.createElement('article');
  card.className = 'draw-card';

  const label = document.createElement('div');
  label.className = 'draw-card-label';

  const kana = document.createElement('span');
  kana.className = 'draw-card-kana';
  kana.textContent = entry.kana;
  label.appendChild(kana);

  if (showRomaji) {
    const romaji = document.createElement('span');
    romaji.className = 'draw-card-romaji';
    romaji.textContent = entry.romaji;
    label.appendChild(romaji);
  }

  card.appendChild(label);

  const characterCount = [...entry.kana].length;
  const practice = document.createElement('div');
  practice.className = 'draw-practice';
  if (characterCount > 1) {
    practice.classList.add('is-wide');
  }

  const guide = document.createElement('div');
  const guideCaption = document.createElement('p');
  guideCaption.className = 'draw-caption';
  guideCaption.textContent = 'Stroke order';
  guide.appendChild(guideCaption);

  const images = document.createElement('div');
  images.className = 'draw-guide-images';
  [...entry.kana].forEach((char) => {
    const image = document.createElement('img');
    image.className = 'draw-stroke';
    image.src = strokeAssetUrl(char);
    image.alt = `Stroke order animation for ${char}`;
    images.appendChild(image);
  });
  guide.appendChild(images);
  practice.appendChild(guide);

  const pad = document.createElement('div');
  pad.className = 'draw-pad';

  const padCaption = document.createElement('p');
  padCaption.className = 'draw-caption';
  padCaption.textContent = 'Practice';
  pad.appendChild(padCaption);

  const canvas = document.createElement('canvas');
  canvas.className = 'draw-canvas';
  if (characterCount > 1) {
    canvas.classList.add('is-wide');
  }
  canvas.setAttribute('aria-label', `Drawing pad for ${entry.kana}`);
  bindDrawPad(canvas, characterCount);
  pad.appendChild(canvas);

  const actions = document.createElement('div');
  actions.className = 'draw-actions';

  const grade = document.createElement('p');
  grade.className = 'draw-grade';
  grade.setAttribute('aria-live', 'polite');

  const checkButton = document.createElement('button');
  checkButton.type = 'button';
  checkButton.className = 'header-button draw-clear';
  checkButton.textContent = 'Check';
  checkButton.addEventListener('click', () => {
    playSfx('click');
    gradeDrawCard(entry.kana, canvas, grade);
  });

  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'header-button draw-clear';
  clearButton.textContent = 'Clear';
  clearButton.addEventListener('click', () => {
    playSfx('click');
    clearDrawPad(canvas);
    grade.textContent = '';
    grade.classList.remove('is-good');
  });

  actions.appendChild(checkButton);
  actions.appendChild(clearButton);
  pad.appendChild(actions);
  pad.appendChild(grade);

  practice.appendChild(pad);
  card.appendChild(practice);
  return card;
}

function bindDrawPad(canvas, characterCount) {
  const context = canvas.getContext('2d');
  const height = 440;
  const width = height * Math.max(1, characterCount);
  canvas.width = width;
  canvas.height = height;
  context.lineWidth = 14;
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = '#000000';
  context.fillStyle = '#000000';

  let drawing = false;
  let lastPoint = null;

  function pointFromEvent(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  canvas.addEventListener('pointerdown', (event) => {
    drawing = true;
    lastPoint = pointFromEvent(event);
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.arc(lastPoint.x, lastPoint.y, context.lineWidth / 2, 0, Math.PI * 2);
    context.fill();
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!drawing || !lastPoint) {
      return;
    }

    const point = pointFromEvent(event);
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPoint = point;
  });

  function stopDrawing(event) {
    if (!drawing) {
      return;
    }

    drawing = false;
    lastPoint = null;
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  }

  canvas.addEventListener('pointerup', stopDrawing);
  canvas.addEventListener('pointercancel', stopDrawing);
}

function clearDrawPad(canvas) {
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// Grades against the finished character, not the animation frame on screen.
// The drawing is lined up by its own size, without stretching it.
// Coverage is how much of the character your lines pass near.
// 100 requires the lines to land on the character, with little stray ink.
const DRAW_GRADE_CELL = 96;
const DRAW_COVER_RADIUS = 8;
const DRAW_SPILL_RADIUS = 9;

const strokeReferenceCache = new Map();

function strokeReferenceUrl(char) {
  const code = char.codePointAt(0).toString(16).padStart(5, '0');
  return assetUrl(`strokes/ref/${code}.png`);
}

function loadStrokeReference(char) {
  if (char === 'ー') {
    return Promise.resolve(prolongedMarkReference());
  }

  const cached = strokeReferenceCache.get(char);
  if (cached) {
    return cached;
  }

  const pending = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(char));
    image.src = strokeReferenceUrl(char);
  });
  strokeReferenceCache.set(char, pending);
  return pending;
}

function prolongedMarkReference() {
  const canvas = document.createElement('canvas');
  canvas.width = 150;
  canvas.height = 150;
  const context = canvas.getContext('2d');
  context.strokeStyle = '#000000';
  context.lineWidth = 14;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(28, 75);
  context.lineTo(122, 75);
  context.stroke();
  return canvas;
}

async function gradeDrawCard(kana, canvas, grade) {
  if (grade.dataset.pending === '1') {
    return;
  }

  grade.dataset.pending = '1';

  try {
    const characters = [...kana];
    const references = await Promise.all(characters.map((char) => loadStrokeReference(char)));
    const percent = gradeAgainstReferences(canvas, references);
    if (percent == null) {
      grade.textContent = 'Draw it first.';
      grade.classList.remove('is-good');
      return;
    }

    grade.textContent = `${percent}%`;
    grade.classList.toggle('is-good', percent >= 80);
  } catch (error) {
    grade.textContent = "Couldn't grade that.";
    grade.classList.remove('is-good');
  } finally {
    grade.dataset.pending = '0';
  }
}

function gradeAgainstReferences(canvas, references) {
  const parts = references.map((reference) => fittedDarkMask(reference, DRAW_GRADE_CELL, DRAW_GRADE_CELL));
  if (parts.some((part) => !part)) {
    return 0;
  }

  const bands = userBands(canvas, references.length, DRAW_GRADE_CELL);
  if (!bands) {
    return null;
  }

  const total = parts.reduce((sum, part, index) => {
    return sum + scoreShape(bands[index], part, DRAW_GRADE_CELL, DRAW_GRADE_CELL);
  }, 0);

  return Math.round(total / parts.length);
}

function userBands(canvas, count, cell) {
  const source = darkMask(canvas, canvas.width, canvas.height);
  const bounds = inkBounds(source, canvas.width, canvas.height);
  if (!bounds) {
    return null;
  }

  const bands = [];
  const span = bounds.maxX - bounds.minX + 1;

  for (let index = 0; index < count; index += 1) {
    const start = bounds.minX + Math.floor((span * index) / count);
    const end = bounds.minX + Math.floor((span * (index + 1)) / count) - 1;
    bands.push(fitSlice(canvas, bounds.minY, bounds.maxY, start, Math.max(start, end), cell));
  }

  return bands;
}

function fitSlice(source, minY, maxY, minX, maxX, cell) {
  const fitted = document.createElement('canvas');
  fitted.width = cell;
  fitted.height = cell;
  const context = fitted.getContext('2d');
  const boundsWidth = maxX - minX + 1;
  const boundsHeight = maxY - minY + 1;
  const margin = 8;
  const scale = Math.min((cell - margin * 2) / boundsWidth, (cell - margin * 2) / boundsHeight);
  const drawWidth = boundsWidth * scale;
  const drawHeight = boundsHeight * scale;
  context.drawImage(
    source,
    minX,
    minY,
    boundsWidth,
    boundsHeight,
    (cell - drawWidth) / 2,
    (cell - drawHeight) / 2,
    drawWidth,
    drawHeight
  );
  return darkMask(fitted, cell, cell);
}

function fittedDarkMask(source, width, height) {
  const sourceWidth = source.naturalWidth || source.width;
  const sourceHeight = source.naturalHeight || source.height;
  const native = document.createElement('canvas');
  native.width = sourceWidth;
  native.height = sourceHeight;
  native.getContext('2d').drawImage(source, 0, 0, sourceWidth, sourceHeight);
  const bounds = inkBounds(darkMask(native, sourceWidth, sourceHeight), sourceWidth, sourceHeight);
  if (!bounds) {
    return null;
  }

  return fitSlice(native, bounds.minY, bounds.maxY, bounds.minX, bounds.maxX, width);
}

function darkMask(canvas, width, height) {
  const data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  const mask = new Uint8Array(width * height);

  for (let index = 0; index < mask.length; index += 1) {
    const offset = index * 4;
    const alpha = data[offset + 3];
    const luminance = (data[offset] + data[offset + 1] + data[offset + 2]) / 3;
    if (alpha > 40 && luminance < 200) {
      mask[index] = 1;
    }
  }

  return mask;
}

function inkBounds(mask, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!mask[y * width + x]) {
        continue;
      }
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) {
    return null;
  }

  return { minX, minY, maxX, maxY };
}

function scoreShape(user, target, width, height) {
  let targetCount = 0;
  let covered = 0;
  let userCount = 0;
  let spilled = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (target[index]) {
        targetCount += 1;
        if (hasInkNearby(user, width, height, x, y, DRAW_COVER_RADIUS)) covered += 1;
      }
      if (user[index]) {
        userCount += 1;
        if (!hasInkNearby(target, width, height, x, y, DRAW_SPILL_RADIUS)) spilled += 1;
      }
    }
  }

  if (!targetCount || !userCount) {
    return 0;
  }

  const coverage = covered / targetCount;
  const spill = spilled / userCount;
  const fullness = userCount / targetCount;

  if (coverage >= 0.96 && spill <= 0.1 && fullness <= 1.8) {
    return 100;
  }

  const extraPenalty = Math.min(1, Math.max(0, fullness - 2.1) / 3);
  return 100 * coverage * (1 - 0.32 * spill) * (1 - extraPenalty);
}

function hasInkNearby(mask, width, height, x, y, radius) {
  const radiusSquared = radius * radius;

  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      if (dx * dx + dy * dy > radiusSquared) {
        continue;
      }
      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) {
        continue;
      }
      if (mask[nextY * width + nextX]) {
        return true;
      }
    }
  }

  return false;
}
