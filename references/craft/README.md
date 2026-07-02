# Craft references

Brand-agnostic craft knowledge. Each file is a small, dense rulebook on one
dimension of professional UI craft (typography, color, motion, …). Skills
opt into the references they need; the daemon injects only the requested
ones into the system prompt above the active skill body.

## Why a third axis next to `skills/` and `design-systems/`

| Axis | Scope | Example |
|---|---|---|
| `skills/` | Artifact shape | `saas-landing`, `dashboard`, `pricing-page` |
| `design-systems/` | Brand visual language (the 9-section `DESIGN.md`) | `linear-app`, `apple`, `notion` |
| `craft/` | **Universal** craft knowledge — true regardless of brand | letter-spacing rules, accent-overuse caps, anti-AI-slop |

`DESIGN.md` tells the agent which colors and fonts a brand uses. `craft/`
tells the agent the universal rules a competent designer applies on top —
e.g. ALL CAPS always needs ≥0.06em tracking, regardless of the brand.

## How a skill opts in

Add an `od.craft.requires` array to the skill's front-matter. Only the
listed sections are injected, so a skill that needs only typography pays
no token cost for color/motion content.

```yaml
od:
  craft:
    requires: [typography, color, anti-ai-slop]
```

Use the layered stack for editorial skills that require authored hierarchy
and sustained reading behavior:

```yaml
od:
  craft:
    requires: [typography, typography-hierarchy, typography-hierarchy-editorial]
```

Allowed values match the file names in this directory minus the `.md`
extension. Unknown values are silently ignored (forward-compatible).

### Why silent fallback instead of fail-fast?

A skeptical reader will ask: "If a skill requests a planned-but-not-yet-vendored
section and the corresponding file doesn't exist yet, shouldn't we warn
the user?" We chose forward-compatibility over fail-fast: a skill
authored today can list a planned slug and start benefiting the moment
the matching `craft/<slug>.md` is vendored in a follow-up PR, with no
skill edit needed. The cost of a missed reference is a missing
paragraph in the system prompt, not a broken skill — so the loud
failure mode is not worth the friction.

Note for skill authors arriving from older guidance: an earlier draft
used `motion` as the future-slug placeholder. The shipped equivalent
today is `animation-discipline`. Use that one if your skill emits
motion.

### Enforcement levels

Craft files mix auto-checked rules and guidance.

- **Auto-checked.** Rules wired into `apps/daemon/src/lint-artifact.ts` — currently the P0 list in `anti-ai-slop.md` (Tailwind-indigo accent, two-stop hero gradients, emoji-as-icons, etc.). The linter reports these as findings back to the UI (for P0/P1 badges) and to the agent (as a system reminder for self-correction). Artifact persistence is not currently hard-blocked on P0 hits.
- **Guidance.** The rest. The agent reads the rules, reviewers apply them, the linter doesn't check them.

A purely behavioral craft file (state-coverage, animation-discipline) is guidance unless a specific rule is later promoted into `lint-artifact.ts`.

## Files

| File | Section name | When to require |
|---|---|---|
| `typography.md` | `typography` | Any skill that emits typed content (~all skills) |
| `typography-hierarchy.md` | `typography-hierarchy` | Any skill that emits typed content where hierarchy must feel authored, not assembled — especially surfaces with a strong entry point, varied levels, or intentional rhythm. Compose with `typography`. |
| `typography-hierarchy-editorial.md` | `typography-hierarchy-editorial` | Skills whose primary artifact is a sustained reading surface: `blog-post`, `docs-page`, `digital-eguide`. Requires `typography` + `typography-hierarchy`. |
| `color.md` | `color` | Any skill that emits styled output (~all skills) |
| `anti-ai-slop.md` | `anti-ai-slop` | Marketing pages, landing pages, decks |
| `state-coverage.md` | `state-coverage` | Any skill with stateful UI (dashboards, mobile apps, forms, list/table views) |
| `animation-discipline.md` | `animation-discipline` | Any skill that ships motion: mobile apps, multi-screen flows, gamified UI, transitions, microinteractions |
| `accessibility-baseline.md` | `accessibility-baseline` | Any skill that ships interactive UI: dashboards, forms, mobile flows, anything with focus/labels/keyboard paths |
| `rtl-and-bidi.md` | `rtl-and-bidi` | Any skill that ships localized text or layout: blogs, docs, financial tables, mobile apps, anything that may render Arabic / Hebrew / Persian |
| `form-validation.md` | `form-validation` | Any skill whose primary artifact contains an interactive form: lead capture, sign-in, signup, settings, multi-step intake |
| `laws-of-ux.md` | `laws-of-ux` | Any skill whose composition decisions hit named cognitive limits: pricing pages (Hick's, Choice Overload, Von Restorff), dashboards (Pareto, Selective Attention, Working Memory), onboarding (Goal-Gradient, Zeigarnik, Peak-End), modals (Fitts's, Tesler's). Sibling axis to the rendering-rule files above — covers what to compose, not how to render. |
| `taste-dials.md` | `taste-dials` | Landing pages, portfolios, marketing sites, and redesigns — anything that needs a stated design direction before code. The Design Read (brief inference), the three dials (`DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`) with inference + preset tables, technical bands per level, and anti-default discipline. Adapted from Leonxlnx/taste-skill; skill-local, preserved across re-vendor. |
| `anti-ai-slop-taste.md` | `anti-ai-slop-taste` | Extends `anti-ai-slop.md` with the taste-skill production-test tell catalog (Lila rule, premium-consumer palette ban, hero hard rules, eyebrow restraint) and the em-dash ban on generated copy. Guidance, not linter-checked. Skill-local, preserved across re-vendor. |
| `redesign-audit.md` | `redesign-audit` | Any skill that modifies an existing site rather than building greenfield. Mode detection (greenfield / preserve / overhaul), the audit-before-touching checklist, what never changes silently (slugs, nav labels, form fields, wordmark, legal copy), modernisation levers in priority order, and a concrete diagnose-and-fix catalog. Adapted from Leonxlnx/taste-skill. |
| `output-completeness.md` | `output-completeness` | Any skill whose artifact has a countable set of deliverables (decks, multi-screen prototypes, component sets, variant grids) where the model tends to ship fewer than asked. Bans placeholder / truncation patterns, and gives a scope-lock → build → cross-check process plus a clean pause/resume convention. Orthogonal to aesthetics; adapted from Leonxlnx/taste-skill. |

**Partial-stateful skills.** A skill that's mostly static but contains an embedded form, data table, or query surface should opt in. State-coverage rules apply to the stateful component, not the whole page.

More sections (`icons`, `craft-details`) will be added in follow-up
PRs as we wire the linter side.

## Attribution

Craft content is adapted from the MIT-licensed
[refero_skill](https://github.com/referodesign/refero_skill) project
(© Refero Design), with edits to fit Open Design's house style and link
back to OD's design tokens (`var(--accent)` etc.) instead of generic
Tailwind hex values.

The `taste-dials.md`, `redesign-audit.md`, `output-completeness.md`, and
`anti-ai-slop-taste.md` docs are the anti-slop **taste layer** adapted
from the MIT-licensed
[taste-skill](https://github.com/Leonxlnx/taste-skill) project
(© 2026 Leonxlnx), rewritten to this skill's HTML-artifact workflow.
These are skill-local (not vendored from upstream) and are preserved
across `scripts/vendor.ts` re-vendors — see the top-level `NOTICE`.
