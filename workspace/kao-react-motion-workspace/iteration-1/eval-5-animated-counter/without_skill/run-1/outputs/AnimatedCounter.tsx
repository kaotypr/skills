import { useEffect } from "react";
import { animate, useMotionValue, useTransform, motion } from "motion/react";

type AnimatedCounterProps = {
  /** The target number to count toward. Changing this re-triggers the animation. */
  target: number;
  /** Animation duration in seconds. Defaults to 1s. */
  duration?: number;
  /** Optional className for styling the output span. */
  className?: string;
};

/**
 * AnimatedCounter
 *
 * Ticks a number from 0 up to `target` over ~1 second whenever `target` changes.
 * Always restarts from 0 — even when `target` decreases — per spec.
 * Integer-only display (decimals are floored away).
 *
 * Uses `motion`'s imperative `animate()` driving a `MotionValue`, with
 * `useTransform` to floor the value for display. This avoids per-frame React
 * re-renders: the DOM text is updated directly by motion.
 */
export function AnimatedCounter({
  target,
  duration = 1,
  className,
}: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toString());

  useEffect(() => {
    // Reset to 0 and animate up to the new target, regardless of direction.
    count.set(0);
    const controls = animate(count, target, {
      duration,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [target, duration, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

export default AnimatedCounter;
