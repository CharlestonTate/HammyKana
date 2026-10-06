import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import vm from 'vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

function load(path) {
  return readFileSync(join(root, path), 'utf8');
}

const context = {
  HIRAGANA: undefined,
  KATAKANA: undefined,
  WORDS: undefined
};

vm.runInNewContext(load('data/hiragana.js'), context);
vm.runInNewContext(load('data/katakana.js'), context);
vm.runInNewContext(load('data/words.js'), context);
vm.runInNewContext(load('js/romaji-ime.js'), context);

const failures = context.verifyAllWordsRomajiRoundTrip();
if (failures.length === 0) {
  console.log('All words round-trip successfully.');
} else {
  console.log(`${failures.length} failures:`);
  failures.forEach((failure) => {
    console.log(`${failure.script} ${failure.romaji}: expected ${failure.expected}, got ${failure.got}`);
  });
  process.exit(1);
}
