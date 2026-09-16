# Windows 20 Mobile

An installable, fully offline mobile shell for iPhone (and any phone
browser). Companion to [windows20](https://github.com/me7ko-dev/windows20)
(the Electron desktop shell) — same plugin-slot idea, adapted for a phone
screen and for running with zero backend.

## Why this exists

A real desktop OS (Windows/Linux) cannot replace iOS on a modern iPhone —
there's no supported way to do that without jailbreaking, and even then
there are no drivers for the camera/GPU/cellular radio on current chips.
What *is* achievable fully on-device, with no laptop and no cloud needed to
**use** it: a PWA (Progressive Web App). Install it once from Safari, and
from then on it runs standalone from the home screen, entirely offline —
the iPhone's own hardware does all the work, nothing is sent anywhere.

## Architecture

```
index.html            App shell + manifest link
manifest.webmanifest   Home-screen install metadata (name, icons, standalone display)
sw.js                  Service worker — precaches every asset, cache-first, works offline
app.js                 Entry point: boots theme + shell, imports built-in apps
core/
  plugin-registry.js   The single extension point — apps self-register here
  theme.js             Dark/light/system theme, persisted to localStorage
  shell.js             Home screen grid + fullscreen app view + back navigation
apps/
  notes.js             Built-in app: notes stored in localStorage
  settings.js          Built-in app: theme switcher
```

Adding a new app: create `apps/my-app.js` that calls
`registerApp({ id, title, icon, mount(container) })`, then import it from
`app.js`. No build step — this is plain ES modules served as static files.

**Limitation to know:** like every iOS app, this runs inside Safari's
sandbox. It can keep its own notes/data (via `localStorage`/IndexedDB), but
it cannot browse or manage the phone's real file system or other apps —
that's an iOS platform restriction, not something a web app (or even most
native apps) can get around.

## Installing on iPhone

1. Deploy this folder somewhere reachable over HTTPS once (e.g. GitHub
   Pages — see below). PWAs require HTTPS to register a service worker.
2. Open the URL in **Safari** on the iPhone.
3. Share button → **Add to Home Screen**.
4. Launch it from the home screen icon from then on — no internet needed.

## Local development

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in a browser on the same network as your
phone (or use a tunnel) to test before deploying.

## Deploying to GitHub Pages

```bash
git push -u origin main
gh repo edit --enable-pages  # or: Settings → Pages → Deploy from branch: main, folder: /
```
