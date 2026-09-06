# 🧱 LEGO Spelling Blocks

A gamified, offline spelling game for kids. Press a key (or tap) and a **LEGO brick
stamped with that letter drops** into a build tray. The child builds the word,
**checks their own work**, and submits. Correct spellings are celebrated; a wrong
spelling sends them into **practice mode** (build the word 10 times) before moving on.

Built as a **single `index.html`** — no install, no server, works offline. Just open
it in a browser (or host it free on GitHub Pages and "Add to Home Screen" as an app).

---

## ✨ Features

- 🧱 **LEGO-brick letters** — every key press drops a colourful brick with a stud top.
- 🔊 **Multi-sensory prompts** — picture/emoji **+** the word spoken aloud **+** a
  word-to-copy hint (which hides itself at higher levels).
- ✅ **Manual check & submit** — no auto-check. Teaches the child to **cross-check**
  their own work (read-it-back + review highlight before grading).
- ✍️ **Practice-on-mistake** — a wrong answer means building the correct word **10×**
  (word stays visible; a typo only redoes that one attempt — never discouraging).
- 🪜 **Graded ladder (Grade 1 → 6+)** with **auto-promotion** as the child masters levels.
- 🧠 **Spaced repetition** — words answered wrong come back more often; mastered words
  fade to occasional refreshers.
- 📈 **Adaptive difficulty** — the mix of easy/tricky/hard adapts to recent performance;
  challenge escalates (hide word, hide letter-count, fewer hints, tricky pairs, word families).
- 📄 **Daily papers** — 10 words each, unlimited papers per day.
- 👤 **Multiple profiles** — name, age, avatar, favourite colour (themes the bricks).
- 🗓️ **Him-vs-him progress board** — daily score card, personal bests, trend chart,
  days-played streak. Encouraging tone only.
- 🔒 **Parent Zone (PIN)** — manage words, upload word-set files (.txt/.csv), pick the
  speech voice, and adjust settings.
- 📚 **Parent word-set library** — each uploaded file is a named set you can
  enable/disable/rename/delete. Built-in ladder always available.
- 🏆 **Rewards** — stars, streaks, confetti, happy sounds, sticker/trophy shelf.
- 📱 **PWA** — installable to the home screen, fullscreen, offline after first load.
- 🌍 **Language-ready** — English now; architected so Hindi, Kannada, French drop in
  as language packs later.

---

## 🚀 Getting started

### Play on a computer
1. Download/clone this repo.
2. Double-click **`index.html`** (or open it in Chrome/Edge/Firefox).
3. Create a profile and start a paper.

### Play on a phone/tablet (recommended: host it free)
1. Publish this repo to **GitHub Pages** (see [docs/HOSTING.md](docs/HOSTING.md)).
2. Open the link on the phone.
3. Use the browser menu → **"Add to Home Screen"** to install it as an app icon.
4. After the first load it works **offline**.

> **Note on saved data:** progress is stored in the browser's **localStorage**, which is
> **per-device, per-browser**. The same link works everywhere, but each device keeps its
> own scores/history. See [docs/DESIGN.md](docs/DESIGN.md#data--storage).

---

## 🎮 How to play

| Action | Keyboard | Touch |
|---|---|---|
| Drop a letter brick | `A`–`Z` | tap on-screen LEGO key |
| Remove last brick | `Backspace` | ⌫ button |
| Remove a specific letter | — | tap that brick |
| Clear the whole word | — | 🗑️ Clear |
| Check / submit | `Enter` | ✅ Check button |
| Hear the word again | — | 🔊 button (free, unlimited) |

- Empty brick **slots show the letter count** (until higher levels hide them).
- **Hints:** hear-it-again is always free; **one** other hint per paper (reveal first
  letter **or** ghost word).

---

## 🔒 Parent Zone

Behind a **PIN** (set on first use, stored locally):

- Add/edit/remove words and pick active level sets.
- **Upload** `.txt` (one word per line) or `.csv`
  (`word,level,emoji,category,hint`) files — each becomes a manageable **word set**.
- **Word-set library:** enable/disable, preview, rename, delete each set.
- **Download a CSV template** to fill in.
- **Voice picker** — choose from the device's available speech voices (with a Test
  button). Default preference: Indian English → UK → US.
- Adjust practice repeats, "show word" hint, auto-speak, and manage profiles.

---

## 📁 Project structure

```
LOGO-SPELLINGS/
├── index.html              # The entire game (HTML + CSS + JS + word bank)
├── manifest.webmanifest    # PWA manifest (installable app)
├── service-worker.js       # Offline caching for the PWA
├── icons/                  # App icons
├── README.md               # This file
└── docs/
    ├── DESIGN.md           # Full design spec & all decisions (the source of truth)
    ├── ARCHITECTURE.md     # How the code is organised (engine vs. language pack)
    ├── WORD-BANK.md        # Word-list format, levels, and how to add words
    ├── HOSTING.md          # Publish free on GitHub Pages + install on phones
    └── ROADMAP.md          # Future work (languages, sync, etc.)
```

---

## 🌍 Languages

English ships first. The code separates the **engine** (game logic) from a
**language pack** (words, voice, on-screen keyboard, UI labels), so **Hindi**,
**Kannada**, and **French** can be added later without a rewrite — either as a
language picker or as separate files (`spelling-hindi.html`). See
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/ROADMAP.md](docs/ROADMAP.md).

---

## 🛠️ Tech

- Plain **HTML + CSS + JavaScript**, zero dependencies, zero build step.
- **Web Speech API** for spoken words, **Web Audio API** for game sounds,
  **Canvas** for confetti, **localStorage** for saved data.

---

## 📜 License

For personal/family educational use. See [docs/DESIGN.md](docs/DESIGN.md) for the
full rationale behind every design decision.
