---
name: card-twitter
zh_name: "Twitter 分享卡"
en_name: "Twitter Share Card"
emoji: "🐦"
description: "Twitter quote or data card designed to pair with a post."
zh_description: "推特金句 / 数据卡, 适合配推文"
en_description: "Twitter quote or data card designed to pair with a post."
category: card
scenario: marketing
aspect_hint: "1600×900 (16:9)"
tags: ["twitter", "x", "quote", "金句"]
example_id: sample-twitter-quote
example_name: "推特卡 · 金句"
example_format: text
example_tagline: "16:9 暗色金句卡, 截图直接配推文"
example_desc: "高对比金句模板, 含 grid 网格 + 渐变光晕背景"
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  upstream: "https://github.com/nexu-io/html-anything"
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: "Use the Twitter Share Card template to turn my content into a Twitter quote or data card designed to pair with a post. Preserve the template's visual signature, use real content and data, and avoid lorem ipsum or placeholder images."
  example_prompt_i18n:
    zh-CN: "用「Twitter 分享卡」模板把我的内容做成一份「推特金句 / 数据卡, 适合配推文」。保持模板的视觉签名，使用真实内容和数据，避免 lorem ipsum 和占位图片。"
---

【模板: Twitter 分享卡】
- 容器 `w-[1600px] h-[900px]`, 暗色 / 亮色二选一根据内容情绪。
- 中央一句 hero 金句 (text-6xl, font-semibold, 限 2-3 行)。
- 下方作者署名 + 头像占位 + handle。
- 左上角小标签 (类型: "Insight" / "Data" / "Quote")。
- 右下角品牌水印。
- 整张卡片有微妙的纹理 (grid 网格 / noise / dot pattern)。
- 截图后可直接配推文发出, 视觉简洁有力。

## Universal OG image (1200×630)

When the card also has to serve as the link's **Open Graph image**
(`og:image`) — not just an inline Twitter/X attachment — render it at
**1200 × 630 (1.91:1)**. That single size is the one that survives every
platform: Facebook, Twitter/X `summary_large_image`, LinkedIn, Discord,
and Slack. 一张 1200×630 通吃所有平台的 OG 预览图。

- **Reuse your widest banner, don't author a new layout.** The 1.91:1 OG
  aspect is closest to a 16:9 banner card. If you already have a `wide`
  banner variant, give the OG element **both classes** (`card wide og`)
  so it inherits every banner rule, and override **only** the canvas
  size — keeping it *the same design, OG-sized* rather than a divergent
  composition that overflows and clips the footer/crest:
  ```css
  /* defined AFTER .card.wide so equal-specificity dimensions win */
  .card.og{ width:1200px; height:630px }
  ```
- **One source → many canvases.** Drive each format from one HTML file
  via a URL-hash export switch (`#og`, `#wide`, …): the hash adds an
  `export` class + `data-fmt`, which shows only that card and sizes
  `body` to its exact pixels. A no-hash gallery can also show scaled
  **thumbnail** minis for legibility checks.
- **Keep critical content inside the safe center ~80%** — platform crops
  trim the edges of OG previews.
- **Render then crop — `--window-size` lies.** Chromium headless paints
  ~87px short of the requested height, so render at `1200×717` and crop
  to `1200×630`. Full pipeline + diagnostics in
  `references/craft/headless-rendering.md`:
  ```bash
  google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --virtual-time-budget=6000 --window-size=1200,717 \
    --screenshot=/tmp/raw_og.png "file://$(realpath card.html | sed 's/ /%20/g')#og"
  python3 -c "from PIL import Image; Image.open('/tmp/raw_og.png').crop((0,0,1200,630)).save('og.png')"
  ```
