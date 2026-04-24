"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  summary: string;
  image: string;
}

export interface HorizontalCaseStudiesProps {
  caseStudies: CaseStudy[];
  /**
   * Controls how long the user spends in the section.
   * A value of 1 = exactly enough scroll distance to pan all cards (feels 1:1).
   * A value > 1 slows the horizontal travel relative to vertical scroll.
   * Default 1.4 → slightly slower than 1:1 without feeling stuck.
   */
  scrollRatio?: number;
  className?: string;
  eyebrow?: string;
  heading?: string;
}

/**
 * HorizontalCaseStudies
 *
 * A vertically-scrolled section that translates a row of full-viewport-width
 * case-study cards horizontally as the user scrolls. The outer wrapper is
 * `scrollRatio * 100vh` tall per card so the pinned inner panel has enough
 * scroll distance to pan through every card.
 *
 * Motion:
 * - useScroll tracks progress of the outer wrapper through the viewport.
 * - useTransform maps that 0 → 1 progress to an x-translate across N-1 cards.
 * - useSpring smooths the motion so fast scroll wheels / trackpads don't jitter.
 *
 * Accessibility:
 * - Section is focusable and labelled.
 * - Respects prefers-reduced-motion by falling back to a natural horizontal
 *   scroll (native overflow-x) when motion is reduced.
 */
export function HorizontalCaseStudies({
  caseStudies,
  scrollRatio = 1.4,
  className,
  eyebrow = "Case studies",
  heading = "Work we're proud of",
}: HorizontalCaseStudiesProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const count = caseStudies.length;

  // Track the section's progression through the viewport.
  // "start start" → when the top of the section hits the top of the viewport
  // "end end"     → when the bottom of the section hits the bottom of the viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth the raw scroll progress.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.35,
  });

  // We translate the track by (count - 1) * 100vw so the last card lands
  // fully in view at progress = 1. If there's only one card, no translation.
  const maxTranslatePct = count > 1 ? -(count - 1) * 100 : 0;
  const x = useTransform(smoothProgress, [0, 1], [`0vw`, `${maxTranslatePct}vw`]);

  // Outer wrapper height. More height = slower horizontal feel per card.
  // For N cards, we need ~ N * scrollRatio viewports of vertical scroll.
  // (First viewport pins the panel; subsequent viewports pan cards.)
  const wrapperHeight = `${Math.max(1, count) * scrollRatio * 100}vh`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="case-studies-heading"
      className={cn("relative w-full bg-background text-foreground", className)}
      style={{ height: wrapperHeight }}
    >
      {/* Sticky viewport — the "camera" that stays fixed while cards slide. */}
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        <header className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 pt-16 pb-8 md:pt-24">
          <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </span>
          <h2
            id="case-studies-heading"
            className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          >
            {heading}
          </h2>
        </header>

        {/* Reduced-motion fallback: native horizontal scroll */}
        <div className="relative flex-1 motion-reduce:overflow-x-auto motion-reduce:overflow-y-hidden">
          <motion.ul
            // When reduced motion is on, we don't apply the x transform.
            style={{ x }}
            className={cn(
              "flex h-full list-none",
              "motion-reduce:!transform-none motion-reduce:snap-x motion-reduce:snap-mandatory"
            )}
          >
            {caseStudies.map((cs, i) => (
              <li
                key={cs.id}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${cs.title}`}
                className="flex h-full w-screen shrink-0 items-center justify-center px-6 motion-reduce:snap-center md:px-12"
              >
                <Card className="flex h-[70vh] w-full max-w-6xl overflow-hidden border-border/60 bg-card text-card-foreground shadow-xl md:flex-row">
                  {/* Media */}
                  <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-auto md:w-1/2">
                    <img
                      src={cs.image}
                      alt=""
                      loading={i === 0 ? "eager" : "lazy"}
                      className="h-full w-full object-cover"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"
                    />
                  </div>

                  {/* Copy */}
                  <div className="flex w-full flex-col md:w-1/2">
                    <CardHeader className="gap-2 p-8 md:p-10">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        {cs.client}
                      </p>
                      <CardTitle className="text-2xl font-semibold leading-tight md:text-4xl">
                        {cs.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-6 p-8 pt-0 md:p-10 md:pt-0">
                      <CardDescription className="text-base leading-relaxed text-muted-foreground md:text-lg">
                        {cs.summary}
                      </CardDescription>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border text-xs font-medium text-foreground">
                          {i + 1}
                        </span>
                        <span>
                          {i + 1} / {count}
                        </span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Progress indicator */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto flex w-full max-w-7xl items-center gap-2 px-6">
          <ProgressBar progress={smoothProgress} />
        </div>
      </div>
    </section>
  );
}

function ProgressBar({
  progress,
}: {
  progress: ReturnType<typeof useSpring>;
}) {
  const width = useTransform(progress, [0, 1], ["0%", "100%"]);
  return (
    <div className="h-[2px] w-full overflow-hidden rounded-full bg-border/60">
      <motion.div
        style={{ width }}
        className="h-full rounded-full bg-foreground"
      />
    </div>
  );
}

export default HorizontalCaseStudies;
