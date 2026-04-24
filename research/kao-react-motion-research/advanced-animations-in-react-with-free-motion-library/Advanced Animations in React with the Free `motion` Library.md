# Advanced Animations in React with the Free `motion` Library — A Conceptual Overview

Motion (formerly Framer Motion, imported from `motion/react` on npm) is the default animation toolkit for modern React sites. Its free, MIT‑licensed core covers nearly every "advanced animation" pattern you see on award‑winning sites today — scroll‑linked parallax, shared‑element transitions, split‑text reveals, drag‑to‑reorder, gesture micro‑interactions, SVG line drawing, marquees, scroll progress, and layout morphs.

The paid **Motion+** tier mostly sells *packaged components* (Carousel, Ticker, splitText, Typewriter, AnimateNumber, Cursor, AnimateView, animateLayout) and premium examples/tutorials. The same effects are achievable with the free APIs — you just write the composition yourself.

This document maps the popular advanced animations onto the free Motion toolkit, explains conceptually how each is built, and calls out the genuine limitations.

---

## 1. What's in the free `motion` package

The free library is a hybrid engine: it uses the browser's Web Animations API and `ScrollTimeline` for hardware‑accelerated playback where possible, and falls back to JavaScript for what browsers can't do natively (spring physics, interruptible keyframes, gesture tracking).

### Free components

- **`motion.*` components** — a drop‑in `motion.div`, `motion.button`, `motion.path`, `motion.circle`, etc. for every HTML/SVG element, with animation props (`animate`, `initial`, `exit`, `whileHover`, `whileTap`, `whileFocus`, `whileDrag`, `whileInView`, `variants`, `layout`, `layoutId`, `drag`, `transition`).
- **`AnimatePresence`** — keeps elements in the DOM until their `exit` animation finishes. Supports `sync`, `wait`, and `popLayout` modes, plus a `propagate` prop so nested presences can cascade exits.
- **`LayoutGroup`** — namespaces `layoutId`s and groups components that affect each other's layout so measurements stay batched.
- **`Reorder.Group` / `Reorder.Item`** — pre‑built drag‑to‑reorder list with spring physics and automatic layout animation on neighbours.
- **`LazyMotion` + `m`** — code‑split version that can reduce bundle to around 6 kb for the initial synchronous render, then sync- or async-load a subset of features (`domAnimation` or `domMax`).
- **`motion.create()`** — wraps any custom React component so it becomes a motion component.

### Free hooks

`useAnimate`, `useScroll`, `useTransform`, `useSpring`, `useMotionValue`, `useMotionValueEvent`, `useMotionTemplate`, `useInView`, `useAnimationFrame`, `useTime`, `useVelocity`, `useDragControls`, `useReducedMotion`.

Of note:
- **`useMotionTemplate`** is the string-template sibling of `useTransform` — e.g. for composing `` `blur(${px}px) hue-rotate(${deg}deg)` `` from multiple motion values.
- **`useDragControls`** lets you start a drag from a separate handle element.
- **`useReducedMotion`** returns the user's `prefers-reduced-motion` preference for accessible fallbacks.

### Free top-level functions

`animate()` and `scroll()` are imperative APIs you can use outside React components (including on non-DOM values like Three.js object rotations).

### Motion values

A `MotionValue` is a signal‑like animated value that bypasses React's render cycle and writes directly to the DOM on each frame. You can `set`, `get`, read `getVelocity`, subscribe via `.on()`, and chain values with `useTransform`/`useSpring`/`useMotionTemplate` without triggering re-renders.

Three important tricks the free tier gives you:

- **Passing a MotionValue as a child of a motion component renders its latest value directly as text** — so `<motion.span>{count}</motion.span>` makes an animated counter with no React re-renders.
- **CSS variable animation** — `animate={{ "--my-var": "100px" }}` is a first-class feature, very useful for coordinating multiple CSS-driven children from one parent animation.
- **Wildcard keyframes** — `animate={{ x: [0, 100, null, 0] }}` where `null` means "hold the previous value," useful for making interruptible keyframe sequences.

### What's behind the Motion+ paywall (explicitly excluded)

Imported from `motion-plus/…`, these are **not** available in the free package:

- **Carousel** — infinite scrolling carousel component
- **Ticker** — marquee component
- **splitText** — text splitting helper (char/word/line)
- **Typewriter** — typewriter effect component
- **AnimateNumber** — animated number counter component
- **Cursor** — custom / magnetic cursor component
- **AnimateView** — wrapper around the browser View Transitions API
- **animateLayout** — imperative layout animation function

Everything below sticks to free APIs.

---

## 2. Scroll animations

Motion splits scroll into two patterns:

- **Scroll‑triggered** — a normal animation fires when an element enters/exits the viewport. Use `whileInView` (with an optional `viewport={{ once, margin, amount, root }}`) or the `useInView` hook for state.
- **Scroll‑linked** — animation values are driven directly by scroll position. Use `useScroll`, which returns four motion values: `scrollX`, `scrollY`, `scrollXProgress`, `scrollYProgress`. When possible the browser's `ScrollTimeline` handles it, so animations run on the GPU.

### Scroll-triggered reveals / fade-ins / stagger on scroll
`<motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} />`. Combine with `variants` + `staggerChildren` on a parent to get a staggered cascade as a list enters view.

### Parallax
Get `scrollYProgress` from `useScroll({ target: ref })`, map it with `useTransform(scrollYProgress, [0, 1], [-300, 300])`, and bind the result to a `motion.div`'s `y`. For smoothness, pipe it through `useSpring`.

### Scroll progress indicator
`<motion.div style={{ scaleX: scrollYProgress, originX: 0 }} />` — the simplest progress bar. Wrap in `useSpring` for eased motion.

### Sticky / pinned scroll sections with animated content
Tall outer container (e.g. `height: 300vh`), put a `position: sticky` element inside it, track the outer element with `useScroll({ target })`, then drive child animations (translate, opacity, scale, clip-path, colour) with `useTransform`. This is the canonical "storytelling pin" pattern.

### Horizontal scroll sections
Same recipe — tall outer container, inner sticky row, and `useTransform(scrollYProgress, [0, 1], ["0%", "-100%"])` fed to a horizontal flex container's `x`.

### Scroll‑velocity effects (skew/warp on fast scroll)
`const v = useVelocity(scrollY)` returns velocity in px/s; pipe it through `useSpring` and `useTransform` into `skew`, `scale`, or `x`. `useAnimationFrame` handles the per‑frame update and direction wrapping in "infinite velocity marquees."

### Scroll direction detection (hide/reveal sticky header)
Subscribe to `scrollY` via `useMotionValueEvent` and compare to `scrollY.getPrevious()` to flip a state flag that drives a header variant.

### Scroll‑driven clip‑path / filter reveals
`useTransform` can return string values — `clip-path: inset(...)` or `["blur(10px)", "blur(0px)"]` — giving scroll‑driven masks and filters without extra libraries.

### Scroll‑linked SVG path drawing
Feed `useTransform(scrollYProgress, [0, 1], [0, 1])` into the `pathLength` of a `motion.path` for the popular "drawing as you scroll" effect.

---

## 3. Layout animations and shared element transitions (FLIP)

Motion's layout engine detects layout changes (size, position, reorder, grid change, `justify-content` flip, width‑to‑`auto`, etc.) on a React commit and animates via `transform`, correcting for scale distortion so slow properties become GPU-accelerated transforms. It performs scale correction infinitely deep on children and on `borderRadius` and `boxShadow`.

### Single-element layout animation (expanding cards, auto-height accordions, morphing layouts)
Add the `layout` prop: `<motion.div layout />`. Any render that changes its size/position is automatically tweened. `layoutDependency` throttles measurement to only when a specific value changes. `layoutAnchor` customises the relative-positioning anchor (where `x` and `y` are 0–1 progress values).

For auto-height accordions: change the CSS that controls height (show/hide content, or swap `height` class), add `layout`, and the engine animates the size change via transform. You don't animate `height: "auto"` directly — you let the layout engine observe the size change.

### Magic-move / shared element transitions
Give two elements the same `layoutId`. When one unmounts and the other mounts, Motion animates size + position between them — "app-like" hero→detail transitions, tab underlines that glide, modals that expand from a card.

### Grouping
`LayoutGroup` namespaces `layoutId`s so multiple independent tab rows don't cross‑animate, and groups sibling components that need to re‑measure together (e.g. accordions within a list).

### List reorder and drag-to-reorder
`Reorder.Group values={items} onReorder={setItems}` plus `Reorder.Item key value`. Items perform layout animations on neighbours during drag. Pair with `AnimatePresence mode="popLayout"` for smooth insertion/removal of list items.

### Motion vs the native View Transitions API
The Motion docs explicitly compare the two: layout animations are measurably more performant (transform-based vs screenshot width/height), interruptible, support multiple elements with the same id, handle scroll deltas correctly, and can run concurrently with other animations, while View Transitions are simpler for whole-page swaps.

---

## 4. Page / route transitions

### Pattern A — `AnimatePresence` with a keyed page wrapper (recommended free path)
Wrap your layout in `<AnimatePresence mode="wait">` and give the top-level `motion.div` a key tied to the route (e.g. `key={pathname}`) so the exiting route animates out before the new one enters. This is the mature pattern for both Next.js Pages Router and React Router.

In Next.js App Router, `template.tsx` acts as the re-rendering boundary (server components in `layout.tsx` won't re-mount). Put a client-component `AnimatePresence` wrapper inside `template.tsx`. There are still rough edges in App Router — scroll restoration, streaming, and nested layouts all complicate things — so sample any implementation carefully.

### Pattern B — shared element route transitions via `layoutId`
For a thumbnail → detail-view "handoff," give the thumbnail and detail hero the same `layoutId` inside a shared client boundary. More flexible and performant than View Transitions: no screenshots, no scroll artefacts, supports multiple matching ids, and is interruptible.

*(Note: Motion does not currently ship a free wrapper around the View Transitions API. `AnimateView` is a Motion+ Early Access component. If you want the native browser View Transitions API on free Motion, you wire up `document.startViewTransition()` and `::view-transition-*` CSS pseudo-elements yourself; Motion won't help with that pattern.)*

---

## 5. Gestures

`motion` components expose five declarative gesture props:

- **`whileHover`** — real mouse events only (not touch-emulated); pairs with `onHoverStart`/`onHoverEnd`.
- **`whileTap`** — press gesture; filters secondary pointers, automatically keyboard-accessible.
- **`whileFocus`** — keyboard focus styles.
- **`whileDrag`** — styles active during `drag`.
- **`whileInView`** — covered above.

Plus imperative events: `onPan` / `onPanStart` / `onPanEnd` with `info.delta`, `info.offset`, `info.velocity`; the `drag` prop (`true`, `"x"`, `"y"`) with `dragConstraints`, `dragElastic`, `dragMomentum`, `dragTransition`, `dragDirectionLock`, `dragSnapToOrigin`; and `useDragControls` to start dragging from a separate handle.

Gestures accept `propagate` to stop event bubbling, and can target either values or named variants, so a hover state cascades through children.

### Common gesture patterns
- **Card stack / swipe cards** — `drag="x"` + `dragConstraints`, `onDragEnd` checks `info.offset.x` / `info.velocity.x` to animate off-screen or snap back via `useAnimate`.
- **Drag with inertia / momentum** — `transition: { type: "inertia" }` or drag defaults; `useVelocity` reads post-release velocity.
- **Spring-driven hover/press** — `whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}`.

---

## 6. Spring physics, inertia and orchestration

Motion's default transition for physical properties (`x`, `y`, `scale`, `rotate`) is a spring; visual ones (`opacity`, `color`) default to tween. Springs are configured with `stiffness`/`damping`/`mass`, or more intuitively with `visualDuration` + `bounce`. You can also pick `type: "tween" | "spring" | "inertia"`, custom cubic-beziers, or JS easing functions per value.

Motion animates every transform axis independently: `x`, `y`, `z`, `scale`, `scaleX`, `scaleY`, `rotate`, `rotateX`, `rotateY`, `rotateZ`, `skew`, `skewX`, `skewY`, `transformPerspective`, and `originX`/`originY`/`originZ`. This is what makes 3D tilt cards trivial.

**Orchestration** happens through variants. A parent defines named states (e.g. `hidden`/`visible`); children inherit them. Parent transition fields `staggerChildren`, `delayChildren`, `staggerDirection`, and `when: "beforeChildren" | "afterChildren"` give precise choreography. Variants can be functions receiving a `custom` prop for per-index timing.

For imperative control, `useAnimate()` returns a scope + `animate()` to run sequences (including timeline-like stagger selectors scoped to the component).

---

## 7. Text animations (without paid `splitText` / `Typewriter`)

### Word / letter / line reveal (split text)
Split the string in JSX, wrap each piece in a `motion.span`, and use variants with `staggerChildren` on the parent. Add an `sr-only` full string and `aria-hidden` on the split spans for accessibility.

Caveat: splitting by *visual line* (responsive to width) is genuinely hard without a helper — you need to measure rendered width and re-split on resize, or rely on CSS `line-clamp` approximations. This is what the Motion+ `splitText` component solves.

### Typewriter effect
Pass an array of increasing substrings to `animate` as keyframes, or animate a `useMotionValue(0)` from 0 → full length and slice the string in a `useMotionValueEvent` subscription.

### Text scramble
Drive a `useTime` or `useAnimationFrame` loop; on each frame swap unrevealed characters for random ones until a per‑index threshold is reached.

### Marquee / infinite ticker
Render two copies of the row side by side inside an `overflow: hidden` container. Animate `x` from `0` to `-50%` (or `-width`) with `transition={{ repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" }}`. This is the free replacement for Motion+ `Ticker`. For scroll-velocity-reactive marquees, combine `useScroll` + `useVelocity` + `useSpring` + wrap-around in `useAnimationFrame`.

### Animated number counters (replacing Motion+ `AnimateNumber`)
The free recipe is first-party in the docs:

```
const count = useMotionValue(0);
useEffect(() => {
  const controls = animate(count, 100, { duration: 5 });
  return () => controls.stop();
}, []);
return <motion.pre>{count}</motion.pre>;
```

The motion component updates the text node directly on each frame — no React re-renders. For formatted numbers (currency, locale), subscribe with `useMotionValueEvent` and write `Intl.NumberFormat` output to `textContent`. Requires a current version of Motion; older Framer Motion 6/7 had a TypeScript/runtime issue with this pattern that's long since fixed.

What you lose vs the paid `AnimateNumber`: per-digit rolling/odometer animations and built-in locale formatting.

---

## 8. SVG animation

Motion has first-class SVG support:

- **Line drawing** — `pathLength`, `pathSpacing`, `pathOffset` are 0–1 progress values that animate the visible portion of any `path`, `circle`, `ellipse`, `line`, `polygon`, `polyline`, or `rect`. Perfect for hand-drawn reveals, progress rings, and signature-style animations.
- **Path morphing** — animate the `d` attribute between two paths with the same number/type of instructions. For dissimilar shapes, pair with a third-party mixer like Flubber.
- **Animated icons** — wrap the icon's `path` in `motion.path`, attach `variants` keyed to hover/active on the parent.
- **Motion along a path** — pair `pathLength` drawing with CSS `offset-path` + `offset-distance`, or animate the offset values directly.
- **`motion.circle`, `motion.rect`, etc.** accept motion values on native SVG attributes (`cx`, `cy`, `r`). For SVG components, the `x`/`y` props map to attributes — use `attrX`/`attrY` if you want them as attributes not transforms.

Note: SVG components aren't supported by the layout engine (SVGs don't have layout systems); animate their attributes directly.

---

## 9. Effects you can replicate for free from Motion+

| Motion+ feature | Free replacement |
|---|---|
| **AnimateNumber** | `useMotionValue` + `animate(mv, target)` + `<motion.span>{mv}</motion.span>`; format via `useMotionValueEvent` + `Intl.NumberFormat`. |
| **Ticker** | Duplicate row; `<motion.div animate={{ x: "-50%" }} transition={{ repeat: Infinity, duration, ease: "linear" }}>`. Drive by scroll with `useScroll`/`useVelocity` for responsive speed. |
| **Cursor** (custom / magnetic) | Track pointer with `pointermove` listener + two `useMotionValue`s (x, y); pipe through `useSpring` for lag. Magnetic: compute pointer-to-element distance in a ref and lerp a per‑element motion value. Morphing shape: apply `layoutId` to the cursor element. |
| **splitText** | Split string in JSX into `motion.span`s for words/chars; use variants with `staggerChildren` + accessible `sr-only` wrapper. |
| **Typewriter** | Animate `useMotionValue(0)` to `text.length`; slice the string in `useMotionValueEvent`. Or keyframe substrings. |
| **Carousel** | `motion.div` with `drag="x"` + `dragConstraints`; `onDragEnd` reads `info.offset.x` / `info.velocity.x` to snap to the nearest index via `useAnimate` or controlled `x` animations. Pair with `AnimatePresence` + `custom` direction for slide transitions. |
| **AnimateView** (View Transitions wrapper) | Use the browser's `document.startViewTransition()` + `::view-transition-*` CSS directly — no Motion helper. For interruptible shared elements, prefer `layoutId` instead. |

---

## 10. Other commonly-seen patterns — all free

- **Modal/overlay transitions with backdrop blur** — `AnimatePresence` around a conditionally-rendered `motion.div` animating `opacity` + `backdropFilter: blur(…)`; add `layoutId` to expand from a triggering card.
- **Accordions / auto-height collapse** — `layout` prop on a container whose content changes; let the layout engine handle the height animation. `AnimatePresence` handles the inner content's exit.
- **Staggered grids on mount** — parent with `variants` + `staggerChildren`; each cell a `motion.div` that inherits the variant.
- **Card stack / swipe** — `drag="x"` + `dragConstraints`; at drag-end throw off-screen with `animate(x, 500)` above a threshold.
- **Hover-triggered image reveal / image trail** — track pointer with `useMotionValue` + `useSpring`; spawn N images, each listening to a delayed version of the cursor motion value.
- **Masked reveal / clip-path animations** — animate `clipPath` strings either on state change or driven by `useTransform(scrollYProgress, …)`.
- **Keyframe sequences** — pass arrays to `animate={{ x: [0, 100, 50, 200] }}` with `times`, per-segment `ease`, `repeat`/`repeatType`, and `null` wildcard keyframes.
- **Loading spinners / skeletons** — `animate={{ rotate: 360 }}` with `transition={{ repeat: Infinity, ease: "linear" }}`; shimmer via an animated `backgroundPosition`.
- **3D transforms / perspective** — independent `rotateX`, `rotateY`, `rotateZ`, `transformPerspective` make tilt-on-hover cards trivial.
- **Animated gradient backgrounds / blobs** — animate CSS variables, `backgroundPosition`, or `filter: blur()` + `borderRadius` keyframes.
- **Progress indicators** — `scrollYProgress` → `scaleX` (covered).
- **Viewport triggers for state** — `useInView(ref, { once, margin })` flips React state for side effects, lazy loads, video play, etc.

---

## 11. Genuine limitations of the free tier

Most "limitations" are ergonomic (you write more code) rather than functional. Genuine gaps:

1. **Responsive line-splitting for text.** Character/word splitting is a JSX one-liner; splitting by *visual line* requires resize observation and re-splitting, which is what Motion+ `splitText` handles.
2. **Polished per-digit number ticker UI.** Free motion values animate a number cleanly; an odometer with rolling digits, CSS classes per digit, and locale formatting is Motion+ `AnimateNumber`.
3. **Production-grade infinite carousel.** DIY works but edge cases (snap thresholds, a11y, infinite loop without stutter, pixel-perfect swipe inertia) are where Motion+ `Carousel` saves time.
4. **Magnetic cursor engine with target morphing.** The paid `Cursor` uses an internal `useMagneticPull` + layout animations to snap/morph onto any hovered target. A free version works but requires per-target event wiring.
5. **View Transitions API wrapper.** Motion's free tier has no helper; you fall back to the browser API and CSS pseudo-elements, or use `layoutId` for shared elements instead.
6. **`animateLayout` imperative function** for vanilla JS/non-React layout animations is Motion+ only. In React the declarative `layout` prop covers this territory.
7. **Path morphing between radically different shapes.** Motion interpolates `d` when paths have matching command structure; dissimilar shapes require Flubber or similar.
8. **Next.js App Router route transitions** still have rough edges. The mature pattern is `AnimatePresence` inside a client `template.tsx` or `layoutId` within a client boundary.
9. **Bundle size considerations.** Tree-shakable, and `LazyMotion` + `m` can shrink the initial bundle to around 6 kb, but enabling all features (layout, drag, gestures, animations) pushes higher than a purely CSS approach.
10. **No smooth-scroll engine.** For Lenis/GSAP‑style page-wide smooth scroll you still need a third-party library; Motion composes with it rather than replacing it.
11. **Layout animations don't apply to SVG elements.** SVGs have no layout system; animate their attributes directly.

---

## 12. Capabilities matrix — quick reference

| Industry term | Free? | Free primitives |
|---|---|---|
| Scroll-linked parallax | ✅ | `useScroll` + `useTransform` (+ `useSpring`) |
| Scroll progress bar | ✅ | `useScroll` → `scaleX` |
| Scroll reveals / fade-ins | ✅ | `whileInView` / `useInView` |
| Staggered entry on scroll | ✅ | variants + `staggerChildren` + `whileInView` |
| Sticky / pinned sections | ✅ | CSS `position: sticky` + `useScroll({ target })` |
| Horizontal scroll sections | ✅ | tall container + `useTransform` → `x` |
| Scroll-velocity skew/warp | ✅ | `useVelocity` + `useSpring` + `useTransform` |
| Scroll-driven clip-path / mask reveal | ✅ | `useTransform` → string clipPath |
| Page transitions (fade/slide) | ✅ | `AnimatePresence mode="wait"` + keyed motion.div |
| Shared element (magic move) | ✅ | `layoutId` + `LayoutGroup` |
| Layout animations (FLIP) | ✅ | `layout` prop |
| Auto-height accordion | ✅ | `layout` prop + CSS state change + `AnimatePresence` for inner content |
| List reorder animations | ✅ | `Reorder.Group` / `Reorder.Item` + `popLayout` |
| Drag-to-reorder | ✅ | `Reorder` (built-in) |
| Drag with inertia | ✅ | `drag` + `dragMomentum` + `type: "inertia"` |
| Spring physics | ✅ | default transition for transforms; `useSpring` |
| Hover / tap / focus / press / inView gestures | ✅ | `whileHover` / `whileTap` / `whileFocus` / `whileDrag` / `whileInView` |
| Pan / swipe cards | ✅ | `onPan*` + `drag` + velocity-aware exit |
| Split-text word/char reveal | ✅ (manual) | `motion.span` per chunk + variants |
| Typewriter / scramble text | ✅ (DIY) | `useMotionValue` + `useMotionValueEvent` or keyframes |
| Infinite marquee / ticker | ✅ (DIY) | duplicated row + `animate x` + `repeat: Infinity` |
| Animated number counter | ✅ (DIY) | `useMotionValue` + `animate()` + motion text node |
| Magnetic button / custom cursor | ✅ (DIY) | pointer listener → `useMotionValue` → `useSpring` |
| SVG line drawing | ✅ | `pathLength` / `pathSpacing` / `pathOffset` |
| SVG path morph | ✅ (similar shapes) | animate `d`; Flubber for dissimilar |
| Animated icons | ✅ | `motion.path` + variants from parent |
| Masked / clip-path reveals | ✅ | animate `clipPath` strings |
| 3D transforms / tilt cards | ✅ | independent `rotateX/Y/Z` + `transformPerspective` |
| Modal + backdrop blur | ✅ | `AnimatePresence` + animate `backdropFilter` |
| Loading spinners / skeletons | ✅ | `repeat: Infinity` animations |
| Gradient / blob backgrounds | ✅ | animate CSS vars / `borderRadius` keyframes |
| Orchestrated keyframe sequences | ✅ | array keyframes + `times` + per-segment `ease` + `useAnimate` |
| CSS variable animation | ✅ | `animate={{ "--my-var": "…" }}` |
| Non-DOM value animation (Three.js etc.) | ✅ | top-level `animate()` function |
| Browser View Transitions wrapper | ⚠ DIY | no Motion helper — use `document.startViewTransition` + CSS pseudo-elements; prefer `layoutId` for shared elements |
| Responsive **line-by-line** text split | ⚠ hard | DIY measurement or use Motion+ `splitText` |
| Polished digit-ticker counter | ⚠ hard | DIY per-digit CSS vs Motion+ `AnimateNumber` |
| Production-grade infinite carousel | ⚠ hard | DIY vs Motion+ `Carousel` |
| Fully magnetic + target-morphing cursor | ⚠ hard | DIY per-target vs Motion+ `Cursor` |
| Vanilla-JS imperative layout animation | ❌ paid | Motion+ `animateLayout` only; in React the free `layout` prop covers this |

---

## 13. Takeaway

For today's award-winning visual vocabulary — scroll-linked storytelling, pinned sections, hero→detail magic moves, drag-reorderable lists, split-text reveals, SVG line drawing, marquees, magnetic hovers, animated counters, 3D tilt cards, polished page transitions — the free Motion library covers essentially every effect. Motion+ monetises *ready-made components* (Carousel, Ticker, splitText, Typewriter, AnimateNumber, Cursor, AnimateView, animateLayout) and curated examples/editor tools, not core capabilities.

Rule of thumb: reach for Motion+ when you want to ship a finished component in minutes. Stay on free Motion when you're comfortable composing `motion`, `AnimatePresence`, `LayoutGroup`, `Reorder`, and the motion-value hooks yourself — which for most advanced sites is exactly what the code looks like anyway.

Primary references: [Motion docs home](https://motion.dev/docs), [React Quick Start](https://motion.dev/docs/react-quick-start), [React Animation](https://motion.dev/docs/react-animation), [Scroll Animations](https://motion.dev/docs/react-scroll-animations), [useScroll](https://motion.dev/docs/react-use-scroll), [useVelocity](https://motion.dev/docs/react-use-velocity), [Layout Animations](https://motion.dev/docs/react-layout-animations), [LayoutGroup](https://motion.dev/docs/react-layout-group), [AnimatePresence](https://motion.dev/docs/react-animate-presence), [Reorder](https://motion.dev/docs/react-reorder), [Gestures](https://motion.dev/docs/react-gestures), [SVG Animation](https://motion.dev/docs/react-svg-animation), [Motion component](https://motion.dev/docs/react-motion-component), [Motion Values](https://motion.dev/docs/react-motion-value), [useTransform](https://motion.dev/docs/react-use-transform), [LazyMotion](https://motion.dev/docs/react-lazy-motion), [Reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size), and [plus.motion.dev](https://plus.motion.dev/) for the list of paid components.