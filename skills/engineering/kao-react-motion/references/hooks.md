# Motion hooks — full reference

All hooks import from `motion/react`. Use `motion/react-mini` for `useAnimate` in a slimmer bundle.

## Motion-value constructors

### `useMotionValue(initial)`
Creates a `MotionValue<T>`. Doesn't trigger re-renders when updated.
```ts
const x = useMotionValue(0)
x.set(100)
x.get()          // 100
x.getVelocity()  // 0 for strings/colors
x.jump(0)        // reset without animating
x.isAnimating()
x.stop()
x.on("change" | "animationStart" | "animationCancel" | "animationComplete", cb)
```

### `useTransform`
Two forms:
```ts
// Function form — subscribes to any motion value read via .get() inside
const doubled = useTransform(() => x.get() * 2)

// Input/output form
const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])
const colour = useTransform(x, [0, 100], ["#f00", "#00f"])
```
Options: `{ clamp, ease, mixer }`.
- `clamp: false` — extrapolate beyond the range (e.g. `[0,100] → [0,360]` keeps rotating past 100).
- `ease` — JS easing function (from `motion`), e.g. `circOut`, or `cubicBezier(...)`.
- `mixer` — custom interpolator (e.g. Flubber for SVG path morphing).

Multi-output named maps:
```ts
const { opacity, scale } = useTransform(offset, [100, 600], {
  opacity: [1, 0.4],
  scale: [1, 0.6],
})
```

### `useSpring(source, options?)`
Creates a motion value that animates to its target with a spring.
```ts
const smooth = useSpring(0, { stiffness: 300, damping: 30 })
smooth.set(100)      // springs to 100
smooth.jump(0)       // skip to 0 without spring

const sourced = useSpring(scrollYProgress, { stiffness: 100, damping: 30, skipInitialAnimation: true })
```
`skipInitialAnimation: true` is helpful when the source is measured on mount and you don't want a big spring from 0.

### `useVelocity(value)`
```ts
const xVelocity = useVelocity(x)
const acceleration = useVelocity(xVelocity)  // chainable
```

### `useTime()`
Milliseconds since the hook was first called. Great for perpetual animations:
```ts
const time = useTime()
const rotate = useTransform(time, [0, 4000], [0, 360], { clamp: false })
```

### `useMotionTemplate`
Tagged template for composing motion values into a CSS string:
```ts
const filter = useMotionTemplate`blur(${blur}px) saturate(${saturation}%)`
```

### `useMotionValueEvent(value, event, callback)`
Subscribe to a motion value for the lifetime of the component:
```ts
useMotionValueEvent(scrollY, "change", latest => console.log(latest))
```
Events: `"change"`, `"animationStart"`, `"animationComplete"`, `"animationCancel"`.

## Scroll hooks

### `useScroll(options?)`
Returns `{ scrollX, scrollY, scrollXProgress, scrollYProgress }` as motion values.
```ts
const { scrollYProgress } = useScroll({
  container: scrollableRef,             // default: window
  target: targetRef,                    // track target within container
  offset: ["start end", "end start"],   // intersections
  axis: "y",                            // "x" | "y"
  trackContentSize: false,              // true if content size changes dynamically
})
```
Offset notation: `"<target-point> <container-point>"`. Points: `"start"`, `"center"`, `"end"`, `"0"–"1"`, `"Npx"`, `"N%"`, `"Nvh"`, `"Nvw"`.
- `["start end", "end start"]` — from "target top hits container bottom" to "target bottom hits container top".
- `["start start", "end end"]` — default full-scroll progress.

### `useInView(ref, options?)`
Returns a React boolean (re-renders).
```ts
const ref = useRef(null)
const isInView = useInView(ref, { root, margin, once: true, initial: false, amount: "some" })
```

### `usePageInView()`
`true` when the page/tab is active (`document.visibilityState === "visible"`). Use to pause RAF loops / video when tab is hidden.
```ts
const active = usePageInView()
useAnimationFrame(active ? update : undefined)
```

## Animation control

### `useAnimate()`
Imperative control scoped to the returned `ref`.
```ts
const [scope, animate] = useAnimate()

useEffect(() => {
  const controls = animate([
    [scope.current, { opacity: 1 }, { duration: 0.3 }],
    ["li", { y: 0, opacity: 1 }, { delay: stagger(0.05) }],
  ])
  controls.speed = 0.8
  return () => controls.stop()
}, [])

return <ul ref={scope}>{…}</ul>
```
- `animate(target, values, options)` — target is `scope.current`, a selector string (scoped to `scope`), an array of DOM elements, or a MotionValue.
- Returns playback controls: `.play()`, `.pause()`, `.stop()`, `.cancel()`, `.speed`, `.time`, `.duration`, `.then()`.
- Auto-cleans up when the component unmounts.

### `useAnimationFrame(callback)`
Runs `callback(time, delta)` every animation frame. `time` and `delta` in milliseconds.
```ts
useAnimationFrame((time) => {
  ref.current.style.transform = `rotateY(${time / 10}deg)`
})
```
Pass `undefined` to pause the loop.

## Drag

### `useDragControls()`
```ts
const controls = useDragControls()

// Start from somewhere else:
<div onPointerDown={(e) => controls.start(e, { snapToCursor: true, distanceThreshold: 10 })} />
<motion.div drag dragListener={false} dragControls={controls} />

controls.stop()
controls.cancel()
```

## Presence (inside AnimatePresence)

### `useIsPresent()`
Boolean — whether the component is mounted (vs. exiting).

### `usePresence()`
`[isPresent, safeToRemove]` — imperative control when to remove the DOM node.
```ts
const [isPresent, safeToRemove] = usePresence()
useEffect(() => { !isPresent && setTimeout(safeToRemove, 1000) }, [isPresent])
```

### `usePresenceData()`
Inside an exiting component, read the latest `custom` prop set on the enclosing `<AnimatePresence>`.

## Accessibility

### `useReducedMotion()`
Reactive boolean. `true` if the user prefers reduced motion.
```ts
const reduce = useReducedMotion()
const closedX = reduce ? 0 : "-100%"
```
Typical uses: suppress large translations, swap for opacity fades, disable background video autoplay, disable parallax.
