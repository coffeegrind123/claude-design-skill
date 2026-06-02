# Scripts Reference

All `.js` scripts are **self-contained IIFEs** meant to be pasted into `mcp__browser__execute_js`. Each begins with a `CONFIG` line (a `var` to edit) and returns `JSON.stringify(...)`. They use synchronous `XMLHttpRequest` to same-origin PHP endpoints, which works once the browser has cleared the Cloudflare challenge. The one `.sh` script runs in Bash and uses `curl`.

| Script | Channel | Input (edit) | Output |
|--------|---------|--------------|--------|
| `search.js` | browser (execute_js) | `QUERY` | `{textSearch, screenTypes[], games[], filters[]}` — the universal entry point |
| `extract-game.js` | browser (execute_js) | `GAME_ID` | `{id, game, year, totalScreens, sections:[{section, id, screens[]}], flat[]}` — one game, all screens grouped by category section |
| `extract-grid.js` | browser (execute_js) | — (reads current DOM) | `{count, screens:[{imageid, title, game, gameId, size, full, thumb, scrn}]}` — current browse/search grid, deduped |
| `inspector.js` | browser (execute_js) | `IMAGE_ID` | `{imageid, annotations:[{label, description}], colours[], ocr}` — one screen's UI-region annotations + palette + OCR |
| `fetch-images.sh` | bash (curl) | outdir name + URLs | downloads full-res JPEGs to `/tmp/guidb/<outdir>/`, prints a verified manifest |

## Per-screen field meanings
- `full` — full-res image URL (the `<a href>`); **download this for the agent to view**.
- `thumb` — thumbnail (`_thumb.jpg`); surveys only.
- `imageid` — stable screen id; feed to `inspector.js`.
- `title` — UI-element categories of the screen (on a game page) — finer than the section.
- `section` — high-level group on the game page (HUD and Overlays, etc.).
- `scrn` — `index.php?scrn=<imageid>` single-screen permalink.
- `game`/`gameId` — populated by `extract-grid.js` on cross-game grids (set=1), where the tile's `data-title` is the game link instead of categories.

## Typical end-to-end (one game)
```
search.js QUERY="Hollow Knight"      # -> games[0].id
extract-game.js GAME_ID=<id>          # -> sections + flat[] with full URLs
# choose URLs (e.g. all of section "HUD and Overlays"), write one-per-line to /tmp/urls.txt
bash scripts/fetch-images.sh hollowknight /tmp/urls.txt
# Read /tmp/guidb/hollowknight/01_*.jpg ... to view the UI
```

## Notes
- `execute_js` strips/forbids a top-level `return`; everything is wrapped in the IIFE — paste the whole file content as the `script` argument.
- If a script returns `{error: "...returned 403"}` the challenge isn't cleared — `navigate` to the site, `wait`, retry.
- Keep responses lean: these scripts already distill to JSON. Never paste full `gameData.php` HTML (≈400KB) into context.
- `fetch-images.sh` flags any download that isn't a real image (wrong URL / error page) in its manifest — re-extract the `href` if you see a FAIL.
