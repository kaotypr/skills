# The complete Motion animation catalog for the open web

**Motion (motion.dev) ships its entire animation engine — every hook, every physics system, every gesture handler — completely free and open-source under the MIT license.** The paid Motion+ tier ($299 one-time) adds only seven pre-built convenience components, extra tutorials, and developer tools — no core animation capability is locked behind a paywall. This catalog documents every free animation type, named pattern, physics configuration, and API feature available in Motion as of early 2026, covering the library formerly known as Framer Motion that now powers **30M+ monthly npm downloads** across React, Vue, and vanilla JavaScript.

---

## Every animation type in Motion's free tier

Motion organizes animations into distinct systems, all of which are free. Understanding these categories is essential for knowing what's possible without ever touching Motion+.

### Enter, update, and exit animations

The foundation of Motion is declarative state-driven animation. The `initial` prop defines a starting state, `animate` defines the target, and Motion automatically interpolates between them. When `animate` values change on re-render, the transition happens automatically — no imperative code needed. Exit animations require wrapping components in `AnimatePresence` and providing an `exit` prop. AnimatePresence supports three modes: **`"sync"`** (simultaneous in/out), **`"wait"`** (new child waits for old to exit), and **`"popLayout"`** (exiting element removed from flow immediately while animating out). The `propagate` prop enables nested AnimatePresence components to trigger exit animations when a parent exits.

### Keyframe animations

Any animated property accepts arrays as keyframe sequences: `animate={{ x: [0, 100, 0] }}`. **Wildcard keyframes** use `null` to inherit the current value at that point. The `times` array (values from 0 to 1) controls keyframe positioning, and per-keyframe easing is supported by passing an array of easing functions. Default duration stretches to **0.8 seconds** for keyframe animations versus 0.3 for simple transitions.

### Layout animations

Adding `layout` to any motion component triggers automatic FLIP-based animation whenever that element's size or position changes in the DOM. Variants include `layout="position"` (animate only position) and `layout="size"` (animate only size). The `layoutId` prop connects two separate elements — when one unmounts and another with the same `layoutId` mounts, Motion animates a seamless shared-element transition between them. `LayoutGroup` synchronizes layout animations across sibling components that don't share re-renders, and `layoutDependency` optimizes performance by restricting layout measurements to specific value changes. Additional props — `layoutScroll`, `layoutRoot`, `layoutAnchor` — handle edge cases with scroll containers and fixed positioning.

### Scroll-triggered and scroll-linked animations

Two distinct scroll systems exist. **Scroll-triggered** animations use `whileInView` to activate when an element enters the viewport, powered by a pooled IntersectionObserver. The `viewport` option accepts `once` (fire once), `margin`, `amount` (`"some"`, `"all"`, or a 0–1 number), and `root`. **Scroll-linked** animations use the `useScroll` hook, which returns four motion values: `scrollX`, `scrollY`, `scrollXProgress`, and `scrollYProgress`. These pipe directly into `useTransform` for mapping scroll position to any animated property. When animating GPU-friendly properties (opacity, transform, clipPath, filter), Motion leverages the browser's native **ScrollTimeline API** for hardware-accelerated 120fps performance.

### Gesture animations

Five gesture props animate elements during interactions — all free:

- **`whileHover`** — activates while pointer hovers
- **`whileTap`** — activates while primary pointer presses
- **`whileFocus`** — activates while element has keyboard focus
- **`whileDrag`** — activates during drag
- **`whileInView`** — activates while visible in viewport

Each has corresponding event callbacks (`onHoverStart`, `onHoverEnd`, `onTapStart`, `onTap`, `onTapCancel`, `onPan`, `onPanStart`, `onPanEnd`, etc.). The `propagate={{ tap: false }}` prop prevents gesture events from bubbling to parent motion components.

### Drag system

The `drag` prop enables dragging on `true`, `"x"`, or `"y"`. Configuration includes `dragConstraints` (pixel bounds or a ref to a container element), `dragElastic` (0 = rigid boundary, 1 = full movement, default 0.5), `dragMomentum` (inertia after release), `dragTransition` (inertia physics config), `dragDirectionLock` (lock to dominant axis), `dragSnapToOrigin` (spring back to origin), and `dragPropagation`. The `useDragControls` hook enables starting drag programmatically from another element with `controls.start(event, { snapToCursor: true })`.

### SVG animations

Motion provides a motion component for every SVG element: `motion.path`, `motion.circle`, `motion.rect`, `motion.line`, `motion.polygon`, `motion.polyline`, `motion.ellipse`, `motion.svg`, plus filter primitives like `motion.feTurbulence` and `motion.feDisplacementMap`. **Line drawing** uses `pathLength`, `pathSpacing`, and `pathOffset` as 0–1 progress values. **Path morphing** animates the `d` attribute directly between paths with matching point counts. ViewBox animation is supported via `animate={{ viewBox: "100 0 200 200" }}`. SVG-specific transform attributes use `attrX`, `attrY`, and `attrScale`.

### Variant-based animations and orchestration

Variants define named animation states as objects: `{ hidden: { opacity: 0 }, visible: { opacity: 1 } }`. Setting `animate="visible"` on a parent **propagates** that label down through all nested motion components with matching variant names — no prop drilling required. **Dynamic variants** accept functions that resolve per-element using the `custom` prop, enabling index-based stagger delays. Multiple variants apply simultaneously via arrays: `animate={["visible", "danger"]}`.

Orchestration options within variant transitions include `when` (`"beforeChildren"` or `"afterChildren"`), `delayChildren`, and the `stagger()` function with options for `from: "last"`, `from: "center"`, or a specific index. The `stagger()` function also works imperatively with `animate()`.

### Value animations (motion values and hooks)

Motion values are signal-like reactive values that update the DOM **without triggering React re-renders**. The core hooks form a composable pipeline:

- **`useMotionValue(initial)`** — creates a manually-managed value with `get()`, `set()`, `getVelocity()`, `jump()`, `isAnimating()`, `stop()`, and event subscriptions
- **`useTransform(source, inputRange, outputRange)`** — maps one value's range to another, or accepts a pure function that auto-subscribes to any `.get()` calls
- **`useSpring(source, config)`** — wraps a value or number with spring physics; `.set()` animates, `.jump()` is instant
- **`useVelocity(motionValue)`** — tracks velocity of any numerical motion value (composable: `useVelocity(useVelocity(x))` gives acceleration)
- **`useTime()`** — motion value updating every frame with elapsed milliseconds
- **`useMotionTemplate`** — composes multiple motion values into a string template
- **`useMotionValueEvent(value, event, callback)`** — subscribes to "change", "animationStart", "animationComplete", "animationCancel" with auto-cleanup

### Imperative animate() function and sequences

The standalone `animate()` function works outside React components entirely. It exists in two sizes: **mini** (2.3kb, uses native Web Animations API) and **hybrid** (18kb, adds independent transforms, CSS variables, SVG paths, spring physics, sequences, color interpolation, and object animation including Three.js).

The hybrid version supports **timeline-like sequences** — arrays of animation definitions that play in order by default. The `at` parameter controls scheduling: absolute time (`1`), relative to previous end (`"+0.5"`), relative to previous start (`"<0.5"`), or named labels. Sequences can mix HTML elements, SVG, motion values, and JavaScript objects. Both versions return playback controls: `time`, `speed`, `play()`, `pause()`, `complete()`, `cancel()`, `stop()`, and a Promise-like `then()`.

---

## Physics, easing, and transition configurations

Motion's transition system is where the feel of every animation is defined. Three fundamental animation types exist, each with distinct parameters — all free.

### Spring physics (two modes)

**Physics-based springs** model real physical behavior with **`stiffness`** (default 1; higher = snappier), **`damping`** (default 10; 0 = oscillate forever), **`mass`** (default 1; higher = more sluggish), **`velocity`** (auto-inherited from gestures), `restSpeed` (0.1), and `restDelta` (0.01). These springs naturally incorporate velocity from interrupted animations and gestures, producing physically continuous motion.

**Duration-based springs** provide simpler control: `duration` in seconds, **`bounce`** (0 = no overshoot, 1 = extreme), and `visualDuration` — the time the animation visually appears to reach its target, with any "bouncy bit" happening afterward. Setting `visualDuration` overrides `duration` and makes coordinating springs with timed animations straightforward. If any of `stiffness`, `damping`, or `mass` is set, duration-based options are overridden.

Motion applies springs by default to physical properties (`x`, `y`, `scale`, `rotate`) and tweens to visual properties (`opacity`, `color`).

### Tween (duration-based)

Tween options include `duration` (default 0.3s), `ease`, `times` (keyframe positions as 0–1 array), `delay` (negative values start mid-animation), `repeat` (`Infinity` for loops), `repeatType` (`"loop"`, `"reverse"`, `"mirror"`), and `repeatDelay`.

### Inertia (velocity-based deceleration)

Used primarily for post-drag animations via `dragTransition`. Options: `power` (0.8 default; higher = further target), `timeConstant` (700; feel of deceleration), `modifyTarget` (function to snap — e.g., `target => Math.round(target / 50) * 50` for grid snapping), `min`/`max` (boundaries with bounce), `bounceStiffness` (500), and `bounceDamping` (10).

### Complete easing function library

Eleven named easings ship built-in: **`linear`**, **`easeIn`**, **`easeOut`**, **`easeInOut`**, `circIn`, `circOut`, `circInOut`, `backIn`, `backOut`, `backInOut`, and `anticipate`. Cubic bezier arrays (`[0.17, 0.67, 0.83, 0.67]`) and custom JavaScript functions (`(t) => t * t`) are both supported. Additional utilities include `cubicBezier()` for precise control, **`steps(n, "start"|"end")`** for discrete stepped easing (CSS `steps()` compliant), `reverseEasing()` to flip any easing, and `mirrorEasing()` to create symmetric in-out curves from one-directional easings. The standalone `spring()` function generates CSS-compatible `linear()` easing strings for use outside JavaScript — in pure CSS, Astro, or server components.

---

## 33 named animation patterns and how Motion implements them

Each pattern below maps to specific free Motion APIs. Where Motion+ provides a premium shortcut component, it's noted — but every pattern is achievable with the free library.

### Scroll and reveal patterns

**Parallax scrolling** chains `useScroll` → `useTransform` → `useSpring`, mapping `scrollYProgress` to different translation speeds per layer. GPU-accelerated via ScrollTimeline. **Reveal on scroll** (fade-in, slide-up, scale) uses `whileInView` with `viewport={{ once: true }}` — the most common animation pattern on modern sites. **Scroll progress indicators** pipe `useScroll().scrollYProgress` through `useSpring` to a `motion.div` with `style={{ scaleX }}` fixed at the top of the page. **Staggered grid reveals** combine `whileInView` with variants using `staggerChildren` or the `stagger()` function with `from: "center"` for radial reveals.

### Hover and interaction patterns

**Card hover effects** (3D tilt) track mouse position via `onMouseMove`, calculate `rotateX`/`rotateY` from cursor offset relative to card center, and smooth values through `useSpring`. Apply `perspective` and `transformStyle: "preserve-3d"` for depth. **Elastic/bouncy interactions** use spring transitions with low damping: `transition={{ type: "spring", stiffness: 400, damping: 10 }}` on `whileTap={{ scale: 0.85 }}`. **Magnetic cursor effects** calculate distance from target center using `useMotionValue` and apply spring-based attraction forces — achievable free, though Motion+ offers a dedicated `Cursor` component. **Cursor-following elements** track `event.pageX/Y` into motion values and pipe through `useTransform` for rotation or position mapping with spring smoothing.

### Page and component transitions

**Page/route transitions** wrap route content in `AnimatePresence mode="wait"` with a unique `key` per route. For Next.js App Router, a "FrozenRouter" pattern prevents premature unmounting during exit animations. Notable implementations include Denis Snellenberg's curve transitions, perspective transforms (scale down + translate), and K72's stair-effect column animations. **Modal/dialog animations** leverage `layoutId` on both trigger and dialog elements for seamless shared-element morphing, wrapped in `AnimatePresence` for exit handling. **Notification/toast enter-exit** uses `AnimatePresence mode="popLayout"` so remaining items reflow smoothly; add `drag="x"` with `onDragEnd` for swipe-to-dismiss.

### Text and number animations

**Text reveal animations** (character-by-character, word-by-word) split text into arrays and apply parent variants with `staggerChildren: 0.05`. Each character animates from `{ opacity: 0, y: "0.25em" }` to `{ opacity: 1, y: 0 }`. Free implementation requires manual text splitting; Motion+ offers the `splitText` utility. **Number counting/ticking** animates a `useMotionValue` from 0 to target, pipes through `useTransform` with `Math.round()`, and renders directly — no re-renders. Motion+ provides the dedicated `AnimateNumber` component. **Typewriter effects** map characters with incrementing delays: `transition={{ delay: i / 10 }}` per character. Motion+ has a `Typewriter` component for this.

### Layout and list patterns

**Accordion/collapse animations** use the `layout` prop; toggling height causes Motion to automatically FLIP-animate the change. **List reordering** uses the built-in `Reorder.Group` and `Reorder.Item` components with `values` and `onReorder` — items become draggable with automatic z-index management and reorder animation. **Masonry layout transitions** add `layout` to every grid item; filtering, resizing, or reordering triggers automatic position animations via FLIP transforms. `LayoutGroup` synchronizes animations across separately-rendered components.

### Navigation and UI component patterns

**Animated navigation menus** animate SVG `path` `d` attributes for hamburger → X morphing, or use `AnimatePresence` with sliding `motion.nav` for drawer menus. Menu items stagger in using `staggerChildren`. **Tooltip animations** conditionally render within `AnimatePresence`, animating scale and opacity with `transformOrigin` based on tooltip position. **Swipe carousels** use `drag="x"` with `dragConstraints`, checking velocity/offset on `onDragEnd` to determine slide direction, then animating to the next position. Motion+ offers a pre-built `Carousel` component.

### SVG and shape patterns

**Morphing shapes** animate the `d` attribute directly for same-point-count paths, or integrate Flubber.js via Motion's `mixer` option in `useTransform` for arbitrary shape interpolation. **SVG line drawing** animates `pathLength` from 0 to 1 on any SVG shape element. **Animated borders/outlines** use SVG `motion.rect` with `pathLength` animation, or position an oversized gradient behind a card and animate its rotation for gradient border effects. **Clip-path animations** animate between `inset()`, `circle()`, and `polygon()` values for reveal effects and page transitions.

### Perpetual and ambient animations

**Floating/levitation effects** use keyframe arrays with `repeat: Infinity` and `repeatType: "reverse"`: `animate={{ y: [0, -20, 0] }}` with `ease: "easeInOut"`. **Infinite marquee/ticker** duplicates content and animates `x` from `0` to `-100%` with `repeat: Infinity, ease: "linear"`. Motion+ provides the `Ticker` component for optimized marquee. **Loading/skeleton animations** animate SVG elements or background positions with infinite repeat. **Gradient animations** animate CSS `background-position` or `background-size` via keyframes or motion values. **Noise/grain backgrounds** animate SVG `feTurbulence` `seed` attribute via `useAnimationFrame` for shifting grain textures.

### Advanced visual effects

**3D perspective transforms / card flips** stack two `motion.div` elements with `backfaceVisibility: "hidden"`, animating `rotateY` between 0 and 180 degrees with spring transitions. **Confetti/particle effects** generate randomized particle arrays and animate each with different spring configs and random delays using the imperative `animate()` function. **Glitch/distortion effects** rapidly alternate `clipPath` and position keyframes on duplicated elements with color channel offsets and `mix-blend-mode`. **Animated counters** pipe `useMotionValue` through `animate()` with duration-based transitions.

---

## Complete free API reference

### Components

| Component | Size | Purpose |
|-----------|------|---------|
| `motion.div` (and all HTML/SVG elements) | core | Animatable element with `animate`, `initial`, `exit`, `transition`, `variants`, `style`, `layout`, `layoutId`, `drag`, and all gesture props |
| `motion.create(Component)` | core | Wraps any React component or custom HTML element for animation |
| `AnimatePresence` | core | Enables exit animations; modes: `"sync"`, `"wait"`, `"popLayout"` |
| `LayoutGroup` | core | Synchronizes layout animations across sibling component trees |
| `MotionConfig` | core | Sets default `transition`, `reducedMotion` policy, and CSP `nonce` for descendants |
| `LazyMotion` | core | Lazy-loads animation features for bundle optimization |
| `Reorder.Group` + `Reorder.Item` | core | Drag-to-reorder list primitives |

### Hooks

| Hook | Size | Returns |
|------|------|---------|
| `useMotionValue(initial)` | core | Reactive motion value with `get/set/jump/getVelocity/on` |
| `useTransform(source, in, out)` | core | Derived motion value mapped from input to output ranges |
| `useSpring(source, config)` | core | Spring-animated motion value |
| `useScroll(options)` | core | `{ scrollX, scrollY, scrollXProgress, scrollYProgress }` |
| `useVelocity(motionValue)` | core | Motion value tracking velocity (composable for acceleration) |
| `useTime()` | core | Motion value with elapsed milliseconds per frame |
| `useMotionTemplate` | core | Composed string from multiple motion values |
| `useMotionValueEvent(value, event, cb)` | core | Auto-cleaning event subscription |
| `useAnimate()` | core | `[scopeRef, animate]` for imperative, scoped animation |
| `useAnimationFrame(callback)` | core | Per-frame callback with time and delta |
| `useInView(ref, options)` | 0.6kb | Boolean for viewport visibility |
| `usePageInView()` | core | Page/tab visibility detection |
| `useDragControls()` | core | Programmatic drag start/stop |
| `useReducedMotion()` | core | Boolean for OS reduced-motion preference |

### Standalone functions (vanilla JS compatible)

| Function | Bundle | Purpose |
|----------|--------|---------|
| `animate(target, values, options)` | mini: 2.3kb / hybrid: 18kb | Animate elements, selectors, values, objects, or sequences |
| `scroll(callback, options)` | core | Scroll-linked animation runner |
| `inView(element, callback, options)` | core | Viewport detection |
| `hover(element, callback)` | <1kb | Hover gesture handler |
| `press(element, callback)` | core | Press gesture handler |
| `resize(element, callback)` | core | Resize observer |
| `stagger(duration, options)` | core | Stagger delay generator with `from` option |
| `spring(visualDuration, bounce)` | core | CSS-compatible spring easing string generator |
| `cubicBezier(x1, y1, x2, y2)` | core | Cubic bezier easing function |
| `steps(count, direction)` | core | Stepped easing function |
| `mix(from, to, progress)` | core | Value interpolation |
| `transform(value, inRange, outRange)` | core | One-off value mapping |
| `wrap(min, max, value)` | core | Wrapping value within range |

### Framework support

Motion's free tier runs on **React** (`motion/react`), **vanilla JavaScript** (`motion` or `motion/mini`), and **Vue** (`motion-v` package with Nuxt module support). Layout animations and the component-level API (`Reorder`, `LayoutGroup`) are React/Vue only; vanilla JS covers `animate()`, `scroll()`, `inView()`, gestures, and all easing/spring utilities. Integration guides exist for Next.js, Nuxt, Astro, Squarespace, Webflow, WordPress, Radix UI, and Base UI.

---

## What Motion+ adds (and what to skip)

Seven premium components comprise the entire paid surface area: **AnimateNumber**, **Carousel**, **Cursor**, **ScrambleText**, **Ticker**, **Typewriter**, and **splitText**. Early access features include `AnimateView` and `AnimateActivity` for View Transitions API integration. The package also includes 250+ additional examples and tutorials beyond the 80+ free ones, a Visual Studio Code Transition Editor, an AI Kit with MCP integration, and private Discord/GitHub access. Critically, **every pattern these components implement can be built from scratch using the free core library** — Motion+ simply provides polished, accessible, pre-built versions that save development time.

---

## Real-world sites and community resources

Award-winning sites built with Motion/Framer Motion span agencies, portfolios, and products. **Basement Studio** (basement.studio) combines Motion with Three.js and Next.js for Awwwards-recognized 3D interactive experiences. **Denis Snellenberg's** portfolio showcases signature curve page transitions. **K72 Agency** demonstrates stair-effect column animations. The Framer Gallery at framer.com/gallery and Awwwards' dedicated framer-motion tag showcase hundreds of production implementations. Olivier Larose's blog (blog.olivierlarose.com) serves as the premier tutorial resource with 20+ detailed guides covering parallax, sticky cursors, SVG morphing, page transitions, and text effects — all using Next.js and Motion.

## Conclusion

Motion's free tier is remarkably complete. The entire animation engine — spring physics, scroll-linked GPU-accelerated animations, layout FLIP transitions, shared-element morphing, drag-to-reorder, SVG path drawing, variant orchestration, imperative timelines, and 14+ composable hooks — ships at zero cost. The seven Motion+ components (ticker, typewriter, cursor, carousel, counter, scramble text, text splitting) are convenience layers, not capability gates. Every one of the 33 named patterns cataloged here — from parallax and 3D card flips to confetti particles and masonry transitions — is implementable entirely within the free library. For teams choosing between animation libraries, Motion's combination of a **2.3kb mini bundle**, native ScrollTimeline acceleration, React/Vue/vanilla JS support, and complete feature availability under the MIT license makes it uniquely positioned as the most capable free animation library on the web today.