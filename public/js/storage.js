// localStorage persistence: progress shape, unlock/mastery rules, and JSON backup import/export.

const STORAGE_KEY = 'hammyKana_v1';
const EXPORT_FORMAT_VERSION = 1;
const GROUP_COUNT = 26;
const LESSONS_PER_GROUP = 10;

function createDefaultScriptProgress() {
  const groups = [];

  for (let i = 0; i < GROUP_COUNT; i++) {
    groups.push({
      mastered: false,
      lessons: Array(LESSONS_PER_GROUP).fill(false)
    });
  }

  return { groups };
}

function createDefaultSettings() {
  return {
    musicVolume: 0.3,
    sfxVolume: 0.7,
    showRomaji: true
  };
}

function createDefaultProgress() {
  return {
    settings: createDefaultSettings(),
    hiragana: createDefaultScriptProgress(),
    katakana: createDefaultScriptProgress()
  };
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return createDefaultProgress();
    }

    const saved = JSON.parse(raw);
    return mergeWithDefaults(saved);
  } catch (error) {
    console.warn('Failed to load progress, using defaults:', error);
    return createDefaultProgress();
  }
}

function mergeWithDefaults(saved) {
  const defaults = createDefaultProgress();

  return {
    settings: { ...defaults.settings, ...saved.settings },
    hiragana: mergeScriptProgress(defaults.hiragana, saved.hiragana),
    katakana: mergeScriptProgress(defaults.katakana, saved.katakana)
  };
}

function mergeScriptProgress(defaultProgress, savedProgress) {
  if (!savedProgress || !savedProgress.groups) {
    return defaultProgress;
  }

  const groups = defaultProgress.groups.map((defaultGroup, index) => {
    const savedGroup = savedProgress.groups[index];

    if (!savedGroup) {
      return defaultGroup;
    }

    const lessons = defaultGroup.lessons.map((value, lessonIndex) => {
      return savedGroup.lessons[lessonIndex] || value;
    });

    return {
      mastered: savedGroup.mastered || false,
      lessons
    };
  });

  return { groups };
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save progress:', error);
  }
}

function serializeProgressForExport(settings, progress) {
  return {
    formatVersion: EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'HammyKana',
    settings,
    hiragana: progress.hiragana,
    katakana: progress.katakana
  };
}

function parseImportedProgress(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid progress file.');
  }

  // Accepts our own export format, an older { data: {...} } wrapper, or a bare progress object.
  const payload = raw.app === 'HammyKana' ? raw : raw.data && raw.data.hiragana ? raw.data : raw;

  if (!payload.hiragana || !payload.katakana) {
    throw new Error('Progress file is missing hiragana or katakana data.');
  }

  return mergeWithDefaults(payload);
}

function downloadProgressFile(settings, progress) {
  const payload = serializeProgressForExport(settings, progress);
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hammyKana-progress-${date}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function isGroupComplete(groupProgress) {
  return groupProgress.lessons.every((lesson) => lesson === true);
}

function updateGroupMastery(groupProgress) {
  groupProgress.mastered = isGroupComplete(groupProgress);
}

function isGroupUnlocked(scriptProgress, groupIndex) {
  if (groupIndex === 0) {
    return true;
  }

  return isGroupComplete(scriptProgress.groups[groupIndex - 1]);
}

function isLessonUnlocked(scriptProgress, groupIndex, lessonIndex) {
  if (!isGroupUnlocked(scriptProgress, groupIndex)) {
    return false;
  }

  if (groupIndex === 0 && lessonIndex === 0) {
    return true;
  }

  if (lessonIndex > 0) {
    return scriptProgress.groups[groupIndex].lessons[lessonIndex - 1] === true;
  }

  return true;
}

function canStartLesson(scriptProgress, groupIndex, lessonIndex) {
  if (!isGroupUnlocked(scriptProgress, groupIndex)) {
    return false;
  }

  const group = scriptProgress.groups[groupIndex];

  if (group.lessons[lessonIndex]) {
    return true;
  }

  return isLessonUnlocked(scriptProgress, groupIndex, lessonIndex);
}

function getGroupTitle(group) {
  return group.kana.join('');
}

function getCurrentLesson(scriptProgress) {
  for (let groupIndex = 0; groupIndex < GROUP_COUNT; groupIndex++) {
    const group = scriptProgress.groups[groupIndex];

    for (let lessonIndex = 0; lessonIndex < LESSONS_PER_GROUP; lessonIndex++) {
      if (!group.lessons[lessonIndex]) {
        return { groupIndex, lessonIndex };
      }
    }
  }

  return { groupIndex: GROUP_COUNT - 1, lessonIndex: LESSONS_PER_GROUP - 1 };
}

function markLessonComplete(scriptProgress, groupIndex, lessonIndex) {
  const group = scriptProgress.groups[groupIndex];
  group.lessons[lessonIndex] = true;
  updateGroupMastery(group);
}

function getMasteredKana(script, scriptProgress) {
  const groups = script === 'hiragana' ? HIRAGANA_GROUPS : KATAKANA_GROUPS;
  const kanaList = script === 'hiragana' ? HIRAGANA : KATAKANA;
  const mastered = [];

  groups.forEach((group) => {
    const groupProgress = scriptProgress.groups[group.index];

    if (!groupProgress.mastered) {
      return;
    }

    group.kana.forEach((kanaChar) => {
      const entry = kanaList.find((item) => item.kana === kanaChar);

      if (entry) {
        mastered.push(entry);
      }
    });
  });

  return mastered;
}

function getScriptData(script) {
  if (script === 'katakana') {
    return { groups: KATAKANA_GROUPS, kana: KATAKANA };
  }

  return { groups: HIRAGANA_GROUPS, kana: HIRAGANA };
}
