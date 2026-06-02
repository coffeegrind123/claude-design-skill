# Proprietary → Claude Code native tool mapping

The Claude Design master prompt references a proprietary tool layer that does
not exist here. Translate every such call to the host's native tools:

| What Claude Design calls it | What you actually use |
|---|---|
| `read_file` / `list_files` / `grep` | `Read` / `Glob` / `Grep` |
| `write_file` / `str_replace_edit` / `copy_files` / `delete_file` | `Write` / `Edit` / `Bash(cp:*, mv:*, rm:*)` |
| `view_image` | `Read` (passes images natively to multimodal models) |
| `web_search` / `web_fetch` | `WebSearch` / `WebFetch` |
| `done` / `show_to_user` | Tell the user the file path and let them open it. |
| `save_screenshot` / `multi_screenshot` / `eval_js_user_view` | None native. Spawn `google-chrome --headless=new --screenshot=...` via `Bash` — **but `--window-size` lies about the viewport, so render compensated and crop with PIL.** Full pipeline + diagnostic overlay in `references/craft/headless-rendering.md`. Playwright / Puppeteer work too if installed. Last-resort fallback: ask the user to paste a screenshot. |
| `gen_pptx` / `super_inline_html` / `open_for_print` | None native. Output PPTX via `python-pptx` / `pptxgenjs` through `Bash`; emit self-contained HTML by inlining your assets at write time; tell the user to print to PDF from their browser. |
| `fork_verifier_agent` | Spawn a `Task` subagent for an independent review pass. |
| `invoke_skill` | Read the relevant `references/skills/<name>.md` from this skill's directory. |
| `update_todos` | `TodoWrite`. |
| `questions_v2` | `AskUserQuestion` (1–4 structured options per question). |
