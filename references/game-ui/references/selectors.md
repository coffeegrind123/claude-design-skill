# Screen-Tile Data Model & Selectors

Every screenshot in any grid (`gameData.php`, `index.php?set=1`, search expansions) is rendered as one `<a class="galleryimage">` "tile". All the metadata you need is in its attributes — **no per-screen API call required** for the basics.

## Tile anatomy

```html
<a  class="galleryimage chosen-single"
    data-imageid="100623"                         <!-- unique screen id -->
    data-title="Title Screen, Mode & Screen Select" <!-- view-dependent, see below -->
    data-size="1920x1080"                          <!-- resolution -->
    data-thumb="https://www.gameuidatabase.com/uploads/Soulstone-Survivors05212026-015846-66972_thumb.jpg"
    data-url="index.php?scrn=100623"               <!-- single-screen permalink -->
    href="https://www.gameuidatabase.com/uploads/Soulstone-Survivors05212026-015846-66972.jpg">  <!-- FULL-RES IMAGE -->
  <img class="imgcard galleryimg" src="...thumb...">
</a>
```

| Attribute | Use |
|-----------|-----|
| `href` | **Full-res image URL — download this for the agent to read.** |
| `data-imageid` | Stable screen id; feed to `inspector.php?id=` for annotations/colours. |
| `data-title` | **View-dependent** (see below). |
| `data-size` | Resolution, e.g. `1920x1080`. |
| `data-thumb` | Thumbnail URL (`_thumb.jpg`). Small — surveys only. |
| `data-url` | `index.php?scrn=<imageid>` permalink to the single screen. |

### `data-title` is view-dependent
- On **`gameData.php?id=N`** (one game's page): `data-title` = the screen's **UI-element categories**, comma-separated, e.g. `"Player Vitals, Enemy Health & Damage, Minimap"` or `"Settings: Audio"`. This is how you filter a game's screens down to "just the HUD" or "just the menus".
- On the **`set=1` screens grid** (cross-game): `data-title` = the **game name wrapped in a link**, e.g. `"<a href='gameData.php?id=1988'>Game Name</a>"`. Parse the `href` for the game id and the text for the name.

`extract-game.js` and `extract-grid.js` already handle each case.

## Category sections on a game page (`gameData.php`)

A game's screens are grouped under high-level **category section** headings, rendered as
`<h4 class="headingGameCount gamedata_category" id="...">SectionName</h4>` followed by that section's tiles.
Observed sections + ids (a game shows only the sections it has screens for):

| Section heading | element id |
|-----------------|-----------|
| Title and Settings | `gameTitleSystem` (a.k.a. "Title and System") |
| Modals and Text | `gameModalsText` |
| Game States | `gameStates` |
| Stats and Resources | `gameStatsResources` |
| Information & Extras | `gameInfoExtras` |
| HUD and Overlays | `gameHUDOverlays` |
| **RELATED TITLES** | — (trailing section: links to OTHER games, **not** this game's screens — exclude it) |

`extract-game.js` walks the DOM, assigns each tile to the most recent `.gamedata_category` heading, and **stops at "RELATED TITLES"**. This lets you answer "show me game X's HUD" by filtering to the `HUD and Overlays` section. (The per-screen `data-title` then gives the finer element labels within the section.) The game's release **year** is in a `.font_roboto_header_lg` element near the title.

## Stable selectors

| Selector | Meaning |
|----------|---------|
| `a.galleryimage[data-imageid]` | A screen tile (primary). |
| `[data-imageid]` | Any element carrying a screen id (use as the generic tile selector). |
| `.search_result` | One row in a `search.php` response. |
| `.search_result a` | The link in a search row (target distinguishes game / screen-type / text-search). |
| `.gameGrid_Detailed[data-id]` | A game card in the `set=0` games grid (`data-id` = game id). |
| `.inspectorlink` / `.inspectorlink .description` | A UI-region annotation in the inspector overlay. |
| `.inspectorlinkColour` | A palette colour entry in the inspector overlay. |

## UI-element category vocabulary (examples seen in `data-title`)

These are free-text-ish, comma-joined, and hierarchical with `:`. Representative values:
`Title Screen` · `Mode & Screen Select` · `Loading Screen` · `Settings: Gameplay/Display/Audio/UI & Accessibility` · `Language` · `Button Layouts` · `Credits` · `Stage/Level Select` · `Pause` · `Failure & Game Over` · `Results Screen` · `Post-Game Menu` · `Skill Tree` · `Ability List` · `Upgrade: Browse` · `Choose Boon/Upgrade` · `Challenges & Achievements` · `Game Totals and Progress` · `Inventory` (and `Inventory: Browse / Transfer / Inspect Item / Home & Directory`) · `Player Vitals` · `Equipped Items & Abilities` · `Enemy Health & Damage` · `Minimap` · `Waypoints and Markers` · `Weapon Reticles` · `Objectives: Pinned Mission` · `Notification: Objective`.

To match these reliably across games, prefer the **screen-type filter** (`index.php?scrn=<typeID>` from `search.js`) over substring-matching `data-title`, since the type filter is the site's own canonical grouping.
