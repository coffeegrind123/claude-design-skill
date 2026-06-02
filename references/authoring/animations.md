# Animations & video-style HTML artifacts

For timeline-driven animation (sprite scenes, scrubber, play/pause),
read `references/skills/video-hyperframes.md` and the `frame-*.md`
recipes (`frame-glitch-title`, `frame-light-leak-cinema`,
`frame-liquid-bg-hero`, `frame-logo-outro`, …) for the
keyframe/transport pattern; for programmatic React-driven motion or
exported video, see `references/skills/remotion.md`; for
library-grade choreography (timelines, ScrollTrigger, easing,
`interpolate()`) see the `gsap-*.md` family (`gsap-core`,
`gsap-timeline`, `gsap-scrolltrigger`, `gsap-utils`, …). For interactive
prototypes, plain CSS transitions or React state are sufficient — don't
reach for a heavier animation library unless those genuinely can't cover it.

**Resist the urge to add a TITLE screen** to actual HTML pages.
Centered/responsively-sized within the viewport beats a chrome-eating
splash.
