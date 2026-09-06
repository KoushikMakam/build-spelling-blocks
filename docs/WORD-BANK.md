# 📚 Word Bank & Adding Words

## Built-in graded ladder

The game ships with a graded word ladder (Grade 1 → 6+) of **~3000 kid-safe words**
in `words-en.js` (loaded by `index.html`; minified). Each entry has:

```js
{ w: "elephant", lvl: 3, e: "🐘", cat: "animals", tags: [] }
```

| Field | Required | Meaning |
|---|---|---|
| `w` | ✅ | the word (lowercase) |
| `lvl` | ✅ | difficulty level 1–6 |
| `e` | optional | emoji/picture; omitted for abstract words (voice-first card) |
| `cat` | optional | category (animals, food, school…) for themed papers |
| `tags` | optional | e.g. `homophone`, `silent`, `double`, `prefix`, `suffix` |

Abstract words (because, rhythm) intentionally have **no emoji** — the game shows a clean
"spell-it" card and relies on the spoken word.

## Levels

| Level | Feel | Examples |
|---|---|---|
| 1 | 2–3 letters | cat, sun, dog, hat |
| 2 | short blends | apple, train, brush, clock |
| 3 | tricky/common | because, friend, enough, people |
| 4 | multi-syllable | beautiful, separate, tomorrow, favourite |
| 5 | advanced | necessary, rhythm, definitely, embarrass |
| 6 | expert | conscience, mischievous, pronunciation |

## Adding your own words (Parent Zone)

Open **Parent Zone** (PIN) → **Words**.

### Option 1 — Paste
Type or paste words in the box (one per line). Optionally prefix an emoji:
```
🐶 dog
because
🚂 train
```

### Option 2 — Upload a file
Supported: **`.txt`** and **`.csv`**.

**Plain `.txt`** — one word per line:
```
elephant
because
rhythm
```

**`.csv`** — flexible columns (only `word` is required):
```csv
word,level,emoji,category,hint
elephant,3,🐘,animals,big grey animal
because,3,,tricky,
rhythm,5,,tricky,no vowels you can hear
```

- Missing **level** → auto-estimated from length/patterns.
- Missing **emoji** → voice-first spell-card is used.
- Numbers/symbols are stripped from words; blanks and duplicates are skipped.
- A **preview** shows counts before saving.
- Download a ready-made **CSV template** from the Parent Zone.

### Word-set library
Each paste/upload becomes a named **set** you can **enable/disable, preview, rename, or
delete**. The built-in ladder is always available. Only **enabled** sets feed the papers,
so you can keep old term lists without deleting them.
