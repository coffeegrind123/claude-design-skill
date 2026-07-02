---
name: imagegen-frontend
description: Image art-direction for frontend work — direct a set of section-by-section reference images (web) or screen mockups (mobile) before or instead of writing HTML. Enforces one image per section, a combinatorial variation engine so output never looks templated, one consistent palette, and platform/safe-area discipline for mobile. Distilled from Leonxlnx/taste-skill imagegen-frontend-web + imagegen-frontend-mobile.
---

# Imagegen — frontend art direction

Use when the brief calls for **generated design imagery** rather than
(or ahead of) code: hero art, section reference images, or phone-mockup
screens for an app. Two modes share one engine — **web** (one horizontal
image per landing/marketing section) and **mobile** (clean device-mockup
screens for a flow). Output is image *direction*: prompts and composition
decisions a generation model renders. When there's no image backend
wired in, this same engine directs high-quality placeholder art and the
downstream HTML layout, and you say so.

## Source

Distilled from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
(MIT) — `skills/imagegen-frontend-web/SKILL.md` and
`skills/imagegen-frontend-mobile/SKILL.md`.

## The primary output rule

- **Web:** generate **one separate horizontal image per section**. An
  8-section landing page produces 8 images. Never compress the whole
  page into one image. Default counts: landing 6, marketing 8,
  product/portfolio 6. N sections → N images; count them.
- **Mobile:** generate **one clean screen per step in the flow**, framed
  in a consistent device mockup. Never crop or reuse an old image to fake
  a new screen — regenerate fresh, standalone.
- **One palette across every image.** Lock the palette once (from the
  Variation Engine) and keep it identical across all sections/screens so
  the set reads as one product, not a mood board.

## The Combinatorial Variation Engine

To avoid templated output, internally pick **one** option from each
category and commit consistently. Don't mash everything together — pick a
strong combination and execute it clearly.

**Theme paradigm** (choose 1): Pristine Light (off-white/cream, sharp
dark text) · Deep Dark (charcoal/graphite, glow only when justified) ·
Bold Studio Solid (oxblood / royal blue / forest / vermilion / emerald
fields) · Quiet Premium Neutral (bone / sand / taupe / stone / smoke).

**Background character** (choose 1): subtle technical grid / dotted field
· solid field with soft ambient gradient depth · full-bleed cinematic
imagery with contrast control · quiet textured paper / tactile surface.

**Typography character** (choose 1): Satoshi-like clean grotesk ·
Neue-Montreal-like refined grotesk · Cabinet/Clash expressive display ·
Monument-like compressed statement · elegant editorial serif+sans ·
Swiss rational sans with strong hierarchy.

**Hero architecture** (choose 1): Cinematic Centered Minimalist ·
Asymmetric Split · Floating Polaroid Scatter · Inline Typography
Behemoth · Editorial Offset · Massive Image-First with restrained text.

**Section system** (choose 1 dominant): strict modular bento · alternating
editorial blocks · poster-like stacked storytelling · gallery-led cadence
· Swiss grid discipline · asymmetric premium marketing flow.

**Signature components** (choose exactly 4): Diagonal Staggered Masonry ·
3D Cascading Card Deck · Hover-Accordion Slices · Gapless Bento · Infinite
Brand Marquee · Turning Polaroid Arc · Vertical Rhythm Lines · Off-Grid
Editorial · Product UI Panel Stack · Split Testimonial Wall · Oversized
Metrics Strip · Layered Image Crop Frames.

**Motion-implied language** (choose exactly 2): scrubbing text reveal ·
pinned narrative · staggered float-up · parallax image drift · smooth
accordion expansion · cinematic fade-through. (These are *implied* by the
composition; the still image should read as if it moves this way.)

**Narrative spine** (choose 1, thread it through visuals + copy):
artifact/collectible · journey/pilgrimage · tool/precision instrument ·
living system/garden · stage/spotlight · archive/dossier.

**Second-read moment** (choose exactly 1, place once): an asymmetric bleed
that still respects hierarchy · one oversized numeral/punctuation serving
structure · a single material switch · a narrow vertical side-rail note ·
a macro crop carrying brand color. It must aid scan order or brand recall,
not be a gimmick.

## Per-section variation (web)

- **Composition anchor** — the left-text / right-image layout is *allowed
  but the most overused AI pattern*; never the default, never twice in a
  row. Each section picks one anchor; ≥ 3 distinct anchors appear across
  the page: centered statement · top-left lead + bottom-right support ·
  bottom-left text over image · bottom-right CTA cluster · classic
  left-third caption (sparingly) · inverted classic · centered-low over
  hero image · off-grid editorial offset · stacked-center minimalist ·
  image-as-canvas with text in a safe area.
- **Background mode** — vary per section, never all the same: solid +
  inline asset · texture/paper/grid · full-bleed image + tonal overlay ·
  editorial side-image (50/50, 60/40, 40/60) · flat color block + detail
  crop · cinematic tonal gradient (low chroma) · duotone (palette-locked)
  · soft radial vignette + product crop · micro-noise over solid ·
  color-blocked diptych.
- **CTA style** — vary at least once across the page (pill · ghost ·
  underlined inline w/ arrow · banner · oversized headline + tiny hint ·
  CTA-as-caption). The primary action stays unmistakable.
- **Hero scale** (per page): Giant Statement · Mid Editorial · Mini
  Minimalist (confident restraint, not weak).

## Mobile-specific discipline

- **Decide platform first:** iOS-native premium · Android-Material premium
  · cross-platform neutral. It sets type, control shapes, and spacing.
- **Default phone-mockup framing:** even canvas margins, one consistent
  device scale across screens, content is the hero.
- **Respect safe areas:** status bar, home indicator, sheet docking,
  notch/island. Never let content collide with system regions.
- **Logical flow:** screens follow a real sequence (onboarding → auth →
  home → detail), locked to an app "design bible" for cross-screen
  consistency.
- **Readability doctrine:** if text feels small, the design isn't
  finished. Not always simple — always clean.

## Anti-slop (image direction)

Banned by default across both modes: purple/blue "trust" gradients,
rainbow-mesh, neon-on-everything, gradient text; decorative blob/wave
backgrounds; unjustified glassmorphism; div-style fake dashboards as
"product shots"; placeholder brand names (Acme / NovaCore / Flowbit);
"Elevate / Seamless / Next-Gen" copy; emoji feature icons. Gradients are
allowed only low-chroma and palette-matched (tonal / vignette / noise).
See `anti-ai-slop.md` for the full ruleset — it applies to generated
imagery exactly as it does to code.

## Pre-flight

- [ ] One image per section (web) or one per flow step (mobile); count
      matches the section/screen count
- [ ] One locked palette across every image
- [ ] Variation Engine choices made and consistent (theme, type, hero,
      section system, 4 components, 2 motion languages, spine)
- [ ] ≥ 3 distinct composition anchors (web); left-text/right-image is
      not the default and never repeats back-to-back
- [ ] Mobile: platform decided, safe areas respected, flow is logical
- [ ] No banned gradients / fake dashboards / placeholder names / emoji
