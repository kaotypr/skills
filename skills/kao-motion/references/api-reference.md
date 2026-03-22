# Motion API Reference

Complete API surface for Motion v12.x.

## Table of Contents

1. [Components](#components)
2. [React Hooks](#react-hooks)
3. [Vanilla JS Functions](#vanilla-js-functions)
4. [Easing Functions & Utilities](#easing-functions--utilities)
5. [Motion Value Methods](#motion-value-methods)
6. [Animation Controls](#animation-controls)
7. [Transition Options](#transition-options)
8. [Motion Component Props](#motion-component-props)

---

## Components

| Component | Import | Purpose |
|-----------|--------|---------|
| `motion.*` | `motion/react` | Animation-enabled HTML/SVG elements |
| `motion.create(Component)` | `motion/react` | Wrap custom components (must forward ref) |
| `AnimatePresence` | `motion/react` | Exit animations; `mode`: `"sync"` \| `"wait"` \| `"popLayout"` |
| `LayoutGroup` | `motion/react` | Scope `layoutId` and coordinate layout animations |
| `MotionConfig` | `motion/react` | Default `transition`, `reducedMotion`, CSP `nonce` |
| `LazyMotion` | `motion/react` | Tree-shakeable feature loading with `domAnimation` or `domMax` |
| `Reorder.Group` | `motion/react` | Drag-to-reorder container (`axis`, `values`, `onReorder`) |
| `Reorder.Item` | `motion/react` | Draggable list item (full motion component) |

### AnimatePresence Props

| Prop | Type | Description |
|------|------|-------------|
| `mode` | `"sync"` \| `"wait"` \| `"popLayout"` | Enter/exit coordination (default: `"sync"`) |
| `initial` | `boolean` | Enable/disable initial animations (default: `true`) |
| `onExitComplete` | `() => void` | Fires when all exit animations complete |
| `propagate` | `boolean` | Nested AnimatePresence triggers on parent exit |
| `custom` | `any` | Pass updated data to exiting components |

### LazyMotion Features

| Feature bundle | Size | Includes |
|---------------|------|----------|
| `domAnimation` | ~15kb | Animations, variants, exit, tap/hover/focus gestures |
| `domMax` | ~25kb | + drag, pan, layout animations |

## React Hooks

| Hook | Import | Returns |
|------|--------|---------|
| `useMotionValue(initial)` | `motion/react` | Reactive motion value |
| `useTransform(source, inputRange, outputRange)` | `motion/react` | Derived motion value |
| `useTransform(() => expr)` | `motion/react` | Function-based derived value (auto-subscribes) |
| `useSpring(source, config?)` | `motion/react` | Spring-wrapped motion value |
| `useScroll(options?)` | `motion/react` | `{ scrollX, scrollY, scrollXProgress, scrollYProgress }` |
| `useVelocity(motionValue)` | `motion/react` | Velocity tracking (chainable) |
| `useTime()` | `motion/react` | Elapsed ms updating every frame |
| `useMotionTemplate\`...\`` | `motion/react` | String template from motion values |
| `useMotionValueEvent(value, event, cb)` | `motion/react` | Auto-cleaning event subscription |
| `useAnimate()` | `motion/react` | `[scopeRef, animate]` for imperative control |
| `useAnimationFrame((time, delta) => {})` | `motion/react` | Per-frame callback |
| `useInView(ref, options?)` | `motion/react` | Boolean viewport visibility |
| `usePageInView()` | `motion/react` | Page/tab visibility |
| `useDragControls()` | `motion/react` | Programmatic drag initiation |
| `useReducedMotion()` | `motion/react` | OS prefers-reduced-motion preference |
| `useIsPresent()` | `motion/react` | Boolean, is component still in AnimatePresence |
| `usePresence()` | `motion/react` | `[isPresent, safeToRemove]` for custom exit logic |

### useScroll Options

| Option | Type | Description |
|--------|------|-------------|
| `container` | `RefObject` | Scrollable element (default: window) |
| `target` | `RefObject` | Tracked element |
| `offset` | `[string, string]` | Intersection definitions, e.g. `["start end", "end start"]` |
| `axis` | `"x"` \| `"y"` | Scroll axis |

Offset syntax: `"<target edge> <container edge>"` — edges: `"start"`, `"center"`, `"end"`, pixels, percentages.

### useTransform Options

```jsx
// Range mapping
useTransform(source, [0, 100], [0, 1], { clamp: true })

// Function form (auto-subscribes to .get() calls)
useTransform(() => x.get() * 2 + y.get())
```

## Vanilla JS Functions

| Function | Import | Purpose |
|----------|--------|---------|
| `animate(target, values, options?)` | `motion` or `motion/mini` | Animate elements, selectors, values, objects, sequences |
| `scroll(callback, options?)` | `motion` | Scroll-linked animation |
| `inView(element, callback, options?)` | `motion` | Viewport detection with enter/leave |
| `hover(element, callback)` | `motion` | Hover gesture handler |
| `press(element, callback)` | `motion` | Press gesture handler |
| `resize(element, callback)` | `motion` | Resize observer |
| `stagger(duration, options?)` | `motion` | Cascading delay generator |
| `spring(visualDuration, bounce)` | `motion` | CSS-compatible spring easing string |
| `cubicBezier(x1, y1, x2, y2)` | `motion` | Cubic bezier easing function |
| `steps(count, direction?)` | `motion` | Stepped easing function |
| `mix(from, to, progress)` | `motion` | Value interpolation |
| `transform(value, inRange, outRange)` | `motion` | One-off value mapping |
| `wrap(min, max, value)` | `motion` | Wrap value within range |

### animate() Target Types

```js
// HTML element
animate(element, { opacity: 1 })

// CSS selector
animate(".box", { x: 100 })

// Motion value
animate(motionValue, 100, { duration: 0.5 })

// JavaScript object (Three.js, etc.)
animate(camera.rotation, { y: Math.PI })

// Sequence
animate([
  ["ul", { opacity: 1 }],
  ["li", { x: 0 }, { at: "<" }],        // start with previous
  ["a", { scale: 1 }, { at: "+0.5" }],   // 0.5s after previous ends
  ["h2", { y: 0 }, { at: 1.2 }],         // absolute time
])
```

### Sequence `at` Parameter

| Value | Meaning |
|-------|---------|
| `number` | Absolute time in seconds |
| `"+N"` / `"-N"` | Relative to previous end |
| `"<"` | Start with previous |
| `"<N"` | Offset from previous start |
| `"label"` | Named label position |

## Easing Functions & Utilities

### Built-in Named Easings

`linear`, `easeIn`, `easeOut`, `easeInOut`, `circIn`, `circOut`, `circInOut`, `backIn`, `backOut`, `backInOut`, `anticipate`

### Custom Easings

```js
// Cubic bezier array
ease: [0.17, 0.67, 0.83, 0.67]

// Custom function
ease: (t) => t * t

// Stepped
ease: steps(5, "end")

// CSS-compatible spring
ease: spring(0.3, 0.5)  // visualDuration, bounce
```

### Easing Utilities

| Function | Purpose |
|----------|---------|
| `cubicBezier(x1, y1, x2, y2)` | Precise bezier control |
| `steps(n, direction?)` | Discrete stepping (`"start"` \| `"end"`) |
| `spring(visualDuration, bounce)` | CSS `linear()` spring string |
| `reverseEasing(easing)` | Flip any easing function |
| `mirrorEasing(easing)` | Symmetric in-out from one-directional |

## Motion Value Methods

| Method | Description |
|--------|-------------|
| `.get()` | Current value |
| `.set(value)` | Set value (triggers animation if spring-wrapped) |
| `.jump(value)` | Set instantly, no animation |
| `.getVelocity()` | Current velocity |
| `.isAnimating()` | Boolean |
| `.stop()` | Stop current animation |
| `.on("change", cb)` | Subscribe to changes |
| `.on("animationStart", cb)` | Animation started |
| `.on("animationComplete", cb)` | Animation finished |
| `.on("animationCancel", cb)` | Animation cancelled |

## Animation Controls

Returned by `animate()` and `useAnimate()`:

| Property/Method | Description |
|----------------|-------------|
| `play()` | Resume playback |
| `pause()` | Pause playback |
| `stop()` | Stop and reset |
| `complete()` | Jump to end |
| `cancel()` | Cancel animation |
| `speed` | Get/set playback speed |
| `time` | Get/set current time (seeking) |
| `then()` | Promise-like, resolves on completion |
| `duration` | Total duration |

## Transition Options

### Common

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delay` | `number` | `0` | Delay in seconds (negative = start mid-animation) |
| `repeat` | `number` | `0` | Repeat count (`Infinity` for forever) |
| `repeatType` | `"loop"` \| `"reverse"` \| `"mirror"` | `"loop"` | How to repeat |
| `repeatDelay` | `number` | `0` | Delay between repeats |

### Spring

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"spring"` | — | Spring animation |
| `stiffness` | `number` | `100` | Spring stiffness |
| `damping` | `number` | `10` | Damping force |
| `mass` | `number` | `1` | Mass of object |
| `velocity` | `number` | auto | Initial velocity |
| `bounce` | `number` (0–1) | — | Duration-based mode bounce |
| `duration` | `number` | — | Duration-based mode duration |
| `visualDuration` | `number` | — | Apparent completion time |
| `restSpeed` | `number` | `0.1` | Speed below which animation completes |
| `restDelta` | `number` | `0.01` | Distance below which animation completes |

### Tween

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"tween"` | — | Duration-based animation |
| `duration` | `number` | `0.3` | Duration in seconds (keyframes: `0.8`) |
| `ease` | `string \| number[] \| function` | `"easeOut"` | Easing |
| `times` | `number[]` | — | Keyframe positions (0–1 array) |

### Inertia

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `"inertia"` | — | Velocity-based deceleration |
| `power` | `number` | `0.8` | Throw distance multiplier |
| `timeConstant` | `number` | `700` | Deceleration feel |
| `modifyTarget` | `(target) => number` | — | Snap function |
| `min` / `max` | `number` | — | Boundaries |
| `bounceStiffness` | `number` | `500` | Boundary bounce |
| `bounceDamping` | `number` | `10` | Boundary damping |

## Motion Component Props

### Animation

| Prop | Type | Description |
|------|------|-------------|
| `initial` | `object \| string \| false` | Starting state |
| `animate` | `object \| string \| string[]` | Target state |
| `exit` | `object \| string` | Leave state (needs AnimatePresence) |
| `transition` | `object` | How to animate |
| `variants` | `object` | Named animation states |
| `custom` | `any` | Dynamic value passed to variant functions |

### Gesture

| Prop | Type | Description |
|------|------|-------------|
| `whileHover` | `object \| string` | Animate while hovered |
| `whileTap` | `object \| string` | Animate while pressed |
| `whileFocus` | `object \| string` | Animate while focused |
| `whileDrag` | `object \| string` | Animate while dragging |
| `whileInView` | `object \| string` | Animate while in viewport |
| `onHoverStart` / `onHoverEnd` | `(event) => void` | Hover callbacks |
| `onTap` / `onTapStart` / `onTapCancel` | `(event, info) => void` | Tap callbacks |
| `onPan` / `onPanStart` / `onPanEnd` | `(event, info) => void` | Pan callbacks |

### Layout

| Prop | Type | Description |
|------|------|-------------|
| `layout` | `boolean \| "position" \| "size"` | Auto-animate layout changes |
| `layoutId` | `string` | Shared element transition identifier |
| `layoutDependency` | `any` | Limit layout measurements to value changes |
| `layoutScroll` | `boolean` | Correct for scroll offset in ancestors |
| `layoutRoot` | `boolean` | For `position: fixed` elements |

### Drag

| Prop | Type | Description |
|------|------|-------------|
| `drag` | `boolean \| "x" \| "y"` | Enable dragging |
| `dragConstraints` | `object \| RefObject` | Pixel bounds or container ref |
| `dragElastic` | `number` (0–1) | Movement beyond constraints (default: 0.5) |
| `dragMomentum` | `boolean` | Inertia after release (default: true) |
| `dragSnapToOrigin` | `boolean` | Return to origin |
| `dragDirectionLock` | `boolean` | Lock to first detected axis |
| `dragTransition` | `object` | Inertia transition config |
| `onDragStart` / `onDrag` / `onDragEnd` | `(event, info) => void` | Drag callbacks |

### Viewport

| Prop | Type | Description |
|------|------|-------------|
| `viewport` | `object` | Options for `whileInView` |
| `viewport.once` | `boolean` | Only trigger once |
| `viewport.margin` | `string` | Margin around viewport |
| `viewport.amount` | `"some" \| "all" \| number` | Visibility threshold |
| `viewport.root` | `RefObject` | Custom scroll root |
| `onViewportEnter` | `(entry) => void` | Enter callback |
| `onViewportLeave` | `(entry) => void` | Leave callback |

### Style

| Prop | Type | Description |
|------|------|-------------|
| `style` | `object` | CSS styles (accepts motion values) |
| `transformTemplate` | `(transform, generatedTransform) => string` | Custom transform order |
