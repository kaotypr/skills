# AnimatedCounter

A reusable component that ticks an integer from `0` up to `target` over ~1 second whenever `target` changes (including when it decreases — it always restarts from 0). No extra dependencies: everything comes from `motion/react`.

```tsx
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
```

### Usage

```tsx
<AnimatedCounter target={revenue} />
<AnimatedCounter target={1284} duration={1.2} className="text-4xl font-bold tabular-nums" />
```

Tip: add `tabular-nums` (Tailwind) or `font-variant-numeric: tabular-nums` in CSS so the digits don't jitter horizontally as they change width.

### How it works

- `useMotionValue(0)` holds the animating number *outside* React's render cycle, so every frame doesn't trigger a re-render.
- `useTransform(() => Math.round(count.get()))` derives the rounded integer.
- Rendering a `MotionValue` as the child of a `motion.span` (`<motion.span>{rounded}</motion.span>`) is Motion's built-in way to animate text content without a per-frame `setState`.
- The `useEffect` resets `count` to `0` and calls `animate(count, target, { duration })` whenever `target` changes. The cleanup stops the in-flight tween if the target changes mid-animation, so you never get two animations racing.

### Respecting reduced motion (optional polish)

If you want to honour `prefers-reduced-motion`, wrap the top of your app in `<MotionConfig reducedMotion="user">`, or short-circuit inside the component:

```tsx
import { useReducedMotion } from "motion/react"
// ...
const shouldReduce = useReducedMotion()
useEffect(() => {
  if (shouldReduce) {
    count.set(target)
    return
  }
  count.set(0)
  const controls = animate(count, target, { duration, ease: [0.22, 1, 0.36, 1] })
  return () => controls.stop()
}, [target, duration, shouldReduce])
```

---

## Is `AnimateNumber` the right tool?

Short answer: **no, not for this project.**

`<AnimateNumber>` is a component from **Motion+**, which is the paid tier of Motion (alongside `<Cursor>`, `<Ticker>`, and Motion Studio). It's not part of the `motion` npm package you already have — using it would require a paid Motion+ license, which goes against your "no new dependencies" constraint.

The good news is that ticking-number is exactly the kind of effect Motion's free primitives are designed for. The `AnimatedCounter` above uses only `animate`, `useMotionValue`, `useTransform`, and `<motion.span>` — all included in the free `motion` package — and gets you the same result in about 15 lines.

So: skip `AnimateNumber`, ship the component above.
