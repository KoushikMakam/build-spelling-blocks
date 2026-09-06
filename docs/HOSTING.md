# 🌐 Hosting on GitHub Pages + Installing on Phones

The game runs by double-clicking `index.html`, but hosting it (free) gives the best
phone experience: a shareable link, "Add to Home Screen" app icon, and offline use.

## Publish free on GitHub Pages

1. Create a new **public** repo on GitHub (e.g. `lego-spelling`).
2. Push this project to it:
   ```bash
   git remote add origin https://github.com/<you>/lego-spelling.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Branch: **main**, folder: **/ (root)**. Save.
6. Wait ~1 minute. Your link appears: `https://<you>.github.io/lego-spelling/`.

That link opens the game on any device.

## Install on a phone (Add to Home Screen)

Because the game is a **PWA**, it can be installed like an app.

**Android (Chrome):**
1. Open the link.
2. Menu (⋮) → **Add to Home screen** / **Install app**.
3. A 🧱 icon appears; it opens fullscreen and works offline.

**iPhone/iPad (Safari):**
1. Open the link in **Safari**.
2. Share button → **Add to Home Screen**.
3. Tap the icon; it runs fullscreen.

## Notes

- **Offline:** after the first load, the service worker caches everything — no internet
  needed afterwards.
- **Saved data is per-device.** The same link works everywhere, but each phone/PC keeps
  its own scores/history (localStorage). This is expected; a future Backup/Restore can
  move data between devices if wanted.
- **Updates:** when you push changes, the service worker picks up the new version on the
  next load (may take one refresh).
