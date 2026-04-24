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
