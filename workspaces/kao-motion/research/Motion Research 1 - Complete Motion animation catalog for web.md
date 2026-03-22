# The complete Motion animation catalog for web

Motion (formerly Framer Motion) is the dominant React animation library with **30+ million monthly npm downloads** and **232,000+ tracked websites** using it in production. Now at version **12.38.0**, it has evolved from a React-only library into a cross-framework animation engine supporting React, Vue, and vanilla JavaScript. The library's hybrid engine dynamically switches between the Web Animations API for hardware-accelerated performance and JavaScript-driven animation for spring physics, gestures, and complex orchestration — all transparently. What follows is an exhaustive catalog of every animation type, technique, pattern, and system available in Motion.

---

## Core animation engine and how it works

Motion's architecture rests on three pillars: **NativeAnimation** (Web Animations API for GPU-accelerated CSS properties at 120fps), **JSAnimation** (requestAnimationFrame-driven for springs, inertia, and gesture tracking), and **AsyncMotionValueAnimation** (the orchestration layer that automatically selects between the two). The library ships in two sizes: **mini** at 2.3kb using WAAPI only, and **hybrid** at 18kb with the full engine. The React bundle with all features weighs approximately 34kb, reducible to ~4.6kb initial load via `LazyMotion`.

Every HTML and SVG element has a motion counterpart (`motion.div`, `motion.path`, `motion.svg`, etc.) that extends the native element with animation props. These components bypass React's render cycle entirely — animated values update through Motion's optimized DOM renderer, meaning complex 60-frame-per-second animations cause zero React re-renders. Physical properties like `x`, `y`, `scale`, and `rotate` default to spring physics, while visual properties like `opacity` and `color` default to tween easing.

The **MotionValue** system is the reactive foundation powering everything. These signal-like values track both state and velocity, compose through `useTransform` and `useSpring`, and propagate changes to the DOM without touching React. You can chain them: `useScroll` → `useTransform` → `useSpring` → style binding, and the entire pipeline runs outside React's reconciliation.

---

## Every animation type and API surface

### Enter, update, and exit animations

The most fundamental pattern uses three props: `initial` sets the starting visual state, `animate` defines the target, and `exit` (paired with `AnimatePresence`) handles removal. Setting `initial={false}` skips the enter animation — critical for server-side rendering to prevent flash-of-animation.

**Keyframe animations** accept arrays of values: `animate={{ x: [0, 100, 0] }}`. A `null` value in the array inherits the current state. The `times` array (values from 0 to 1) positions each keyframe precisely, and per-segment easing is supported: `ease: ["easeIn", "easeOut"]`. Default keyframe duration is **0.8 seconds** versus 0.3 seconds for single-value animations.

**Variant-based animations** define named states (`"hidden"`, `"visible"`) that propagate through component trees automatically. Child motion components with matching variant names animate in concert with their parent — no explicit wiring required. Variants can be functions receiving a `custom` prop for dynamic, index-based behavior like stagger delays.

### The transition system in full

Motion supports three fundamental transition types:

**Spring physics** offers two configuration modes. Physics-based springs use `stiffness` (default 100), `damping` (default 10), and `mass` (default 1) to model a damped harmonic oscillator. **Underdamped springs** (low damping relative to stiffness) oscillate before settling — the classic "bouncy" feel most UI springs use. **Critically damped springs** return to rest fastest without overshoot. **Overdamped springs** move slowly without oscillation. The alternative duration-based mode uses `duration` and `bounce` (0 to 1), which is easier for coordinating timing. A newer `visualDuration` parameter defines when the animation *appears* complete, with the "bouncy bit" happening after. Springs automatically incorporate velocity from interrupted animations and gestures for natural handoff.

**Tween animations** use duration and easing curves. Built-in easings include `linear`, `easeIn`, `easeOut`, `easeInOut`, `circIn`, `circOut`, `circInOut`, `backIn`, `backOut`, `backInOut`, and `anticipate`. Custom easing accepts cubic bezier arrays (`[0.17, 0.67, 0.83, 0.67]`) or arbitrary JavaScript functions. The `steps()` function creates discrete stepping. Utility functions `reverseEasing` and `mirrorEasing` transform existing curves. Repeat control uses `repeat` (set to `Infinity` for looping), `repeatType` (`"loop"`, `"reverse"`, `"mirror"`), and `repeatDelay`.

**Inertia animations** decelerate based on initial velocity — the default for post-drag momentum. Parameters include `power` (throw distance multiplier, default 0.8), `timeConstant` (deceleration feel, default 700), `modifyTarget` (a function for snap-to-grid behavior), and `min`/`max` boundaries with `bounceStiffness` and `bounceDamping` for elastic boundary response.

Per-value transitions let you assign different transition types to different properties: `transition={{ duration: 1, opacity: { ease: "linear" }, x: { type: "spring" } }}`.

### Gesture recognition system

Motion provides six gesture types, each with a "while" prop that animates to a target during the gesture and reverts when it ends:

- **`whileHover`** — pointer hover, filtered to exclude touch events (unlike CSS `:hover`)
- **`whileTap`** — press and release, with automatic keyboard accessibility via Enter key
- **`whileFocus`** — matches CSS `:focus-visible` rules
- **`whileDrag`** — active during drag gesture
- **`whileInView`** — element visible in viewport via pooled IntersectionObserver
- **Pan detection** — pointer pressed and moved more than 3px, with `onPan`, `onPanStart`, `onPanEnd` handlers

The **drag system** is comprehensive: `drag` enables on both axes (or constrained to `"x"` or `"y"`), `dragConstraints` accepts pixel bounds or a ref to a container element, `dragElastic` (0 to 1, default 0.5) controls movement beyond constraints, `dragMomentum` enables post-release inertia, `dragSnapToOrigin` returns to center, `dragDirectionLock` constrains to the first detected axis, and `useDragControls` enables programmatic drag initiation from external elements. The `propagate` prop (v12.33+) prevents gesture events from bubbling to parents.

### Scroll animation system

Two distinct approaches serve different needs. **Scroll-triggered animations** use `whileInView` with viewport options (`once`, `root`, `margin`, `amount`) to fire when elements enter the viewport. **Scroll-linked animations** use the `useScroll` hook, which returns four motion values: `scrollX`, `scrollY`, `scrollXProgress`, and `scrollYProgress`. These bind directly to scroll position through the native `ScrollTimeline` API for hardware-accelerated performance when driving compositor-friendly properties like `opacity`, `transform`, `clipPath`, or `filter`.

The `useScroll` hook accepts `container` (a scrollable element ref), `target` (a tracked element ref), `offset` (intersection definitions like `["start end", "end start"]`), and `axis`. The offset syntax uses `"<target edge> <container edge>"` where edges can be `"start"`, `"center"`, `"end"`, or pixel/percentage values. Version 12.35.0 added native `ViewTimeline` support.

### Layout animation system

Motion implements an enhanced **FLIP** (First, Last, Invert, Play) technique. Adding `layout` to any motion component causes it to automatically animate between positions when React re-renders change its layout. Before the render, Motion records the element's position; after, it records the new position, applies an inverse transform, and animates back to zero. This happens entirely via CSS `transform` for maximum performance.

The `layout` prop accepts `true` (animate position and size), `"position"` (position only), `"size"` (size only), or `"preserve-aspect"`. The key enhancement over basic FLIP is **scale distortion correction** — Motion automatically corrects `borderRadius`, `boxShadow`, and all child elements during scale transforms.

**`layoutId`** enables shared element transitions: assign matching IDs to different components, and Motion automatically animates between them when one mounts and another exists. If both coexist momentarily, they crossfade. **`LayoutGroup`** scopes these IDs and coordinates layout recalculation across related components. Additional props include `layoutScroll` (for scrollable ancestors), `layoutRoot` (for `position: fixed` elements), and `layoutAnchor` (custom reference point).

### Orchestration and sequencing

The **variants system** propagates named animation states through component trees. Orchestration parameters within variant transitions include `when` (`"beforeChildren"` or `"afterChildren"`), `delayChildren`, and the `stagger()` function. The `stagger(duration, options)` function creates cascading delays with options for `from` (`"first"`, `"center"`, `"last"`, or a specific index), `startDelay`, and `ease` (to redistribute timing through an easing curve for non-linear stagger).

**Timeline sequences** (hybrid animate only) allow complex choreography:

```js
const sequence = [
  ["ul", { opacity: 1 }],
  ["li", { x: [-100, 0] }, { at: "<" }],      // same start as previous
  ["a", { scale: 1.2 }, { at: "+0.5" }],       // 0.5s after previous ends
  ["section", { y: 0 }, { at: 1.2 }],          // absolute time
]
animate(sequence, { defaultTransition: { duration: 0.2 } })
```

The `at` parameter accepts absolute times, relative offsets (`"+0.5"`, `"-0.2"`), the `"<"` shorthand (start with previous), and named labels. Full playback control is available: `time`, `speed`, `play()`, `pause()`, `stop()`, `complete()`.

### SVG and path animations

All SVG elements are supported as motion components. **Line drawing** uses `pathLength`, `pathSpacing`, and `pathOffset` (0 to 1 progress values) on `path`, `circle`, `ellipse`, `line`, `polygon`, `polyline`, and `rect`. **Path morphing** animates the `d` attribute between shapes — paths with the same number of points morph natively; dissimilar shapes require Flubber.js interpolation. **ViewBox animation** pans and zooms SVGs: `<motion.svg animate={{ viewBox: "100 0 200 200" }} />`. SVG filter elements like `motion.feTurbulence` are also animatable.

### Animatable value types

Motion interpolates **numbers**, **strings with numeric values** (`"10px"`, `"0vh"`), **all CSS color formats** (hex, rgba, hsla, oklch, oklab, `color-mix()`), **complex multi-value strings** (box-shadow), **`display: "none"/"block"`**, **`visibility: "hidden"/"visible"`**, and **`width`/`height` to/from `"auto"`**. Cross-unit animation is supported for positional properties — animate from `"100%"` to `"calc(100vw - 50%)"` directly. Independent transform shortcuts (`x`, `y`, `z`, `rotate`, `rotateX`, `rotateY`, `scale`, `scaleX`, `scaleY`, `skewX`, `skewY`, `transformPerspective`) can each have separate animation options.

---

## All React components and hooks

### Components

| Component | Purpose |
|-----------|---------|
| `motion.*` | Animation-enabled HTML/SVG elements |
| `AnimatePresence` | Exit animations; modes: `"sync"`, `"wait"`, `"popLayout"` |
| `LayoutGroup` | Scoped layout animation coordination |
| `Reorder.Group` / `Reorder.Item` | Drag-to-reorder lists |
| `MotionConfig` | Default transitions, `reducedMotion`, `skipAnimations` |
| `LazyMotion` | Tree-shakeable feature loading |
| `AnimateActivity` | Animated React Activity (React 19.2+, Motion+ early access) |
| `AnimateView` | View Transitions API wrapper (Motion+ alpha) |

### Hooks

| Hook | Purpose |
|------|---------|
| `useMotionValue` | Create reactive animation values outside React |
| `useTransform` | Derive values via function or range mapping |
| `useSpring` | Spring-connected motion value |
| `useScroll` | Scroll position and progress tracking |
| `useVelocity` | Velocity tracking (chainable for acceleration) |
| `useMotionValueEvent` | React-safe motion value event subscription |
| `useMotionTemplate` | Template string composition from motion values |
| `useAnimate` | Imperative animation control with scoped selectors |
| `useAnimationFrame` | Per-frame callback with time and delta |
| `useInView` | Viewport detection returning boolean |
| `usePageInView` | Page/tab visibility detection |
| `useDragControls` | Programmatic drag initiation |
| `useReducedMotion` | OS accessibility preference detection |
| `useTime` | Elapsed time motion value updating every frame |

### Vanilla JavaScript API

The standalone `animate()`, `scroll()`, `inView()`, `hover()`, `press()`, `resize()`, and `stagger()` functions work without React. The `animate()` function handles HTML elements, CSS selectors, JavaScript objects (including Three.js), and motion values. Renderers like `styleEffect`, `attrEffect`, `svgEffect`, and `propEffect` bind motion values to DOM properties. The `spring()` generator function produces CSS-compatible `linear()` easing for pure CSS springs. Version 12.30.0 introduced `animateLayout` for vanilla JS layout animations.

---

## 26 component animation pattern recipes

### Hero sections and entry choreography

Hero animations combine `initial={{ opacity: 0, y: 20 }}` with `animate={{ opacity: 1, y: 0 }}` on elements, orchestrated through variants with `staggerChildren`. Text reveals split headings into `motion.span` elements per word or character with incremental delays. Background parallax layers use `useScroll` + `useTransform` to move at different speeds. The parent container uses `initial="hidden" animate="visible"` with child variants for cascading entry.

### Navigation and menu systems

**Hamburger menus** use `useCycle` to toggle states, animating SVG `motion.path` elements for the hamburger-to-X morph via `d` attribute keyframes or `rotate`/`y` transforms. **Sidebars** wrap in `AnimatePresence`, animating `x` from `-300` to `0` with staggered menu items. **Dropdowns** use `useAnimate` with `stagger(0.1, { startDelay: 0.25 })`, animating container dimensions then child items. **Mobile fullscreen navs** use `AnimatePresence` with opacity/scale transitions and staggered item entry.

### Card interactions

**Hover lift**: `whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}`. **Card flip**: animate `rotateY: 180` on click with `perspective: 800` on the parent and `backfaceVisibility: "hidden"` on faces. **Expandable cards**: use `layoutId` connecting a thumbnail to an expanded detail view — Motion auto-animates the layout transition. **Tilt-on-hover**: track mouse position via `onMouseMove`, calculate `rotateX`/`rotateY` with `useMotionValue` and `useTransform` relative to card center, apply with perspective.

### Modals, dialogs, and overlays

Scale-up entry: `initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}` wrapped in `AnimatePresence`. Backdrop gets its own motion div with opacity transitions. **Shared element modals** use `layoutId` on both the trigger and the modal — Motion animates the transition between positions and sizes automatically. Works with Radix and Base UI via render props.

### List and grid reordering

Adding the `layout` prop to each `motion.li` causes Motion to auto-animate position changes when items are reordered, added, or removed. `AnimatePresence` wraps the list for exit animations on removed items. `LayoutGroup` synchronizes independent components affecting each other's layout. Toggling between grid and list CSS layouts with `layout` on items produces automatic repositioning animations.

The dedicated `Reorder.Group` and `Reorder.Item` components provide drag-to-reorder with `axis` constraint (`"x"` or `"y"`), `values` for the source array, and `onReorder` for the state updater. Items accept all motion props including `whileDrag` styling.

### Tab transitions

The animated tab indicator uses `layoutId="underline"` rendered inside the active tab only — Motion slides it between tabs automatically. Content crossfading wraps panels in `AnimatePresence mode="wait"` with unique keys and opacity transitions. **Direction-aware tabs** pass direction (1 or -1) via the `custom` prop, with dynamic variants reading direction to determine slide direction.

### Accordion and collapse

Motion can animate to `height: "auto"` directly — it measures content and animates using transforms. The pattern uses `animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}` with `overflow: "hidden"`. Wrapping multiple accordions in `LayoutGroup` ensures collapsing one smoothly pushes siblings via coordinated layout animations.

### Carousel and slider

**Gesture-based**: use `drag="x"` with `dragConstraints`, checking `info.offset.x` in `onDragEnd` to determine swipe direction. **AnimatePresence slideshow**: direction-aware variants slide images in from left or right based on a `custom` direction prop. The premium **Motion+ Carousel** provides infinite loop, pixel-perfect swiping, wheel threshold, and accessibility out of the box.

### Toast and notification stacks

Entry: `initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}`. Each toast gets the `layout` prop so new additions smoothly reposition the stack. `AnimatePresence` handles enter/exit. Auto-dismiss uses `setTimeout` to remove from state; Motion completes the exit animation before DOM removal.

### Text animation techniques

**Word-by-word reveal**: split text into `motion.span` elements with incremental delays. **Character-by-character**: same pattern with `staggerChildren: 0.03` in variants. **DIY typewriter**: use `animate(0, text.length, { onUpdate: ... })` to progressively slice a string. **Premium options** include Motion+'s `Typewriter` (natural speed variance, cursor blink, backspace), `splitText` (DOM splitting into animatable spans per character/word/line), and `ScrambleText` (randomized character resolution).

### SVG path drawing and morphing

**Drawing**: `initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}` on `motion.path` — compatible with path, circle, ellipse, line, polygon, polyline, and rect. **Same-structure morphing**: animate the `d` attribute directly. **Complex morphing** between dissimilar shapes: combine Flubber.js interpolation with Motion's `animate` function via `onUpdate`. **ViewBox animation** enables smooth SVG panning and zooming.

### Cursor-following and magnetic effects

**Custom cursor**: track mouse via `onPointerMove`, store in `useMotionValue`, smooth with `useSpring`, apply as `style={{ x: springX, y: springY }}` to a fixed-position motion div. **Magnetic buttons**: calculate distance from button center on hover, pull toward cursor via `useSpring`, reset on leave. The premium **Motion+ Cursor** component offers magnetic pull, cursor zones, morph-to-target via layout animations, and floating tooltips.

### Marquee and ticker

**DIY**: duplicate content, animate `x` from `0` to `"-50%"` with `repeat: Infinity, ease: "linear"`, using `display: flex; width: max-content`. The premium **Motion+ Ticker** drives infinite scroll via time, drag, or scroll with optimized rendering.

### Counter and number animations

**DIY**: `animate(0, 1000, { duration: 2, onUpdate: (v) => setCount(Math.round(v)) })`. The premium **AnimateNumber** provides individual digit tickers with spring physics, `Intl.NumberFormat` support (currency, compact notation), and a `trend` prop controlling spin direction.

### Progress indicators

**Scroll progress bar**: bind `useScroll`'s `scrollYProgress` directly to `style={{ scaleX }}` with `transformOrigin: "left"`. Pipe through `useSpring` for physics-based smoothing. **Circular progress**: animate `motion.circle`'s `pathLength` bound to a progress value. **Linear progress**: animate `width` as a percentage.

### Skeleton loading states

Pulsing placeholders animate opacity through keyframes `[0.5, 1, 0.5]` with `repeat: Infinity`. Shimmer effects animate `backgroundPosition` or slide a gradient highlight via `x` translation. Wrap in `AnimatePresence` with `exit={{ opacity: 0 }}` to fade out when content loads.

### Page route transitions

**Next.js Pages Router**: wrap `<Component>` in `AnimatePresence mode="wait"` in `_app.js`, keyed by `router.route`. Each page wraps content in a motion div with enter/exit animations. **App Router**: use `template.tsx` with a `FrozenRouter` pattern that freezes the layout context during exit animations. The community notes App Router exit animations remain fragile due to reliance on Next.js internals.

### Image gallery and lightbox

Thumbnails get `layoutId={`img-${id}`}`; the detail view uses the same `layoutId`. Motion auto-animates from grid position to full-screen. Backdrop fades in via `AnimatePresence`. **Drag-to-dismiss**: add `drag="y"` to the lightbox image, close on drag offset threshold.

### 3D transforms and perspective

**Card flip**: animate `rotateY: 180` with `perspective: 800` on the parent and `transformStyle: "preserve-3d"`. **Tilt**: `whileHover={{ rotateX: 5, rotateY: -5, scale: 1.05 }}` with perspective. **3D drag**: drive `rotateX`/`rotateY` from drag offset via `useMotionValue` and `useTransform`.

### Background animations

**Gradient animation**: animate CSS custom properties or `background` through keyframe arrays. **Blob effects**: multiple motion divs with `borderRadius: "50%"`, animating `x`, `y`, `scale` at different durations with `repeat: Infinity, repeatType: "mirror"`, plus CSS `filter: blur()` and `mix-blend-mode`. **SVG noise**: animate `motion.feTurbulence` `baseFrequency` for organic movement.

### Hover effects collection

**Underline reveal**: child motion div transitions `width` from 0 to `"100%"` via parent `whileHover` variant. **Scale**: `whileHover={{ scale: 1.05 }}`. **Glow**: animate `boxShadow` or use variant propagation where parent hover triggers child glow. **Magnetic pull**: small `x`/`y` offset via `useSpring` based on mouse position relative to element.

### Micro-interactions

**Button press**: `whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}`. **Toggle switch**: the `layout` prop on the switch handle with toggled `justifyContent` auto-animates position. **Like button**: combine `whileTap={{ scale: 1.3 }}` with `useAnimate` for sequenced particle animations. **Error shake**: keyframe `x: [0, -10, 10, -10, 10, 0]`.

### Loading animations

**Spinner**: `rotate: 360` with `repeat: Infinity, ease: "linear"`. **Bouncing dots**: three motion divs with staggered `y: [0, -15, 0]` keyframes. **Loading bars**: staggered `scaleY` keyframes. **Path drawing loader**: `pathLength` from 0 to 1 with infinite repeat.

### Parallax effects

Multiple layers transform at different rates: `useTransform(scrollYProgress, [0, 1], [0, -100])` for slow background, `[0, -300]` for fast foreground. Pipe through `useSpring` for physics-based smoothing. A custom `useParallax(scrollYProgress, distance)` hook encapsulates the pattern.

---

## Advanced techniques and sophisticated patterns

### Shared element transitions across routes

The `layoutId` system powers cross-route transitions when combined with `AnimatePresence`. An element on page A with `layoutId="hero"` animates to the position of an element with the same ID on page B during navigation. The new **AnimateView** (Motion+ alpha) wraps the browser's View Transitions API, adding spring physics, interruptibility, and transform-based performance that the raw API lacks. Unlike browser view transitions, Motion's approach doesn't block pointer events, supports multiple simultaneous animations, and handles scroll-awareness.

### Scroll-driven storytelling

Combine `useScroll` with `target` refs and custom `offset` configurations to create section-by-section narrative experiences. Map `scrollYProgress` to `opacity`, `scale`, `x`, `y`, `backgroundColor`, `filter`, and `clipPath` via `useTransform`. Hardware acceleration kicks in automatically when scroll progress drives compositor-friendly properties. Horizontal scrolling stories use a tall container (e.g., `height: 300vh`) with a `position: sticky` inner wrapper, mapping `scrollYProgress` to horizontal `x` translation.

### Animation timeline orchestration

The sequence syntax enables film-like choreography across multiple elements. Each segment specifies a target (CSS selector, element, or Three.js object), keyframes, and timing via the `at` parameter. Sequences compose by spreading arrays: `[...introSequence, ...mainSequence]`. Full scrubbing support via the `time` property enables scroll-linked timeline playback — bind `scroll()` to an `animate()` sequence for scroll-driven multi-element choreography.

### Three.js, WebGL, and Canvas integration

Motion's `animate()` function works with any JavaScript object, including Three.js cameras, geometries, and materials: `animate(camera.rotation, { y: 360 })`. Three.js objects can even appear in the same timeline sequence as DOM elements. MotionValues can drive WebGL uniforms, canvas draw calls, or any non-DOM rendering via change subscriptions.

### Scroll velocity and physics-based effects

Chain `useScroll` → `useVelocity` to get scroll speed, then drive blur, skew, or scale based on velocity magnitude. `useVelocity` is chainable — applying it twice gives acceleration. `useSpring` smoothing on velocity values prevents jitter. Scroll direction detection uses `useMotionValueEvent` to compare current and previous scroll positions.

### Performance tier system

Motion's official performance guide ranks properties by rendering cost. **S-tier** (compositor only, safest): `transform`, `opacity`. **A-tier** (compositor in most browsers): `filter`, `clipPath`, `backgroundColor`. **B-tier** (triggers paint): `boxShadow`, `borderRadius` — use `filter: "drop-shadow(...)"` and `clipPath: "inset(0 round 50px)"` as performant alternatives. **D-tier** (triggers layout): `width`, `height`, `margin`, `top`, `padding` — use Motion's `layout` prop instead, which animates via transforms internally. The `willChange` property should be used sparingly to avoid excessive GPU memory consumption, especially on mobile.

---

## What's new in Motion v11 and v12

**Version 11** was the pivotal release that **merged Framer Motion (React) and Motion One (vanilla JS)** into a single unified `motion` package. This introduced the two-tier `animate` function (mini vs. hybrid), overhauled the scroll system with native `ScrollTimeline` support, and unified the API across frameworks.

**Version 12** brought gesture API refinements (callbacks now receive `(element, event)`), `ViewTimeline` support for `scroll` and `useScroll` (12.35.0), tap gesture propagation control via `propagate.tap` (12.33.0), transition inheritance via `transition.inherit` (12.32.0), bi-directional callbacks in animation sequences (12.31.0), global `skipAnimations` for testing (12.30.0), and `animateLayout` for vanilla JS layout animations (12.30.0).

**Motion+ premium APIs** (subscription-based) add production-ready components: `AnimateNumber` (digit ticker with Intl.NumberFormat), `Carousel` (infinite loop, wheel swipe), `Cursor` (magnetic, morphing), `Ticker` (time/drag/scroll-driven marquee), `Typewriter` (natural typing), `ScrambleText` (character scramble), `splitText` (DOM text splitting), and `AnimateView` (View Transitions API wrapper with springs).

**Motion Studio MCP** provides VS Code/Cursor integration with visual spring editing, AI-powered animation assistance (`/motion`, `/css-spring`, `/see-transition` skills), and performance audit tooling.

---

## Real-world implementations from notable websites

**Vercel** pioneered the now-ubiquitous **navbar hover pill** — a background highlight that smoothly follows the cursor between nav items using `layoutId` with spring transitions. This single pattern has been replicated thousands of times across the ecosystem.

**Stripe's morphing dropdown menu** is one of the most-studied Motion patterns. The mega-menu's content container transitions smoothly between navigation items using `layoutId` for shared layout animations, with `AnimatePresence` handling panel entrance/exit. Their multi-step hero animation uses keyframe sequences with orchestrated timing.

**Linear's spotlight card effect** tracks cursor position via `useMotionValue` and `useTransform` to apply dynamic radial gradients that follow the pointer. This pattern has been reproduced in Aceternity UI and other component libraries.

**Framer** itself runs every published website (43,100+ tracked) on Motion's engine, making it the largest single deployment of the library. The Framer Awards showcase sites like **Analogue Agency** (geometric scroll animations with bold color transitions), **27b** (interactive editorial storytelling), and **Temper Studio** (elevated e-commerce with parallax and hover effects).

**Awwwards-recognized sites** include developer portfolio **Etienne Planeix** (Developer Award + Site of the Day, January 2026), creative agency **Basement Studio** (combining Motion with Three.js for 3D transitions), and numerous others tagged under dedicated "Framer Motion" and "Motion" categories.

The **component library ecosystem** built on Motion is substantial. **Aceternity UI** offers 200+ animated components (3D cards, spotlight effects, infinite marquees, parallax, animated tabs). **Magic UI** (19,000+ GitHub stars) specializes in text effects and special visual treatments. **Motion Primitives** provides character/word reveals, magnetic buttons, and macOS-style dock animations. **nextjs-animated-components** contains 150+ components recreating patterns from Stripe, Vercel, and Linear. Others include Hover.dev, Cult UI, Variant Vault, UI-Layout, Animata, and Eldora UI.

---

## Conclusion

Motion's animation surface area spans **three transition types** (spring, tween, inertia), **six gesture recognizers**, **two scroll animation modes** (triggered and linked), **FLIP-based layout animations** with scale distortion correction, **timeline sequencing** with label-based choreography, and a **reactive MotionValue system** that composes entirely outside React's render cycle. The library handles everything from a simple `whileHover={{ scale: 1.05 }}` to scroll-driven multi-layer parallax storytelling to shared element transitions across routes.

The v12 era has added native `ViewTimeline` support, vanilla JS layout animations, gesture propagation control, and premium components that solve historically complex patterns (number tickers, carousels, magnetic cursors) in single components. The hybrid engine's automatic switching between WAAPI and JavaScript means developers never choose between performance and capability — Motion picks the optimal rendering path for each animation property on each frame. For any animation pattern that exists on the modern web, Motion either provides a first-class API or a composable primitive to build it.