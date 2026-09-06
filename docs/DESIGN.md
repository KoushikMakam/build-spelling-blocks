# 🧱 LEGO Spelling Blocks — Design Document

> This is the **source of truth** for the project. It captures every design decision,
> the reasoning behind it, and how the pieces fit together. Written from the
> parent/product conversation that shaped the game.

---

## 1. Vision

A **gamified, self-teaching spelling game** for a child (initially ~7–8 years old).
The child sees/hears a word, then **builds it out of LEGO bricks** — each key press or
tap drops a brick stamped with a letter. The child **checks their own work** and submits.
Learning is reinforced through celebration, encouraging repetition on mistakes, and a
**personal progress journey** ("him vs. him") so the child can see themselves improving.

**Guiding principle:** *Everything is designed to help the child learn — nothing should
discourage.* Mistakes lead to friendly practice, never failure states.

---

## 2. Core game loop

1. The child starts (or continues) a **daily paper** = 10 words.
2. For each word:
   - A **picture/emoji** shows (or a clean "spell-it" card for abstract words).
   - The word is **spoken aloud** (🔊 replay available any time — free).
   - A **word-to-copy** hint may show (hidden automatically at higher levels).
   - Empty **brick slots** indicate the letter count (also hidden at higher levels).
3. The child taps the **build tray** to bring up their keyboard (physical on desktop,
   built-in soft keyboard on phones/tablets) and types. Each input **drops a LEGO brick**
   with that letter into the tray. An optional on-screen LEGO keyboard is available behind
   the **⌨️ Keys** toggle (hidden by default — a real keyboard is preferred).
4. The child **corrects** freely (see §5) — nothing is graded yet.
5. **🔍 Check** and **✅ Submit** are **two separate steps**:
   - **🔍 Check** = self-review only. It reads the word back and runs the review highlight
     with a "does it look right?" nudge, then pulses Submit. It **does not grade** and
     **never** triggers practice.
   - **✅ Submit** (or `Enter`) = the **only** action that grades the answer.
6. On submit:
   - **Review highlight**: bricks light up left→right (a visible "checking" habit).
   - **Correct** → confetti + happy sound + big cheer emoji + a **star**; streak +1;
     **first-try bonus star** if correct on the first attempt; advance to next word.
   - **Wrong** → enter **practice mode** (see §4).
7. **No leaving mid-paper**: the 🏠 Home button is hidden while a paper is in progress, so
   the child finishes all 10 words first. It returns on the score card. (Practice mode
   always shows the target word, so there are no dead-ends.)
8. After 10 words → **paper score card** → **personal progress board**. The child may
   start **another paper** (unlimited per day).

---

## 3. Presentation of each word

Decided: **a combination of all cues**, layered so difficulty can scale:

- **Picture/emoji** for concrete words (🐘 elephant). For abstract words (because,
  rhythm) there is **no forced/mismatched emoji** — a clean **voice-first "spell-it"
  card** is shown instead.
- **Spoken aloud** automatically via the device's text-to-speech voice.
- **Word-to-copy** shown as a hint at lower levels; **auto-hidden** at higher levels so
  the child spells from sound/picture alone.

---

## 4. Mistake handling — practice mode

- A wrong submission sends the child to **practice**: build the correct word **10 times**.
- **The target word stays visible** during practice — this is practice, not punishment.
- A **typo mid-practice only redoes that one attempt** — the 10-count does **not** reset.
- A row of **10 dots** fills up to show progress toward the goal.
- After 10 correct builds → advance to the next word.
- Tone is always encouraging ("Great! 3 more to go").

Repeat count is configurable in Parent Zone (default **10**, range 1–20).

---

## 5. Input & correction

Manual, deliberate input to teach **cross-checking**:

- **Keyboard on request** — a real keyboard is preferred. On phones/tablets, **tapping the
  build tray** focuses a hidden input so the device's built-in keyboard pops up. An
  optional on-screen LEGO keyboard sits behind the **⌨️ Keys** toggle (hidden by default).
- **Add** a letter: type it, or tap a key on the on-screen keyboard.
- **Remove last** brick: `Backspace`, or the on-screen **⌫** button.
- **Remove a specific** letter: **tap that brick** — bricks to its right shift left to
  fill the gap (fix middle mistakes without deleting everything).
- **Clear all**: 🗑️ button restarts the word.
- Every removal gives a soft "pop" sound + animation.
- **🔍 Check reviews only; ✅ Submit / `Enter` grades.** Nothing is graded until Submit.

### Cross-checking helpers (included)
- **Read-it-back** — 🔍 Check speaks the built word + "does it look right?" nudge, no grade.
- **Review highlight** — bricks light left→right on Check and Submit.
- **Letter-count slots** — the child can catch a wrong length themselves.
- **First-try bonus star** — rewards careful checking over guessing.

---

## 6. Word bank & difficulty

### 6.1 Sources
1. **Built-in graded ladder** — Grade 1 → 6+, targeting ~2,000–3,000 words over time,
   each tagged with a level and (where sensible) an emoji. Baked into `index.html` as
   JavaScript data (does **not** consume localStorage).
2. **Parent-added words** — typed or **uploaded as files** (see §9). Stored in localStorage.

### 6.2 Levels (the ladder)
| Level | Feel | Examples |
|---|---|---|
| 1 | 2–3 letters | cat, sun, dog |
| 2 | short, blends | apple, train, brush |
| 3 | tricky/common | because, friend, enough |
| 4 | multi-syllable | beautiful, separate, tomorrow |
| 5 | advanced | necessary, rhythm, definitely |
| 6+ | expert | conscience, mischievous, pronunciation |

Also tagged where relevant: **tricky pairs** (homophones there/their/they're, silent
letters, double letters) and **word families** (prefixes/suffixes: un-, -tion, -ful).

### 6.3 Auto-promotion
The child starts at a level derived from **age**. Mastering the current level (enough
words reach "mastered" via the mastery score) **unlocks the next level**, feeding harder
words into papers automatically — the child grows for years without a static ceiling.

### 6.4 Challenge escalation (harder *task*, not just harder words)
As levels rise, the game escalates *conditions*:
- Hide the **word-to-copy** (spell from sound/picture).
- Remove the **letter-count slots**.
- **Fewer hints**.
- Introduce **tricky pairs** (homophones, silent/double letters).
- Introduce **word families** (prefixes/suffixes).

---

## 7. Paper generation & spaced repetition

Each paper = **10 words**, chosen by a smart selector (not pure random):

- **Fully adaptive difficulty mix** — the easy/tricky/hard blend adapts to recent
  performance. Doing well → more tricky/hard. Struggling → more easy "wins". Every paper
  keeps a couple of easy wins so it's never discouraging.
- **Spaced repetition** via a per-word **mastery score**:
  - Answered **wrong** → score drops → word appears **more frequently**.
  - Answered **right** → score rises → word appears **less frequently**; occasional
    refreshers keep it from being forgotten.
  - Fully mastered → appears **rarely**.
- **Avoid same-day repeats**, **rotate through the bank**, **shuffle order**.

---

## 8. Profiles

- **Multiple profiles** (siblings) with a picker on the home screen.
- **Adding a player is a parent action** — the home "➕ Add player" tile is **PIN-gated**
  (free only on first-time setup, before any PIN exists). Players can also be added, edited,
  and removed from the **👦 Players** section inside the Parent Zone.
- **Single player → straight in**: if only one player exists, the app **skips the
  "Who's playing?" picker** on launch and goes directly to their Start screen. With two or
  more players, the picker is shown so the child selects themselves.
- Each profile captures: **Name**, **Date of Birth**, **Avatar** (LEGO minifigure/emoji),
  **Favourite colour** (themes the bricks).
- **Age is computed from DOB** every session (never stored stale), so the child
  **auto-ages up** — the starting level nudges up on birthdays with no manual edits.
- A **🎂 "Happy Birthday!" celebration** shows on the child's birthday.
- Age (from DOB) sets the **starting level**; performance drives **adaptive difficulty**.
- Each profile has its **own** scores, history, mastery data, and sticker shelf.

---

## 9. Parent Zone (PIN-protected)

A **kid-gate**, not bank-grade security — enough to stop a child editing their own list.

- One shared **PIN** for the app, set on first use, stored locally, resettable.
- Capabilities:
  - Add/edit/remove words; choose active level sets.
  - **Upload files** — `.txt` (one word/line) or `.csv`
    (`word,level,emoji,category,hint`; only `word` required, rest optional/auto-filled).
  - **Word-set library** — each upload (or paste) becomes a named **set** the parent can
    **enable/disable, preview, rename, delete**. The built-in ladder is always present.
  - **Preview before save** (found X words, Y duplicates, Z skipped).
  - **Download CSV template**.
  - **Voice picker** — lists the device's available speech voices with a 🔊 **Test**
    button. Default preference: **Indian English → UK → US**.
  - **👦 Players** — add, edit (name/DOB/avatar/colour), and delete players (each keeps
    their own progress). Adding from the home screen is PIN-gated to this zone.
  - Toggle "show word" hint, auto-speak; set practice repeat count.

---

## 10. Hints

- 🔊 **Hear it again** — always **free and unlimited**.
- **One additional hint per paper**, spent on either:
  - 👀 **Reveal first letter**, or
  - 🧩 **Ghost word** (faint letters on the slots to copy/trace).
- After it's used, an indicator shows "hint used" until the next paper.

---

## 11. Rewards & feedback

- **Stars/points** per correct word (+ first-try bonus star).
- **Streak counter**.
- **Confetti** burst on correct answers (bigger on paper completion).
- **Happy sounds** (Web Audio) + a big **cheer emoji** flash.
- **Sticker/trophy shelf** that fills as words/papers are completed.

---

## 12. Progress board (him vs. him)

Strictly **personal** — never compared to others:

- **Today vs. past days** — stars, words done, first-try accuracy, best streak.
- **Personal bests** with "🌟 New record!" celebrations.
- **Trend** — a friendly bar chart of the last 7–14 days.
- **Days-played streak** — "5 days in a row! 🔥".
- **Daily score card** shown once per day on start, viewable anytime.
- Rough days show **encouragement only** — never a red/failing tone.

---

## 13. Data & storage

- **localStorage only** (per the parent's choice — "keep it simple").
- The **big built-in word bank lives in the HTML file**, not in localStorage.
- localStorage holds: profiles, scores/history, per-word mastery, PIN, settings,
  chosen voice, parent word-sets, stickers.
- **Realistic size:** even 3 years of daily play + custom words ≈ **~0.4 MB** of a
  typical **~5 MB** budget (~8%). No practical risk of overflow.
- **Important property:** localStorage is **per-device, per-browser**. The same hosted
  link works everywhere, but each device keeps its **own** data. This is expected.
- **Design stays ready** for an optional **Backup/Restore** (export/import a small JSON)
  or cloud sync later — not built now, but no rewrite required to add it.

---

## 14. Platforms & delivery

- **Single `index.html`** — double-click to play on a computer; no install/build.
- **Responsive** — works on desktop keyboard **and** tablet/phone (on-screen LEGO
  keyboard, large touch targets, portrait/landscape).
- **PWA** — `manifest.webmanifest` + `service-worker.js` make it **installable to the
  home screen**, fullscreen (kid-safe, no browser bar), and **offline after first load**.
- **Hosting** — publish free on **GitHub Pages**; open the link on any phone and
  "Add to Home Screen". See [HOSTING.md](HOSTING.md).

---

## 15. Multi-language (future-ready)

- **English first**, but architected so future languages are a **drop-in language pack**.
- A "word" is modelled as a **list of units** (not just single Latin letters) so scripts
  with matras/conjuncts work without redesign.
- Planned: **French** (Latin + accents — easiest), **Hindi** (Devanagari, syllabic),
  **Kannada** (Kannada script, syllabic). Each needs its own word ladder, TTS voice, and
  on-screen keyboard.
- Output later as a **language picker** or **separate files** (`spelling-hindi.html`) —
  parent's choice at that time. See [ARCHITECTURE.md](ARCHITECTURE.md) and
  [ROADMAP.md](ROADMAP.md).

---

## 16. Decision log (quick reference)

| Topic | Decision |
|---|---|
| Presentation | Emoji/picture + spoken + word-to-copy (hideable) |
| Check / Submit | **Two steps**: 🔍 Check = review only (no grade); ✅ Submit / Enter grades |
| Keyboard | **On request** — real/built-in keyboard preferred; on-screen ⌨️ toggle hidden by default; tap tray to raise phone keyboard |
| Mid-paper | **No leaving** — 🏠 Home hidden until all 10 words are finished |
| Correcting | Backspace / on-screen ⌫ / tap-a-brick / 🗑️ clear all |
| Wrong answer | Practice **10×**, word visible, typo redoes just that attempt |
| Age / difficulty | 7–8 start (age computed from **DOB**); **adaptive**; 🎂 birthday celebration |
| Word source | Built-in graded ladder + parent-added + **file upload sets** |
| Ladder | Grade 1 → 6+, **auto-promotion**, escalating challenge conditions |
| Selection | **Fully adaptive** mix + **spaced repetition** (wrong↑ freq, right↓ freq) |
| Paper size | **10 words**, unlimited papers/day |
| Hints | Hear-again free; **one** other per paper (first letter *or* ghost) |
| Profiles | Multiple: name, DOB, avatar, favourite colour; **single player auto-starts** |
| Add player | **Parent action** — PIN-gated; managed in Parent Zone (👦 Players) |
| Parent Zone | **PIN**; players, words, upload .txt/.csv sets, voice picker, settings |
| Word-set mgmt | Library: enable/disable/preview/rename/delete |
| Rewards | Stars, streak, confetti, sounds, sticker shelf |
| Progress | **Him vs. him**; daily card, personal bests, trend, day-streak |
| Voice | Device-voice picker + Test; default Indian → UK → US |
| Storage | **localStorage only**; backup/restore kept ready for later |
| Phone | Host on **GitHub Pages** + **PWA** install; localStorage per device |
| Languages | English now; **drop-in packs** for Hindi, Kannada, French |
