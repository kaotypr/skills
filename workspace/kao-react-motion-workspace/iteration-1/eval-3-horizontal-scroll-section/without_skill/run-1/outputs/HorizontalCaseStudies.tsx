import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { caseStudies } from "./caseStudies"; // assumes the array is defined elsewhere

type CaseStudy = {
  id: string | number;
  title: string;
  client?: string;
  description?: string;
  image?: string;
  tags?: string[];
};

type HorizontalCaseStudiesProps = {
  /**
   * Multiplier applied to the section height to slow the horizontal scroll.
   * 1 = 1:1 scroll feel. Values > 1 make the user spend more vertical scroll
   * per unit of horizontal travel (i.e. "slower").
   * Default: 1.5
   */
  slowness?: number;
};

export default function HorizontalCaseStudies({
  slowness = 1.5,
}: HorizontalCaseStudiesProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Track scroll progress across the entire tall section. When the top of the
  // section hits the top of the viewport, progress = 0. When the bottom of the
  // section hits the bottom of the viewport, progress = 1.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 5 cards, each 100vw wide → total inner width is 500vw.
  // We need to translate the inner track from 0 to -(total - 100vw) = -400vw.
  // Doing this in percentages (relative to the track itself) is cleaner:
  //   track is 500% wide, we move it by -80% of its own width to reveal the last card.
  const rawX = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  // Smooth the motion so the horizontal translation feels less "sticky" to the
  // raw scroll position. Tune stiffness/damping to taste.
  const x: MotionValue<string> = useSpring(rawX, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  const count = caseStudies.length; // expected to be 5, but we don't hard-code it

  return (
    // The outer section is taller than the viewport. The `slowness` multiplier
    // stretches it so the user scrolls more vertical pixels per horizontal pixel,
    // giving the slower-than-1:1 feel requested.
    //
    // Height formula: one viewport of "entrance" + (count - 1) viewports of travel,
    // all multiplied by slowness. For 5 cards + slowness 1.5 → 750vh.
    <section
      ref={sectionRef}
      style={{ height: `${count * 100 * slowness}vh` }}
      className="relative w-full bg-neutral-950 text-white"
      aria-label="Case studies"
    >
      {/* Sticky viewport-sized stage that pins while the parent scrolls past it */}
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        <motion.ul
          style={{ x, width: `${count * 100}vw` }}
          className="flex h-full list-none p-0 m-0 will-change-transform"
        >
          {(caseStudies as CaseStudy[]).map((cs, i) => (
            <li
              key={cs.id ?? i}
              className="relative h-full w-screen shrink-0"
            >
              <Card study={cs} index={i} total={count} progress={scrollYProgress} />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

type CardProps = {
  study: CaseStudy;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

function Card({ study, index, total, progress }: CardProps) {
  // Each card's "active window" in the overall scroll progress.
  // For 5 cards, card i is most prominent around progress = i / (total - 1).
  const center = total > 1 ? index / (total - 1) : 0.5;
  const span = 1 / Math.max(total - 1, 1);

  // Subtle parallax + fade around the card's active window. Optional but gives
  // the section life as it scrubs across.
  const opacity = useTransform(
    progress,
    [center - span, center, center + span],
    [0.5, 1, 0.5],
  );
  const scale = useTransform(
    progress,
    [center - span, center, center + span],
    [0.94, 1, 0.94],
  );

  return (
    <motion.article
      style={{ opacity, scale }}
      className="flex h-full w-full flex-col justify-end p-12 md:p-20"
    >
      {study.image && (
        <img
          src={study.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover -z-10 opacity-60"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {study.client && (
        <p className="text-sm uppercase tracking-[0.2em] text-white/70">
          {study.client}
        </p>
      )}
      <h3 className="mt-2 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
        {study.title}
      </h3>
      {study.description && (
        <p className="mt-4 max-w-xl text-base text-white/80 md:text-lg">
          {study.description}
        </p>
      )}
      {study.tags && study.tags.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {study.tags.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80"
            >
              {t}
            </li>
          ))}
        </ul>
      )}

      <span className="mt-8 text-xs text-white/50">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </motion.article>
  );
}
