// Course/track metadata and track data access (replaces getScriptData if/else chains).

const ALL_TRACK_IDS = ['hiragana', 'katakana', 'telugu'];

function getBootConfig() {
  return (
    window.HAMMY_BOOT || {
      courseId: 'japanese',
      tracks: ['hiragana', 'katakana'],
      defaultTrack: 'hiragana'
    }
  );
}

function getCourseConfig() {
  const boot = getBootConfig();
  const course = COURSES[boot.courseId];

  if (!course) {
    return COURSES.japanese;
  }

  return course;
}

function getTrackIds() {
  const boot = getBootConfig();
  if (boot.tracks && boot.tracks.length) {
    return boot.tracks.slice();
  }

  return getCourseConfig().tracks.map((track) => track.id);
}

function getTrackData(trackId) {
  if (trackId === 'katakana') {
    return { groups: KATAKANA_GROUPS, kana: KATAKANA };
  }

  if (trackId === 'telugu') {
    return { groups: TELUGU_GROUPS, kana: TELUGU };
  }

  return { groups: HIRAGANA_GROUPS, kana: HIRAGANA };
}

function getWords(trackId) {
  return (WORDS && WORDS[trackId]) || [];
}

function getGroupCount(trackId) {
  return getTrackData(trackId).groups.length;
}

function getLessonsPerGroup() {
  return LESSONS_PER_GROUP;
}

function getInputEngine(trackId) {
  if (trackId === 'telugu') {
    return 'telugu-latin';
  }

  return 'romaji';
}

function getGroupTitle(group) {
  const chars = group.characters || group.kana;
  return (chars || []).join('');
}

function getTrackProgress(progressRoot, trackId) {
  if (!progressRoot) {
    return createDefaultTrackProgress(trackId);
  }

  if (progressRoot.tracks) {
    return progressRoot.tracks[trackId] || createDefaultTrackProgress(trackId);
  }

  // Legacy in-memory shape during transition
  if (progressRoot[trackId]) {
    return progressRoot[trackId];
  }

  return createDefaultTrackProgress(trackId);
}
