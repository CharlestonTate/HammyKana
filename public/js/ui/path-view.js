// The lesson path: 26 kana groups x 10 lesson nodes each, with unlock/mastery states.

function renderPath(state) {
  const scriptProgress = state.progress[state.activeScript];
  const groupData = getScriptData(state.activeScript);
  const current = getCurrentLesson(scriptProgress);
  const path = document.createElement('section');
  path.className = 'lesson-path';

  const justMastered = state.justMasteredGroup && state.justMasteredGroup.script === state.activeScript
    ? state.justMasteredGroup
    : null;

  const groupsToReveal = [];

  groupData.groups.forEach((group) => {
    const groupProgress = scriptProgress.groups[group.index];
    const groupUnlocked = isGroupUnlocked(scriptProgress, group.index);
    const groupEl = document.createElement('div');
    groupEl.className = 'lesson-group';

    if (groupProgress.mastered) {
      groupEl.classList.add('mastered');
    }

    if (!groupUnlocked) {
      groupEl.classList.add('locked');
    }

    const revealMastery = !!justMastered && group.index === justMastered.groupIndex;

    if (revealMastery) {
      groupEl.classList.add('mastery-pending');
      groupsToReveal.push({ el: groupEl, pendingClass: 'mastery-pending', kind: 'mastery' });
    }

    if (justMastered && group.index === justMastered.groupIndex + 1) {
      groupEl.classList.add('unlock-pending');
      groupsToReveal.push({ el: groupEl, pendingClass: 'unlock-pending', kind: 'unlock' });
    }

    const label = document.createElement('h2');
    label.className = 'lesson-group-label';
    label.textContent = getGroupTitle(group);
    groupEl.appendChild(label);

    const nodes = document.createElement('div');
    nodes.className = 'lesson-nodes';

    for (let lessonIndex = 0; lessonIndex < LESSONS_PER_GROUP; lessonIndex++) {
      const node = createLessonNode(
        state,
        group.index,
        lessonIndex,
        groupProgress,
        current,
        groupUnlocked,
        revealMastery
      );
      nodes.appendChild(node);
    }

    groupEl.appendChild(nodes);
    path.appendChild(groupEl);
  });

  ui.app.appendChild(path);

  if (justMastered) {
    state.justMasteredGroup = null;
  }

  groupsToReveal.forEach((target) => {
    armRevealOnVisible(target.el, target.pendingClass, target.kind);
  });

  if (state.scrollToCurrentLesson) {
    // A just-mastered group is the moment we actually want on screen - scroll to
    // it directly instead of the next lesson node, so its gold reveal (and the
    // "finish" sfx that fires with it) is guaranteed to be seen, not just the
    // newly-unlocked group next to it.
    const masteryTarget = groupsToReveal.find((target) => target.kind === 'mastery');

    if (masteryTarget) {
      masteryTarget.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const nextLesson = getCurrentLesson(state.progress[state.activeScript]);
      const lessonId = `lesson-${nextLesson.groupIndex}-${nextLesson.lessonIndex}`;
      const targetNode = document.getElementById(lessonId);

      if (targetNode) {
        targetNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    state.scrollToCurrentLesson = false;
  }
}

// Waits for a freshly-mastered/unlocked group to scroll into view, then drops its "pending"
// class - the base .lesson-group/.lesson-node CSS transitions take it from there, fading the
// gold border/box-shadow (or opacity) in on their own. The mastery reveal also fires the
// "finish" sfx here, so the sound lands on the main menu in sync with the gold fading in,
// not back on the lesson-complete screen.
function armRevealOnVisible(el, pendingClass, kind) {
  const observer = new IntersectionObserver((observedEntries) => {
    observedEntries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      observer.disconnect();

      // rAF guarantees the browser has painted the "pending" (suppressed) look at least
      // once before we remove it, so the transition always has a start point to fade from.
      requestAnimationFrame(() => {
        entry.target.classList.remove(pendingClass);

        entry.target.querySelectorAll(`.${pendingClass}`).forEach((child) => {
          child.classList.remove(pendingClass);
        });

        if (kind === 'mastery') {
          playSfx('finish');
        }
      });
    });
  }, { threshold: 0.4 });

  observer.observe(el);
}

function createLessonNode(state, groupIndex, lessonIndex, groupProgress, current, groupUnlocked, revealMastery) {
  const node = document.createElement('button');
  node.type = 'button';
  node.className = 'lesson-node';
  node.id = `lesson-${groupIndex}-${lessonIndex}`;
  node.textContent = String(lessonIndex + 1);

  const isComplete = groupProgress.lessons[lessonIndex];
  const isCurrent = current.groupIndex === groupIndex && current.lessonIndex === lessonIndex;
  const canStart = canStartLesson(state.progress[state.activeScript], groupIndex, lessonIndex);

  if (groupProgress.mastered) {
    node.classList.add('mastered');
  }

  if (revealMastery) {
    node.classList.add('mastery-pending');
  }

  if (isComplete) {
    node.classList.add('completed');
  }

  if (isCurrent && !isComplete && groupUnlocked) {
    node.classList.add('available');
  }

  if (!canStart) {
    node.classList.add('locked');
    node.disabled = true;
  }

  if (canStart) {
    node.addEventListener('click', () => {
      playSfx('click');
      startLesson(groupIndex, lessonIndex);
    });
  }

  return node;
}
