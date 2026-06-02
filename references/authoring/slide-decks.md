# Slide decks

Use `references/html-ppt/runtime.js` — a `<deck-stage>` web component
that handles scaling, keyboard / tap navigation, slide counter overlay,
`localStorage` slide-position persistence, and print-to-PDF. Each slide
is a direct child `<section>` of `<deck-stage>`.

For decks and multi-screen prototypes, add `data-screen-label="01
Title"`, `data-screen-label="02 Agenda"`, etc. on each slide / screen
root. **Slide numbers are 1-indexed** (see Gotchas in SKILL.md).

**Speaker notes** — only add when the user explicitly asks. With speaker
notes you can put less text on slides and lean on impactful visuals.
Format:

```html
<script type="application/json" id="speaker-notes">
[
  "Slide 1 notes — full conversational script",
  "Slide 2 notes",
  ...
]
</script>
```

The deck shell wires up `window.postMessage({slideIndexChanged: N})`
on init and on every change, so an external presenter mode (in another
window, frame, or tab) can sync.

See also the deck library docs under `references/html-ppt/refs/`
(`themes.md`, `layouts.md`, `animations.md`, `presenter-mode.md`,
`full-decks.md`, `authoring-guide.md`).
