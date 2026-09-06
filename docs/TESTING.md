# 🧪 Tests

Automated smoke/flow tests run the whole game inside **jsdom** (a headless DOM) to
catch boot errors and verify the core loop without a real browser.

## Run

```bash
npm install      # installs jsdom (dev dependency)
npm test         # runs both test files
```

## What they cover

**`smoke-test.js`** — boot & UI wiring (20 checks):
- word bank loads, screens/keyboard render, no boot errors
- create & save a profile (DOB), pick it → progress → play
- typing adds bricks; backspace / clear / tap-a-brick removal
- Parent PIN gate (first-time set) → Parent Zone opens; PIN stored
- word-set library shows the built-in ladder

**`smoke-test2.js`** — end-to-end game flow (8 checks):
- read the target word (with "show word" on), type it, submit
- correct answer → score increases → advances to next word
- wrong answer → practice mode banner with the correct target
- completing the practice reps → advances past the word

Both files mock browser APIs jsdom lacks (SpeechSynthesis, AudioContext, Canvas) and
inline `words-en.js` so it's available synchronously at boot.
