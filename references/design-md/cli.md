# design.md CLI

The `npx @google/design.md` CLI (bins: `design.md`, `designmd`) validates and
transforms DESIGN.md files. Source: github.com/google-labs-code/design.md.
No install needed — `npx` fetches it. All commands emit agent-friendly JSON.

## Commands

```bash
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
```

## When to use in this skill

- `lint` a DESIGN.md you (or the user) authored before generating UI from it —
  catches broken `{token}` references and AA/AAA contrast failures early.
- `export ... --format css-tailwind` to turn a DESIGN.md into ready-to-paste
  Tailwind v4 `@theme` CSS for the artifact's `<style>`.
- `diff` two revisions when iterating a design system to confirm no regressions.
- See `spec.md` for the full format and `examples/` for canonical DESIGN.md +
  design_tokens.json + tailwind.config.js triples.
