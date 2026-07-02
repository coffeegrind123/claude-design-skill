#!/usr/bin/env bun
/*
 * Re-vendor nexu-io/open-design (Apache 2.0) content into the STANDALONE
 * claude-design-skill repo's references/ tree.
 *
 * Differences from openclaude's build-claude-design-skill.ts:
 *   - Targets the standalone skill layout (references/ at repo root, no
 *     claudeDesign.generated.ts manifest — this is a plain Claude Code skill).
 *   - html-ppt source path moved upstream: skills/html-ppt -> design-templates/html-ppt.
 *   - Full skills mirror EXCEPT an external-paid-API exclusion set.
 *   - Preserves craft/headless-rendering.md (skill-local adaptation, not upstream;
 *     referenced by SKILL.md and would be clobbered by a blind wipe).
 *   - Preserves the anti-slop TASTE LAYER adapted from Leonxlnx/taste-skill (MIT):
 *     craft/{taste-dials,redesign-audit,output-completeness,anti-ai-slop-taste}.md and
 *     skills/{image-to-code,imagegen-frontend}.md are hand-authored, snapshotted before
 *     the wipe, restored after, and folded into the generated skills/_INDEX.md. The taste
 *     craft docs are also re-appended to the (upstream-regenerated) craft/README.md index.
 *     NOTE: taste-skill and brandkit are deliberately NOT preserved — upstream open-design
 *     now vendors the full originals (taste-skill ~1233 lines, brandkit ~822 lines), so we
 *     let those flow through rather than shadow them with thinner local copies. To refresh
 *     the remaining taste files against upstream, re-derive them from Leonxlnx/taste-skill
 *     by hand (see README "Refreshing against upstream"); this script only protects them.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

const SRC = process.env.OPEN_DESIGN_SRC || '/tmp/open-design-ref'
const DESIGN_MD_SRC = process.env.DESIGN_MD_SRC || '/tmp/design-md-ref'
const REPO_ROOT = process.env.SKILL_REPO || '/home/claudeuser/claude-design-skill'
const REF_ROOT = join(REPO_ROOT, 'references')
const HTML_PPT_SRC = join(SRC, 'design-templates/html-ppt') // moved upstream

// google-labs-code/design.md vendoring: spec + these canonical examples.
const DESIGN_MD_EXAMPLES = ['atmospheric-glass', 'paws-and-paths', 'totality-festival']

// gameuidatabase skill — integrated in full for building/mocking game UIs.
const GAME_UI_SRC = process.env.GAME_UI_SRC || '/home/claudeuser/.claude/skills/gameuidatabase'

if (!existsSync(SRC)) { console.error(`Open Design source missing at ${SRC}.`); process.exit(1) }
if (!existsSync(REPO_ROOT)) { console.error(`Skill repo missing at ${REPO_ROOT}.`); process.exit(1) }

// External paid-API generative-media skills — excluded (no Claude Code native mapping).
const SKILL_EXCLUDE = new Set<string>([
  'fal-3d','fal-generate','fal-image-edit','fal-kling-o3','fal-lip-sync','fal-realtime',
  'fal-restore','fal-train','fal-tryon','fal-upscale','fal-video-edit','fal-vision',
  'venice-audio-music','venice-audio-speech','venice-image-edit','venice-image-generate','venice-video',
  'replicate','minimax-docx','minimax-pdf','imagen','imagegen','sora','speech',
  'pixelbin-media','nanobanana-ppt','gif-sticker-maker','ai-music-album',
])

// Craft docs that are skill-local (hand-authored, not upstream) — preserved across the wipe.
// The taste-* docs are the anti-slop taste layer adapted from Leonxlnx/taste-skill (MIT).
const CRAFT_PRESERVE = [
  'headless-rendering.md',
  'taste-dials.md', 'redesign-audit.md', 'output-completeness.md', 'anti-ai-slop-taste.md',
]

// Skill recipe files that are skill-local (hand-authored, not upstream) — preserved across
// the skills/ wipe and folded into the generated index. Adapted from Leonxlnx/taste-skill (MIT).
// taste-skill and brandkit are intentionally omitted: upstream open-design now vendors the full
// originals, so we let those flow through instead of shadowing them with thinner local copies.
const SKILLS_PRESERVE = ['image-to-code.md', 'imagegen-frontend.md']

// Curated design-systems subset (matches the original build script's behavior).
const DESIGN_SYSTEMS = [
  'apple','stripe','figma','vercel','notion','linear-app','github','openai','framer','raycast',
  'claude','supabase','airbnb','shopify','atelier-zero','warm-editorial','brutalism','neobrutalism',
  'bento','minimal','neumorphism','glassmorphism','retro','editorial','modern','paper','default',
]

const rmrf = (p: string) => { if (existsSync(p)) rmSync(p, { recursive: true, force: true }) }
const mkdirp = (p: string) => mkdirSync(p, { recursive: true })
function copyText(s: string, d: string) { mkdirp(dirname(d)); copyFileSync(s, d) }

// --- Preserve skill-local craft docs across the wipe ---
const preserved: Record<string, Buffer> = {}
for (const f of CRAFT_PRESERVE) {
  const p = join(REF_ROOT, 'craft', f)
  if (existsSync(p)) preserved[f] = readFileSync(p)
}

// --- Preserve skill-local recipe files (taste layer) across the wipe ---
const preservedSkills: Record<string, Buffer> = {}
for (const f of SKILLS_PRESERVE) {
  const p = join(REF_ROOT, 'skills', f)
  if (existsSync(p)) preservedSkills[f] = readFileSync(p)
}

console.log('Wiping references tree...')
rmrf(join(REF_ROOT, 'skills'))
rmrf(join(REF_ROOT, 'craft'))
rmrf(join(REF_ROOT, 'design-systems'))
rmrf(join(REF_ROOT, 'html-ppt'))
mkdirp(join(REF_ROOT, 'skills'))
mkdirp(join(REF_ROOT, 'craft'))
mkdirp(join(REF_ROOT, 'design-systems'))
mkdirp(join(REF_ROOT, 'html-ppt/themes'))
mkdirp(join(REF_ROOT, 'html-ppt/templates'))
mkdirp(join(REF_ROOT, 'html-ppt/refs'))

// --- Skills ---
console.log('Vendoring skills/ ...')
const skillNames: string[] = []
let excluded = 0
for (const name of readdirSync(join(SRC, 'skills')).sort()) {
  if (!existsSync(join(SRC, 'skills', name, 'SKILL.md'))) continue
  if (SKILL_EXCLUDE.has(name)) { excluded++; continue }
  copyText(join(SRC, 'skills', name, 'SKILL.md'), join(REF_ROOT, 'skills', `${name}.md`))
  skillNames.push(name)
}
console.log(`  ${skillNames.length} skills vendored (${excluded} excluded as external-API)`)

// Restore skill-local recipe files (taste layer) after the upstream copy.
for (const f of SKILLS_PRESERVE) {
  if (preservedSkills[f]) { writeFileSync(join(REF_ROOT, 'skills', f), preservedSkills[f]); console.log(`  preserved local skill: ${f}`) }
}

// Generate the index from EVERY recipe present (upstream + preserved local), sorted, so the
// taste layer's recipes appear alongside the vendored ones.
const idx: string[] = ['# Skills index', '', 'Each entry below is a recipe for one artifact type.',
  'Read the matching `<name>.md` before starting a project of that kind.', '']
const allSkillNames = readdirSync(join(REF_ROOT, 'skills'))
  .filter(f => f.endsWith('.md') && f !== '_INDEX.md')
  .map(f => f.replace(/\.md$/, '')).sort()
for (const name of allSkillNames) {
  const md = readFileSync(join(REF_ROOT, 'skills', `${name}.md`), 'utf8')
  const m = md.match(/description:\s*(?:\|\s*\n((?:\s+.*\n)+)|(.+))/)
  const desc = m ? (m[1] || m[2] || '').trim().split('\n').map(l => l.trim()).join(' ').slice(0, 220) : ''
  idx.push(`- **${name}** — ${desc}`)
}
writeFileSync(join(REF_ROOT, 'skills', '_INDEX.md'), idx.join('\n') + '\n')
console.log(`  index: ${allSkillNames.length} entries (${skillNames.length} upstream + ${Object.keys(preservedSkills).length} preserved local)`)

// --- Craft (+ preserved locals) ---
console.log('Vendoring craft/ ...')
let craftN = 0
for (const name of readdirSync(join(SRC, 'craft')).sort()) {
  if (!name.endsWith('.md')) continue
  copyText(join(SRC, 'craft', name), join(REF_ROOT, 'craft', name)); craftN++
}
for (const f of CRAFT_PRESERVE) {
  if (preserved[f]) { writeFileSync(join(REF_ROOT, 'craft', f), preserved[f]); console.log(`  preserved local: craft/${f}`) }
}
console.log(`  ${craftN} upstream craft docs vendored (+${Object.keys(preserved).length} preserved local)`)

// Document the skill-local taste-layer craft docs in the freshly-copied craft/README.md.
// Upstream regenerates that file each vendor and does not list our local docs, so append a
// section describing them (idempotent per run — the copied README never already has it).
const craftReadmePath = join(REF_ROOT, 'craft', 'README.md')
if (existsSync(craftReadmePath)) {
  const tasteSection = [
    '',
    '## Taste layer (skill-local, adapted from Leonxlnx/taste-skill, MIT)',
    '',
    'These docs are hand-authored, not vendored from upstream. `scripts/vendor.ts`',
    'preserves them across the wipe (`CRAFT_PRESERVE`) and re-appends this section:',
    '',
    '- `taste-dials.md` — the Design Read (brief inference) + the three dials',
    '  (`DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`) with inference + preset',
    '  tables and per-level technical bands. Wired into the root `SKILL.md` "Design',
    '  direction" step so it fires on landing / portfolio / marketing / redesign work.',
    '- `redesign-audit.md` — audit-first redesign protocol + concrete diagnose-and-fix catalog.',
    '- `output-completeness.md` — anti-truncation / no-placeholder enforcement.',
    '- `anti-ai-slop-taste.md` — extended slop-tell catalog + the em-dash ban, extending `anti-ai-slop.md`.',
    '',
  ].join('\n')
  writeFileSync(craftReadmePath, readFileSync(craftReadmePath, 'utf8') + tasteSection)
  console.log('  appended taste-layer section to craft/README.md')
}

// --- Design systems (curated) ---
console.log('Vendoring design-systems/ (curated) ...')
const ds: string[] = []
for (const name of DESIGN_SYSTEMS) {
  const p = join(SRC, 'design-systems', name, 'DESIGN.md')
  if (!existsSync(p)) { console.warn(`  skipping ${name}: no DESIGN.md`); continue }
  copyText(p, join(REF_ROOT, 'design-systems', `${name}.md`)); ds.push(name)
}
const dsi: string[] = ['# Design systems index', '',
  'Each file below is a complete brand / aesthetic in DESIGN.md format —',
  'theme, colors, typography, components, layout, and patterns. Use one as',
  'a starting point when the user lacks their own design system.', '']
for (const name of ds) dsi.push(`- **${name}** — \`./${name}.md\``)
writeFileSync(join(REF_ROOT, 'design-systems', '_INDEX.md'), dsi.join('\n') + '\n')
console.log(`  ${ds.length} design systems vendored`)

// --- html-ppt (new upstream path) ---
console.log('Vendoring html-ppt/ ...')
let themes = 0, tpls = 0, refs = 0
for (const n of readdirSync(join(HTML_PPT_SRC, 'assets/themes')).sort()) {
  if (n.endsWith('.css')) { copyText(join(HTML_PPT_SRC, 'assets/themes', n), join(REF_ROOT, 'html-ppt/themes', n)); themes++ }
}
for (const n of readdirSync(join(HTML_PPT_SRC, 'templates/single-page')).sort()) {
  if (n.endsWith('.html')) { copyText(join(HTML_PPT_SRC, 'templates/single-page', n), join(REF_ROOT, 'html-ppt/templates', n)); tpls++ }
}
for (const n of readdirSync(join(HTML_PPT_SRC, 'references')).sort()) {
  if (n.endsWith('.md')) { copyText(join(HTML_PPT_SRC, 'references', n), join(REF_ROOT, 'html-ppt/refs', n)); refs++ }
}
copyText(join(HTML_PPT_SRC, 'assets/runtime.js'), join(REF_ROOT, 'html-ppt/runtime.js'))
console.log(`  ${themes} themes, ${tpls} templates, ${refs} refs, runtime.js`)

// --- google-labs-code/design.md (spec + examples + authored cli.md) ---
let dmFiles = 0
if (existsSync(DESIGN_MD_SRC)) {
  console.log('Vendoring design-md/ (google-labs-code/design.md) ...')
  rmrf(join(REF_ROOT, 'design-md'))
  mkdirp(join(REF_ROOT, 'design-md/examples'))
  copyText(join(DESIGN_MD_SRC, 'docs/spec.md'), join(REF_ROOT, 'design-md/spec.md')); dmFiles++
  const dmEx: string[] = []
  for (const ex of DESIGN_MD_EXAMPLES) {
    const exDir = join(DESIGN_MD_SRC, 'examples', ex)
    if (!existsSync(exDir)) { console.warn(`  skipping example ${ex}: missing`); continue }
    for (const f of ['DESIGN.md', 'README.md', 'design_tokens.json', 'tailwind.config.js']) {
      const s = join(exDir, f)
      if (existsSync(s)) { copyText(s, join(REF_ROOT, 'design-md/examples', ex, f)); dmFiles++ }
    }
    dmEx.push(ex)
  }
  // Hand-authored CLI cheat sheet for `npx @google/design.md` (not vendored upstream).
  const cli = `# design.md CLI

The \`npx @google/design.md\` CLI (bins: \`design.md\`, \`designmd\`) validates and
transforms DESIGN.md files. Source: github.com/google-labs-code/design.md.
No install needed — \`npx\` fetches it. All commands emit agent-friendly JSON.

## Commands

\`\`\`bash
# Validate structure, broken token refs, and WCAG contrast. "-" reads stdin.
npx @google/design.md lint DESIGN.md [--format json|text]

# Compare two DESIGN.md files; reports token + prose changes and a regression flag.
npx @google/design.md diff DESIGN.md DESIGN-v2.md [--format json|text]

# Export tokens to other formats:
#   css-tailwind  -> Tailwind v4 CSS @theme
#   json-tailwind -> Tailwind v3 theme.extend JSON  (alias: tailwind)
#   dtcg          -> W3C Design Tokens (DTCG)
npx @google/design.md export DESIGN.md --format css-tailwind

# Print the DESIGN.md format spec (or just the active lint-rules table).
npx @google/design.md spec [--rules] [--rules-only] [--format markdown|json]
\`\`\`

## When to use in this skill

- \`lint\` a DESIGN.md you (or the user) authored before generating UI from it —
  catches broken \`{token}\` references and AA/AAA contrast failures early.
- \`export ... --format css-tailwind\` to turn a DESIGN.md into ready-to-paste
  Tailwind v4 \`@theme\` CSS for the artifact's \`<style>\`.
- \`diff\` two revisions when iterating a design system to confirm no regressions.
- See \`spec.md\` for the full format and \`examples/\` for canonical DESIGN.md +
  design_tokens.json + tailwind.config.js triples.
`
  writeFileSync(join(REF_ROOT, 'design-md/cli.md'), cli); dmFiles++
  console.log(`  spec.md + ${dmEx.length} examples + cli.md (${dmFiles} files)`)
} else {
  console.warn(`design.md source missing at ${DESIGN_MD_SRC} — skipping design-md/.`)
}

// --- gameuidatabase skill (integrated in full) ---
let guiFiles = 0
function copyTree(srcDir: string, destDir: string) {
  for (const e of readdirSync(srcDir, { withFileTypes: true })) {
    if (e.name === '.git') continue
    const s = join(srcDir, e.name), d = join(destDir, e.name)
    if (e.isDirectory()) copyTree(s, d)
    else { copyText(s, d); guiFiles++ }
  }
}
if (existsSync(GAME_UI_SRC)) {
  console.log('Integrating game-ui/ (gameuidatabase) ...')
  rmrf(join(REF_ROOT, 'game-ui'))
  mkdirp(join(REF_ROOT, 'game-ui'))
  copyTree(GAME_UI_SRC, join(REF_ROOT, 'game-ui'))
  console.log(`  ${guiFiles} files integrated`)
} else {
  console.warn(`gameuidatabase source missing at ${GAME_UI_SRC} — skipping game-ui/.`)
}

// --- Summary ---
function countFiles(d: string): number {
  let n = 0
  for (const e of readdirSync(d, { withFileTypes: true })) n += e.isDirectory() ? countFiles(join(d, e.name)) : 1
  return n
}
console.log('\nSummary:')
console.log(`  skills:             ${skillNames.length + Object.keys(preservedSkills).length} (${skillNames.length} upstream + ${Object.keys(preservedSkills).length} preserved local taste layer)`)
console.log(`  craft docs:         ${craftN + Object.keys(preserved).length}`)
console.log(`  design systems:     ${ds.length}`)
console.log(`  html-ppt themes:    ${themes}`)
console.log(`  html-ppt templates: ${tpls}`)
console.log(`  html-ppt refs:      ${refs}`)
console.log(`  design-md files:    ${dmFiles}`)
console.log(`  game-ui files:      ${guiFiles}`)
console.log(`  total ref files:    ${countFiles(REF_ROOT)}`)
