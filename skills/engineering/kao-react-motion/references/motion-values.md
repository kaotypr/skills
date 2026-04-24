# Motion values — the signal primitive

A `MotionValue<T>` holds animated state outside React's render cycle. Motion components read it and update the DOM directly — **no re-renders**. Reach for it when:

- You need per-frame updates (scroll, pointer, time) to drive styles.
- Two components must share the same animated value.
- You want to compose (map, smooth, invert, combine).
- You need velocity.
- You want to render a number into HTML text without churning React.

```tsx
const x = useMotionValue(0)
return <motion.div style={{ x }} />
```

## The API

```ts
const x = useMotionValue(0)
x.set(100)            // synchronous update, DOM follows on next frame
x.get()               // current value
x.getVelocity()       // units/sec; 0 for strings/colors
x.getPrevious()       // value on previous frame
x.jump(0)             // reset without animation, clears any attached spring / effect, zeros velocity
x.isAnimating()
x.stop()              // stop whatever animation is driving it
x.on("change" | "animationStart" | "animationComplete" | "animationCancel", cb)
x.destroy()           // only needed if you made it via the vanilla motionValue() outside React
```

A MotionValue can hold any string or number.

## Passing to motion components

Via `style` for standard styles + transform shorthands:
```tsx
<motion.div style={{ x, rotate, opacity }} />
```

Via the attribute prop for SVG attributes:
```tsx
<motion.circle cx={cx} />
```

As children, to render value into text:
```tsx
const count = useMotionValue(0)
<motion.pre>{count}</motion.pre>
```
This bypasses React re-renders — great for counters or high-frequency numeric displays.

## Composition hooks

All documented in detail in `hooks.md`:

| Hook | Purpose |
|---|---|
| `useMotionValue(init)` | Create |
| `useTransform(mv, input, output)` / `useTransform(() => …)` | Map |
| `useSpring(source, opts)` | Smooth with spring |
| `useVelocity(mv)` | Derive velocity |
| `useTime()` | Ticks every frame since creation |
| `useMotionTemplate\`…${mv}…\`` | Compose into CSS string |
| `useMotionValueEvent(mv, event, cb)` | Subscribe |

## Events

`on(...)` returns an unsubscribe function. Inside a component, use `useMotionValueEvent` so cleanup is automatic. If you call `on` in a `useEffect` directly, return the unsubscribe.

```ts
useMotionValueEvent(x, "change", latest => console.log(latest))

// Or manually:
useEffect(() => {
  const unsub = x.on("change", doSomething)
  return unsub
}, [x])
```

## Patterns

### State → style without re-renders
```tsx
const x = useMotionValue(0)
useEffect(() => { const t = setTimeout(() => x.set(100), 1000); return () => clearTimeout(t) }, [])
return <motion.div style={{ x }} />
```

### Drag → derive opacity
```tsx
const x = useMotionValue(0)
const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])
return <motion.div drag="x" style={{ x, opacity }} />
```

### Spring-smooth a scroll progress
```tsx
const { scrollYProgress } = useScroll()
const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30, skipInitialAnimation: true })
return <motion.div style={{ scaleX: smooth, originX: 0 }} />
```

### Animated counter (no Motion+ needed)
```tsx
import { animate, motion, useMotionValue, useTransform } from "motion/react"

function Counter({ to }: { to: number }) {
  const n = useMotionValue(0)
  const rounded = useTransform(() => Math.round(n.get()))
  useEffect(() => {
    const controls = animate(n, to, { duration: 1, ease: "easeOut" })
    return () => controls.stop()
  }, [to])
  return <motion.span>{rounded}</motion.span>
}
```

### Velocity → scale (dragged item squashes faster it moves)
```tsx
const x = useMotionValue(0)
const v = useVelocity(x)
const scale = useTransform(v, [-3000, 0, 3000], [0.7, 1, 0.7], { clamp: false })
return <motion.div drag="x" style={{ x, scale }} />
```

### Compose into a CSS string
```tsx
const blur = useMotionValue(10)
const filter = useMotionTemplate`blur(${blur}px) saturate(150%)`
return <motion.div style={{ filter }} />
```

### Paint-free drift on mount
```tsx
const time = useTime()
const rotate = useTransform(time, [0, 4000], [0, 360], { clamp: false })
return <motion.div style={{ rotate }} />
```

## When NOT to use

If a value is only read during render or changes at React-state frequency (a handful of updates per interaction), plain `useState` + `animate` on the motion component is simpler. Reach for motion values when React re-renders would be expensive or when you need cross-component sharing / composition.
