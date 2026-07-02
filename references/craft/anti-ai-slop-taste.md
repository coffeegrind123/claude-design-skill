# Anti-AI-slop — taste-skill extended tells

The extended slop-tell catalog and the em-dash ban, on top of the seven
cardinal sins in `anti-ai-slop.md`. Read both before shipping marketing /
landing / portfolio work.

> Adapted from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
> (MIT) — `skills/taste-skill/SKILL.md` §4, §9. These are **agent and
> reviewer guidance**, not wired into any linter. They extend, not
> override, the P0/P1/P2 lists in `anti-ai-slop.md`. This is a skill-local
> file preserved across re-vendor (see `scripts/vendor.ts`); pair it with
> `taste-dials.md` — the dials set direction, these tells catch the
> backsliding.

## Typography tells

- **Serif as the reflex for "creative" briefs** is the #1 typography
  tell. Default to a strong sans display; use a serif only when the brief
  names one or the work is genuinely editorial / luxury / heritage. Avoid
  the over-used defaults (`Fraunces`, `Instrument Serif`) — rotate
  justified serifs (PP Editorial New, GT Sectra, Reckless Neue, Tiempos,
  Recoleta, Playfair) when a serif is warranted.
- **Inter / Roboto / Arial / Helvetica as the default** → reach for
  Geist, Satoshi, Cabinet Grotesk, Outfit, Clash.
- **Injecting one serif word into a sans headline** for emphasis → use
  italic or weight of the *same* family instead.
- **Clipped italic descenders** (y/g/j/p/q) → give italic display
  `line-height: 1.1` and a little bottom padding.
- **All-caps under 0.06em tracking**, proportional figures in data
  (use `tabular-nums`).

## Color tells

- **The Lila rule.** The AI-purple / blue glow is discouraged as a
  default: no automatic purple button glows, no random neon gradients.
  Use a neutral base (Zinc / Slate / Stone) + one high-contrast accent
  (Emerald, Electric Blue, Deep Rose, Burnt Orange). If the brand
  genuinely *is* purple, embrace it — but execute with intent.
- **Color consistency lock.** One accent for the whole page. A warm-grey
  site does not get a blue CTA in section 7; a rose site does not get a
  teal badge in the footer. One gray family, one hue tint — never mix
  warm and cool grays in one project.
- **Premium-consumer palette ban** (second-most-recurring tell). For
  cookware / wellness / artisan / luxury / heritage / DTC briefs, the
  beige-cream + brass/clay/oxblood + espresso-ink cliché is banned as a
  default. Concretely, don't default-reach for:
  - Backgrounds: `#f5f1ea`, `#f7f5f1`, `#fbf8f1`, `#efeae0`, `#ece6db`,
    `#faf7f1`, `#e8dfcb`
  - Accents: `#b08947`, `#b6553a`, `#9a2436`, `#9c6e2a`, `#bc7c3a`,
    `#7d5621`
  - Text: `#1a1714`, `#1a1814`, `#1b1814`

  Rotate a different family instead (and never ship the same one twice in
  a row): Cold Luxury (silver-grey + chrome + smoke); Forest (deep green +
  bone + amber); Black-and-Tan (off-black + warm tan); Cobalt + Cream;
  Terracotta + Slate; Olive + Brick + Paper; or pure monochrome + one
  saturated pop. Allowed only when the brief explicitly names those colors
  or the identity is genuinely warm-craft and you can say why.

## Layout tells

- **Eyebrow restraint.** Uppercase-tracking eyebrow labels are the
  most-violated layout tell: at most 1 per 3 sections. Count the
  `uppercase tracking` labels before shipping.
- **Section-layout repetition.** Across 8 sections, use ≥ 4 distinct
  layout families. Cap consecutive image/text splits (zigzag) at 2.
- **Split-header floater.** A giant left headline with a tiny unaligned
  explainer paragraph floating in the top-right corner is a tell. Put the
  sub-text under the headline, or build a clean aligned 2-column header.
- **Hero hard rules.** Headline ≤ 2 lines; subtext ≤ ~20 words / ≤ 4
  lines; CTAs visible in the first viewport; hero top padding ≤ `pt-24`;
  hero stack ≤ 4 text elements. Banned *in the hero*: a tagline below the
  CTAs, a trust micro-strip, a pricing teaser, feature bullets, an avatar
  row. Logo walls go *under* the hero. Nav is one line, ≤ 80px tall.
- **Bento exact cell count.** N items → N cells; no phantom filler tiles,
  no dropped items. Vary bento cell backgrounds.
- **Div-based fake product UI in the hero** (fake dashboard / terminal /
  task list built from styled divs) is the single biggest tell. Use a
  real screenshot, a generated image, a real component, or nothing.

## Production-test tells (banned outright by default)

Signatures the model reaches for when it tries to "look designed."
Acceptable only when the brief explicitly calls for one.

- **Version labels / status eyebrows** in the hero: `V0.6`, `v2.0`,
  `BETA`, `EARLY ACCESS`, `ALPHA`, `INVITE-ONLY PREVIEW`.
- **Section-number eyebrows / pagination:** `00 / INDEX`,
  `001 · Capabilities`, `01 / 4` on tiles, `Scroll · 001`,
  `Index of Work, 2018-2026`. Eyebrows name the topic in plain language.
- **Generic step labels:** `Stage 1 / 2 / 3`, `Phase 01 / 02`,
  `Pass One / Two`. Use the verb directly (Install, Configure, Ship).
- **Overused middle-dot separators** (`foo · bar · baz · qux`): ration to
  1 per line; prefer line breaks, hairlines, or columns.
- **Decorative status dots** before nav links / list rows / badges — only
  when a dot conveys real semantic state, and sparingly.
- **Poetic sidebar/quote labels:** "From the field", "Field notes",
  "On our desks", "Currently on the bench". Use plain labels or none.
- **"Quietly trusted by" / "Quietly in use at"** social-proof headers →
  "Trusted by", "Used at", or let the logos speak.
- **Weather / locale / time strips** (`LIS 14:23 · 18°C`,
  "Lisbon 14:23") unless the brief is genuinely place/timezone-specific.
- **Scroll cues** (`↓ Scroll`, "Scroll to explore", animated mouse-wheel)
  — the user is already looking at the hero.
- **Pills / tags / photo-credit captions overlaid on images**
  (`PLATE · BRAND`, `Frame XII · 35mm`); caption below the image if at
  all, and only real credits for real photos.
- **Version footers / live counters on marketing pages** (`v1.4.2`,
  `Build 0048`, `last sync 4s ago`, `Reservation 412 of 800`) — CLI /
  devtool fixtures, not landing content.
- **`<br>`-broken-and-italicized headlines**, **90°-rotated vertical
  text**, and **decoration text strips at hero bottom**
  (`BRAND. MOTION. SPATIAL.`) — agency-portfolio clichés.
- **`border-t` + `border-b` on every row** of a long spec table (pick
  one, use it sparsely), and **comparison bars with filled background
  tracks** (dashboard clutter on a landing page).

## The em-dash ban (hard default)

The em-dash (`—`) is the LLM's signature stylistic crutch and the #1
visual tell in production tests. In generated artifact **copy** —
headlines, eyebrows, pills, button text, body, quotes, attribution,
captions, alt text — do not emit `—`. "Use sparingly" has historically
failed; the rule is binary. The en-dash (`–`) used as a separator is
banned too (date ranges `2018-2026` and number ranges `€40-80k` use a
hyphen). The only dash characters permitted in visible copy are the
regular hyphen `-` and a math minus (`-5°C`). Restructure instead: a
period, a comma, parentheses, a colon, a line break, or (for attribution)
` - ` with spaces.

The single narrow exception is sustained long-form **editorial prose**
(a `blog-post` / article body) where an author's voice legitimately uses
the em-dash as punctuation — and even there, prefer restraint. This ban
governs *artifact output only*; it does not apply to this skill's own
reference docs or to your conversational replies. If a marketing /
landing / portfolio artifact contains a single visible `—`, it fails
pre-flight and gets rewritten.
