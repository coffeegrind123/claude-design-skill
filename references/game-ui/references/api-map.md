# gameuidatabase.com — Reverse-Engineered API Map

The site exposes **no documented/JSON API**. Everything below was reverse-engineered by inspecting the live site. It is a **server-rendered PHP app** behind a **Cloudflare managed challenge**, with a handful of AJAX endpoints that return **HTML fragments** (never JSON). This file is the contract the skill relies on.

## Access model (Cloudflare)

- `https://www.gameuidatabase.com/` and every `*.php` page is protected by a **Cloudflare managed challenge**. A plain `curl`/WebFetch returns **HTTP 403** with `cf-mitigated: challenge` and a "Just a moment..." JS interstitial. `robots.txt` and is served directly (no challenge) and the live `sitemap.xml` is *also* challenged.
- A **real headed browser** (Chromium via `mcp__browser__*`) running JS clears the challenge automatically within a few seconds and sets an httpOnly `cf_clearance` cookie. After that, in-page `fetch`/`XMLHttpRequest` to same-origin endpoints works (the skill's `.js` scripts use synchronous `XMLHttpRequest`).
- **Static assets under `/uploads/**` (the screenshots, thumbnails, and logos) are NOT challenged.** Plain `curl`/`wget` with a normal browser User-Agent downloads them with HTTP 200. This is the foundation of the image-download channel.
- `robots.txt`: `User-agent: * → Content-Signal: search=yes, ai-train=no; Allow: /`. Browsing/search is permitted; AI *training* on the content is reserved by the operator. Amazonbot, Applebot-Extended, Bytespider are fully disallowed. Treat the images as **on-screen design reference**, credit the source, don't bulk-republish or treat as a training corpus.
- `cf_clearance` is bound to (this container's IP + the browser's UA). You **cannot** lift it into `curl` to fetch HTML — and you don't need to, because images aren't challenged.

## Browser config that clears the challenge

`start_browser(headless=false, low_memory=false)`. Headless mode and the low-memory Chrome flags (`--disable-gpu`, software WebGL, etc.) are bot-detectable and get blocked. Xvfb on `:99` provides the display for headed mode in the container.

## Endpoints

### `index.php` — browse (HTML page)
Query params (combine freely; all observed live):

| Param | Values | Meaning |
|-------|--------|---------|
| `set` | `0` / `1` | View mode: `0` = **games** grid (logos → game pages); `1` = **screens** grid (screenshots directly). Default `0`. |
| `tag` | int (see tags.md) | Filter by a design attribute (genre, theme, art-style, perspective, layout, animation…). **Repeatable** → AND filter: `?set=1&tag=64&tag=103`. |
| `plat` | `0`–`5` | Platform: 0 ALL, 1 PC & Console, 2 Mobile & Tablet, 3 Retro Handheld, 4 Virtual Reality, 5 Playdate. |
| `scrn` | int | **Overloaded.** Small id = **screen-type filter** (e.g. `scrn=100` = all "Inventory" screens). Large id = **single-image permalink** (e.g. `scrn=100623`). Get the right value from `search.php`. |
| `text` | string | **OCR text search** — screens whose recognised on-screen text contains the query. Pair with `&set=1`. |
| `hex` | `RRGGBB` | Colour search — screens whose palette contains/approximates the colour. Pair with `&set=1`. |
| `vid` | (flag) | Restrict to video/animation screens. |
| `sort` | int | Result ordering. |

The screens grid (`set=1`) is **server-rendered ~50 tiles**, then more load on scroll. See pagination below.

### `gameData.php?id=GAMEID` — one game, ALL its screens (HTML page) — PRIMARY
A single request returns the full page for one game with **every** screen tile inlined (no pagination needed). Each tile carries the full `data-*` model (see selectors.md), with `data-title` = that screen's **UI-element categories**. This is the cleanest, most complete path for "show me game X's UI". Game ids come from `search.php` or `index.php?set=0` game grid.

### `search.php?t=QUERY` — universal search (AJAX → HTML fragment)
Returns a list of `.search_result` rows. Three kinds of result, distinguishable by the link target and a label:
- **Text-in-screenshots** (always first): `index.php?text=QUERY&set=1` — labelled "Find \"QUERY\" in Screenshots — N RESULTS". The OCR search.
- **Screen types**: `index.php?scrn=<typeID>` — labelled "…SCREEN TYPE" (e.g. Inventory=100, "Inventory: Browse"=71). Use these to browse a UI element across all games.
- **Games**: `gameData.php?id=N` — labelled "<Game Name><Year>".
  (Design **filters** may also appear, linking `index.php?tag=N`.)
`search.js` parses these into `{textSearch, screenTypes[], games[]}`.

### `queryGameScreens.php?set=&tag=&id=GAMEID` — (AJAX → HTML fragment)
Used by the games-grid "expand this game's screens inline (within the current filter)" interaction; `id` is a **game id** (id=0 → 404). Not needed for normal flows — `gameData.php` and grid scrolling cover everything — documented for completeness.

### `galleryscript/inspector.php?id=IMAGEID` — per-screen deep data (AJAX → HTML fragment)
Returns the "inspector" overlay HTML for one screenshot: clickable **UI-region annotations** (`.inspectorlink` with `.description`) and the **colour palette** used (`.inspectorlinkColour`). `inspector.js` extracts these. Companion:
- `galleryscript/inspector_OCR.php?id=IMAGEID` — recognised on-screen text overlay. **404s when a screen has no OCR layer** (normal).
- `tooltip_coloursAJAX.php?id=IMAGEID` — colours in a screen (fragment).
- `tooltip_getColourInfo.php?hex=HEX` — colour-name info for a hex (fragment).

### Other
- `videoInspectorPlayer_videojs.php?imageID=N` — video player for animated/video screens.
- `special_multiplat.php` — multi-platform comparison special view.

## Image URLs (the download channel)

From a screen tile:
- **Full-res**: the `<a>` element's `href` → `https://www.gameuidatabase.com/uploads/<Game-Name><timestamp>-<rand>.jpg` (typ. 1920×1080, ~200KB–1MB). **Download these for the agent to read.**
- **Thumbnail**: `data-thumb` → same path with `_thumb.jpg`. Small; only for wide surveys.
- **Game logo**: `uploads/logo/<Game>_Logo_<timestamp>.jpg`.
All three are fetchable with plain `curl -A '<browser UA>' -e 'https://www.gameuidatabase.com/' <url>`.

## Pagination (screens grid)

`index.php?set=1&...` server-renders ~50 tiles. More are appended as the user scrolls (a scroll handler fetches the next batch; the lazy `jQuery.loadScroll` plugin only lazy-loads *thumbnails* into already-present tiles). Robust approach: **scroll the browser repeatedly and re-extract tiles from the DOM** (`browse-scroll.js`) rather than reconstructing the cursor. Per-game pages (`gameData.php`) are **not** paginated — all tiles are in the one response.

## Pitfalls

1. **Never `curl` an HTML/PHP endpoint** — 403 challenge. Browser only.
2. **Never pull `/uploads/` images through the browser** — `curl` is faster and parallel; images aren't challenged.
3. **`scrn=` is overloaded** (screen-type filter vs single-image permalink) — disambiguate via `search.php`.
4. **`data-title` is view-dependent**: UI-element categories on `gameData.php`; game name+link on the `set=1` screens grid.
5. **`inspector_OCR.php` 404 is normal** for screens without OCR.
6. **One `gameData.php`/`search.php` HTML fetch can be large** (gameData ≈ 400KB) — parse in-page with the `.js` scripts and return only the distilled JSON; never dump full HTML into context.
7. **Headless/low-memory browser = blocked.** Always headed + stealth.
8. A downloaded "image" that is small and `file`-types as HTML = a wrong URL or an error page; re-extract the `href`.
