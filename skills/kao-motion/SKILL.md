---
name: kao-motion
description: >
  ALWAYS use this skill when the user wants to animate anything in a web project. This skill
  provides the complete Motion (motion.dev) animation library guide — the #1 JavaScript animation
  library for React, Vue, and vanilla JS with 30M+ monthly npm downloads. Trigger this skill for:
  fade-in effects, scroll animations, parallax, page/route transitions, modal animations, sidebar
  slide-ins, drag-and-drop with reordering, hover effects, tap/press interactions, spring physics,
  staggered reveals, hero section choreography, SVG path drawing, shared element transitions,
  layout animations, carousel/slider, accordion collapse, tab indicators, toast notifications,
  loading spinners, text reveals, number counters, marquee/ticker, 3D transforms, or ANY request
  involving visual motion, transitions, or interactive animation in a web UI. Also trigger when
  the user mentions Motion, Framer Motion, motion.dev, framer-motion, AnimatePresence, layoutId,
  whileInView, whileHover, useAnimate, useScroll, useSpring, or useMotionValue. This skill has
  detailed API references and 22+ ready-to-use animation pattern recipes — consult it even for
  seemingly simple animation tasks because it ensures idiomatic patterns, proper spring physics,
  accessibility (reduced motion, ARIA), and performance-optimized implementations.
license: MIT
metadata:
  author: kaotypr
  version: "1.0.0"
---

# Motion — Animation Library

**Package**: `motion` v12.x (formerly `framer-motion`)
**Import**: `import { motion } from "motion/react"`
**Bundle**: ~34kb full / ~4.6kb with LazyMotion / 2.3kb mini
**Frameworks**: React, Vue (`motion-v`), vanilla JS

## Installation

```bash
npm install motion
```

Import paths by context:

| Context | Import |
|---------|--------|
| React | `import { motion, AnimatePresence } from "motion/react"` |
| React Server Components | `import * as motion from "motion/react-client"` |
| React mini (2.3kb) | `import { useAnimate } from "motion/react-mini"` |
| Vanilla JS hybrid (~18kb) | `import { animate } from "motion"` |
| Vanilla JS mini (~2.5kb) | `import { animate } from "motion/mini"` |
| Vue | `import { motion } from "motion-v"` |

If the project still uses `framer-motion`, migration is a find-and-replace: change `"framer-motion"` imports to `"motion/react"`.

## Core Concept — The motion Component

Every HTML and SVG element has a `motion.*` counterpart (`motion.div`, `motion.button`, `motion.path`, etc.) that extends it with animation props. These components **bypass React's render cycle** — animated values update directly in the DOM, so animations never cause re-renders.

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
/>
```

**Three core props** drive declarative animation:
- **`initial`** — starting state (set `false` to skip enter animation, important for SSR)
- **`animate`** — target state (changes trigger automatic transitions)
- **`exit`** — leave state (requires `AnimatePresence` wrapper)

Custom components work via `motion.create(Component)` — the component must forward a ref. Never call `motion.create()` inside a render function.

## Animatable Values

Motion handles an unusually broad range: all CSS properties, colors in any format (hex, rgba, hsla, oklch), CSS variables, `display: "none"/"block"`, `width`/`height` to/from `"auto"`, cross-unit values (`"100%"` → `"calc(100vw - 50%)"`), and complex strings like box-shadow.

**Independent transforms** are a standout feature — each axis animates independently so a hover scale won't interfere with an ongoing translate:

`x`, `y`, `z`, `scale`, `scaleX`, `scaleY`, `rotate`, `rotateX`, `rotateY`, `rotateZ`, `skewX`, `skewY`, `transformPerspective`

## Transitions

Transitions control *how* values animate. Motion picks sensible defaults: **spring** for physical properties (`x`, `y`, `scale`, `rotate`), **tween** for visual properties (`opacity`, `color`).

### Spring (default for physical props)

Two configuration modes:

```jsx
// Physics-based: stiffness, damping, mass
transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}

// Duration-based: easier to coordinate timing
transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
```

Springs automatically inherit velocity from interrupted animations and gestures — this is what makes Motion feel physically natural.

### Tween (default for visual props)

```jsx
transition={{ duration: 0.3, ease: "easeInOut" }}
```

Built-in easings: `linear`, `easeIn`, `easeOut`, `easeInOut`, `circIn`, `circOut`, `circInOut`, `backIn`, `backOut`, `backInOut`, `anticipate`. Also accepts cubic bezier arrays (`[0.17, 0.67, 0.83, 0.67]`) or custom functions.

### Inertia (post-drag momentum)

```jsx
transition={{ type: "inertia", power: 0.8, timeConstant: 700 }}
```

Supports `modifyTarget` for snap-to-grid, `min`/`max` boundaries with bounce.

### Per-property transitions

```jsx
transition={{
  default: { type: "spring" },
  opacity: { duration: 0.2, ease: "linear" }
}}
```

### Keyframes

```jsx
animate={{ x: [0, 100, 0] }}
transition={{ duration: 2, times: [0, 0.3, 1], ease: ["easeIn", "easeOut"] }}
```

Use `null` as first value to start from current state. Default keyframe duration is 0.8s.

### Repeat

```jsx
transition={{ repeat: Infinity, repeatType: "reverse", repeatDelay: 0.5 }}
```

`repeatType`: `"loop"` | `"reverse"` | `"mirror"`

## Gestures

Motion provides gesture props that animate while active and revert when the gesture ends:

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
/>
```

- **`whileHover`** — pointer hover (filters out touch, unlike CSS `:hover`)
- **`whileTap`** — press and release (keyboard accessible via Enter)
- **`whileFocus`** — matches `:focus-visible` rules
- **`whileDrag`** — during drag
- **`whileInView`** — element visible in viewport

Each has event callbacks: `onHoverStart`, `onHoverEnd`, `onTap`, `onTapStart`, `onTapCancel`, `onPan`, `onPanStart`, `onPanEnd`, etc.

## Drag

```jsx
<motion.div
  drag          // true | "x" | "y"
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  // or: dragConstraints={containerRef}
  dragElastic={0.5}       // 0 = rigid, 1 = full movement beyond constraints
  dragMomentum={true}     // inertia after release
  dragSnapToOrigin={false} // spring back to start
  onDragEnd={(event, info) => {
    // info has: point, delta, offset, velocity (each with x, y)
  }}
/>
```

Use `useDragControls()` to start drag programmatically from another element.

## AnimatePresence — Exit Animations

`AnimatePresence` keeps components mounted while their `exit` animation plays. Children **must** have unique `key` props.

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

**Modes:**
- `"sync"` (default) — enter and exit run simultaneously
- `"wait"` — new child waits for exit to complete (ideal for page transitions, tabs)
- `"popLayout"` — exiting element removed from flow immediately, pairs well with `layout`

Changing the `key` on a single child forces remount — triggering both exit and enter. This is the foundation of page transitions and slideshows.

## Layout Animations

Add `layout` to any motion component to automatically animate position/size changes on re-render using performant CSS transforms:

```jsx
<motion.div layout>
  {/* This animates smoothly when its position or size changes */}
</motion.div>
```

`layout` accepts: `true` | `"position"` | `"size"`

### Shared Element Transitions with layoutId

Connect different elements — when one with a matching `layoutId` mounts, Motion animates from the previous element's position:

```jsx
{items.map(item => (
  <motion.li layout key={item.id}>
    {item.isSelected && <motion.div layoutId="highlight" />}
  </motion.li>
))}
```

This powers tab underlines, card expansions, modal openings. Use `<LayoutGroup id="unique">` to scope `layoutId` and prevent cross-instance conflicts.

## Variants — Orchestrated Animations

Named states that propagate through component trees automatically:

```jsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1 }
  }
}
const item = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
}

<motion.ul initial="hidden" animate="visible" variants={container}>
  {items.map(i => <motion.li key={i} variants={item} />)}
</motion.ul>
```

Orchestration options: `when` (`"beforeChildren"` | `"afterChildren"`), `delayChildren`, `staggerChildren`. The `stagger()` function supports `from: "center"` | `"last"` | index.

Dynamic variants accept a function receiving the `custom` prop for per-element behavior.

## Scroll Animations

### Scroll-triggered (viewport detection)

```jsx
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px", amount: 0.3 }}
/>
```

### Scroll-linked (bound to scroll position)

```jsx
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
})
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

<motion.div style={{ opacity }} />
```

When scroll progress drives `transform`, `opacity`, `clipPath`, or `filter`, Motion uses the native **ScrollTimeline API** for hardware-accelerated 120fps performance.

## Motion Value Hooks — The Composition Pipeline

These hooks update the DOM **without React re-renders**:

| Hook | Purpose |
|------|---------|
| `useMotionValue(init)` | Create reactive value with `.get()`, `.set()`, `.jump()` |
| `useTransform(source, inRange, outRange)` | Map one value's range to another |
| `useSpring(source, config)` | Wrap value with spring physics |
| `useScroll(options)` | Get `scrollX/Y` and `scrollX/YProgress` motion values |
| `useVelocity(motionValue)` | Track velocity (chainable for acceleration) |
| `useTime()` | Elapsed milliseconds updating every frame |
| `useMotionTemplate` | Compose motion values into string template |
| `useMotionValueEvent(value, event, cb)` | Subscribe to change/animationStart/Complete |

The canonical composition pattern:

```jsx
const { scrollYProgress } = useScroll({ target: ref })
const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])
const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 })
return <motion.div style={{ scale: smoothScale }} />
```

## useAnimate — Imperative Control

For sequences, timeline scrubbing, and event-driven animations:

```jsx
const [scope, animate] = useAnimate()

async function handleClick() {
  await animate(scope.current, { x: 100 })
  await animate("li", { opacity: 1 }, { delay: stagger(0.1) })
}

return <div ref={scope}>...</div>
```

Sequences with timeline control:

```jsx
const controls = animate([
  ["ul", { opacity: 1 }],
  ["li", { x: [-100, 0] }, { at: "<" }],     // start with previous
  ["a", { scale: 1.2 }, { at: "+0.5" }],      // 0.5s after previous ends
  ["section", { y: 0 }, { at: 1.2 }],         // absolute time
])
controls.speed = 0.8  // play(), pause(), stop(), time (get/set)
```

## SVG Animations

All SVG elements have motion counterparts. Key patterns:

```jsx
// Line drawing
<motion.path
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 2 }}
/>

// Path morphing (same point count)
<motion.path animate={{ d: isToggled ? pathA : pathB }} />

// ViewBox animation
<motion.svg animate={{ viewBox: "100 0 200 200" }} />
```

`pathLength`, `pathOffset`, `pathSpacing` work on path, circle, ellipse, line, polygon, polyline, rect.

## Reorder Lists

```jsx
import { Reorder } from "motion/react"

<Reorder.Group axis="y" values={items} onReorder={setItems}>
  {items.map(item => (
    <Reorder.Item key={item.id} value={item} whileDrag={{ scale: 1.05 }}>
      {item.label}
    </Reorder.Item>
  ))}
</Reorder.Group>
```

For multi-column or cross-container drag, use DnD Kit instead.

## Performance Guide

**S-tier (compositor only, best):** `transform` (`x`, `y`, `scale`, `rotate`), `opacity`
**A-tier:** `filter`, `clipPath`, `backgroundColor`
**B-tier (triggers paint):** `boxShadow` → prefer `filter: "drop-shadow(...)"`, `borderRadius` → prefer `clipPath: "inset(0 round Xpx)"`
**D-tier (triggers layout, avoid):** `width`, `height`, `margin`, `top`, `padding` → use `layout` prop instead

Tips:
- Use motion values (`useMotionValue`) instead of React state for frequently-updating visual properties
- Use `willChange: "transform"` sparingly (each layer consumes GPU memory)
- Use `LazyMotion` + `m` component in production to reduce initial bundle to ~4.6kb
- Set `initial={false}` for SSR to prevent flash-of-animation

## Bundle Optimization with LazyMotion

```jsx
import { LazyMotion, domAnimation, m } from "motion/react"

// domAnimation (~15kb): animations, variants, exit, tap/hover/focus
// domMax (~25kb): + drag, pan, layout animations

<LazyMotion features={domAnimation} strict>
  <m.div animate={{ opacity: 1 }} />
</LazyMotion>
```

Async loading:
```jsx
const loadFeatures = () => import("motion").then(mod => mod.domMax)
<LazyMotion features={loadFeatures} strict>
```

## Next.js Integration

- Mark files using motion components with `"use client"`
- Or create reusable client wrapper components importable by Server Components
- Or use `import * as motion from "motion/react-client"` in Server Component files
- Hooks (`useAnimate`, `useMotionValue`, `useScroll`, etc.) always require Client Components

Page transitions:

```jsx
"use client"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"

export default function Template({ children }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

## Accessibility

Always wrap the app root with:

```jsx
<MotionConfig reducedMotion="user">
  {/* Respects OS prefers-reduced-motion setting */}
</MotionConfig>
```

Use `useReducedMotion()` to conditionally simplify animations. Motion automatically makes `whileTap` keyboard-accessible (adds `tabindex="0"`, Enter triggers tap).

## Vanilla JS API

For non-React contexts, Motion provides standalone functions:

```js
import { animate, scroll, inView, stagger } from "motion"

// Animate elements
animate(".box", { opacity: 1, x: 100 }, { duration: 0.5 })

// Scroll-linked
scroll(animate(".progress", { scaleX: [0, 1] }))

// Viewport detection
inView(".section", (info) => {
  animate(info.target, { opacity: 1 })
  return () => animate(info.target, { opacity: 0 }) // leave callback
})
```

## Reference Files

For detailed pattern recipes and implementation examples, read:

- **`references/animation-patterns.md`** — 26+ ready-to-use component animation patterns (hero sections, modals, cards, tabs, carousels, toasts, text effects, parallax, etc.) with complete code snippets
- **`references/api-reference.md`** — Full API surface: all components, hooks, vanilla JS functions, easing utilities, and configuration options
