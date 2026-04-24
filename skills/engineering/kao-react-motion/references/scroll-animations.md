# Scroll animations — triggered and linked

Two kinds:
- **Scroll-triggered**: fires when an element enters/leaves a viewport. Use `whileInView` or `useInView`.
- **Scroll-linked**: value is a continuous function of scroll position. Use `useScroll` + `useTransform`/`useSpring`.

Motion runs scroll-linked animations on the browser's `ScrollTimeline` (GPU) when the animated output is `opacity`, `transform`, `clipPath`, or `filter`. Keep outputs on those for best performance.

## Scroll-triggered

### `whileInView`

```tsx
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true, margin: "0px 0px -100px 0px", amount: 0.3 }}
/>
```

Viewport options:
- `once: true` — don't animate again after first entry.
- `root: ref` — track against a custom scroll container.
- `margin: "Tpx Rpx Bpx Lpx"` — grow/shrink the detection box.
- `amount: "some" | "all" | 0–1` — how much of the element must be in view.

### `useInView(ref, options)`

For any element (not just motion components) when you need React state:

```tsx
const ref = useRef(null)
const isInView = useInView(ref, { once: true })
useEffect(() => { if (isInView) fetchAnalytics() }, [isInView])
```

## Scroll-linked

### `useScroll`

```tsx
const { scrollX, scrollY, scrollXProgress, scrollYProgress } = useScroll({
  container,        // ref of scrollable element (default: window)
  target,           // ref whose progress through container we track
  offset: ["start end", "end start"],  // intersections (see below)
  axis: "y",
  trackContentSize: false,
})
```

Offsets — `"<target> <container>"` pairs. Accepted values:
- Names: `"start"`, `"center"`, `"end"` (== 0, 0.5, 1).
- Numbers: `"0"` to `"1"` (outside range also allowed).
- Pixels: `"100px"`, `"-50px"`.
- Percent: `"50%"`.
- Viewport: `"10vh"`, `"50vw"`.

Common offsets:
- `["start end", "end start"]` — full traversal (enters bottom, exits top).
- `["start start", "end end"]` — progress while element fills viewport.
- `["start end", "start start"]` — fades in on entry, 100% once top reaches top.

### Progress bar

```tsx
const { scrollYProgress } = useScroll()
<motion.div style={{ scaleX: scrollYProgress, originX: 0, position: "fixed", top: 0, left: 0, right: 0, height: 4 }} />
```

### Smoothed progress — ONLY for progress indicators, NOT for scrub-linked translation

`useSpring` on a scroll-linked motion value introduces lag — the spring has to catch up to the scroll, so the output trails the user's input by a few frames. That's fine (and looks nice) for **progress-indicator-style outputs** where the exact value doesn't matter moment-to-moment: a top-of-page reading bar, a small fill that the user isn't scrubbing.

```tsx
// OK — progress bar, user isn't scrubbing it
const { scrollYProgress } = useScroll()
const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 30, skipInitialAnimation: true })
<motion.div style={{ scaleX: smooth }} />
```

It is **wrong** for scrub-linked translation — horizontal-scroll sections, parallax y, scroll-zoom heroes — anywhere the user is effectively using scroll as a scrubber. The spring lag decouples the visual motion from the scroll wheel / trackpad input and feels broken:

```tsx
// BAD — horizontal scroll section; user scrubs, spring lags behind
const { scrollYProgress } = useScroll({ target: ref, offset: [...] })
const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })  // ← don't
const x = useTransform(smooth, [0, 1], ["0%", "-80%"])
<motion.div style={{ x }} />

// GOOD — scrub-linked: pipe scrollYProgress straight through useTransform
const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"])
<motion.div style={{ x }} />
```

Rule of thumb:
- **Output crosses a threshold** (progress bar, indicator, badge reveal) → `useSpring` is fine.
- **Output is continuous scrubbed visual state** (horizontal translate, parallax, zoom, rotation, mask) → pipe straight through `useTransform`. Use the browser's ScrollTimeline (GPU) for the smoothest result, which Motion does automatically when the output is `opacity`, `transform`, `clipPath`, or `filter`.

### Scroll direction

```tsx
const { scrollY } = useScroll()
const [dir, setDir] = useState<"up" | "down">("down")
useMotionValueEvent(scrollY, "change", current => {
  const diff = current - scrollY.getPrevious()
  setDir(diff > 0 ? "down" : "up")
})
```

### Parallax

Move layers at different rates relative to scroll.

```tsx
const { scrollY } = useScroll()
const fg = useTransform(scrollY, [0, 1000], [0, -200])  // moves faster
const bg = useTransform(scrollY, [0, 1000], [0, -50])   // moves slower
<motion.div style={{ y: fg }}>…foreground…</motion.div>
<motion.div style={{ y: bg }}>…background…</motion.div>
```

Multi-output named map:
```tsx
const { fg, bg } = useTransform(scrollY, [0, 1], {
  fg: [0, 2],
  bg: [0, 0.5],
}, { clamp: false })
```

### Image reveal

```tsx
const ref = useRef(null)
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
const clipPath = useTransform(scrollYProgress, [0, 1], ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"])

<motion.div ref={ref} style={{ clipPath }}>
  <img src={src} />
</motion.div>
```

### Horizontal scroll section

Wrap wide flex inside a sticky container inside a tall container:

```tsx
const ref = useRef(null)
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"])

<div ref={ref} style={{ height: "300vh" }}>
  <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
    <motion.div style={{ x, display: "flex", gap: 20 }}>
      {items.map(i => <section key={i.id} style={{ flexShrink: 0, width: 400 }}>{i.content}</section>)}
    </motion.div>
  </div>
</div>
```

The taller the outer container, the slower it feels.

### Scroll-zoom hero

```tsx
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3])
const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0])
```

### Scroll-hide header

```tsx
const { scrollY } = useScroll()
const [hidden, setHidden] = useState(false)
useMotionValueEvent(scrollY, "change", current => {
  const diff = current - scrollY.getPrevious()
  setHidden(diff > 0 && current > 100)
})

<motion.header animate={hidden ? "hidden" : "visible"} variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }} />
```

## Custom scroll container

```tsx
const containerRef = useRef(null)
const { scrollYProgress } = useScroll({ container: containerRef })

<div ref={containerRef} style={{ height: 400, overflow: "scroll" }}>
  …
</div>
```

For `useInView` under a custom container, pass the same ref via `root`.

## `trackContentSize`

Enable when the scrollable content's size changes after mount (e.g. lazy-loaded images, content expansion). Small overhead — leave off by default.
