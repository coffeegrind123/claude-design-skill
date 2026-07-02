---
name: image-to-code
description: Image-first website build — for visually important web work, generate the design image(s) first, analyze them deeply as the spec, then implement HTML that matches as closely as possible. Prefers large section-specific images, fresh regeneration over cropping, clean heroes, and no cards-inside-cards. Distilled from Leonxlnx/taste-skill image-to-code-skill.
---

# Image-to-code — generate, analyze, build

For visually important pages, don't design in code from a blank file.
**Generate a reference image (or one per section) first, treat it as the
spec, then build HTML to match it.** This front-loads the taste decisions
into a form you can actually see and critique before committing to
markup. Pairs with `imagegen-frontend.md` (which directs the images) and
this skill's own "recreating from screenshots" flow.

## Source

Distilled from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
(MIT) — `skills/image-to-code/SKILL.md`.

## Workflow

1. **Set direction** — Design Read + dials (`taste-dials.md`), then make
   the Combinatorial Variation Engine choices (`imagegen-frontend.md`).
2. **Generate** — produce one large, readable image per section (see
   image rules below). If no generation backend is available, use the
   user's pasted screenshots / references as the source images instead.
3. **Analyze** — `Read` each image and extract its spec (checklists
   below). The image is the source of truth; describe what you observe
   before writing anything.
4. **Build** — implement section by section, matching the image. Verify
   against it, don't drift.

## Image rules

- **One large image per section**, mapped N:N to the page's sections.
  Prefer large and readable over many tiny thumbnails.
- **Never crop an old image to fake a new section** — regenerate a fresh,
  standalone image at the right aspect ratio.
- Optional **extraction images**: tight close-ups of a type specimen or a
  single component when you need to read fine detail.
- Keep the hero clean; avoid busy composites that can't be faithfully
  translated to markup.

## Extraction checklists (image → spec)

Treat the image as the contract and pull, per section:

- **Text** — every headline, subhead, label, and CTA string, verbatim.
  Don't paraphrase the copy; transcribe it.
- **Typography** — display vs body family character, weights, relative
  scale, tracking, case, line-height feel.
- **Spacing** — section padding rhythm, gaps, the container width, where
  whitespace is doing the work.
- **Buttons / components** — shape, fill vs outline, radius, iconography,
  the exact component archetypes present.
- **Color** — background, text, the single accent, any surface tints;
  sample real values rather than guessing.

## Anti-drift & cleanliness rules

- **Faithful to the image, not "inspired by" it.** Match layout,
  proportion, and copy. If the build diverges, fix the build, not the
  target.
- **Anti-nested-box:** no cards-inside-cards-inside-cards. Flatten. A
  bordered card holding bordered cards is a tell and a translation
  failure.
- **Reduce micro-UI clutter:** drop the decorative pills, status dots,
  and meta strips the model tends to sprinkle in (see the production-test
  tells in `anti-ai-slop.md`).
- **Missing detail resolution:** when the image is ambiguous, choose the
  simpler, cleaner interpretation and note the assumption — don't invent
  ornamentation to fill space.
- **Copy discipline:** the image's real strings win; don't substitute
  lorem or AI-cliché phrasing during the build.

## Pre-flight

- [ ] Direction set (Design Read + dials + engine choices) before
      generating
- [ ] One readable image per section; none cropped from another
- [ ] Each section's text / type / spacing / components / color extracted
      before coding it
- [ ] Build matches the image in layout, proportion, and copy
- [ ] No nested-card stacks; micro-UI clutter removed
- [ ] Verified section-by-section against the source images
