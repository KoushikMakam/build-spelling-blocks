# 🏗️ Architecture

How the single-file game is organised, and why it's structured to make future
languages a drop-in.

## Big picture

Everything lives in **`index.html`** as three layers inside one file:

```
index.html
├── <style>   … all CSS (theme, LEGO bricks, screens, animations)
├── markup    … every "screen" as a hidden <section>, shown one at a time by JS
└── <script>  … the engine + the English language pack + the word bank data
```

There is **no build step and no dependencies**. Screens (Home/Profiles, Parent Zone,
Game, Score Card, Progress Board) are `<section>` elements; JavaScript shows exactly one
at a time — it *feels* like separate pages but is one file.

## Engine vs. language pack (the key separation)

To keep future languages (Hindi, Kannada, French) a drop-in, the code separates
**generic game logic** from **language-specific data**.

```
ENGINE (language-agnostic)                LANGUAGE PACK (per language)
─────────────────────────                ────────────────────────────
- paper generation                        - word bank (graded ladder)
- spaced repetition / mastery             - emoji map / spell-cards
- adaptive difficulty & promotion         - TTS voice preference + lang code
- brick rendering & input handling        - on-screen keyboard layout (units)
- check/submit, practice mode             - UI label strings
- rewards, progress board, storage        - "unit" splitter (letters vs. matras)
- parent zone, uploads, PWA
```

### The "unit" abstraction
A word is modelled as an **ordered list of units**, not raw characters. In English a
unit is a single letter. In Devanagari/Kannada a unit is a **syllable/akshara** (a
consonant plus its matra/vowel sign). Each LEGO brick holds **one unit**. This means
the brick/keyboard/check logic never assumes "1 char = 1 brick", so syllabic scripts
slot in by supplying a different `splitIntoUnits()` and keyboard layout — **no engine
rewrite**.

```js
languagePack = {
  code: "en-US",
  labels: { check: "Check", clear: "Clear", ... },
  voicePreference: ["en-IN", "en-GB", "en-US"],
  keyboard: [ "abcdefghijklmnopqrstuvwxyz".split("") ],
  splitIntoUnits: (word) => word.split(""),   // English: 1 letter = 1 unit
  bank: WORD_BANK_EN                            // graded ladder + emojis
};
```

Adding a language later = provide a new `languagePack` object (its bank, voice, keyboard,
labels, splitter) and either:
- **A language picker** on the home screen (one file switches packs at runtime), or
- **A separate file** (`spelling-hindi.html`) that loads the shared engine + its pack.

## Data model (localStorage)

Namespaced keys, all JSON:

| Key | Holds |
|---|---|
| `ls.profiles` | list of profiles (id, name, dob, avatar, colour) |
| `ls.active` | active profile id |
| `ls.pin` | parent PIN |
| `ls.settings` | voice, repeats, show-word, auto-speak, etc. |
| `ls.sets` | parent word-sets (name, enabled, words) |
| `ls.mastery.<profileId>` | per-word mastery scores |
| `ls.days.<profileId>` | daily score history (per date) |
| `ls.stickers.<profileId>` | earned stickers/trophies |

The **built-in word bank is NOT here** — it's compiled into the script, so it never
counts against the storage budget.

## Runtime APIs used

- **Web Speech API** (`speechSynthesis`) — speak the word and read-it-back.
- **Web Audio API** — game sound effects (click, pop, cheer, buzz).
- **Canvas 2D** — confetti.
- **localStorage** — persistence.
- **Service Worker + manifest** — PWA install + offline caching.

## Screens

| Screen | Purpose |
|---|---|
| Home / Profiles | pick or create a profile; daily score card greeting |
| Game | the paper: prompt, bricks, keyboard, check/practice/hints |
| Paper Card | results for the finished paper |
| Progress Board | him-vs-him history, personal bests, trend, streak |
| Parent Zone | PIN gate → words, uploads, voice, settings |
