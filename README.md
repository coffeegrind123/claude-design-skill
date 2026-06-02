# Claude Design — standalone skill (for stock Claude Code)

A standalone copy of the **Claude Design** skill that ships built-in with
[openclaude](https://github.com/coffeegrind123/openclaude). Drop this
folder into `~/.claude/skills/claude-design/` if you're running stock
Claude Code and want the same workflow.

Anthropic Labs released **Claude Design** ([claude.ai/design](https://claude.ai/design))
on 2026-04-17 — a vision-model-driven HTML design tool that turns a brief
into polished visual work (slides, prototypes, mockups, landing pages,
animations, decks, game UIs). The hosted product ships with proprietary tools
(sandboxed iframe preview, `gen_pptx`, `fork_verifier_agent`, `invoke_skill`,
`questions_v2`). This skill ports the same workflow on top of Claude Code's
native tools, so the model produces the same kinds of artifacts in your
local working directory without the hosted environment.

## What's bundled

The `references/` tree (251 files) is vendored from
[`nexu-io/open-design`][od] and [`google-labs-code/design.md`][dmd] under
Apache 2.0, plus an integrated game-UI reference pipeline:

- **111 named workflow recipes** under `references/skills/` —
  `frontend-design`, `web-artifacts-builder`, `login-flow`,
  `resume-modern`, `data-report`, `poster-hero`, `brand-guidelines`,
  `slides` / `ppt-keynote` / `deck-swiss-international`, `remotion`,
  `threejs`, `shader-dev`, `d3-visualization`, `shadcn-ui`, the `gsap-*`
  family (9), the `frame-*` animation recipes, `figma-*`,
  `paywall-upgrade-cro`, `release-notes-one-pager`, and 90+ more.
  External paid-API generative-media skills (`fal-*`, `venice-*`,
  `replicate`, `minimax-*`, `imagen`, `imagegen`, `sora`, `speech`,
  `pixelbin-media`, `nanobanana-ppt`, `gif-sticker-maker`,
  `ai-music-album`) are excluded — they need vendor keys and don't map to
  Claude Code's native tools. `_INDEX.md` lists all.
- **12 design-discipline docs** under `references/craft/` (+ a `README.md`
  index) — `anti-ai-slop.md` (the seven cardinal sins),
  `accessibility-baseline.md`, `animation-discipline.md`, `color.md`,
  `form-validation.md`, `laws-of-ux.md`, `rtl-and-bidi.md`,
  `state-coverage.md`, `typography-hierarchy.md`,
  `typography-hierarchy-editorial.md`, `typography.md`, and
  `headless-rendering.md` (skill-local: the Chromium render-then-crop
  pipeline).
- **27 brand-grade design systems** under `references/design-systems/` —
  `apple`, `stripe`, `figma`, `vercel`, `notion`, `linear-app`, `github`,
  `openai`, `framer`, `raycast`, `claude`, `supabase`, `airbnb`, `shopify`,
  `atelier-zero`, `warm-editorial`, `brutalism`, `neobrutalism`, `bento`,
  `minimal`, `neumorphism`, `glassmorphism`, `retro`, `editorial`,
  `modern`, `paper`, `default`. `_INDEX.md` lists all.
- **36 deck themes** under `references/html-ppt/themes/` as `:root`
  token-override CSS.
- **31 single-page slide layouts** under `references/html-ppt/templates/`.
- **`references/html-ppt/runtime.js`** — the `<deck-stage>` web component.
- **6 html-ppt authoring docs** under `references/html-ppt/refs/`.
- **The `google-labs-code/design.md` format** under `references/design-md/`
  — `spec.md` (full DESIGN.md spec), 3 canonical `examples/` (DESIGN.md +
  `design_tokens.json` + `tailwind.config.js`), and a `cli.md` cheat-sheet
  for `npx @google/design.md` (lint / diff / export / spec).
- **Integrated game-UI pipeline** under `references/game-ui/` — the
  `gameuidatabase` skill bundled in full (SKILL.md + endpoint/selector/tag
  references + search/extract/fetch scripts) for grounding game-HUD /
  inventory / menu mocks in real reference screenshots from
  gameuidatabase.com.

## Install

Clone this repo straight into your skills directory (its `SKILL.md` lives at
the repo root, so it installs as a skill directly):

```bash
mkdir -p ~/.claude/skills
git clone --depth 1 https://github.com/coffeegrind123/claude-design-skill.git ~/.claude/skills/claude-design
```

To update later, `git -C ~/.claude/skills/claude-design pull`. If you prefer not
to keep the `.git` directory, download a tarball and extract it to the same path
instead.

Restart your Claude Code session. The skill should appear in `/skills`.

## Use

Type natural-language design briefs — the skill auto-discovers via
Claude Code's skill description matching:

```
design an iOS signup flow for a bikesharing app, blue + orange palette
build a 12-slide pitch deck for our seed round, editorial-serif theme
create 5 interactive shader wallpapers that react to mouse position
wireframe an admin dashboard, sidebar + dense layout
make this landing page tweakable — accent color, type scale, density
mock a sci-fi RPG inventory HUD — pull references from gameuidatabase first
```

Or invoke explicitly via `/skills`.

The model:

1. Asks clarifying questions via `AskUserQuestion` (always, for non-trivial
   work — confirms output format, fidelity, brand context, variation count).
2. Plans via `TodoWrite` for multi-screen prototypes / decks / wireframe
   sets.
3. Reads the relevant workflow recipe from `references/skills/<name>.md`.
4. Writes self-contained HTML to your working directory with descriptive
   filenames (`Bikeshare Onboarding.html`, `Pitch Deck v2.html`).
   Significant revisions become new files (`v2`, `v3`).
5. Verifies — reads file back, optionally spawns a `Task` subagent for an
   independent review pass against `references/craft/anti-ai-slop.md`.
6. Tells you the file path. You open the HTML in your browser.

## Caveats vs. the hosted Claude Design product

- No sandboxed iframe preview — you open the artifact in your own browser.
- No `gen_pptx` / `super_inline_html` / `open_for_print`. For PPTX export
  the model shells out to `python-pptx` / `pptxgenjs` via `Bash`. For
  self-contained single-file HTML the model inlines assets at write time.
- No `save_screenshot` / `eval_js_user_view`. For a fixed-pixel render the
  model follows `references/craft/headless-rendering.md` (headless Chrome /
  Puppeteer / Playwright with the viewport-compensation + crop pipeline), or
  asks you for a screenshot.
- No `fork_verifier_agent` — the model spawns a regular `Task` subagent
  for an independent review pass.
- No `invoke_skill` recursion — the model reads `references/skills/<name>.md`
  directly when a sub-workflow matches.
- The **game-UI reference pipeline** (`references/game-ui/`) drives the
  Cloudflare-gated gameuidatabase.com, so it needs a real browser (the
  `browser` MCP server) plus `Xvfb` and `curl`/`wget` — included in the
  skill's `allowed-tools`. Without a browser MCP server configured, the
  build/mock steps still work; only the reference-pulling step is unavailable.

## Refreshing against upstream

This repo ships its own self-contained re-vendor script, `scripts/vendor.ts`
(run with [`bun`](https://bun.sh)). It clones nothing itself — point it at
local checkouts of the upstreams and it rebuilds `references/` atomically:

```bash
git clone --depth 1 https://github.com/nexu-io/open-design.git /tmp/open-design-ref
git clone --depth 1 https://github.com/google-labs-code/design.md.git /tmp/design-md-ref
bun run scripts/vendor.ts
```

The script wipes and rebuilds `references/skills`, `craft`, `design-systems`,
`html-ppt`, and `design-md` from those clones, **preserving** the skill-local
`references/craft/headless-rendering.md` and re-syncing `references/game-ui/`
from `~/.claude/skills/gameuidatabase` (override paths via the `OPEN_DESIGN_SRC`,
`DESIGN_MD_SRC`, and `GAME_UI_SRC` env vars). Curation knobs live at the top of
the script: `SKILL_EXCLUDE` (external paid-API skills) and `DESIGN_SYSTEMS`
(the 27-system subset).

Notes on upstream drift this script already accounts for:

- **html-ppt moved** upstream from `skills/html-ppt/` to
  `design-templates/html-ppt/` — `vendor.ts` reads the new path.
- **Skill churn** — the upstream catalog is reorganized frequently; a full
  mirror adds/drops many recipes. After a re-vendor, diff
  `references/skills/_INDEX.md` and refresh any example skill names cited in
  `SKILL.md` / this README so no reference dangles.

For the broader (openclaude monorepo) procedure — build verification, the
generated TS manifest, the container hot-patch, and the changelog discipline —
see openclaude's [update protocol][protocol].

## License & attribution

This skill bundles content adapted from these upstream sources:

1. **The Claude Design master system prompt** — Anthropic Labs released
   on 2026-04-17 with the Claude Design product. Adapted to remap proprietary
   tool references onto Claude Code's native tools.
2. **Open Design** ([nexu-io/open-design][od]) — Apache 2.0 open-source
   replica of Claude Design. Most of the `references/` tree is vendored here.
3. **design.md** ([google-labs-code/design.md][dmd]) — Apache 2.0. The
   DESIGN.md format spec + canonical examples under `references/design-md/`.
4. **gameuidatabase skill** — integrated in full under `references/game-ui/`
   for building/mocking game UIs from real reference screenshots.

See `NOTICE` for full attribution. Apache 2.0 throughout.

[od]: https://github.com/nexu-io/open-design
[dmd]: https://github.com/google-labs-code/design.md
[protocol]: https://github.com/coffeegrind123/openclaude/blob/main/context/claude-design-update-protocol.md
