# The complete guide to Motion

**Motion is the dominant JavaScript animation library for React, Vue, and vanilla JS, with over 30 million monthly npm downloads and 30,000+ GitHub stars.** Created by Matt Perry and spun off from Framer in November 2024, it combines a declarative React API with a hybrid engine that fuses the Web Animations API's GPU acceleration with JavaScript's flexibility — delivering spring physics, layout transitions, gesture recognition, and scroll-linked effects through a single coherent API. This guide covers everything from installation to advanced patterns, drawn primarily from the official documentation at motion.dev.

---

## From Popmotion to Framer Motion to Motion

Matt Perry began writing animation libraries in 2014 with "Redshift," quickly renamed Popmotion. Framer acquired Popmotion around 2018, and Perry spent six years building **Framer Motion** — the React animation layer powering all Framer websites. By 2021, Perry also released Motion One, a tiny vanilla JS library built on the Web Animations API.

The pivotal merger happened in **version 11.11.12**, which unified Framer Motion and Motion One into a single package, adopting Framer Motion's API conventions (given its 20× larger user base). On **November 12, 2024**, Perry announced his departure from Framer and the library's independence. The package was renamed from `framer-motion` to `motion`, the website moved to **motion.dev**, and the GitHub organization became `motiondivision/motion`. Framer gave its blessing and became Motion's first sponsor; Tailwind became the second.

As of March 2026, Motion is at **version 12.38.0** with multiple releases per week. It ships three first-class packages: `motion` for React and vanilla JavaScript, and `motion-v` for Vue. The `framer-motion` npm package still works for backward compatibility, but all new development uses the `motion` package.

### Installation and import paths

```bash
# React / JavaScript
npm install motion

# Vue
npm install motion-v
```

The key import paths are:

| Context | Import |
|---|---|
| React (standard) | `import { motion } from "motion/react"` |
| React Server Components | `import * as motion from "motion/react-client"` |
| React slim `m` component | `import * as m from "motion/react-m"` |
| React mini (2.3kb) | `import { useAnimate } from "motion/react-mini"` |
| Vanilla JS hybrid (~18kb) | `import { animate } from "motion"` |
| Vanilla JS mini (~2.5kb) | `import { animate } from "motion/mini"` |
| Vue | `import { motion } from "motion-v"` |
| CDN | `import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm"` |

### The hybrid engine architecture

Motion's key differentiator is its **hybrid engine**. The primary path runs animations natively via the **Web Animations API** and **ScrollTimeline** for 120fps GPU-accelerated performance — the same pipeline CSS uses. When native APIs can't handle a feature (spring physics, interruptible keyframes, gesture tracking, independent transforms), Motion seamlessly falls back to JavaScript. Physical properties like `x`, `scale`, and `rotate` default to **spring** transitions; visual properties like `opacity` default to **tween** easing. This dual approach delivers both performance and flexibility without requiring developers to think about the underlying mechanism.

---

## The motion component and basic animations

The `<motion />` component is the foundation of Motion for React. Every HTML and SVG element has a corresponding motion component — `motion.div`, `motion.button`, `motion.circle`, `motion.path`, and so on. They behave identically to their native counterparts but gain animation props like `animate`, `whileHover`, and `exit`. Crucially, **motion components bypass React's render cycle** — animated values update via the browser's native animation pipeline, so animations never cause React re-renders.

```jsx
import { motion } from "motion/react"

<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 300 }}
/>
```

The **`initial`** prop sets the starting visual state before animation begins. Setting `initial={false}` skips the enter animation entirely and renders directly in the `animate` state — useful for SSR where you want the server output to match the animated state. The **`animate`** prop defines the target; Motion detects changes and transitions between them automatically. The **`exit`** prop defines the animation played when a component unmounts (requires `AnimatePresence` as a parent).

### What Motion can animate

Motion handles an unusually broad range of values: any CSS property (including `filter`, `clip-path`, `box-shadow`), colors in any format (hex, rgba, hsla, oklch — freely interpolated between formats), CSS variables, `display: "none"/"block"`, and complex strings like gradients. It can animate between unit types (`"100%"` → `"calc(100vw - 50%)"`) and to/from `"auto"` for `width` and `height`.

**Independent transforms** are a standout feature. Unlike CSS where the entire `transform` string must be specified as one unit, Motion animates each axis independently: `x`, `y`, `z` for translation; `scale`, `scaleX`, `scaleY` for scaling; `rotate`, `rotateX`, `rotateY`, `rotateZ` for rotation; `skewX`, `skewY` for skew; and `transformPerspective` for perspective. This means a hover scale animation won't interfere with an ongoing translate animation.

Custom components can be turned into motion components via `motion.create(Component)` — the component must forward a ref to its DOM element. Never call `motion.create()` inside a render function, as it creates a new component every render and breaks animations.

### Transition types in detail

Transitions control *how* values animate. Motion provides three types:

**Spring transitions** use physics-based simulation and are the default for physical properties. They accept either physics parameters (`stiffness`, `damping`, `mass`, `velocity`) or the more intuitive duration-based configuration (`bounce` from 0–1, `duration`, `visualDuration`). A spring with `stiffness: 300` and `damping: 30` creates a snappy, controlled bounce; setting `damping: 0` produces infinite oscillation.

**Tween transitions** are duration-based with easing curves. The `ease` prop accepts named presets (`"easeInOut"`, `"circOut"`, `"backInOut"`, `"anticipate"`), cubic bezier arrays (`[0.17, 0.67, 0.83, 0.67]`), or custom JavaScript functions mapping 0–1 input to 0–1 output. The default duration is **0.3s** for single targets and **0.8s** for keyframes.

**Inertia transitions** decelerate based on initial velocity, primarily used for drag release animations. They support `power`, `timeConstant`, boundary constraints (`min`/`max`), and a `modifyTarget` function for snapping (e.g., to a grid).

All transition types share common props: `delay` (negative values start mid-animation), `repeat` (with `Infinity` for forever), `repeatType` (`"loop"`, `"reverse"`, `"mirror"`), and `repeatDelay`. You can set per-property transitions and define defaults via `MotionConfig`:

```jsx
<motion.li
  animate={{ x: 0, opacity: 1 }}
  transition={{
    default: { type: "spring" },
    opacity: { ease: "linear" }
  }}
/>
```

### Keyframes and gesture props

Any animation value can accept an **array** for keyframe animations. Using `null` as the first value means "start from current value," and `null` mid-array means "hold the previous value." The `times` array (0–1 progress values matching keyframe count) controls when each keyframe occurs, and per-segment easing can be specified as an array of easing functions.

```jsx
<motion.div
  animate={{ x: [0, 100, 0] }}
  transition={{ duration: 2, times: [0, 0.3, 1], ease: ["easeIn", "easeOut"] }}
/>
```

Motion provides **gesture animation props** that temporarily animate while a gesture is active, then revert when it ends. `whileHover` filters out touch events automatically for reliable cross-device behavior. `whileTap` handles primary pointer press and is **keyboard-accessible** — elements with tap listeners receive `tabindex="0"`, and `Enter` triggers the tap gesture. `whileFocus` follows CSS `:focus-visible` rules (keyboard navigation, not click-focus). `whileDrag` animates during drag operations. All gesture props accept either animation target objects or variant labels, and their events (`onHoverStart`, `onTap`, `onTapCancel`, etc.) provide rich interaction data.

### Variants and orchestration

Variants define named animation states that propagate through component trees. When a parent motion component sets `animate="visible"`, all child motion components with matching variant labels animate automatically — no explicit `animate` prop needed on children.

```jsx
const list = {
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      delayChildren: stagger(0.1)
    }
  },
  hidden: { opacity: 0 }
}
const item = {
  visible: { opacity: 1, x: 0 },
  hidden: { opacity: 0, x: -100 }
}

<motion.ul initial="hidden" whileInView="visible" variants={list}>
  {items.map(i => <motion.li key={i} variants={item} />)}
</motion.ul>
```

**Dynamic variants** accept functions that receive a value from the `custom` prop, enabling per-element resolution (e.g., index-based stagger delays). **Orchestration** controls parent-child timing: `when: "beforeChildren"` means children start after the parent finishes; `when: "afterChildren"` reverses this. The `stagger()` function (imported from `"motion/react"`) creates cascading delays with options for `from` (`"first"`, `"last"`, `"center"`, or an index), `startDelay`, and custom easing.

---

## AnimatePresence and layout animations

### Exit animations with AnimatePresence

`AnimatePresence` is the mechanism for animating components as they leave the DOM. It detects when direct children are removed from the React tree and keeps them mounted while their `exit` animation plays. Children **must** have unique `key` props.

```jsx
<AnimatePresence mode="wait">
  {show && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    />
  )}
</AnimatePresence>
```

The **`mode`** prop controls enter/exit coordination. `"sync"` (default) runs enter and exit simultaneously — best with `position: absolute` overlapping elements. `"wait"` holds the entering component until the exit finishes — ideal for step wizards and tab switching. `"popLayout"` immediately removes the exiting element from document flow so siblings reflow instantly, while the exit animation plays from the popped position — pairs well with the `layout` prop for list removal.

Key-based swapping is a powerful pattern: changing the `key` on a single child forces React to unmount and remount it, triggering both exit and enter animations. This is the foundation of slideshows and page transitions.

Additional capabilities include `onExitComplete` (fires when all exits finish), the `propagate` prop for nested AnimatePresence components, and `custom` for passing updated data to exiting components whose props can't change. The `useIsPresent()` hook returns whether a component is still mounted, enabling conditional content during exit.

### Layout animations and shared layout transitions

Adding the **`layout`** prop to a motion component automatically animates any layout change on re-render using CSS transforms for high performance. This can animate previously unanimatable CSS properties like `justify-content` and `flex-direction`. The prop accepts `true`, `"position"` (animate only position), or `"size"` (animate only size).

**`layoutId`** connects different elements across the tree. When a new element with a matching `layoutId` mounts, it animates from the previous element's position and size — enabling shared element transitions like tab underlines, card expansions, and modal openings. If both elements remain mounted, they crossfade.

```jsx
{items.map(item => (
  <motion.li layout key={item.id}>
    {item.name}
    {item.isSelected && <motion.div layoutId="highlight" />}
  </motion.li>
))}
```

**`layoutDependency`** optimizes performance by limiting layout measurements to only when the specified value changes (default: every render). **`LayoutGroup`** scopes `layoutId` animations — since `layoutId` is global, wrapping reusable components in `<LayoutGroup id="unique">` prevents cross-instance conflicts. Layout animations use full scale correction for children and border-radius, going well beyond basic FLIP techniques.

---

## Scroll animations, drag, and motion value hooks

### Scroll-triggered and scroll-linked animations

Motion provides two scroll animation paradigms. **Scroll-triggered animations** use `whileInView` with `IntersectionObserver` to fire when elements enter the viewport. The `viewport` option object configures `once` (play once), `margin` (expand/shrink detection area), `amount` (`"some"`, `"all"`, or a 0–1 threshold), and `root` (custom scroll container).

**Scroll-linked animations** bind values directly to scroll position via the `useScroll` hook, which returns four motion values: `scrollX`, `scrollY`, `scrollXProgress`, and `scrollYProgress`. These can track page scroll, a specific container, or an element's progress through the viewport:

```jsx
const ref = useRef(null)
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]  // when target-start meets container-end → 0
})
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
```

When `scrollYProgress` feeds directly into a `transform`, `opacity`, `clipPath`, or `filter` style, Motion creates **hardware-accelerated** scroll animations via the native ScrollTimeline API. The `useInView` hook provides a simpler boolean for viewport detection.

### Drag gestures

The `drag` prop enables dragging on any motion component (`true` for both axes, `"x"` or `"y"` for single-axis). **`dragConstraints`** accepts either a pixel boundary object (`{ left: 0, right: 300 }`) or a ref to a bounding element. **`dragElastic`** (default **0.5**) controls how far elements can move beyond constraints. `dragMomentum` (default `true`) applies inertia on release. `dragSnapToOrigin` returns the element to center.

Drag event callbacks (`onDragStart`, `onDrag`, `onDragEnd`) receive a `PanInfo` object containing `point`, `delta`, `offset`, and `velocity` — each with `x` and `y` components. The `useDragControls` hook enables initiating drag from a separate element (e.g., a drag handle), with `snapToCursor` support.

### The motion value composition system

Motion's hook system forms a composable pipeline that updates without React re-renders:

**`useMotionValue`** creates signal-like values with `.get()`, `.set()`, `.jump()` (instant, no animation), `.getVelocity()`, `.isAnimating()`, and `.stop()`. The same motion value can be shared across multiple components for synchronized motion.

**`useTransform`** derives new values from existing ones. The function form (`useTransform(() => x.get() * 2)`) auto-subscribes to any motion values read via `.get()`. The mapping form (`useTransform(x, [0, 100], [0, 1])`) maps input ranges to output ranges with optional `clamp` (default `true`) and easing. A multi-value mapping form returns an object of motion values from a single source.

**`useSpring`** wraps any value (number, string, or motion value) with spring physics. Calling `.set()` animates with spring; `.jump()` skips the spring. The `skipInitialAnimation` option prevents the spring from animating on mount — essential when tracking `useScroll` values.

**`useVelocity`** creates a motion value tracking the velocity of another, enabling effects like velocity-dependent scaling. Chaining `useVelocity(useVelocity(x))` yields acceleration.

**`useMotionValueEvent`** subscribes to motion value events (`"change"`, `"animationStart"`, `"animationComplete"`, `"animationCancel"`) with automatic cleanup — preferred over the `.on()` method in React components.

The canonical composition pattern chains these hooks together:

```jsx
const { scrollYProgress } = useScroll({ target: ref })
const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })
return <motion.div style={{ scale: smoothScale }} />
```

---

## Advanced patterns and the imperative API

### useAnimate for imperative control

The `useAnimate` hook returns a scope ref and a scoped `animate` function. CSS selectors passed to this `animate` only match children of the scope element, and all animations auto-cleanup on unmount. This is the tool for **sequences, timeline scrubbing, and event-driven animations** outside React's render cycle.

```jsx
const [scope, animate] = useAnimate()

useEffect(() => {
  const controls = animate([
    [scope.current, { x: "100%" }],
    ["li", { opacity: 1 }, { at: "-0.3" }]  // overlap by 0.3s
  ])
  controls.speed = 0.8
  return () => controls.stop()
}, [])
```

The returned controls object provides `play()`, `pause()`, `stop()`, `speed` (get/set), and `time` (get/set for seeking). It's also thenable — `await animate(...)` waits for completion. The mini version (`"motion/react-mini"`) weighs just **2.3kb** and uses only the Web Animations API.

For exit animations with imperative control, use `usePresence()` which returns `[isPresent, safeToRemove]` — call `safeToRemove()` after your custom exit sequence completes.

### SVG path animations and 3D transforms

Motion provides three special SVG properties for line-drawing effects: **`pathLength`** (0–1, total drawn length), **`pathOffset`** (where drawing starts), and **`pathSpacing`** (gap between dashed segments). These work on `path`, `circle`, `ellipse`, `line`, `polygon`, `polyline`, and `rect`. The `d` attribute can also be animated for **path morphing** between shapes.

For 3D effects, apply `perspective` (as a CSS value, typically 500–1000) on a parent container, then use `rotateX`/`rotateY` on children. The `transformTemplate` prop customizes transform order when the default (translate → scale → rotate → skew) doesn't suffice. For full 3D scenes, `framer-motion-3d` provides `motion.mesh`, `motion.group`, and layout-aware cameras for React Three Fiber integration.

### The vanilla JavaScript API

The non-React API centers on standalone functions. **`animate()`** comes in mini (2.3kb, WAAPI only) and hybrid (18kb, full features including springs, independent transforms, sequences, CSS variables, and JavaScript object animation). **Sequences** accept arrays of animation segments with timing control via `at` (absolute time, relative offset like `"-0.5"`, or named labels):

```js
animate([
  ["ul", { opacity: 1 }, { duration: 1 }],
  ["li", { x: [-100, 0] }, { at: "-0.5" }],
  "sectionStart",
  ["h2", { scale: 1 }, { at: "sectionStart" }]
])
```

**`scroll()`** (5.1kb) creates scroll-linked animations, using native ScrollTimeline for hardware acceleration when possible. **`inView()`** (0.5kb) wraps IntersectionObserver with a cleaner API, including a return-function pattern for enter/leave callbacks. **`stagger()`** creates cascading delays with `from` and `startDelay` options.

### Performance optimization strategies

The fastest animations target **composite-only properties**: `transform` and `opacity` bypass layout and paint entirely. `filter` and `clip-path` are gaining compositor support in Chrome and Firefox. Properties like `width`, `height`, `padding`, and `top` trigger full layout recalculation and should be avoided when possible.

A critical nuance: **individual transforms** (`x`, `scale`, `rotate` as separate props) use CSS variables internally and are **not hardware-accelerated**. For maximum performance with the vanilla API, use `transform` as a single string: `animate(".box", { transform: "translateX(100px) scale(2)" })`. In the React API, this trade-off is handled automatically — the convenience of independent transforms usually outweighs the performance difference.

Use `willChange: "transform"` sparingly to hint the browser to create compositor layers (each layer consumes GPU memory). Replace expensive `boxShadow` animations with `filter: "drop-shadow(...)"`, and `borderRadius` with `clipPath: "inset(0 round 50px)"` for compositor-friendly alternatives. Motion values should always be preferred over React state for frequently-updating visual properties to avoid re-renders.

---

## Server-side rendering and Next.js integration

Motion components are fully SSR-compatible. The `initial` prop determines what renders on the server — setting `initial={false}` outputs the `animate` values directly. In Next.js App Router (where pages are Server Components by default), three approaches work:

1. Mark files using motion components with `"use client"`
2. Create reusable client wrapper components that can be imported into Server Components
3. Use `import * as motion from "motion/react-client"` for the namespace import that works in Server Component files

Hooks like `useAnimate`, `useMotionValue`, and `useInView` always require Client Components. For page transitions, wrap content in `AnimatePresence` with `mode="wait"` inside a layout or template file, using `usePathname()` as the key:

```jsx
"use client"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"

export default function Template({ children }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

---

## Migration from framer-motion and bundle optimization

### Three-step migration

Migration is straightforward — the React API is **fully backward-compatible**. The steps are: uninstall `framer-motion` and install `motion`; find-and-replace all imports from `"framer-motion"` to `"motion/react"`; for LazyMotion users, update `m` component imports to `"motion/react-m"`. There is no official codemod — a simple find-and-replace suffices.

Notable **breaking changes across major versions**: v12 changed only the vanilla JS API; v11 altered MotionValue velocity calculation (synchronous `.set()` calls no longer stack velocity) and moved mount renders to microtasks (Jest tests need `await nextFrame()`); v10 removed IntersectionObserver fallback; v9 made `whileTap` keyboard-accessible; v5 replaced `AnimateSharedLayout` with `layoutId` + `LayoutGroup`.

### Bundle size optimization with LazyMotion

The full `motion` component bundles at approximately **34kb** (gzipped). For production optimization, `LazyMotion` combined with the slim `m` component drops the initial render to **~4.6kb**. Two feature bundles are available: `domAnimation` (+15kb, covers animations, variants, exit animations, and tap/hover/focus gestures) and `domMax` (+25kb, adds drag/pan gestures and layout animations). Features can be loaded asynchronously after hydration:

```jsx
const loadFeatures = () => import("./features").then(res => res.default)

<LazyMotion features={loadFeatures} strict>
  <m.div animate={{ opacity: 1 }} />
</LazyMotion>
```

The `strict` prop enforces `m` usage inside `LazyMotion`, throwing errors if the full `motion` component appears. The smallest possible React animation setup uses `useAnimate` from `"motion/react-mini"` at just **2.3kb**.

---

## Key API reference at a glance

**Components**: `motion.*` (all HTML/SVG elements), `AnimatePresence`, `LayoutGroup`, `LazyMotion`, `MotionConfig`, `Reorder.Group`, `Reorder.Item`

**React hooks**: `useAnimate`, `useMotionValue`, `useTransform`, `useSpring`, `useScroll`, `useInView`, `useVelocity`, `useMotionValueEvent`, `useDragControls`, `useReducedMotion`, `useIsPresent`, `usePresence`

**Vanilla JS functions**: `animate()`, `scroll()`, `inView()`, `stagger()`, `spring()`, `delay()`, `frame`, `motionValue()`, `mix()`, `transform()`, `wrap()`

**The `Reorder` component** provides drag-to-reorder lists with `Reorder.Group` (accepts `axis`, `values`, `onReorder`) and `Reorder.Item` (a full motion component with automatic drag). It handles single-axis reordering well but doesn't support multi-column or cross-container drag — DnD Kit is recommended for those cases.

---

## Conclusion

Motion stands as the most comprehensive animation library in the JavaScript ecosystem, unique in its hybrid engine architecture that bridges browser-native performance with JavaScript flexibility. The three most impactful capabilities to understand are the **motion value composition system** (which enables complex reactive animations without React re-renders), **layout animations with `layoutId`** (which solve the notoriously difficult problem of shared element transitions), and **AnimatePresence** (which elegantly handles the unmount animation problem that CSS alone cannot solve).

For teams migrating from Framer Motion, the transition is a simple import path change. For new projects, the recommended starting point is the declarative `<motion />` component API for most interactions, reserving `useAnimate` for sequences and timeline control. Use `LazyMotion` with the `m` component in production to keep bundle size under control, and always wrap the app in `<MotionConfig reducedMotion="user">` for accessibility. The library's composable hook pipeline — `useScroll` → `useTransform` → `useSpring` → `style` — is the mental model that unlocks its full potential.