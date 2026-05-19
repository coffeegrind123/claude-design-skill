# Headless rendering — verifying HTML artifacts as pixels

When a design must ship at a **fixed pixel canvas** (Discord embed,
Twitter/X card, Open Graph image, LinkedIn share, Instagram post), the
HTML file isn't the deliverable — the rendered PNG is. You need a
reliable host→pixels pipeline AND a way to verify what actually got
painted, because eyeballing the HTML is not enough.

This doc is the runbook. Read it before you screenshot anything you
intend to send to the user.

## The Chromium headless viewport-compensation bug

**Critical** — get this wrong and your screenshots silently lose
content at the bottom.

`google-chrome --headless=new --window-size=W,H` does **not** give you
a `W × H` rendering viewport. On Linux (verified Chrome 131+), the
window-size value includes ~87px of *invisible* chrome that doesn't
render any pixels but does consume vertical space. The actual
`document.documentElement.clientHeight` (and `window.innerHeight`) you
get inside the page is `H - 87`.

Consequence: any layout positioned past `y = H - 87` is silently
unrendered. Your screenshot is still `W × H`, but everything below
`y = H - 87` shows whatever's beneath — the body background, often
just the default white. You'll spend an hour adjusting CSS thinking
the content is overflowing when it's actually fitting perfectly.

**Symptom** — a `body { background: red }` probe shows red at the
bottom of the screenshot. The body's CSS height worked, the .poster's
CSS height worked, but those pixels are below the viewport that
actually got painted.

**Fix** — render at `W × (H + 87)` and crop to `W × H` from the top:

```bash
# Render with chrome compensation
google-chrome --headless=new --disable-gpu --no-sandbox \
  --hide-scrollbars --virtual-time-budget=4000 \
  --window-size=1200,717 \
  --screenshot=/tmp/raw.png \
  "file:///absolute/path/to/Card.html"

# Crop to actual target dimensions
python3 -c "
from PIL import Image
Image.open('/tmp/raw.png').crop((0, 0, 1200, 630)).save('/tmp/final.png')
"
```

The 87px figure has been measured on `--headless=new` on Linux WSL2;
treat it as a constant for that environment. Other headless modes
(`--headless=old`, `--headless` without value) and other platforms
may differ — **always verify with a diagnostic overlay on a fresh
machine** before publishing the pipeline. See "Step 0: measure your
host" below.

## The full render-then-verify workflow

### Step 0 — measure your host's chrome compensation (once)

Drop this 4-line diagnostic at the bottom of any test page:

```html
<div id="dbg" style="position:fixed;top:8px;left:8px;background:lime;
  color:black;font:bold 22px monospace;padding:8px;z-index:9999;
  white-space:pre"></div>
<script>
  document.fonts.ready.then(() => requestAnimationFrame(() => {
    document.getElementById('dbg').textContent =
      'window  ' + window.innerWidth + 'x' + window.innerHeight + '\n' +
      'docEl   ' + document.documentElement.clientWidth + 'x' +
                   document.documentElement.clientHeight;
  }));
</script>
```

Render with `--window-size=1200,630` and screenshot. The lime box
will report something like `window 1200x543 / docEl 1200x543`. The
delta from your requested height (630 − 543 = 87) is the
compensation constant for your host. **Add it to your render
window-size for every subsequent screenshot.**

### Step 1 — size the artifact to its true target

For a Discord embed at 1200×630, the HTML should set body to exactly
those dimensions, with `overflow:hidden` so any layout overrun
becomes a visible debugging signal rather than a phantom scrollbar:

```css
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--paper); }
body {
  width: 1200px;
  height: 630px;
  overflow: hidden;
}
.poster {
  width: 1200px;
  height: 630px;
  position: relative;
  overflow: hidden;
}
```

A `@media (min-width: 1240px)` block can re-introduce the dark
backdrop + drop shadow for in-browser preview, so the same file
serves both export (exact viewport) and human viewing (framed).

### Step 2 — render with the compensated window size

```bash
google-chrome --headless=new --disable-gpu --no-sandbox \
  --hide-scrollbars --virtual-time-budget=4000 \
  --window-size=W,(H+87) \
  --screenshot=/tmp/raw.png \
  "file://$(realpath Artifact.html | sed 's/ /%20/g')"
```

- `--virtual-time-budget=4000` gives webfonts time to load before the
  screenshot fires. Without this, Fraunces and other Google Fonts
  often miss the first paint and you screenshot fallback metrics.
- `--hide-scrollbars` keeps a phantom scrollbar from eating pixels at
  the right edge when content is exactly at the canvas width.
- File paths need URL-encoding for spaces (`%20`). `realpath` plus
  `sed` is the cheapest way; `python3 -c "import urllib.parse..."`
  is fine if you prefer.

### Step 3 — crop to target dimensions

```bash
python3 -c "
from PIL import Image
im = Image.open('/tmp/raw.png')
im.crop((0, 0, W, H)).save('/path/to/final.png')
print('final size:', im.size, '→', (W, H))
"
```

### Step 4 — verify what actually painted

Trusting your eyes on a thumbnail is unreliable. Use Pillow to:

**Sample pixels at suspect coordinates** — quickest check for "did
the content I expected actually render there?":

```python
from PIL import Image
im = Image.open('final.png')
for y in [50, 200, 400, 500, 580, 620]:
    print(f'y={y}: {im.getpixel((100, y))}')
```

A `(255, 0, 0)` reading where you expected cream paper means the
body's `background: red` probe is showing through — content didn't
paint there.

**Crop specific regions** — read just the strip you're worried about:

```python
im.crop((0, 530, 1200, 600)).save('/tmp/bottom-strip.png')
# Then Read the cropped PNG.
```

This is far more reliable than squinting at a thumbnailed full
render. A 1200×60 strip preserves enough detail to read 11px
monospace.

## Diagnostic techniques (deploy any time content goes missing)

### Per-element DOM-coordinate overlay

When elements are "in the DOM" per `getBoundingClientRect()` but
don't appear in pixels, you need both numbers side by side. Drop in
just before `</body>` and screenshot:

```html
<div id="dbg" style="position:fixed;top:8px;right:8px;background:lime;
  color:black;font:bold 16px monospace;padding:8px;z-index:9999;
  line-height:1.3;white-space:pre"></div>
<script>
  document.fonts.ready.then(() => requestAnimationFrame(() => {
    const els = ['.eyebrow','.head','h1','.subline','.stats','.caps','.foot','.frame'];
    document.getElementById('dbg').textContent = els.map(s => {
      const e = document.querySelector(s);
      if (!e) return s + ': MISSING';
      const r = e.getBoundingClientRect();
      return s.padEnd(10) + 'y=' + Math.round(r.top) + '..' +
             Math.round(r.bottom) + ' h=' + Math.round(r.height);
    }).join('\n');
  }));
</script>
```

Read the lime box from the rendered PNG. Now you can see exactly
where every element sits in the document coordinate space and
compare it against where the screenshot shows it (or doesn't).

### Element background-color paint probes

If the DOM coordinates say "the element should be at y=569..586" but
the pixels at that range are blank cream, paint the element bright:

```css
.caps { background: yellow; }   /* DEBUG */
.foot { background: cyan;   }   /* DEBUG */
```

If the bright color shows up in the cropped strip, the element is
painting — your eyes (or the thumbnail) just missed it. If even the
bright color doesn't appear, the element isn't being painted at that
coordinate range — usually meaning the viewport is smaller than you
think (chrome compensation bug above) or a parent has
`overflow:hidden` and a smaller clip rect than expected.

### Body background-leak detection

Set `body { background: red }` (or any vivid color you'd never use
in the design). Sample pixels at the bottom of the screenshot — any
red below `y = H − 87` is your smoking gun for the chrome
compensation bug.

## The `margin-top: auto` measurement trap

If you measure layout heights at a viewport TALLER than the target
canvas, `margin-top: auto` on a flex child stretches to fill slack —
and your "everything fits" reading is a lie. The same content in a
shorter viewport collapses the auto-margin to zero and overflows.

**Always measure at the actual target viewport**, never at a tall
diagnostic viewport. If you must use a tall viewport to see the
overlay, also render at the target and compare.

## Font loading races

`--virtual-time-budget=4000` is usually enough for Google Fonts but
not guaranteed. If type metrics differ between renders, force the
wait explicitly:

```js
// Run this and wait for the promise before screenshotting
await document.fonts.ready;
// Or, even more conservative:
await Promise.all([...document.fonts].map(f => f.load()));
```

For CI / scripted exports, pin webfonts locally (Google Fonts
download → `assets/fonts/`) and `@font-face` them. Eliminates the
race entirely.

## Cleanup before shipping

Before the final render, remove every debug aid:

- `<div id="dbg">` and its `<script>` block.
- Bright `background: yellow` / `cyan` debug colors on layout elements.
- `body { background: red }` leak probe — set it back to the design's
  intended background.

Re-render, re-verify with a region crop, then hand the file to the user.
