# Filter Tag & Platform Vocabulary

Tags are passed to `index.php` as `tag=N` (repeatable for AND-filtering, e.g. `?set=1&tag=64&tag=103`). Platforms as `plat=N`. Ids below were enumerated live from the filter UI; the set is stable but the site adds tags over time — if a label you want isn't here, run `search.js` (it returns design **filter** matches with their live ids) or re-enumerate from the filter modal.

> **Screen-type categories** (Main Menu, HUD, Inventory, Settings, Skill Tree, Map, Dialogue, etc.) are a **separate dimension** — NOT in this `tag` list. They are reached via `index.php?scrn=<typeID>`, and you discover the right `<typeID>` at runtime with `search.js` (results labelled "SCREEN TYPE"). Example: Inventory = `scrn=100`, "Inventory: Browse" = `scrn=71`.

## Platforms (`plat=`)
| id | platform |
|----|----------|
| 0 | ALL PLATFORMS |
| 1 | PC & Console |
| 2 | Mobile & Tablet |
| 3 | Retro Handheld |
| 4 | Virtual Reality |
| 5 | Playdate |

## Genre (`tag=`)
1 Shooter · 2 Fighting · 3 Flying · 4 Racing · 6 Music & Rhythm · 7 Platformer · 8 Casual/Puzzle · 9 RPG · 10 Sport · 11 Stealth · 12 Strategy · 13 Roguelike · 14 Card · 15 Action · 16 Story/Novel · 17 Free to Play · 18 Survival · 19 User Creation · 26 Match 3 & Block · 27 Point and Click · 30 Open World · 31 Management

## Art style (`tag=`)
20 2D Art · 21 3D Stylized · 22 3D Realistic · 24 Low Poly · 25 Retro

## Perspective (`tag=`)
40 First Person · 41 Third Person · 42 Isometric/Grid · 43 Top Down · 44 Side View

## Setting / Theme (`tag=`)
50 Criminal · 54 Ancient Greece · 56 Detective · 57 Spy · 59 Wholesome · 60 Asian · 61 Cartoon · 62 Fantasy · 63 Futuristic · 64 Horror · 65 Medieval · 66 Pirate · 67 Post-Apocalypse · 68 Real World · 69 Steampunk · 70 Western · 71 Abstract · 72 Underworld · 73 War & Army · 74 Jungle & Ruins · 75 Urban & City · 97 Snowscape · 98 Paranormal · 104 Viking

## Input / Device / Orientation (`tag=`)
80 Gamepad · 81 Mouse · 82 Touch Screen · 83 Free Pointer · 84 Playstation · 85 Xbox · 86 Switch / Wii U · 87 Keyboard · 88 Tablet · 89 Phone · 90 VR Pointer · 91 Motion Control · 92 Widescreen · 93 Landscape · 94 Portrait · 95 Dual Screen · 96 CRT & Letterbox

## UI visual style (`tag=`)
100 Flat · 101 Flat 2.0 · 102 Skeuomorphic Styles · 103 Pixel · 105 Art & Vector · 106 Hand-Painted · 107 Flat-Textured · 108 Flat-Minimalist · 109 Flat Styles (Combined)

## Layout / Composition (`tag=`)
120 3D Space · 121 Tilted · 122 Diegetic · 123 Skew & Wonk · 125 Tile Menu · 127 Side Menu · 128 Scroll Right · 129 Image Grid · 130 Radial Menu · 131 Tabs · 132 Icons · 133 List Menu · 136 Tooltip

## Decorative / Texture motifs (`tag=`)
141 Art Deco · 142 Wavy Freehand · 143 Ornate · 144 Tribal · 145 Halftone · 146 Gothic · 148 Nordic/Celtic · 149 Pen & Pencil · 150 Stripes · 151 Circles · 152 Barcode & Tag · 154 Blueprint/Chart · 155 Border Pattern · 156 Tiled Backdrop · 157 Runes · 160 Paper · 161 Wood · 162 Metal Border · 163 Grunge Brush · 164 Memphis · 165 Scanline/Grid · 166 Grain/Noise · 167 Stone · 168 Nature · 169 Brush Stroke · 170 Distress · 171 Glowing Edges · 172 Splat · 175 Book & Folio · 176 Linen & Textile

## Animation / Transition (`tag=`)
220 Menu Navigation · 221 Screen Wipes · 222 Panel Outline · 223 Sequence/Intro · 224 Camera Pan · 225 Pop Up & Out · 226 Cascade · 229 Flicker & Distort · 230 Fade · 231 Backdrop · 233 Sideways Slide · 234 VFX/Particles · 235 Morph · 236 Parallax · 238 Nav Cursor · 239 Vertical Slide · 240 Phase In & Out
