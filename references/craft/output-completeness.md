# Output completeness — no truncation, no placeholders

Design artifacts fail silently when the model quietly ships less than
was asked: a deck with 8 of 12 slides, a prototype where three of five
screens are `<!-- similar to above -->`, a component file that trails off
in `// ...rest of the sections`. Treat every artifact as
production-critical. A partial output is a broken output. Optimize for
completeness, not brevity.

> Adapted from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
> (MIT) — `skills/full-output-enforcement/SKILL.md` and its
> `research/laziness/` findings. This is an orthogonal discipline: it
> applies on top of whatever aesthetic / medium you're building.

## Why the model under-delivers (so you can catch yourself)

The taste-skill laziness research traces truncation to four causes, all
of which show up in design work:

1. **Brevity bias & stopping pressure** — alignment rewards short
   answers; the model stops at a "good enough" breakpoint.
2. **Placeholder propagation** — training data is full of
   `# implement here` / `// TODO`, so the model reaches for them.
3. **Cognitive shortcuts** — when a task *looks* easy or the context is
   long, the model shortcuts (e.g. builds slide 1 and slide 12, elides
   the middle). This is deliberate, not a decoding failure, and it is
   not a memory failure — it happens with plenty of context left.
4. **Perceived output limits** — the model self-limits as if near a cap
   even when it isn't.

The countermeasure is explicit: count the deliverables, lock the number,
build every one, cross-check before finishing.

## Banned output patterns (hard failures)

Never produce these in a design artifact or the code behind it:

- **In code / markup:** `// ...`, `// rest of code`,
  `// implement here`, `// TODO`, `/* ... */`, `// similar to above`,
  `// continue pattern`, `// add more as needed`, a bare `...` standing
  in for omitted code, `<!-- repeat for the other N -->`.
- **In prose:** "for brevity", "the rest follows the same pattern",
  "similarly for the remaining", "and so on" (in place of real content),
  "let me know if you want me to continue", "I'll leave that as an
  exercise".
- **Structural shortcuts:** a skeleton when a full implementation was
  asked for; first + last section with the middle skipped; one example
  plus a description of the repeats; describing what a component should
  do instead of building it.

For decks and multi-screen prototypes specifically: if the brief says
12 slides or 5 screens, the file contains 12 slides or 5 screens, each
fully composed — not 3 real ones and a comment.

## Execution process

1. **Scope** — read the full request. Count the distinct deliverables
   (slides, screens, components, variants, sections). Lock that number,
   ideally as a `TodoWrite` list.
2. **Build** — generate every deliverable completely. No partial drafts,
   no "you can extend this later."
3. **Cross-check** — before finishing, re-read the request and compare
   your deliverable count to the locked scope. Anything missing gets
   added before you respond.

## Handling genuinely long output

When a single artifact is too large to finish in one pass:

- Do not compress the remaining sections to squeeze them in.
- Do not skip to a conclusion.
- Write at full quality up to a clean breakpoint (end of a slide, end of
  a file, end of a section) and end with:

  ```
  [PAUSED — X of Y complete. Send "continue" to resume from: <next section>]
  ```

- On "continue", pick up exactly where you stopped. No recap, no
  repetition, no re-emitting finished work.

Because this skill writes to real files on disk, the strongest form of
this is simply: keep editing the file until every locked deliverable is
present, then verify (see the skill's Verify step — grep for orphan
`[REPLACE]` markers and for the banned patterns above).
