# AnimatedCounter

Here is a reusable component that restarts from `0` and ticks up to `target` over 1 second every time `target` changes (up or down). It only uses `motion` — no extra dependencies.

```tsx
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
```

### Usage

```tsx
<AnimatedCounter target={1234} />
<AnimatedCounter target={value} className="text-4xl font-bold tabular-nums" />
```

Tip: add the Tailwind class `tabular-nums` (or CSS `font-variant-numeric: tabular-nums`) so digits don't jitter horizontally as they change width.

### How it works

1. `useMotionValue(0)` holds the animated scalar outside of React state, so each frame doesn't cause a re-render.
2. `useTransform` derives a display string by flooring the live value — that enforces the "integers only" requirement without cutting the animation short.
3. The `useEffect` runs whenever `target` changes. It calls `count.set(0)` to force a restart from zero (covering the "even if it decreases" case) and then kicks off `animate(count, target, { duration: 1, ease: "easeOut" })`.
4. The cleanup calls `controls.stop()` so if `target` changes mid-animation, the previous tween is cancelled and a fresh one starts.
5. The JSX renders `<motion.span>{rounded}</motion.span>`. Passing a `MotionValue` as a child lets motion update the DOM text node directly — smooth 60fps updates with zero React reconciliation per frame.

## About `AnimateNumber`

You're thinking of `<AnimateNumber>`, which is a component shipped by **NumberFlow / number-flow** (and a similarly-named component that shows up in some community snippets / Motion-Plus examples). It is **not** part of the core `motion` / `framer-motion` package, so using it would add a new dependency — which you said you don't want.

For your constraints (motion-only, integers, restart-on-change including decreases, ~1s), the custom component above is the right tool. It's ~30 lines, uses only primitives that already ship with `motion` (`animate`, `useMotionValue`, `useTransform`, `motion.span`), and gives you exact control over the "always start from 0" behavior — which a black-box `AnimateNumber` component typically does *not* do (most of them tween from the previous value to the new one).

If you ever relax the dependency constraint and want features like locale-aware formatting, decimal support, or digit-by-digit slot animations, `number-flow` is worth a look — but for this spec, stay with the component above.
