# Claude Design — standalone skill (for stock Claude Code)

A standalone copy of the **Claude Design** skill that ships built-in with
[openclaude](https://github.com/coffeegrind123/openclaude). Drop this
folder into `~/.claude/skills/claude-design/` if you're running stock
Claude Code and want the same workflow.

Anthropic Labs released **Claude Design** ([claude.ai/design](https://claude.ai/design))
on 2026-04-17 — a vision-model-driven HTML design tool that turns a brief
into polished visual work (slides, prototypes, mockups, landing pages,
animations, decks). The hosted product ships with proprietary tools
(sandboxed iframe preview, `gen_pptx`, `fork_verifier_agent`, `invoke_skill`,
`questions_v2`). This skill ports the same workflow on top of Claude Code's
native tools, so the model produces the same kinds of artifacts in your
local working directory without the hosted environment.

## What's bundled

The `references/` tree (228 files, ~1.17 MB) is vendored from
[`nexu-io/open-design`][od] under Apache 2.0:

- **113 named workflow recipes** under `references/skills/` — `web-prototype`,
  `wireframe-sketch`, `tweaks` (live parameter panel), `html-ppt`,
  `simple-deck`, `dashboard`, `saas-landing`, `mobile-app`,
  `mobile-onboarding`, `pricing-page`, `pm-spec`, `weekly-update`,
  `sprite-animation`, `video-shortform`, `hyperframes`, `dating-web`,
  `gamified-app`, `kanban-board`, `finance-report`, `dcf-valuation`,
  `ib-pitch-book`, `clinical-case-report`, `github-dashboard`,
  `magazine-poster`, plus 30+ `html-ppt-zhangzara-*` deck variants.
- **12 craft / discipline docs** under `references/craft/` — `anti-ai-slop.md`
  (the seven cardinal sins), `accessibility-baseline.md`,
  `animation-discipline.md`, `color.md`, `form-validation.md`,
  `laws-of-ux.md`, `rtl-and-bidi.md`, `state-coverage.md`,
  `typography-hierarchy.md`, etc.
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

## Install

```bash
mkdir -p ~/.claude/skills
git clone --depth 1 --filter=blob:none --sparse https://github.com/coffeegrind123/openclaude.git /tmp/openclaude-skill
cd /tmp/openclaude-skill && git sparse-checkout set contrib/claude-design
mv /tmp/openclaude-skill/contrib/claude-design ~/.claude/skills/claude-design
rm -rf /tmp/openclaude-skill
```

Or, if you've already cloned `coffeegrind123/openclaude`:

```bash
mkdir -p ~/.claude/skills
cp -r contrib/claude-design ~/.claude/skills/claude-design
```

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
- No `save_screenshot` / `eval_js_user_view`. If a render check is
  genuinely needed, the model asks you for a screenshot or spawns headless
  Chrome / Puppeteer / Playwright via `Bash`.
- No `fork_verifier_agent` — the model spawns a regular `Task` subagent
  for an independent review pass.
- No `invoke_skill` recursion — the model reads `references/skills/<name>.md`
  directly when a sub-workflow matches.

## Refreshing against upstream

Whenever `nexu-io/open-design` ships new content or `Anthropic` updates the
Claude Design master prompt, refresh this skill by following openclaude's
[update protocol][protocol]. Or just re-run the openclaude vendor script
(`scripts/build-claude-design-skill.ts`) and `cp -r` the result into your
`~/.claude/skills/claude-design/` directory.

## License & attribution

This skill bundles content adapted from two upstream sources:

1. **The Claude Design master system prompt** — Anthropic Labs released
   on 2026-04-17 with the Claude Design product. Adapted to remap proprietary
   tool references onto Claude Code's native tools.
2. **Open Design** ([nexu-io/open-design][od]) — Apache 2.0 open-source
   replica of Claude Design. The `references/` tree is vendored from this
   repo.

See `NOTICE` for full attribution. Apache 2.0 throughout.

[od]: https://github.com/nexu-io/open-design
[protocol]: https://github.com/coffeegrind123/openclaude/blob/main/context/claude-design-update-protocol.md
