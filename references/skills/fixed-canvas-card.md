---
name: fixed-canvas-card
description: |
  A single-image card at exact platform dimensions — Discord embed,
  Twitter/X share card, Open Graph image, LinkedIn share, Facebook
  share, Instagram square or 4:5. The deliverable is a PNG screenshot
  of an HTML artifact rendered at the exact target canvas, not the
  HTML itself.

  Use when the user wants an image to attach to a Discord thread,
  share to social, or set as an `og:image`. The card is read at
  thumbnail size before clickthrough — the design has to land in
  ~400px of width on a phone embed.
triggers:
  - "discord card"
  - "discord image"
  - "discord embed"
  - "waywo image"
  - "og image"
  - "open graph"
  - "twitter card"
  - "x card"
  - "linkedin share image"
  - "social card"
  - "share image"
  - "thumbnail"
  - "1200x630"
  - "1200×630"
od:
  mode: prototype
  surface: image
  scenario: marketing
  preview:
    type: html
    entry: card.html
  design_system:
    requires: false
---

# Fixed-canvas card

A static image card at a platform-mandated pixel dimension. Built as
HTML, delivered as PNG. The pipeline assumes the host can run
`google-chrome --headless` via `Bash`.

## Canvas dimensions cheat sheet

| Platform                | Dimensions   | Aspect | Notes |
|-------------------------|--------------|--------|-------|
| Discord embed           | 1200 × 630   | 1.91:1 | Same as Open Graph; what the link preview uses. |
| Discord attachment      | flexible     | —      | Posts attach at native size; 1200×630 or 1920×1080 are the common picks. |
| Open Graph (`og:image`) | 1200 × 630   | 1.91:1 | Min 600×315; 1200×630 is the universal sweet spot. |
| Twitter / X large card  | 1200 × 628   | 1.91:1 | Effectively the same as OG. |
| Twitter / X summary     | 144 × 144    | 1:1    | Tiny — only for fallback. |
| LinkedIn share          | 1200 × 627   | 1.91:1 | Treat as OG. |
| Facebook share          | 1200 × 630   | 1.91:1 | Same as OG. |
| Instagram square        | 1080 × 1080  | 1:1    | Cropped from 4:5 on feed; design for the square center. |
| Instagram portrait      | 1080 × 1350  | 4:5    | Maximum feed real estate. |
| Instagram story         | 1080 × 1920  | 9:16   | Reserve the top + bottom ~250px for chrome (avatar, CTAs). |

**1200×630 covers Discord, OG, Twitter, LinkedIn, Facebook** with one
asset. Lead with that unless the user specifies a square or portrait
crop.

## Design constraints unique to thumbnail viewing

A Discord embed appears in the chat list at roughly **400px wide**
before clickthrough. Twitter/X same. Mobile feeds smaller. Anything
under ~24px display size in the design becomes illegible at thumbnail
scale, so:

- The **headline** does almost all the work. Make it large (≥80px
  display on the 1200-wide canvas) and high-contrast.
- The **single most important fact** — version number, date, big stat
  — gets visual primacy alongside the headline. Three big numbers in
  a row reads at thumbnail. A wall of bullet points doesn't.
- The **subline / dek paragraph** is fine to include for the
  click-through viewer, but accept that it will be a grey blur at
  thumbnail scale. Don't make it carry critical info.
- **One accent color** drawn from the brand. Multiple accents at
  thumbnail just look noisy.

## Workflow

### 1. Pick the canvas

`AskUserQuestion` if it isn't obvious from the brief. Default to
1200×630 for share / embed / OG. Square 1080×1080 only when the user
names Instagram or asks for a square.

### 2. Pick the visual direction

The same direction options that apply to any hi-fi design apply here.
Common picks for tech / dev / launch cards:

- **Editorial spec sheet** — warm cream paper, big serif headline,
  mono numerals for stats, hairline dividers. Reads "shipped product".
  Pair with `references/design-systems/warm-editorial.md`.
- **Dark terminal** — near-black canvas, single warm accent, mono
  type, faux terminal lines. Reads "developer in flow". Pair with
  `references/design-systems/atelier-zero.md` or a custom dark theme.
- **Brand poster** — bold sans display, full-bleed accent color,
  one image, one number. Reads "campaign / launch". Pair with
  `references/design-systems/<brand>.md` if the user has one.

State the direction in one sentence before writing 200 lines of HTML.

### 3. Build the HTML at exact target dimensions

The body, NOT a child element, owns the canvas dimensions:

```css
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--paper); }
body {
  width: 1200px;     /* canvas width  */
  height: 630px;     /* canvas height */
  overflow: hidden;  /* layout overrun becomes a visible bug */
}

/* In-browser preview frame — only when viewed at a larger window */
@media (min-width: 1240px) {
  html, body { width: auto; height: auto; background: #2a2522; }
  body { min-height: 100vh; display: flex; align-items: center;
         justify-content: center; padding: 24px; }
  .poster { box-shadow: 0 30px 80px rgba(0,0,0,.4); }
}
```

The same file works for both export (exact pixel canvas) and human
viewing (framed inside a dark backdrop).

### 4. Render and crop to target

**Critical** — `--window-size=1200,630` does NOT give a 1200×630
viewport. Read `references/craft/headless-rendering.md` for the full
story; the short version:

```bash
# Render at canvas-height + chrome compensation (87px on Linux Chrome)
google-chrome --headless=new --disable-gpu --no-sandbox \
  --hide-scrollbars --virtual-time-budget=4000 \
  --window-size=1200,717 \
  --screenshot=/tmp/raw.png \
  "file:///absolute/path/to/Card.html"

# Crop to exact target
python3 -c "
from PIL import Image
Image.open('/tmp/raw.png').crop((0, 0, 1200, 630)).save('Card.png')
"
```

The compensation constant (`87` here) is host-dependent — measure
once with the diagnostic overlay from the craft doc, then reuse.

### 5. Verify with region crops, not eyeball

Don't trust a thumbnail. Crop the strip you're worried about:

```python
from PIL import Image
im = Image.open('Card.png')
print('size:', im.size)
im.crop((0, 530, 1200, 600)).save('/tmp/bottom-strip.png')
# Then Read('/tmp/bottom-strip.png') — full resolution, easy to verify.
```

Verify the **bottom strip** specifically — that's where the chrome
compensation bug bites. If the foot / capability row / metadata you
expected at the bottom isn't there, you've hit it.

### 6. Hand off

State the final file path. If a re-render is needed, fork to a `v2`
copy rather than overwriting — design iteration deserves git history
of its own.

## Hard rules

- **Headline ≥ 80px** on a 1200-wide canvas. Smaller is unreadable at
  thumbnail.
- **One accent color** only, used 1–3 times.
- **Real data** — actual version numbers, real URLs, real metric
  counts. No "Lorem" or "1,234,567". See
  `references/craft/anti-ai-slop.md`.
- **Render and verify** — never claim a card is ready without
  rendering it and inspecting a region crop. "Looks fine in HTML" is
  not enough.
- **Match the platform** — if the user said Discord, deliver 1200×630.
  If Instagram, deliver 1080×1080 or 1080×1350. Don't substitute.
- **Strip all debug aids** before final render: `dbg` divs, bright
  `background:` colors on layout elements, body background-leak probes.
