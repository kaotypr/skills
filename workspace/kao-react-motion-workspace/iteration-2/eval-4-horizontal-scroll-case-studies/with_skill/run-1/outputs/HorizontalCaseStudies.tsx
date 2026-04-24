"use client"

import { useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface CaseStudy {
  id: string
  title: string
  client: string
  summary: string
  image: string
}

interface HorizontalCaseStudiesProps {
  caseStudies: CaseStudy[]
  /** Optional heading shown above the scroll track. */
  eyebrow?: string
  heading?: string
}

/**
 * HorizontalCaseStudies
 *
 * As the user scrolls vertically, a sticky viewport keeps 5 full-width cards
 * pinned while they translate horizontally. The section is taller than strictly
 * needed for a 1:1 scroll so the horizontal pace feels ~0.8× vertical — present
 * enough to notice, not so slow it feels stuck.
 *
 * Scroll math (for N = caseStudies.length):
 *   horizontal travel  = (N - 1) * 100vw
 *   sticky viewport    = 100vh
 *   extra scroll room  = PACE * (N - 1) * 100vh       // PACE > 1 → slower than 1:1
 *   section height     = 100vh + extra scroll room
 *
 * With N = 5 and PACE = 1.25 → section is 100vh + 500vh = 600vh, driving 400vw
 * of horizontal travel. Ratio ≈ 400/500 = 0.8 horizontal vw per vertical vh.
 */
const PACE = 1.25

export function HorizontalCaseStudies({
  caseStudies,
  eyebrow = "Case studies",
  heading = "Work we're proud of",
}: HorizontalCaseStudiesProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  // Smooth the raw scroll progress so the horizontal track doesn't feel jittery
  // on trackpads / momentum-scroll. Tight spring — follows input closely.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  })

  const count = caseStudies.length
  // End at -((count - 1) / count) * 100% so the last card lands flush with the
  // left edge of the sticky viewport.
  const endPercent = count > 1 ? -((count - 1) * 100) : 0
  const x = useTransform(
    smoothProgress,
    [0, 1],
    ["0%", `${endPercent}%`],
  )

  // Total section height: 100vh sticky stage + PACE * (count - 1) * 100vh of
  // extra scroll to drive the translate. Reduced-motion users get a short
  // section with no horizontal animation (cards stack vertically below).
  const extraScrollVh = PACE * Math.max(count - 1, 0) * 100
  const sectionHeight = `${100 + extraScrollVh}vh`

  if (prefersReducedMotion) {
    return (
      <section
        aria-labelledby="case-studies-heading"
        className="bg-background py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <Header eyebrow={eyebrow} heading={heading} />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {caseStudies.map((study) => (
              <li key={study.id}>
                <CaseStudyCard study={study} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="case-studies-heading"
      className="relative bg-background"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-8">
          <Header eyebrow={eyebrow} heading={heading} />
        </div>

        <div className="relative flex-1">
          <motion.ul
            style={{ x }}
            className="flex h-full will-change-transform"
          >
            {caseStudies.map((study, index) => (
              <li
                key={study.id}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}: ${study.title}`}
                className="flex h-full w-screen shrink-0 items-center justify-center px-6 md:px-12"
              >
                <CaseStudyCard study={study} />
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}

function Header({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
        {eyebrow}
      </p>
      <h2
        id="case-studies-heading"
        className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
      >
        {heading}
      </h2>
    </div>
  )
}

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <Card className="h-full max-h-[70vh] w-full max-w-5xl overflow-hidden border-border bg-card text-card-foreground shadow-xl">
      <div className="grid h-full md:grid-cols-[1.1fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted md:aspect-auto md:h-full">
          <img
            src={study.image}
            alt=""
            loading="lazy"
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex h-full flex-col justify-between gap-8 p-8 md:p-12">
          <CardHeader className="gap-3 p-0">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {study.client}
            </p>
            <CardTitle className="text-balance text-2xl font-semibold leading-tight text-foreground md:text-3xl">
              {study.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <CardDescription className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {study.summary}
            </CardDescription>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}

export default HorizontalCaseStudies
