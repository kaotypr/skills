import { useEffect } from "react"
import { animate, motion, useMotionValue, useTransform } from "motion/react"

type AnimatedCounterProps = {
  /** The number to count up to. Whenever this changes, the counter re-ticks from 0. */
  target: number
  /** Animation duration in seconds. Defaults to ~1s. */
  duration?: number
  /** Optional className forwarded to the rendered <motion.span>. */
  className?: string
}

/**
 * AnimatedCounter — ticks an integer from 0 up to `target` over ~1 second
 * whenever `target` changes. Integers only (value is rounded on every frame).
 *
 * Built on Motion's free primitives (useMotionValue + useTransform + animate),
 * so it doesn't depend on Motion+ / AnimateNumber.
 */
export function AnimatedCounter({
  target,
  duration = 1,
  className,
}: AnimatedCounterProps) {
  // Hold the animating number outside React's render cycle — no per-frame re-renders.
  const count = useMotionValue(0)
  // Derived motion value: the rounded integer. Rendered as the child of a motion element.
  const rounded = useTransform(() => Math.round(count.get()))

  useEffect(() => {
    // Reset to 0 on every target change so the counter always ticks up from 0,
    // whether `target` increased or decreased.
    count.set(0)
    const controls = animate(count, target, {
      duration,
      ease: [0.22, 1, 0.36, 1], // easeOutExpo-ish — fast start, gentle settle
    })
    return () => controls.stop()
    // `count` is a stable MotionValue ref; only re-run when target/duration change.

  }, [target, duration])

  return <motion.span className={className}>{rounded}</motion.span>
}

export default AnimatedCounter
