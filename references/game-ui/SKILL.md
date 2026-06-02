---
name: gameuidatabase
description: Browse, search, and pull game UI reference screenshots from gameuidatabase.com and feed them to the agent as viewable images. Finds UI screens by game, by UI-element category (HUD, inventory, settings, main menu...), by genre/theme/art-style filter, by on-screen text (OCR), or by colour, then downloads the full-res images locally so the agent can SEE them. Use whenever the user wants game UI references, UI/UX inspiration, screenshots of a game's menus/HUD, "how does game X do its inventory", design examples for a UI element, or to browse/search the Game UI Database, even if they don't name the site.
allowed-tools: mcp__browser__* Bash(bash:*) Bash(cd:*) Bash(curl:*) Bash(wget:*) Bash(grep:*) Bash(sed:*) Bash(awk:*) Bash(cat:*) Bash(ls:*) Bash(mkdir:*) Bash(rm /tmp/guidb:*) Bash(file:*) Bash(wc:*) Bash(head:*) Bash(tail:*) Bash(find:*) Bash(jq:*) Bash(python3:*) Bash(date:*) Bash(pgrep:*) Bash(Xvfb:*) Bash(xdpyinfo:*) Read Write Edit
argument-hint: "[game name, UI element, genre, or search term]"
---

# Game UI Database Browser Skill

Drives **gameuidatabase.com** (Edd Coates' archive of 1,790+ games / 72,000+ UI screenshots) for an agent. The site has **no API and no LLM-friendly access** — it is a Cloudflare-challenged, server-rendered PHP site. This skill reverse-engineers its internal endpoints and tile data model so the agent can search/browse the full feature set and, above all, **pull the actual UI screenshots and view them**.

## ⛔ READ FIRST (before any browser/curl action)

1. Read [references/api-map.md](references/api-map.md) **in full** — the endpoint contract this whole skill depends on.
2. Skim [references/selectors.md](references/selectors.md) (the screen-tile `data-*` model you parse) and [references/tags.md](references/tags.md) (filter vocabulary).
3. Internalise the **two-channel rule** below. Getting it wrong is the #1 way this skill fails.

### The two-channel rule (the core architecture)

| Channel | What | How | Why |
|---------|------|-----|-----|
| **Metadata** | HTML/PHP pages (`index.php`, `gameData.php`, `search.php`, `inspector.php`) | **Browser only** (`mcp__browser__*`) | Behind a Cloudflare *managed challenge* — plain `curl`/WebFetch get HTTP 403. A real headed browser clears it once per session. |
| **Images** | full-res screenshots under `/uploads/**.jpg` | **plain `curl`/`wget`** (browser UA, no cookies) | Static image assets are **NOT** challenged. `curl` is fast and parallel; never round-trip images through the browser. |

So: **discover with the browser → parse tiles to get full-res `href` URLs → `curl` the images to disk → `Read` them to feed the UI to the agent / user.** Never `curl` an HTML page; never `Read`-via-browser a static image.

## Setup (once per session)

```bash
# 1. Xvfb (headed mode is mandatory — headless gets Cloudflare-blocked)
pgrep -x Xvfb >/dev/null || Xvfb :99 -screen 0 1920x1080x24 >/dev/null 2>&1 &
```
Then start the browser **without** low-memory flags (stealth — those flags are bot-detectable):
`mcp__browser__start_browser(headless=false, low_memory=false)`.
Then `mcp__browser__navigate("https://www.gameuidatabase.com/index.php")` and `mcp__browser__wait(4)` to let the challenge clear. Confirm with `get_page_info` — title should be the site name, **not** "Just a moment...". If still challenged, `wait` a few more seconds and re-check; do not retry-navigate in a tight loop.

All downloads go to `/tmp/guidb/<slug>/`. Output dir is yours to name per request.

## Decision tree

```
What does the user want?
├─ Screenshots of a SPECIFIC game ........ Workflow A (gameData.php?id=) — one request, ALL screens
├─ A named UI element across games ....... Workflow B (search → screen-type → browse grid)
│   (HUD, inventory, main menu, settings, skill tree, map, dialogue, ...)
├─ By genre/theme/art-style/layout ....... Workflow C (index.php?tag=… filters, combinable)
├─ Find screens containing some TEXT ..... Workflow D (index.php?text=…  OCR search)
├─ Find screens by COLOUR ................ index.php?hex=RRGGBB&set=1  (see api-map)
├─ Just "search X" / unsure .............. Workflow E (search.php?t=  — universal entry point)
└─ Deep info on ONE screen ............... inspector.js (UI-region annotations + palette)
```

In every workflow the end is the same: **collect full-res image URLs → `fetch-images.sh` → `Read`**.

## Scripts

`.js` scripts are pasted into `mcp__browser__execute_js` (each is a self-contained IIFE that returns `JSON.stringify(...)`; edit the `CONFIG` line at the top first). The `.sh` script runs in Bash. See [references/scripts.md](references/scripts.md) for the full table; quick reference:

| Script | Channel | Purpose |
|--------|---------|---------|
| `scripts/search.js` | browser | `search.php?t=Q` → `{games, screenTypes, textSearch}` structured results |
| `scripts/extract-game.js` | browser | `gameData.php?id=N` → every screen, **grouped into the game's category sections** (Title and Settings, Game States, Stats and Resources, Information & Extras, HUD and Overlays, Modals and Text…) + game meta |
| `scripts/extract-grid.js` | browser | parse the **current** page's grid → screen tiles JSON (after navigate/filter/scroll) |
| `scripts/inspector.js` | browser | `inspector.php?id=IMAGEID` → UI-region annotations + colour palette |
| `scripts/fetch-images.sh` | bash | `curl` a list of full-res URLs → `/tmp/guidb/<dir>/` for `Read` |

### Paging the screens grid (`set=1` / `scrn=` / `text=` / `hex=` views)
These views server-render ~50 tiles then load more on scroll. To collect more than the first page, loop in the agent:
`mcp__browser__scroll(direction="down", amount=6000)` → `mcp__browser__wait(2)` → repeat N times → then run `extract-grid.js` once (it reads the whole accumulated DOM, deduped). ~1 scroll ≈ +350 tiles. Per-game pages (`gameData.php`) need **no** scrolling — `extract-game.js` gets everything in one shot.

## Workflow A — one game's UI screens (the common case)

1. Resolve the game id: run `scripts/search.js` with the game name → take the `gameData.php?id=N` hit. (Or the user gave a URL/id.)
2. Run `scripts/extract-game.js` (set `GAME_ID`) → all screens **grouped by category section**, each with its `full` URL and `title` (the screen's fine-grained UI-element labels). A game page carries *every* screen in one response — sections like "HUD and Overlays", "Stats and Resources", "Title and Settings", "Game States", "Information & Extras", "Modals and Text" (which sections appear depends on what's been catalogued for that game).
3. Pick the relevant screens: filter by `section` (e.g. only "HUD and Overlays" if the user wants the HUD) and/or by `title`. Write the chosen `full` URLs to a file.
4. `bash scripts/fetch-images.sh <outdir> <urlfile>` → images land in `/tmp/guidb/<outdir>/`.
5. `Read` each downloaded image so it renders for you/the user. **Lead with the visuals**, then describe patterns.

**Success criteria**: the requested game's screens are downloaded as valid JPEGs and `Read` into the conversation.

## Workflow B — a UI element across many games

1. `scripts/search.js` with the element term (e.g. `inventory`, `skill tree`, `pause menu`). The results include **SCREEN TYPE** entries → `index.php?scrn=<typeID>` (e.g. Inventory = 100). Pick the best-matching type.
2. `navigate` to `https://www.gameuidatabase.com/index.php?scrn=<typeID>` → `wait(3)`.
3. scroll the grid a few times (see "Paging the screens grid" above), then `extract-grid.js` to accumulate tiles across pages.
4. Choose a spread of examples (vary games/art-styles), then `fetch-images.sh` → `Read`.

## Workflow C — by genre / theme / art-style / layout

1. Look up tag id(s) in [references/tags.md](references/tags.md) (e.g. Horror = 64, Pixel = 103, Radial Menu = 130). **Tags combine** for AND-filtering: `index.php?set=1&tag=64&tag=234`.
2. `navigate` to the filtered screens URL (`set=1` = screens grid) → `wait(3)` → scroll to page (see "Paging the screens grid") → `extract-grid.js` → `fetch-images.sh` → `Read`.
   - Add `&plat=N` to constrain platform (1 PC&Console, 2 Mobile&Tablet, 3 Retro Handheld, 4 VR, 5 Playdate).

## Workflow D — find screens by on-screen text (OCR)

`navigate` to `https://www.gameuidatabase.com/index.php?text=<urlencoded>&set=1` → `wait(3)` → scroll to page (see "Paging the screens grid") → `extract-grid.js` → `fetch-images.sh` → `Read`. (The site OCRs every screenshot; this searches that text — great for finding specific labels/strings in real UIs.)

## Workflow E — universal search

`scripts/search.js` with any query. It returns three buckets: **games** (`gameData.php?id=`), **screen types** (`index.php?scrn=`), and a **text-in-screenshots** count (`index.php?text=…&set=1`). Branch into Workflow A / B / D from the bucket that fits.

## Rules

- **Lead with images.** This skill exists to put real UI screenshots in front of the agent/user. Download and `Read` them — don't just hand back URLs or describe from memory.
- **Browser for HTML, curl for images.** Never `curl` `index.php`/`gameData.php` (403). Never pull `/uploads/` images through the browser when `curl` works.
- **Headed + stealth.** `start_browser(headless=false, low_memory=false)`. Headless or low-memory flags get Cloudflare-blocked.
- **Download full-res, not thumbs.** Use the tile `href` (full image), not `data-thumb`, when feeding the agent — thumbnails are too small to read UI detail. Use thumbs only for quick wide surveys.
- **Respect the source.** robots.txt allows browsing (`Content-Signal: ai-train=no`): use these images as **on-screen reference for design analysis**, do not present them as training data or republish in bulk. Always credit Game UI Database (Edd Coates) when surfacing images to the user.
- **Don't re-fetch.** Cache to `/tmp/guidb/`; re-`Read` from disk rather than re-downloading.
- **Pick a spread.** When sampling an element/genre across games, vary the games and art styles rather than grabbing 20 near-identical screens.
- **Verify downloads.** `fetch-images.sh` reports per-file byte size + `file` type; a 5KB "JPEG" that's actually an HTML error page means the URL was wrong — re-extract.
- **Session end**: optionally `rm -rf /tmp/guidb/*` and `stop_browser`.

## Pitfalls

See [references/api-map.md](references/api-map.md) for the full list. The ones that bite:
- `scrn=` is **overloaded**: a small id (e.g. `scrn=100`) is a *screen-type filter*; a large id (e.g. `scrn=100623`) is a *single-image permalink*. Use the value `search.js` hands you.
- `data-title` means different things per view: on `gameData.php` it's the **UI-element categories** of that screen; on the `set=1` screens grid it's the **game name + link**. `extract-game.js` and `extract-grid.js` handle each correctly.
- `inspector_OCR.php` 404s for screens with no OCR layer — that's normal, not an error.
- The screens grid is server-rendered 50 at a time then infinite-scrolls; one fetch of the HTML only has ~50 tiles. Scroll the grid then `extract-grid.js` to get the rest.
- Cloudflare clearance is bound to this container's IP + the browser's UA; you cannot reuse it from `curl` for HTML. (Doesn't matter — images don't need it.)
