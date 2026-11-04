// Hammy's replies. The model still loads when the Japanese course opens.
// The play screen draws the dialogue; this file only answers.

import { CreateMLCEngine } from '@mlc-ai/web-llm';

const MODEL = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';
const MAX_MESSAGES = 4;
const MAX_TOKENS = 80;
const SYSTEM_PROMPT = [
  'You are Hammy, a small hamster who helps people learn hiragana, katakana, and Telugu.',
  'Answer in a few short, friendly sentences.'
].join(' ');
const UNSUPPORTED = "I can chat on a computer in Chrome or Edge. This phone doesn't have enough graphics memory for me.";
const MIN_GPU_BUFFER = 512 * 1024 * 1024;

const transcript = [];
let engine = null;
let enginePromise = null;
let capability = null;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), ms);
    })
  ]);
}

async function browserCanRun() {
  if (!navigator.gpu) {
    return false;
  }

  try {
    const adapter = await withTimeout(navigator.gpu.requestAdapter(), 4000);
    if (!adapter) {
      return false;
    }

    const limits = adapter.limits || {};
    const storage = limits.maxStorageBufferBindingSize || 0;
    const buffer = limits.maxBufferSize || 0;
    return storage >= MIN_GPU_BUFFER || buffer >= MIN_GPU_BUFFER;
  } catch {
    return false;
  }
}

function reportProgress(text) {
  if (window.hammyChat && typeof window.hammyChat.onProgress === 'function') {
    window.hammyChat.onProgress(text);
  }
}

async function prepare() {
  if (capability === null) {
    capability = await browserCanRun();
  }

  if (!capability) {
    return false;
  }

  if (!enginePromise) {
    enginePromise = loadEngine();
  }

  await enginePromise;
  return Boolean(engine);
}

async function loadEngine() {
  // this is so poop bro what am I doing.
  reportProgress('Downloading… 0%');

  try {
    engine = await CreateMLCEngine(MODEL, {
      initProgressCallback(report) {
        const percent = Math.min(100, Math.round((report.progress || 0) * 100));
        reportProgress(`Downloading… ${percent}%`);
      }
    }, {
      context_window_size: 2000
    });
    reportProgress('');
  } catch {
    engine = null;
    enginePromise = null;
    reportProgress('');
  }
}

async function ask(text) {
  const ready = await prepare();
  if (!ready || !engine) {
    return capability === false ? UNSUPPORTED : "I can't talk right now.";
  }

  const content = String(text || '').trim().slice(0, 500);
  if (!content) {
    return 'Ask me about kana or Telugu.';
  }

  transcript.push({ role: 'user', content });

  try {
    const recent = transcript.slice(-MAX_MESSAGES);
    await engine.resetChat();
    const result = await engine.chat.completions.create({
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...recent],
      max_tokens: MAX_TOKENS
    });
    const reply = result.choices && result.choices[0] && result.choices[0].message
      ? String(result.choices[0].message.content || '').trim()
      : '';
    const spoken = reply || "I don't know what to say.";
    transcript.push({ role: 'assistant', content: spoken });
    return spoken;
  } catch {
    return "I can't talk right now.";
  }
}

window.hammyChat = {
  prepare,
  ask,
  onProgress: null
};

if (window.HAMMY_BOOT && window.HAMMY_BOOT.courseId === 'japanese') {
  prepare();
}
