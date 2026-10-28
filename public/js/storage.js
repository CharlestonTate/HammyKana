// localStorage persistence: progress shape, unlock/mastery rules, and JSON backup import/export.

const STORAGE_KEY_V1 = 'hammyKana_v1';
const STORAGE_KEY = 'hammyKana_v2';
const EXPORT_FORMAT_VERSION = 2;
const LESSONS_PER_GROUP = 10;

function createDefaultTrackProgress(trackId) {
  const groupCount = getGroupCount(trackId);
  const groups = [];

  for (let i = 0; i < groupCount; i++) {
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
  const tracks = {};

  ALL_TRACK_IDS.forEach((trackId) => {
    tracks[trackId] = createDefaultTrackProgress(trackId);
  });

  return {
    settings: createDefaultSettings(),
    tracks
  };
}

function migrateV1ToV2(v1) {
  const defaults = createDefaultProgress();

  return {
    settings: { ...defaults.settings, ...(v1.settings || {}) },
    tracks: {
      hiragana: mergeTrackProgress(
        defaults.tracks.hiragana,
        v1.hiragana,
        'hiragana'
      ),
      katakana: mergeTrackProgress(
        defaults.tracks.katakana,
        v1.katakana,
        'katakana'
      ),
      telugu: defaults.tracks.telugu
    }
  };
}

function loadProgress() {
  try {
    const rawV2 = localStorage.getItem(STORAGE_KEY);

    if (rawV2) {
      const saved = JSON.parse(rawV2);
      return mergeWithDefaults(saved);
    }

    const rawV1 = localStorage.getItem(STORAGE_KEY_V1);

    if (rawV1) {
      const migrated = migrateV1ToV2(JSON.parse(rawV1));
      saveProgress(migrated);
      return migrated;
    }

    return createDefaultProgress();
  } catch (error) {
    console.warn('Failed to load progress, using defaults:', error);
    return createDefaultProgress();
  }
}

function mergeWithDefaults(saved) {
  const defaults = createDefaultProgress();

  const tracks = { ...defaults.tracks };

  ALL_TRACK_IDS.forEach((trackId) => {
    tracks[trackId] = mergeTrackProgress(
      defaults.tracks[trackId],
      saved.tracks && saved.tracks[trackId],
      trackId
    );
  });

  return {
    settings: { ...defaults.settings, ...(saved.settings || {}) },
    tracks
  };
}

function mergeTrackProgress(defaultProgress, savedProgress, trackId) {
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

function serializeProgressForExport(settings, progressRoot) {
  const tracks = progressRoot.tracks || progressRoot;

  return {
    formatVersion: EXPORT_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'HammyKana',
    settings,
    tracks: {
      hiragana: tracks.hiragana,
      katakana: tracks.katakana,
      telugu: tracks.telugu
    }
  };
}

function parseImportedProgress(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid progress file.');
  }

  if (raw.formatVersion === 2 && raw.tracks) {
    return mergeWithDefaults(raw);
  }

  const payload =
    raw.app === 'HammyKana' && raw.hiragana ? raw : raw.data && raw.data.hiragana ? raw.data : raw;

  if (payload.tracks) {
    return mergeWithDefaults(payload);
  }

  if (payload.hiragana && payload.katakana) {
    return migrateV1ToV2(payload);
  }

  throw new Error('Progress file is missing track data.');
}

function downloadProgressFile(settings, progressRoot) {
  const payload = serializeProgressForExport(settings, progressRoot);
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

function getCurrentLesson(scriptProgress, trackId) {
  const groupCount = getGroupCount(trackId);

  for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
    const group = scriptProgress.groups[groupIndex];

    for (let lessonIndex = 0; lessonIndex < LESSONS_PER_GROUP; lessonIndex++) {
      if (!group.lessons[lessonIndex]) {
        return { groupIndex, lessonIndex };
      }
    }
  }

  return {
    groupIndex: Math.max(0, groupCount - 1),
    lessonIndex: LESSONS_PER_GROUP - 1
  };
}

function markLessonComplete(scriptProgress, groupIndex, lessonIndex) {
  const group = scriptProgress.groups[groupIndex];
  group.lessons[lessonIndex] = true;
  updateGroupMastery(group);
}

function getMasteredCharacters(trackId, scriptProgress) {
  const groups = getTrackData(trackId).groups;
  const charList = getTrackData(trackId).kana;
  const mastered = [];

  groups.forEach((group) => {
    const groupProgress = scriptProgress.groups[group.index];

    if (!groupProgress || !groupProgress.mastered) {
      return;
    }

    group.kana.forEach((char) => {
      const entry = charList.find((item) => item.kana === char);

      if (entry) {
        mastered.push(entry);
      }
    });
  });

  return mastered;
}

function getMasteredKana(trackId, scriptProgress) {
  return getMasteredCharacters(trackId, scriptProgress);
}

function getScriptData(trackId) {
  return getTrackData(trackId);
}
