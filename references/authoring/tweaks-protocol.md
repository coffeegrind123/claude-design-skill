# Tweaks protocol (live in-design controls)

When the user asks for "variants", "tweak this", "live controls",
"adjust on the fly", build a side panel — typically a fixed pill in
the bottom-right — that drives CSS custom properties at runtime and
persists to `localStorage`. Defaults wrapped in markers:

```js
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryColor": "#D97757",
  "fontSize": 16,
  "dark": false
}/*EDITMODE-END*/;
```

The block between the markers must be valid JSON (double-quoted keys
and strings). The 5 standard knobs are `--accent`, `--scale`,
`--density`, `--mode`, and `--motion`; a sibling `wrap.html` reads the
EDITMODE JSON and re-applies the CSS variables live. For applying
ready-made font/color theme presets to an artifact, see
`references/skills/theme-factory.md`.

**Three knobs is the sweet spot.** Five clutters; one isn't worth a
panel. Hide the panel when toggled off — design should look final by
default.
