const hammy = (function () {
  const idleImages = ['img/idle1.png', 'img/idle2.png'];
  const talkImages = ['img/talk1.png', 'img/talk2.png'];
  const smileImages = ['img/smile1.png', 'img/smile2.png'];

  // Tweaks for Hammy animation, center stage, fling, and wander — edit freely.
  const HAMMY_TUNING = {
    idleFrameMs: 150,
    talkFrameMs: 200,
    smileFrameMs: 150,
    speakDurationMs: 2200,
    talkingEnabled: false,

    stageEdgePad: 12,
    stageTopInset: 72,
    stageImageMaxPxDesktop: 240,
    stageImageVwDesktop: 0.42,
    stageImageMaxPxMobile: 160,
    stageImageVwMobile: 0.44,
    mobileBreakpointPx: 640,

    flyDurationMs: 500,
    flyEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    flyPopScale: 1.12,
    flyPopDurationMs: 220,
    entranceTotalMs: 520,

    wanderSpeedMin: 0.55,
    wanderSpeedMax: 1.0,

    flingTriggerSpeed: 2.5,
    flingMaxSpeed: 22,
    flingFriction: 0.992,
    flingStopSpeed: 0.35
  };

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

  // ---------------------------------------------------------------------------
  // Center stage — click Hammy on the main menu to focus him
  // ---------------------------------------------------------------------------

  let centerStageActive = false;
  let centerStageElements = null;
  let centerStageMovement = null;
  let centerStageFrame = null;
  let centerStageSmileTimer = null;
  let centerStageSmileIndex = 0;
  let centerStageTalkTimer = null;
  let centerStageTalkIndex = 0;
  let centerStageEntranceTimer = null;
  let centerStageExitTimer = null;

  function isMainMenuView() {
    return typeof state !== 'undefined' && state.activeView === 'path';
  }

  function getCenterStageShell() {
    return document.querySelector('.hammy-shell');
  }

  function startCenterStageSmileAnimation() {
    stopMainHammyAnimation();
    centerStageSmileIndex = 0;
    updateImage(smileImages[centerStageSmileIndex]);
    centerStageSmileTimer = setInterval(() => {
      centerStageSmileIndex = (centerStageSmileIndex + 1) % smileImages.length;
      updateImage(smileImages[centerStageSmileIndex]);
    }, HAMMY_TUNING.smileFrameMs);
  }

  function stopCenterStageSmileAnimation() {
    if (centerStageSmileTimer) {
      clearInterval(centerStageSmileTimer);
      centerStageSmileTimer = null;
    }
  }

  function startCenterStageTalkAnimation() {
    stopIdleAnimation();
    stopCenterStageSmileAnimation();
    centerStageTalkIndex = 0;
    updateImage(talkImages[centerStageTalkIndex]);
    centerStageTalkTimer = setInterval(() => {
      centerStageTalkIndex = (centerStageTalkIndex + 1) % talkImages.length;
      updateImage(talkImages[centerStageTalkIndex]);
    }, HAMMY_TUNING.talkFrameMs);
  }

  function stopCenterStageTalkAnimation() {
    if (centerStageTalkTimer) {
      clearInterval(centerStageTalkTimer);
      centerStageTalkTimer = null;
    }
  }

  function getCenterStageHammySize() {
    const shell = getCenterStageShell();
    if (!shell) {
      return { width: 200, height: 200 };
    }

    const rect = shell.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }

  function getCenterStageBounds() {
    const size = getCenterStageHammySize();
    const pad = HAMMY_TUNING.stageEdgePad;
    const topInset = HAMMY_TUNING.stageTopInset;

    return {
      minX: pad + size.width / 2,
      minY: topInset + size.height / 2,
      maxX: window.innerWidth - pad - size.width / 2,
      maxY: window.innerHeight - pad - size.height / 2
    };
  }

  function clampCenterStagePosition(x, y) {
    const bounds = getCenterStageBounds();
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, y))
    };
  }

  function applyCenterStageTransform() {
    const shell = getCenterStageShell();
    if (!shell || !centerStageMovement) {
      return;
    }

    const { x, y } = centerStageMovement.position;
    const scale = centerStageMovement.isShooting ? HAMMY_TUNING.flyPopScale : 1;
    shell.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
  }

  function getCenterStageFlyTransition() {
    return `transform ${HAMMY_TUNING.flyDurationMs}ms ${HAMMY_TUNING.flyEase}`;
  }

  function bounceCenterStageWalls() {
    const bounds = getCenterStageBounds();
    const movement = centerStageMovement;

    if (movement.position.x <= bounds.minX || movement.position.x >= bounds.maxX) {
      movement.velocity.x *= -1;
    }

    if (movement.position.y <= bounds.minY || movement.position.y >= bounds.maxY) {
      movement.velocity.y *= -1;
    }

    const clamped = clampCenterStagePosition(movement.position.x, movement.position.y);
    movement.position.x = clamped.x;
    movement.position.y = clamped.y;
  }

  function tickCenterStageMovement() {
    if (!centerStageActive || !centerStageMovement) {
      return;
    }

    if (centerStageMovement.isDragging || centerStageMovement.isExiting) {
      applyCenterStageTransform();
      centerStageFrame = requestAnimationFrame(tickCenterStageMovement);
      return;
    }

    if (centerStageMovement.isCoasting) {
      centerStageMovement.position.x += centerStageMovement.velocity.x;
      centerStageMovement.position.y += centerStageMovement.velocity.y;
      centerStageMovement.velocity.x *= HAMMY_TUNING.flingFriction;
      centerStageMovement.velocity.y *= HAMMY_TUNING.flingFriction;
      bounceCenterStageWalls();

      const coastSpeed = Math.hypot(
        centerStageMovement.velocity.x,
        centerStageMovement.velocity.y
      );

      if (coastSpeed < HAMMY_TUNING.flingStopSpeed) {
        centerStageMovement.isCoasting = false;
        const wander = randomWanderVelocity();
        centerStageMovement.velocity.x = wander.vx;
        centerStageMovement.velocity.y = wander.vy;
      }
    } else if (centerStageMovement.isRoaming) {
      centerStageMovement.position.x += centerStageMovement.velocity.x;
      centerStageMovement.position.y += centerStageMovement.velocity.y;
      bounceCenterStageWalls();
    }

    applyCenterStageTransform();
    centerStageFrame = requestAnimationFrame(tickCenterStageMovement);
  }

  function startCenterStageRoaming() {
    stopCenterStageSmileAnimation();
    stopCenterStageTalkAnimation();
    startIdleAnimation();

    const wander = randomWanderVelocity();
    centerStageMovement.velocity.x = wander.vx;
    centerStageMovement.velocity.y = wander.vy;
    centerStageMovement.isRoaming = true;

    if (!centerStageFrame) {
      centerStageFrame = requestAnimationFrame(tickCenterStageMovement);
    }
  }

  function stopCenterStageMovement() {
    if (centerStageFrame) {
      cancelAnimationFrame(centerStageFrame);
      centerStageFrame = null;
    }

    centerStageMovement = null;
  }

  function onCenterStagePointerDown(event) {
    if (!centerStageActive || !centerStageMovement) {
      return;
    }

    const shell = getCenterStageShell();
    if (!shell || !shell.contains(event.target)) {
      return;
    }

    event.preventDefault();
    centerStageMovement.isDragging = true;
    centerStageMovement.isRoaming = false;
    centerStageMovement.isCoasting = false;
    shell.classList.add('is-dragging');
    startCenterStageTalkAnimation();

    centerStageMovement.dragOffsetX = event.clientX - centerStageMovement.position.x;
    centerStageMovement.dragOffsetY = event.clientY - centerStageMovement.position.y;
    centerStageMovement.lastPointerX = event.clientX;
    centerStageMovement.lastPointerY = event.clientY;
    centerStageMovement.lastMoveTime = performance.now();

    shell.setPointerCapture(event.pointerId);
  }

  function onCenterStagePointerMove(event) {
    if (!centerStageMovement || !centerStageMovement.isDragging) {
      return;
    }

    const targetX = event.clientX - centerStageMovement.dragOffsetX;
    const targetY = event.clientY - centerStageMovement.dragOffsetY;
    const clamped = clampCenterStagePosition(targetX, targetY);
    centerStageMovement.position.x = clamped.x;
    centerStageMovement.position.y = clamped.y;

    const now = performance.now();
    const elapsed = Math.max(now - centerStageMovement.lastMoveTime, 16);
    centerStageMovement.velocity.x = (event.clientX - centerStageMovement.lastPointerX) / elapsed * 16;
    centerStageMovement.velocity.y = (event.clientY - centerStageMovement.lastPointerY) / elapsed * 16;
    centerStageMovement.lastPointerX = event.clientX;
    centerStageMovement.lastPointerY = event.clientY;
    centerStageMovement.lastMoveTime = now;
  }

  function onCenterStagePointerUp(event) {
    if (!centerStageMovement || !centerStageMovement.isDragging) {
      return;
    }

    const shell = getCenterStageShell();
    centerStageMovement.isDragging = false;
    centerStageMovement.isRoaming = true;

    if (shell) {
      shell.classList.remove('is-dragging');

      if (shell.hasPointerCapture(event.pointerId)) {
        shell.releasePointerCapture(event.pointerId);
      }
    }

    stopCenterStageTalkAnimation();
    startIdleAnimation();

    const speed = Math.hypot(centerStageMovement.velocity.x, centerStageMovement.velocity.y);

    if (speed > HAMMY_TUNING.flingTriggerSpeed) {
      const cap = Math.min(speed, HAMMY_TUNING.flingMaxSpeed);
      const scale = cap / speed;
      centerStageMovement.velocity.x *= scale;
      centerStageMovement.velocity.y *= scale;
      centerStageMovement.isCoasting = true;
    } else {
      const wander = randomWanderVelocity();
      centerStageMovement.velocity.x = wander.vx;
      centerStageMovement.velocity.y = wander.vy;
      centerStageMovement.isCoasting = false;
    }

    if (!centerStageFrame) {
      centerStageFrame = requestAnimationFrame(tickCenterStageMovement);
    }
  }

  function onCenterStageResize() {
    if (!centerStageMovement) {
      return;
    }

    const clamped = clampCenterStagePosition(
      centerStageMovement.position.x,
      centerStageMovement.position.y
    );
    centerStageMovement.position.x = clamped.x;
    centerStageMovement.position.y = clamped.y;
    applyCenterStageTransform();
  }

  function bindCenterStagePointer() {
    const shell = getCenterStageShell();
    if (!shell) {
      return;
    }

    shell.addEventListener('pointerdown', onCenterStagePointerDown);
    shell.addEventListener('pointermove', onCenterStagePointerMove);
    shell.addEventListener('pointerup', onCenterStagePointerUp);
    shell.addEventListener('pointercancel', onCenterStagePointerUp);
    window.addEventListener('resize', onCenterStageResize);
  }

  function unbindCenterStagePointer() {
    const shell = getCenterStageShell();
    if (!shell) {
      return;
    }

    shell.removeEventListener('pointerdown', onCenterStagePointerDown);
    shell.removeEventListener('pointermove', onCenterStagePointerMove);
    shell.removeEventListener('pointerup', onCenterStagePointerUp);
    shell.removeEventListener('pointercancel', onCenterStagePointerUp);
    window.removeEventListener('resize', onCenterStageResize);
  }

  function buildCenterStageBackButton() {
    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.id = 'hammy-center-stage-back';
    backButton.className = 'hammy-center-stage-back';
    backButton.textContent = 'Back';
    backButton.setAttribute('aria-label', 'Back to main menu');
    backButton.addEventListener('click', closeCenterStage);
    return backButton;
  }

  function onCenterStageKeyDown(event) {
    if (event.key === 'Escape') {
      closeCenterStage();
    }
  }

  function finishCenterStageEntrance() {
    const shell = getCenterStageShell();
    if (!shell || !centerStageMovement) {
      return;
    }

    shell.style.transition = '';
    centerStageMovement.isShooting = true;
    applyCenterStageTransform();

    window.setTimeout(() => {
      if (!centerStageActive || !centerStageMovement) {
        return;
      }

      centerStageMovement.isShooting = false;
      applyCenterStageTransform();
      startCenterStageRoaming();
      bindCenterStagePointer();
    }, HAMMY_TUNING.flyPopDurationMs);
  }

  function openCenterStage() {
    if (centerStageActive || !isMainMenuView()) {
      return;
    }

    const shell = getCenterStageShell();
    if (!shell) {
      return;
    }

    window.scrollTo(0, 0);

    const rect = shell.getBoundingClientRect();
    const homeAnchor = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    const endX = window.innerWidth / 2;
    const endY = window.innerHeight / 2;

    centerStageActive = true;
    startCenterStageSmileAnimation();

    centerStageMovement = {
      position: { x: homeAnchor.x, y: homeAnchor.y },
      homeAnchor,
      velocity: { x: 0, y: 0 },
      isDragging: false,
      isRoaming: false,
      isCoasting: false,
      isShooting: false,
      isExiting: false,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      lastMoveTime: 0
    };

    const backButton = buildCenterStageBackButton();
    document.body.appendChild(backButton);
    centerStageElements = { backButton };

    shell.style.transition = 'none';
    shell.classList.add('is-free-roaming');
    document.body.classList.add('hammy-center-stage-active');
    document.addEventListener('keydown', onCenterStageKeyDown);

    applyCenterStageTransform();
    shell.offsetHeight;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!centerStageActive || !centerStageMovement) {
          return;
        }

        centerStageMovement.position.x = endX;
        centerStageMovement.position.y = endY;
        shell.style.transition = getCenterStageFlyTransition();
        applyCenterStageTransform();
      });
    });

    if (centerStageEntranceTimer) {
      clearTimeout(centerStageEntranceTimer);
    }

    centerStageEntranceTimer = window.setTimeout(
      finishCenterStageEntrance,
      HAMMY_TUNING.entranceTotalMs
    );
  }

  function finishCenterStageExit() {
    const shell = getCenterStageShell();

    document.body.classList.remove('hammy-center-stage-exiting');

    if (shell) {
      shell.style.transition = 'none';
      shell.style.transform = '';
      shell.classList.remove('is-free-roaming', 'is-shooting', 'is-dragging');
      shell.offsetHeight;
      shell.style.transition = '';
    }

    centerStageElements = null;
    centerStageMovement = null;
    centerStageActive = false;
    centerStageExitTimer = null;
    document.removeEventListener('keydown', onCenterStageKeyDown);
    startIdleAnimation();
  }

  function closeCenterStage() {
    if (!centerStageActive || !centerStageMovement) {
      return false;
    }

    if (centerStageMovement.isExiting) {
      return true;
    }

    if (centerStageEntranceTimer) {
      clearTimeout(centerStageEntranceTimer);
      centerStageEntranceTimer = null;
    }

    if (centerStageExitTimer) {
      clearTimeout(centerStageExitTimer);
    }

    unbindCenterStagePointer();
    stopCenterStageSmileAnimation();
    stopCenterStageTalkAnimation();

    if (centerStageFrame) {
      cancelAnimationFrame(centerStageFrame);
      centerStageFrame = null;
    }

    centerStageMovement.isRoaming = false;
    centerStageMovement.isDragging = false;
    centerStageMovement.isExiting = true;

    const shell = getCenterStageShell();
    const home = centerStageMovement.homeAnchor;

    document.body.classList.remove('hammy-center-stage-active');
    document.body.classList.add('hammy-center-stage-exiting');

    if (centerStageElements && centerStageElements.backButton) {
      centerStageElements.backButton.remove();
    }

    if (shell && home) {
      const finishExit = (event) => {
        if (event && (event.target !== shell || event.propertyName !== 'transform')) {
          return;
        }

        shell.removeEventListener('transitionend', finishExit);

        if (centerStageExitTimer) {
          clearTimeout(centerStageExitTimer);
          centerStageExitTimer = null;
        }

        finishCenterStageExit();
      };

      shell.addEventListener('transitionend', finishExit);
      centerStageExitTimer = window.setTimeout(() => {
        finishExit({});
      }, HAMMY_TUNING.flyDurationMs + 80);

      centerStageMovement.position.x = home.x;
      centerStageMovement.position.y = home.y;
      shell.style.transition = getCenterStageFlyTransition();
      applyCenterStageTransform();
    } else {
      finishCenterStageExit();
    }

    return true;
  }

  function bindCenterStage() {
    const shell = getCenterStageShell();
    if (!shell) {
      return;
    }

    shell.setAttribute('title', 'Play with Hammy');
    shell.addEventListener('click', () => {
      if (!isMainMenuView() || centerStageActive) {
        return;
      }

      openCenterStage();
    });
  }

  // ---------------------------------------------------------------------------
  // End center stage
  // ---------------------------------------------------------------------------

  function startIdleAnimation() {
    stopIdleAnimation();
    idleTimer = setInterval(() => {
      idleIndex = (idleIndex + 1) % idleImages.length;
      updateImage(idleImages[idleIndex]);
    }, HAMMY_TUNING.idleFrameMs);
  }

  function stopMainHammyAnimation() {
    stopIdleAnimation();
    stopCenterStageSmileAnimation();
    stopCenterStageTalkAnimation();
    if (messageTimer) {
      clearInterval(messageTimer);
      messageTimer = null;
    }
  }

  function resumeMainHammyAnimation() {
    startIdleAnimation();
  }

  function stopIdleAnimation() {
    if (idleTimer) {
      clearInterval(idleTimer);
      idleTimer = null;
    }
  }

  function startTalkingAnimation() {
    stopMainHammyAnimation();

    updateImage(talkImages[talkIndex]);
    talkIndex = (talkIndex + 1) % talkImages.length;
    messageTimer = setInterval(() => {
      updateImage(talkImages[talkIndex]);
      talkIndex = (talkIndex + 1) % talkImages.length;
    }, HAMMY_TUNING.talkFrameMs);
  }

  function stopTalkingAnimation() {
    if (messageTimer) {
      clearInterval(messageTimer);
      messageTimer = null;
    }
    resumeMainHammyAnimation();
  }

  function speak(type) {
    if (!HAMMY_TUNING.talkingEnabled) {
      return;
    }

    const text = pickRandomMessage(type);
    updateBubble(text);
    startTalkingAnimation();

    setTimeout(() => {
      stopTalkingAnimation();
      updateBubble('');
    }, HAMMY_TUNING.speakDurationMs);
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
    const span = HAMMY_TUNING.wanderSpeedMax - HAMMY_TUNING.wanderSpeedMin;
    const speed = HAMMY_TUNING.wanderSpeedMin + Math.random() * span;
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

    stopMainHammyAnimation();
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
    resumeMainHammyAnimation();
    return true;
  }

  function init() {
    startIdleAnimation();
    bindCenterStage();
  }

  function createPlayPen() {
    openPlayPen();
  }

  return {
    init,
    speak,
    tuning: HAMMY_TUNING,
    openCenterStage,
    closeCenterStage,
    openPlayPen,
    closePlayPen,
    messages,
    setMessagePool(newMessages) {
      Object.assign(messages, newMessages);
    },
    createPlayPen
  };
})();

window.hammy = hammy;
