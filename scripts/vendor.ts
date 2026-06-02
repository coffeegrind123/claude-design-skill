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
const CRAFT_PRESERVE = ['headless-rendering.md']

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

const idx: string[] = ['# Skills index', '', 'Each entry below is a recipe for one artifact type.',
  'Read the matching `<name>.md` before starting a project of that kind.', '']
for (const name of skillNames) {
  const md = readFileSync(join(REF_ROOT, 'skills', `${name}.md`), 'utf8')
  const m = md.match(/description:\s*(?:\|\s*\n((?:\s+.*\n)+)|(.+))/)
  const desc = m ? (m[1] || m[2] || '').trim().split('\n').map(l => l.trim()).join(' ').slice(0, 220) : ''
  idx.push(`- **${name}** — ${desc}`)
}
writeFileSync(join(REF_ROOT, 'skills', '_INDEX.md'), idx.join('\n') + '\n')

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
console.log(`  skills:             ${skillNames.length}`)
console.log(`  craft docs:         ${craftN + Object.keys(preserved).length}`)
console.log(`  design systems:     ${ds.length}`)
console.log(`  html-ppt themes:    ${themes}`)
console.log(`  html-ppt templates: ${tpls}`)
console.log(`  html-ppt refs:      ${refs}`)
console.log(`  design-md files:    ${dmFiles}`)
console.log(`  game-ui files:      ${guiFiles}`)
console.log(`  total ref files:    ${countFiles(REF_ROOT)}`)
