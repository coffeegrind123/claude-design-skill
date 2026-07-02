# Taste dials — Design Read + the three dials

The single most reliable anti-slop move is to **decide the design
direction before writing any HTML**, then hold it. Default LLM output is
bad because the model jumps to one house aesthetic (AI-purple gradient,
centered hero, three equal cards, Inter + slate-900) instead of reading
the brief. This doc is the fix: a one-line **Design Read**, then three
numeric **dials** that gate every layout, motion, and density decision.

> Adapted from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
> (MIT) — `skills/taste-skill/SKILL.md` §0, §1, §7. Framework-agnostic:
> the dials drive plain HTML/CSS artifacts, decks, and React prototypes
> alike, not just Next.js.

Applies to landing pages, portfolios, marketing sites, and redesigns.
It is **contextual, not automatic** — read the brief first, then pull
only what fits. For dashboards / data tables / multi-step product UI,
lean on `state-coverage.md` and `laws-of-ux.md` instead; the variance
dial there stays low.

## 1. Read the room first (six signals)

Before touching code or dials, infer what the user actually wants:

1. **Page kind** — landing (SaaS / consumer / agency / event),
   portfolio (dev / designer / studio), redesign (preserve vs overhaul),
   editorial / blog.
2. **Vibe words** they used — "minimalist", "calm", "Linear-style",
   "Awwwards", "brutalist", "premium consumer", "Apple-y", "playful",
   "serious B2B", "editorial", "glassy", "dark tech".
3. **Reference signals** — URLs linked, screenshots pasted, products
   named, competitors mentioned.
4. **Audience** — B2B procurement panel vs. design-conscious consumer
   vs. recruiter scanning a portfolio. **The audience picks the
   aesthetic, not your taste.**
5. **Brand assets that already exist** — logo, color, type, photography.
   On a redesign these are starting material, not optional (see
   `redesign-audit.md`).
6. **Quiet constraints** — accessibility-first audiences, public-sector,
   regulated industries, trust-first commerce, kids' products. These
   **override** aesthetic preference.

## 2. State the Design Read in one line

Before any code, declare:

> **Reading this as: `<page kind>` for `<audience>`, with a `<vibe>`
> language, leaning toward `<design system or aesthetic family>`.**

Examples:

- *"Reading this as: B2B SaaS landing for technical buyers, with a
  Linear-style minimalist language, leaning toward Geist + restrained
  motion."*
- *"Reading this as: solo designer portfolio for hiring managers, with
  an editorial / kinetic-type language, leaning toward native CSS +
  scroll-driven animation."*
- *"Reading this as: redesign of a public-sector service site, with a
  trust-first language, leaning toward GOV.UK Frontend or USWDS."*

If the brief is ambiguous **and** the read genuinely diverges, ask
**exactly one** clarifying question (e.g. *"Closer to Linear-clean or
Awwwards-experimental?"*). If you can confidently infer, do not ask —
declare the read and proceed. This is the taste-skill counterpart to
this skill's `AskUserQuestion` round; on hi-fi work, do both — ask the
structured questions, then still state a Design Read.

## 3. Anti-default discipline

Do not default to any of these. They are the LLM tells; reach past them
deliberately based on the read:

- AI-purple / blue "trust" gradients
- centered hero over a dark mesh
- three equal feature cards
- generic glassmorphism on everything
- infinite-loop micro-animations everywhere
- Inter + slate-900 as the type/color reflex

## 4. The three dials

After the read, set three dials. Baseline **`8 / 6 / 4`**. Override only
when the read says so; overrides happen conversationally, never by asking
the user to edit a file. Refer to these exact names — never invent
aliases like `LAYOUT_VARIANCE` or `ANIM_LEVEL`.

- **`DESIGN_VARIANCE: 8`** — 1 = perfect symmetry, 10 = artsy chaos
- **`MOTION_INTENSITY: 6`** — 1 = static, 10 = cinematic / physics
- **`VISUAL_DENSITY: 4`** — 1 = art gallery / airy, 10 = cockpit / packed

### 4.A Dial inference (Design Read → values)

| Signal | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| minimalist / clean / calm / editorial / Linear-style | 5-6 | 3-4 | 2-3 |
| premium consumer / Apple-y / luxury / brand | 7-8 | 5-7 | 3-4 |
| playful / wild / Dribbble / Awwwards / experimental / agency | 9-10 | 8-10 | 3-4 |
| landing page / portfolio / marketing site (default) | 7-9 | 6-8 | 3-5 |
| trust-first / public-sector / regulated / a11y-critical | 3-4 | 2-3 | 4-5 |
| redesign — preserve | match existing | +1 | match existing |
| redesign — overhaul | +2 | +2 | match existing |

### 4.B Use-case presets

| Use case | VARIANCE | MOTION | DENSITY |
|---|---|---|---|
| Landing (SaaS, mainstream) | 7 | 6 | 4 |
| Landing (agency / creative) | 9 | 8 | 3 |
| Landing (premium consumer) | 7 | 6 | 3 |
| Portfolio (designer / studio) | 8 | 7 | 3 |
| Portfolio (developer) | 6 | 5 | 4 |
| Editorial / blog | 6 | 4 | 3 |
| Public-sector service | 3 | 2 | 5 |
| Redesign — preserve | match | match +1 | match |
| Redesign — overhaul | +2 | +2 | match |

## 5. Technical reference — what each band renders as

### `DESIGN_VARIANCE`
- **1-3 (predictable):** symmetric CSS Grid (12-col, equal `fr`), equal
  paddings, centered alignment.
- **4-7 (offset):** `margin-top: -2rem` overlaps, mixed image aspect
  ratios (4:3 next to 16:9), left-aligned headers over centered data.
- **8-10 (asymmetric):** masonry, fractional grids
  (`grid-template-columns: 2fr 1fr 1fr`), massive empty zones
  (`padding-left: 20vw`).
- **Mobile override:** at 4-10, asymmetric layouts above `md:` **must**
  collapse to strict single column (`w-full`, `px-4`, `py-8`) below
  `768px`.

### `MOTION_INTENSITY`
- **1-3 (static):** no auto animation; `:hover` / `:active` only.
  `prefers-reduced-motion` is the default posture anyway.
- **4-7 (fluid CSS):** `transition: all .3s cubic-bezier(.16,1,.3,1)`,
  `animation-delay` cascades for load-ins, `transform` + `opacity` only.
- **8-10 (choreography):** scroll-triggered reveals, parallax,
  scroll-driven animation (CSS `animation-timeline` or GSAP
  ScrollTrigger / `IntersectionObserver`). **Never
  `window.addEventListener('scroll')`** — hard ban (see
  `animation-discipline.md`).

### `VISUAL_DENSITY`
- **1-3 (art gallery):** heavy whitespace, `py-32`–`py-48` section gaps.
- **4-7 (daily app):** standard web-app spacing, `py-16`–`py-24`.
- **8-10 (cockpit):** tight paddings, no card boxes, 1px lines separate
  data, `font-mono` mandatory for all numbers.

Any `MOTION_INTENSITY > 3` requires a `prefers-reduced-motion: reduce`
path. Animate `transform` / `opacity` only.

## 6. Where this sits in the workflow

1. Read the brief → six signals.
2. State the one-line Design Read.
3. Set `DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`.
4. Pick the aesthetic vehicle — a `design-systems/<vibe>.md`, the
   `references/skills/taste-skill.md` recipe, or a real design-system
   package when the brief maps to one (Material 3, Carbon, Polaris,
   GOV.UK, Radix, shadcn/ui). One system per project — don't import
   tokens then override 90% of them.
5. Build, holding the dials. Skim `anti-ai-slop.md` before shipping —
   the dials set direction; the tells catch backsliding.
