# 🗺️ Roadmap

Planned and possible future work. Nothing here is built yet; the current release is the
**English** game with the full engine described in [DESIGN.md](DESIGN.md).

## Near-term
- **Grow the word ladder** toward the full ~2,000–3,000 words across Grade 1 → 6+,
  with accurate levels, emojis for concrete words, and tricky-pair/word-family tags.
- **Backup / Restore** — export a small JSON of a profile's progress and import it on
  another device (the localStorage "move data between devices" solution). Design is
  already kept ready for this.

## Languages (drop-in packs)
Architecture already separates engine from language pack (see
[ARCHITECTURE.md](ARCHITECTURE.md)). Planned order by effort:

1. **French** 🇫🇷 — Latin script + accents (é, è, ê, ç, à, ù). Easiest: add accented
   keys; TTS widely available. Watch spelling variants vs. English.
2. **Hindi** 🇮🇳 — Devanagari, syllabic with matras. Needs a syllable/akshara "unit"
   splitter, a Devanagari on-screen keyboard, and an `hi-IN` voice.
3. **Kannada** 🇮🇳 — Kannada script, syllabic with conjuncts. Same syllable-unit
   approach, Kannada keyboard, `kn-IN` voice (device-dependent).

Delivery options at that time: a **language picker** in one file, or **separate files**
(`spelling-hindi.html`) sharing one engine.

## Nice-to-have
- **Themed papers** by category (animals, food, school) using the `cat` field.
- **Cloud sync** for one shared profile across devices (needs a free backend/login;
  only if auto-sync is desired over Backup/Restore).
- **Printable progress report** for parents.
- **More avatars / brick themes** as unlockable rewards.
- **Dictation-only mode** and **beat-the-timer** bonus as optional higher-level challenges.
