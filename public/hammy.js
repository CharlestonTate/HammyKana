const hammy = (function () {
  const idleImages = ['img/idle1.png', 'img/idle2.png'];
  const talkImages = ['img/talk1.png', 'img/talk2.png'];
  const smileImages = ['img/smile1.png', 'img/smile2.png'];

  let idleIndex = 0;
  let talkIndex = 0;
  let idleTimer = null;
  let messageTimer = null;

  let playPenElements = null;
  let playPenState = null;
  let playPenFrame = null;
  let playPenIdleTimer = null;

  const messages = {
    positive: [
      'Nice! You got this love!',
      'Sweet! Keep going!',
      'Great job! You are doing awesome!'
    ],
    encouragement: [
      'Try again, you can do it!',
      'Keep it up! One more try!',
      'Almost there, don\'t give up!'
    ],
    celebration: [
      'Fantastic! You crushed that lesson!',
      'So proud of you!',
      'Hammy says: You are amazing!'
    ],
    playPen: [
      'Click and drag me anywhere you like!',
      'Move your cursor over me for pats!',
      'Practice a little every day and kana sticks.',
      'Try Bomb Rush when you feel brave!',
      'Romaji is a hint — aim to read the kana.',
      'Locked lessons unlock one group at a time.',
      'Gold borders mean you mastered a group!',
      'Spelling lessons help words stick in memory.',
      'Take breaks — Hammy believes in you!',
      'Gallery shows every kana you have learned.'
    ]
  };

  function pickRandomMessage(type) {
    const list = messages[type] || [];
    return list[Math.floor(Math.random() * list.length)];
  }

  function updateImage(src) {
    const image = document.getElementById('hammy-image');
    if (!image) {
      return;
    }
    image.src = src;
  }

  function updateBubble(text) {
    const bubble = document.getElementById('hammy-message');
    const shell = document.querySelector('.hammy-shell');

    if (!bubble || !shell) {
      return;
    }

    if (!text) {
      bubble.textContent = '';
      shell.classList.remove('speaking');
      return;
    }

    bubble.textContent = text;
    shell.classList.add('speaking');
  }

  function startIdleAnimation() {
    stopIdleAnimation();
    idleTimer = setInterval(() => {
      idleIndex = (idleIndex + 1) % idleImages.length;
      updateImage(idleImages[idleIndex]);
    }, 150);
  }

  function stopIdleAnimation() {
    if (idleTimer) {
      clearInterval(idleTimer);
      idleTimer = null;
    }
  }

  function startTalkingAnimation() {
    stopIdleAnimation();
    if (messageTimer) {
      clearInterval(messageTimer);
    }

    updateImage(talkImages[talkIndex]);
    talkIndex = (talkIndex + 1) % talkImages.length;
    messageTimer = setInterval(() => {
      updateImage(talkImages[talkIndex]);
      talkIndex = (talkIndex + 1) % talkImages.length;
    }, 200);
  }

  function stopTalkingAnimation() {
    if (messageTimer) {
      clearInterval(messageTimer);
      messageTimer = null;
    }
    startIdleAnimation();
  }

  function speak(type) {
    const text = pickRandomMessage(type);
    updateBubble(text);
    startTalkingAnimation();

    setTimeout(() => {
      stopTalkingAnimation();
      updateBubble('');
    }, 2200);
  }

  function isDesktop() {
    return window.matchMedia('(min-width: 641px)').matches;
  }

  function canOpenPlayPen() {
    return !playPenElements;
  }

  function buildPlayPenDom() {
    const playPen = document.createElement('div');
    playPen.id = 'hammy-play-pen';
    playPen.className = 'hammy-play-pen';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'hammy-play-pen-close';
    closeButton.setAttribute('aria-label', 'Close Hammy play pen');
    closeButton.textContent = '\u00d7';
    closeButton.addEventListener('click', closePlayPen);

    const stage = document.createElement('div');
    stage.className = 'hammy-play-pen-stage';

    const bubble = document.createElement('div');
    bubble.className = 'hammy-play-pen-bubble';
    bubble.setAttribute('role', 'status');
    bubble.setAttribute('aria-live', 'polite');

    const hammyToken = document.createElement('div');
    hammyToken.className = 'hammy-play-pen-hammy';

    const hammyImage = document.createElement('img');
    hammyImage.src = idleImages[0];
    hammyImage.alt = 'Hammy the hamster';
    hammyToken.appendChild(hammyImage);

    stage.appendChild(bubble);
    stage.appendChild(hammyToken);
    playPen.appendChild(closeButton);
    playPen.appendChild(stage);
    document.body.appendChild(playPen);

    return {
      playPen,
      stage,
      bubble,
      hammyToken,
      hammyImage,
      closeButton
    };
  }

  function showPlayPenBubble(text, durationMs) {
    if (!playPenElements) {
      return;
    }

    playPenElements.bubble.textContent = text;
    playPenElements.bubble.classList.add('is-visible');

    if (playPenState.bubbleTimer) {
      clearTimeout(playPenState.bubbleTimer);
    }

    playPenState.bubbleTimer = setTimeout(() => {
      playPenElements.bubble.classList.remove('is-visible');
    }, durationMs);
  }

  function setPlayPenImage(index) {
    if (!playPenElements) {
      return;
    }
    playPenElements.hammyImage.src = idleImages[index % idleImages.length];
  }

  function setSmileImage(index) {
    if (!playPenElements) {
      return;
    }
    playPenElements.hammyImage.src = smileImages[index % smileImages.length];
  }

  function startPlayPenIdleAnimation() {
    stopPlayPenIdleAnimation();
    playPenIdleTimer = setInterval(() => {
      if (!playPenState || playPenState.isPatting || playPenState.isDragging) {
        return;
      }
      idleIndex = (idleIndex + 1) % idleImages.length;
      setPlayPenImage(idleIndex);
    }, 180);
  }

  function stopPlayPenIdleAnimation() {
    if (playPenIdleTimer) {
      clearInterval(playPenIdleTimer);
      playPenIdleTimer = null;
    }
  }

  function onPlayPenResize() {
    if (!playPenState) {
      return;
    }

    const clamped = clampPosition(playPenState.x, playPenState.y);
    playPenState.x = clamped.x;
    playPenState.y = clamped.y;
    applyHammyTransform();
  }

  function getStageBounds() {
    const stageRect = playPenElements.stage.getBoundingClientRect();
    const hammySize = playPenState.hammySize;
    return {
      minX: 0,
      minY: 0,
      maxX: stageRect.width - hammySize,
      maxY: stageRect.height - hammySize
    };
  }

  function clampPosition(x, y) {
    const bounds = getStageBounds();
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, y))
    };
  }

  function applyHammyTransform() {
    playPenElements.hammyToken.style.transform =
      `translate3d(${playPenState.x}px, ${playPenState.y}px, 0)`;
  }

  function randomWanderVelocity() {
    const speed = 0.55 + Math.random() * 0.45;
    const angle = Math.random() * Math.PI * 2;
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    };
  }

  function bounceOffWalls() {
    const bounds = getStageBounds();

    if (playPenState.x <= bounds.minX || playPenState.x >= bounds.maxX) {
      playPenState.vx *= -1;
    }

    if (playPenState.y <= bounds.minY || playPenState.y >= bounds.maxY) {
      playPenState.vy *= -1;
    }

    const clamped = clampPosition(playPenState.x, playPenState.y);
    playPenState.x = clamped.x;
    playPenState.y = clamped.y;
  }

  function tickPlayPen() {
    if (!playPenState || playPenState.isDragging) {
      playPenFrame = requestAnimationFrame(tickPlayPen);
      return;
    }

    playPenState.x += playPenState.vx;
    playPenState.y += playPenState.vy;
    bounceOffWalls();
    applyHammyTransform();

    playPenFrame = requestAnimationFrame(tickPlayPen);
  }

  function startPatting() {
    if (playPenState.isPatting || playPenState.isDragging) {
      return;
    }

    playPenState.isPatting = true;
    playPenState.patIndex = 0;
    playPenElements.stage.classList.add('is-patting');
    setSmileImage(playPenState.patIndex);

    playPenState.patTimer = setInterval(() => {
      playPenState.patIndex = (playPenState.patIndex + 1) % smileImages.length;
      setSmileImage(playPenState.patIndex);
    }, 120);

    if (Math.random() < 0.35) {
      showPlayPenBubble(pickRandomMessage('playPen'), 2800);
    }
  }

  function stopPatting() {
    if (!playPenState.isPatting) {
      return;
    }

    playPenState.isPatting = false;
    playPenElements.stage.classList.remove('is-patting');

    if (playPenState.patTimer) {
      clearInterval(playPenState.patTimer);
      playPenState.patTimer = null;
    }

    setPlayPenImage(idleIndex);
  }

  function pointerIsOverHammy(clientX, clientY) {
    const rect = playPenElements.hammyToken.getBoundingClientRect();
    const padding = 18;
    return (
      clientX >= rect.left - padding &&
      clientX <= rect.right + padding &&
      clientY >= rect.top - padding &&
      clientY <= rect.bottom + padding
    );
  }

  function onStagePointerMove(event) {
    if (playPenState.isDragging) {
      return;
    }

    if (pointerIsOverHammy(event.clientX, event.clientY)) {
      startPatting();
      return;
    }

    stopPatting();
  }

  function onStagePointerLeave() {
    stopPatting();
  }

  function onHammyPointerDown(event) {
    event.preventDefault();
    playPenState.isDragging = true;
    playPenElements.hammyToken.classList.add('is-dragging');
    stopPatting();

    const stageRect = playPenElements.stage.getBoundingClientRect();
    playPenState.dragOffsetX = event.clientX - stageRect.left - playPenState.x;
    playPenState.dragOffsetY = event.clientY - stageRect.top - playPenState.y;
    playPenState.lastPointerX = event.clientX;
    playPenState.lastPointerY = event.clientY;
    playPenState.lastMoveTime = performance.now();

    playPenElements.hammyToken.setPointerCapture(event.pointerId);
  }

  function onHammyPointerMove(event) {
    if (!playPenState.isDragging) {
      return;
    }

    const stageRect = playPenElements.stage.getBoundingClientRect();
    const targetX = event.clientX - stageRect.left - playPenState.dragOffsetX;
    const targetY = event.clientY - stageRect.top - playPenState.dragOffsetY;
    const clamped = clampPosition(targetX, targetY);
    playPenState.x = clamped.x;
    playPenState.y = clamped.y;
    applyHammyTransform();

    const now = performance.now();
    const elapsed = Math.max(now - playPenState.lastMoveTime, 16);
    playPenState.vx = (event.clientX - playPenState.lastPointerX) / elapsed * 16;
    playPenState.vy = (event.clientY - playPenState.lastPointerY) / elapsed * 16;
    playPenState.lastPointerX = event.clientX;
    playPenState.lastPointerY = event.clientY;
    playPenState.lastMoveTime = now;
  }

  function onHammyPointerUp(event) {
    if (!playPenState.isDragging) {
      return;
    }

    playPenState.isDragging = false;
    playPenElements.hammyToken.classList.remove('is-dragging');

    if (playPenElements.hammyToken.hasPointerCapture(event.pointerId)) {
      playPenElements.hammyToken.releasePointerCapture(event.pointerId);
    }

    const speed = Math.hypot(playPenState.vx, playPenState.vy);
    if (speed > 4) {
      playPenState.vx = Math.max(-3, Math.min(3, playPenState.vx));
      playPenState.vy = Math.max(-3, Math.min(3, playPenState.vy));
    } else {
      const wander = randomWanderVelocity();
      playPenState.vx = wander.vx;
      playPenState.vy = wander.vy;
    }

    setPlayPenImage(idleIndex);
  }

  function bindPlayPenEvents() {
    playPenElements.stage.addEventListener('pointermove', onStagePointerMove);
    playPenElements.stage.addEventListener('pointerleave', onStagePointerLeave);
    playPenElements.hammyToken.addEventListener('pointerdown', onHammyPointerDown);
    playPenElements.hammyToken.addEventListener('pointermove', onHammyPointerMove);
    playPenElements.hammyToken.addEventListener('pointerup', onHammyPointerUp);
    playPenElements.hammyToken.addEventListener('pointercancel', onHammyPointerUp);
    window.addEventListener('resize', onPlayPenResize);
    document.addEventListener('keydown', onPlayPenKeyDown);
  }

  function unbindPlayPenEvents() {
    if (!playPenElements) {
      return;
    }

    playPenElements.stage.removeEventListener('pointermove', onStagePointerMove);
    playPenElements.stage.removeEventListener('pointerleave', onStagePointerLeave);
    playPenElements.hammyToken.removeEventListener('pointerdown', onHammyPointerDown);
    playPenElements.hammyToken.removeEventListener('pointermove', onHammyPointerMove);
    playPenElements.hammyToken.removeEventListener('pointerup', onHammyPointerUp);
    playPenElements.hammyToken.removeEventListener('pointercancel', onHammyPointerUp);
    window.removeEventListener('resize', onPlayPenResize);
    document.removeEventListener('keydown', onPlayPenKeyDown);
  }

  function onPlayPenKeyDown(event) {
    if (event.key === 'Escape') {
      closePlayPen();
    }
  }

  function centerHammyInStage() {
    const bounds = getStageBounds();
    playPenState.x = bounds.maxX / 2;
    playPenState.y = bounds.maxY / 2;
    applyHammyTransform();
  }

  function openPlayPen() {
    if (!canOpenPlayPen()) {
      return;
    }

    stopIdleAnimation();
    playPenElements = buildPlayPenDom();

    const wander = randomWanderVelocity();
    playPenState = {
      hammySize: isDesktop() ? 140 : 88,
      x: 0,
      y: 0,
      vx: wander.vx,
      vy: wander.vy,
      isDragging: false,
      isPatting: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      lastMoveTime: 0,
      patIndex: 0,
      patTimer: null,
      bubbleTimer: null
    };

    document.body.classList.add('hammy-play-pen-active');
    playPenElements.playPen.classList.add('is-open');
    playPenElements.hammyToken.style.width = `${playPenState.hammySize}px`;
    playPenElements.hammyToken.style.height = `${playPenState.hammySize}px`;

    centerHammyInStage();
    bindPlayPenEvents();
    startPlayPenIdleAnimation();
    playPenFrame = requestAnimationFrame(tickPlayPen);

    setTimeout(() => {
      showPlayPenBubble(pickRandomMessage('playPen'), 3200);
    }, 500);
  }

  function closePlayPen() {
    if (!playPenElements) {
      return false;
    }

    if (playPenFrame) {
      cancelAnimationFrame(playPenFrame);
      playPenFrame = null;
    }

    stopPatting();
    stopPlayPenIdleAnimation();
    unbindPlayPenEvents();

    if (playPenState && playPenState.bubbleTimer) {
      clearTimeout(playPenState.bubbleTimer);
    }

    playPenElements.playPen.remove();
    playPenElements = null;
    playPenState = null;

    document.body.classList.remove('hammy-play-pen-active');
    startIdleAnimation();
    return true;
  }

  function init() {
    startIdleAnimation();

    const shell = document.querySelector('.hammy-shell');
    if (shell) {
      shell.setAttribute('title', 'Play with Hammy');
    }
  }

  function createPlayPen() {
    openPlayPen();
  }

  return {
    init,
    speak,
    openPlayPen,
    closePlayPen,
    messages,
    setMessagePool(newMessages) {
      Object.assign(messages, newMessages);
    },
    createPlayPen
  };
})();
