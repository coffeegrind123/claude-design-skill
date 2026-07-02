# Redesign — audit before you touch

Redesigning an existing site is a different job from greenfield, and
misclassifying which one you're doing is the biggest source of bad
redesign output. You are modernising something that already works and
already ranks — so the rule is **audit first, preserve deliberately,
change in priority order**, never rewrite from scratch.

> Adapted from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
> (MIT) — `skills/redesign-existing-projects/SKILL.md` and
> `skills/taste-skill/SKILL.md` §11. Works with any stack: Tailwind,
> vanilla CSS, styled-components, or the self-contained HTML this skill
> ships.

## 1. Detect the mode (first action)

- **Greenfield** — no existing site, or a full overhaul is approved.
  Set dials from `taste-dials.md`.
- **Redesign — preserve** — modernise without breaking the brand. Audit
  first, extract brand tokens, evolve gradually. Dials start from a
  reading of the *existing* site, not the baseline.
- **Redesign — overhaul** — new visual language over existing content.
  Treat visuals as greenfield; preserve content and information
  architecture.

If ambiguous, ask **once**: *"Should this redesign preserve the existing
brand, or are we starting visually from scratch?"*

## 2. Audit before touching

Document the current state before proposing anything:

- **Brand tokens** — primary / accent colors, type stack, logo
  treatment, radii.
- **Information architecture** — page tree, primary nav, key conversion
  paths.
- **Content blocks** — what exists, what's doing work, what's filler.
- **Patterns to preserve** — signature interactions, a recognisable
  hero, copy voice.
- **Patterns to retire** — AI-slop tells, broken layouts, dead links,
  generic stock imagery, perf traps.
- **Existing dial reading** — infer the current `DESIGN_VARIANCE` /
  `MOTION_INTENSITY` / `VISUAL_DENSITY`. That's your starting point.
- **SEO baseline** — ranking pages, meta titles, structured data, OG
  cards. **SEO migration is the #1 redesign risk.**

## 3. What never changes silently

Never modify these without explicit user approval — they break SEO,
analytics, autofill, and muscle memory:

- URL structure / route slugs, anchor IDs.
- Primary nav labels.
- Form field names or order.
- Brand logo or wordmark.
- Existing legal / consent / cookie copy.

Extract brand colors **before** applying any recoloring: a brand that is
already purple stays purple. Preserve copy voice unless a rewrite was
asked for — visual modernisation is not a content rewrite. Honor
existing accessibility wins (focus states, alt text, keyboard nav,
contrast); don't regress them.

## 4. Modernisation levers (priority order)

Apply in order, stop when the brief is satisfied:

1. **Typography refresh** — biggest visual lift per unit of risk.
2. **Spacing & rhythm** — increase section padding, fix vertical rhythm.
3. **Color recalibration** — desaturate, unify neutrals, keep the brand
   accent.
4. **Motion layer** — add `MOTION_INTENSITY`-appropriate
   micro-interactions to existing components.
5. **Hero & key-section recomposition** — restructure top-of-funnel.
6. **Full block replacement** — only when a block is unsalvageable.

**Decision tree.** IA / content / SEO are sound → *targeted evolution*
(levers 1-4); ~70% of the value at ~40% of the risk. Visual debt is
structural (broken IA, no design system, broken mobile) → *full
redesign* with strict content preservation. The brand itself is
changing → *greenfield*.

## 5. Concrete fix catalog

The specific, high-frequency defects and their fixes. This is the
diagnose-and-repair checklist.

### Typography
- **Browser default / Inter everywhere** → a font with character (Geist,
  Outfit, Cabinet Grotesk, Satoshi); serif header + sans body for
  editorial.
- **Headlines lack presence** → larger display size, tighter tracking,
  reduced line-height.
- **Body too wide** → cap at ~65ch, raise line-height.
- **Only 400 / 700 weights** → introduce 500 and 600 for hierarchy.
- **Proportional figures in data** → `font-variant-numeric: tabular-nums`
  or a monospace family.
- **Orphaned last-line words** → `text-wrap: balance` (headings) /
  `text-wrap: pretty` (body).
- **All-caps subheads everywhere** → lowercase italic, sentence case, or
  small-caps; caps always need ≥ 0.06em tracking.

### Color & surfaces
- **Pure `#000` background** → off-black / tinted dark
  (`#0a0a0a`, `#121212`, dark navy).
- **Oversaturated accent** → keep saturation < 80%.
- **More than one accent** → pick one, lock it for the whole page.
- **Mixed warm + cool grays** → one gray family, one hue tint.
- **Purple/blue "AI gradient"** → neutral base + one considered accent
  (the most common AI fingerprint).
- **Generic black `box-shadow`** → tint shadows to the background hue.
- **Flat, textureless surfaces** → subtle noise / grain / micro-pattern.
- **A lone dark section in a light page (or vice versa)** → commit to a
  full mode, or use a slightly darker shade of the same palette, never a
  sudden jump to `#111` mid-cream.

### Layout
- **Everything centered/symmetric** → offset margins, mixed aspect
  ratios, left-aligned headers.
- **Three equal card columns** → 2-col zig-zag, asymmetric grid,
  horizontal scroll, or masonry.
- **`height: 100vh`** → `min-height: 100dvh` (iOS Safari viewport bug).
- **Flexbox percentage math** → CSS Grid.
- **No max-width container** → ~1200-1440px with auto margins.
- **Buttons at random heights in a card row** → pin CTAs to the bottom so
  they form one line.
- **Feature lists starting at different Y across pricing columns** →
  fixed-height title/price blocks so lists start aligned.
- **Math-centered but optically off** → 1-2px optical nudges for icons in
  text, glyphs in circular buttons.
- **Symmetric top/bottom padding** → bottom often needs slightly more.

### States & interactivity
- Add `:hover` (bg shift / slight scale / translate) and `:active`
  (`scale(.98)` or `translateY(1px)`).
- Add 200-300ms transitions to interactive elements; never zero-duration.
- Ensure a visible focus ring (accessibility, not optional).
- Skeleton loaders that match layout shape, not spinners.
- Composed empty states, inline form errors (never `alert()`).
- Kill dead `href="#"` links; style the active nav item;
  `scroll-behavior: smooth` on anchors.
- Animate `transform` / `opacity`, never `top` / `left` / `width` /
  `height`.

### Content
- Real, diverse names (no John Doe / Jane Smith); organic messy numbers
  (`47.2%`, `$99.00`) not round ones.
- Contextual brand names, not Acme / Nexus / SmartFlow.
- Banned clichés: "Elevate", "Seamless", "Unleash", "Next-Gen",
  "Game-changer", "Delve", "Tapestry", "In the world of…".
- No exclamation marks in success copy, no "Oops!" errors, active voice.
- Sentence case headers, never Title Case On Everything. No lorem ipsum.

### Code quality & strategic omissions (what AI forgets)
- Semantic HTML (`<nav> <main> <article> <aside> <section>`), real alt
  text, a clean z-index scale (no `9999`), branded favicon, `<title>` +
  `description` + `og:image` meta.
- Verify every import exists in the dependency file before adding it; on
  Tailwind, check v3 vs v4 before touching config.
- Add: privacy / terms links, a way back from every page, a custom 404,
  form validation, a "skip to content" link, cookie consent where the
  jurisdiction requires it.

## 6. Fix priority (max impact, min risk)

1. Font swap — biggest instant improvement, lowest risk.
2. Color palette cleanup.
3. Hover / active states.
4. Layout & spacing (grid, max-width, consistent padding).
5. Replace generic components.
6. Add loading / empty / error states.
7. Polish the type scale — the premium final touch.

Work with the existing stack. Don't migrate frameworks or styling
libraries. Keep changes small, reviewable, and reversible; verify after
each one.
