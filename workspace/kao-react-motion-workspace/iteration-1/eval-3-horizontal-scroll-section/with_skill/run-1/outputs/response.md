# Horizontal-scrolling case studies section

This is the idiomatic Motion recipe for a vertical-drives-horizontal section: a tall outer container defines the scroll distance, a `position: sticky` child pins to the viewport, and a wide flex track inside gets translated on `x` by scroll progress coming from `useScroll({ target, offset: ["start start", "end end"] })`.

Key decisions:

- **Import path** — `motion/react`, not `framer-motion`.
- **Scroll-linked, not scroll-triggered** — the user wanted the inner content to translate _as they scroll_, which is the `useScroll` + `useTransform` pattern, not `whileInView`.
- **Pacing** — 5 cards × 100vw = 500vw of track. We translate from `0%` to `-80%` of the track (i.e. `-(N-1)/N * 100%` — a nice general formula that keeps the last card flush with the right edge). The outer container is `600vh` tall, so while the sticky child is pinned the user scrolls `500vh` vertically to cover `400vw` horizontally. That ratio (~0.8 vertical-to-horizontal) is the "a bit slower than 1:1" feel the user asked for. Bumping `OUTER_HEIGHT_VH` slows it further; lowering it speeds it up.
- **Performance** — output property is `x` (a transform shorthand), so Motion runs this on the browser's ScrollTimeline on the compositor when supported. No layout thrash.
- **No spring smoothing** — with `useScroll` driving `x` through `useTransform` directly, the translate tracks the user's scroll 1:1 through the mapped range. I deliberately did not wrap it in `useSpring`: scroll-linked horizontal galleries feel broken with spring lag because users expect a direct mapping to their input. If you want the rubbery feel, wrap `scrollYProgress` in `useSpring({ stiffness: 100, damping: 30 })` before passing to `useTransform`.
- **Reduced motion** — `useReducedMotion()` branch falls back to a plain vertical stack of full-height cards, per the skill's reduced-motion guideline for motion > a few pixels.
- **Stable keys** — `study.id` on each card.
- **Percentages, not px** — the transform is in `%` of the track's own width, so the component is resolution-independent and doesn't need `window.innerWidth` measurement.
- **`flex: 0 0 100vw`** on each slide — prevents shrinking and guarantees each card is exactly one viewport wide regardless of flex container gymnastics.

Drop it in where your case studies live:

```tsx
<HorizontalCaseStudies caseStudies={caseStudies} />
```

## Component

```tsx
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

export type CaseStudy = {
  id: string
  title: string
  client?: string
  summary?: string
  image?: string
}

type Props = {
  caseStudies: CaseStudy[]
}

/**
 * Horizontal-scrolling case studies section.
 *
 * Structure (this is the idiomatic Motion recipe):
 *   - An outer tall container defines the scroll distance.
 *   - A sticky 100vh child pins to the viewport while the outer scrolls past.
 *   - A wide flex track inside the sticky child is translated on x,
 *     driven by the outer container's scroll progress via useScroll.
 *
 * Pacing
 *   - 5 cards, each 100vw, so the track is 500vw wide.
 *   - We translate x from 0 to -(N-1) * 100vw = -400vw to reveal every card.
 *   - The outer is 600vh tall. While sticky is active the user scrolls
 *     (600vh - 100vh) = 500vh vertically to cover 400vw horizontally.
 *     That's a ~0.8 vertical:horizontal ratio — slightly slower than 1:1,
 *     so the section "holds" the viewport for longer without feeling stuck.
 *     Raise OUTER_HEIGHT_VH to slow it down further, lower it to speed up.
 *
 * Accessibility
 *   - Respects prefers-reduced-motion: the track collapses to a native
 *     vertical list and no scroll-linked transform runs.
 */
export function HorizontalCaseStudies({ caseStudies }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Progress is 0 when the container's top meets the viewport's top,
  // and 1 when the container's bottom meets the viewport's bottom.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Translate the track from 0% to -(N-1)/N * 100% of its own width.
  // For 5 cards that's -80% of the track (== -400vw, since track is 500vw).
  const total = caseStudies.length
  const endPercent = total > 1 ? -((total - 1) / total) * 100 : 0
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `${endPercent}%`])

  if (prefersReducedMotion) {
    return (
      <section aria-label="Case studies">
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {caseStudies.map((study) => (
            <li key={study.id} style={{ minHeight: "100vh" }}>
              <CaseStudyCard study={study} />
            </li>
          ))}
        </ul>
      </section>
    )
  }

  // Outer container height. 100vh is the sticky viewport; the remaining
  // (OUTER_HEIGHT_VH - 100)vh of scroll is what drives the x translation.
  const OUTER_HEIGHT_VH = 600

  return (
    <section
      ref={containerRef}
      aria-label="Case studies"
      style={{ position: "relative", height: `${OUTER_HEIGHT_VH}vh` }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <motion.ol
          style={{
            x,
            display: "flex",
            height: "100%",
            width: `${total * 100}vw`,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {caseStudies.map((study) => (
            <li
              key={study.id}
              style={{
                flex: "0 0 100vw",
                width: "100vw",
                height: "100%",
              }}
            >
              <CaseStudyCard study={study} />
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "clamp(1.5rem, 5vw, 5rem)",
        boxSizing: "border-box",
        background: study.image ? `url(${study.image}) center / cover` : "#111",
        color: "white",
      }}
    >
      {study.client ? (
        <p style={{ opacity: 0.7, margin: 0 }}>{study.client}</p>
      ) : null}
      <h2 style={{ fontSize: "clamp(2rem, 6vw, 5rem)", margin: "0.5rem 0" }}>
        {study.title}
      </h2>
      {study.summary ? (
        <p style={{ maxWidth: "60ch", textAlign: "center" }}>{study.summary}</p>
      ) : null}
    </article>
  )
}
```

## Notes on extensions

- **Parallax inside each card.** Create a per-card `useScroll({ target: cardRef, offset: ["start end", "end start"] })` and map to a small `y` or `scale` for a background image — keeps the horizontal motion primary.
- **Progress indicator.** Reuse `scrollYProgress` directly as `scaleX` on a `motion.div` with `originX: 0` at the top of the sticky frame.
- **Snap.** Add `scrollSnapType: "y mandatory"` on the body and `scrollSnapAlign: "start"` on the outer `<section>` if you want the section to snap into place before the horizontal scroll begins. Do _not_ use CSS scroll-snap on the inner flex track — it will fight the transform.
