---
name: kao-react-motion
description: >
  Use when building ADVANCED/COMPLEX React animations with Motion (formerly Framer Motion;
  `motion/react`) in a Tailwind + shadcn/ui (Radix) project — marketing sites, landing pages,
  hero reveals, feature grids, scroll-driven storytelling, parallax, horizontal-scroll sections,
  shared-element transitions, layout animations, and custom gesture UX that shadcn doesn't ship.
  Combines Motion with shadcn/Radix primitives via `asChild` + Radix Slot. Assumes shadcn theme
  tokens (text-foreground, bg-card, border-border, text-primary, etc.) exist — use them by
  default. AVOID auto-triggering for: default shadcn Dialog/Sheet/Popover/Tooltip/Dropdown
  enter-exit animations (already handled by Radix data-state + `tw-animate-css`), and simple
  hover/focus/active transitions (Tailwind `transition-*` / `hover:*` do those). If the user
  explicitly invokes this skill on one of those, help anyway. Does NOT cover Motion+ paid
  components (Cursor, AnimateNumber, Ticker, Motion Studio MCP).
license: MIT
metadata:
  author: kaotypr
  version: "1.0.0"
---

# Motion for React — Expert Guide

You are generating or editing React code that uses **Motion** (formerly Framer Motion) inside a
**Tailwind + shadcn/ui (Radix)** project. Your job is to produce idiomatic, performant, accessible
Motion code that a Motion maintainer would ship without edits — *and that fits the shadcn/Tailwind
stack this skill is scoped to*.

Motion's surface is large but organised. This file gives you the rules, the decision framework, and
a map. Reach into `references/` for full prop/hook/recipe detail whenever you need it.

## Context & scope — read this first

This skill is for **advanced or complex animations** in a Tailwind + shadcn project: landing and
marketing pages, hero reveals, feature grids, scroll-driven storytelling, parallax,
horizontal-scroll case studies, shared-element page transitions, layout animations, and custom
gesture UX that shadcn doesn't ship out of the box.

### Assume the stack

Unless the user says otherwise:

- **Tailwind v4 + shadcn/ui** is installed. Use **shadcn theme tokens** by default:
  `text-foreground`, `text-muted-foreground`, `bg-background`, `bg-card`, `bg-primary`,
  `text-primary`, `text-primary-foreground`, `border-border`, `ring-ring`, etc. These resolve to
  CSS variables set by shadcn — they will render correctly. Don't reach for concrete
  `neutral-*`/`white`/`black` utilities unless the user's code shows they aren't using shadcn.
- **`tw-animate-css`** (the successor to `tailwindcss-animate`) is configured. This gives
  `animate-in`, `animate-out`, `fade-in`, `zoom-in`, `slide-in-from-*`, and the `data-[state=open]:*`
  variants that shadcn components rely on.
- **Radix primitives underneath shadcn**. shadcn components re-export Radix and expose `asChild`.

### Combine Motion with shadcn via `asChild` + Radix Slot

The integration pattern — when you want Motion animation props on a shadcn primitive without
losing the primitive's behaviour or accessibility:

```tsx
// Button keeps its styles/behaviour; the motion.a underneath gets whileHover/tap
<Button asChild>
  <motion.a href="/signup" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
    Get started
  </motion.a>
</Button>

// Any Radix primitive that accepts asChild works the same — Dialog.Trigger, Popover.Trigger,
// NavigationMenu.Link, Tooltip.Trigger, etc. The primitive's props are merged onto the
// motion child via Radix's Slot.
```

Rule of thumb: if shadcn gives you the element, use `asChild` to put a motion component
underneath. Don't recreate the primitive from scratch just to add a whileHover.

### Do NOT auto-trigger for things Tailwind or shadcn already handles

The following are **out of scope for automatic invocation** of this skill:

| Want | Use instead |
|---|---|
| Dialog/Sheet/Popover/Tooltip/Dropdown/HoverCard enter-exit | shadcn component's built-in `data-[state=open]:animate-in` + `tw-animate-css` classes |
| Button hover/press microinteractions | Tailwind `transition-all hover:scale-105 active:scale-95` |
| Simple color/opacity transitions on a component | Tailwind `transition-colors`, `transition-opacity` |
| Accordion expand/collapse | shadcn Accordion's built-in animation |
| Skeleton / loading states | `animate-pulse` / shadcn Skeleton |

**If the user explicitly invokes this skill on one of those tasks, help anyway** — they may want
a custom Motion treatment that replaces the default. In that case, write the Motion version AND
tell them they're opting out of the shadcn default so they know what they're trading.

### Prime use cases (where this skill earns its keep)

- Hero sections with staggered reveal, masked text, or scroll-linked intro
- Feature/pricing grids that animate in on scroll
- Shared-element route or card-to-fullscreen transitions (`layoutId`)
- Horizontal scroll / sticky sections for case studies or product walkthroughs
- Parallax, scroll progress bars, reveal-on-scroll clip-paths
- Hide-on-scroll-down headers, progress indicators tied to scroll
- Drag-to-reorder, draggable cards, sortable boards (beyond what shadcn ships)
- Complex gesture interactions (tilt-on-hover cards, swipe-to-dismiss cards, magnetic CTAs)
- Animated counters and number tickers on landing hero stats
- Page transitions between routes

If the task fits one of these, you're in the right place. If not, ask yourself whether Tailwind or
shadcn already solves it before adding Motion.

## Critical rules (read every time)

1. **Package and import path.** The npm package is `motion` — **not `framer-motion`**. Import React
   APIs from `motion/react` (or `motion/react-client` in a React Server Component file).
   `framer-motion` is the legacy name; do not install or import it. If you see it in existing code,
   migrate to `motion` only when the user asks — otherwise follow the project's existing choice and
   flag it.
   ```ts
   import { motion, AnimatePresence } from "motion/react"
   // In a Next.js RSC file:
   import * as motion from "motion/react-client"
   ```

2. **Do NOT use Motion+ (paid) features.** This skill explicitly excludes:
   `<Cursor>`, `<AnimateNumber>`, `<Ticker>`, Motion Studio / the Motion MCP, and any other
   paid-tier component or tool. If the user asks for a ticking-number or magnetic-cursor effect,
   implement it by hand with `useMotionValue` + `useTransform` (see `references/recipes.md`) rather
   than importing a Motion+ component.

3. **`<motion.X />` is a drop-in for `<X />`.** Any HTML or SVG tag has a matching motion component
   (`motion.div`, `motion.button`, `motion.circle`, `motion.feTurbulence`, …). Everything else
   (className, onClick, children, refs) works exactly as it does on the plain element — you just
   get extra animation props on top. Do not re-implement React behaviour around it.

4. **Prefer transforms and opacity.** Motion is fastest (and often runs on the compositor thread)
   when animating `x`, `y`, `scale`, `rotate`, `opacity`, `filter`. Avoid animating `width`,
   `height`, `top`, `left`, `margin`, or `padding` directly unless you've reached for layout
   animations (which translate them into transforms for you).

5. **Every `AnimatePresence` child needs a stable, unique `key`.** Exit animations only fire when
   Motion can tell which element left. Use `key={item.id}` — never `key={index}`. And keep the
   `AnimatePresence` itself mounted (outside the conditional), not inside the element that's
   unmounting.
   ```tsx
   // GOOD
   <AnimatePresence>
     {isOpen && <motion.div key="modal" exit={{ opacity: 0 }} />}
   </AnimatePresence>

   // BAD — AnimatePresence unmounts with the child, so exit never runs
   {isOpen && (
     <AnimatePresence>
       <motion.div exit={{ opacity: 0 }} />
     </AnimatePresence>
   )}
   ```

6. **Don't double-drive a value.** Don't animate the same property via `animate` *and* by letting
   layout change it (e.g. don't animate `width` in `animate={{ width: 300 }}` while also changing it
   in `style`/`className` on a `layout`-flagged component). Pick one source of truth.

7. **Layout changes go through `style` / `className`, not `animate`.** Use the `layout` prop and let
   Motion measure the before/after and animate between them. `animate` is for values Motion owns.

8. **Don't create a motion component inside render.** `motion.create(MyComponent)` must live at
   module scope. Calling it per render creates a new component each frame, which breaks animations.

9. **Default to `transition: { type: "spring" }` for physical values (`x`, `y`, `scale`, `rotate`)** — Motion does this automatically if you omit `transition`. Use `ease` + `duration` for visual values (`opacity`, `color`, `filter`). This only applies to animations Motion owns; for simple hover/press on a button, Tailwind utilities win (see Context & scope above).

10. **Respect `prefers-reduced-motion`.** For anything that moves more than a few pixels, consult `useReducedMotion()` and fall back to opacity-only or no animation. `<MotionConfig reducedMotion="user">` at the app root is the cheapest way to honour it project-wide.

## Decision guide — which API do I reach for?

*Assumes you've already decided the animation isn't handled by Tailwind or shadcn defaults — see "Context & scope" above. If it is, stop here and use the Tailwind / shadcn approach.*

Use this table before writing Motion code. It will save you re-writes.

| Goal | Use |
|---|---|
| Fade / slide / scale an element on mount | `initial` + `animate` on a motion component |
| Animate an element out of the tree | Wrap in `<AnimatePresence>`, add `exit` + unique `key` |
| Hover / tap / focus micro-interaction | `whileHover` / `whileTap` / `whileFocus` |
| Scroll-triggered (fire once or toggle) | `whileInView` + `viewport={{ once: true }}` |
| Scroll-linked (value ∝ scroll position) | `useScroll` → `useTransform` / `useSpring` → `<motion.div style={{ … }}>` |
| A value should smoothly follow another | `useSpring(sourceMotionValue)` |
| Map one motion value to another | `useTransform` (function form or input/output arrays) |
| Orchestrate a tree of children | `variants` on parent + each child, `animate="open"` on parent |
| Stagger children | `delayChildren: stagger(0.07)` in the parent's variant `transition` |
| Size/position change from layout shift | `layout` prop; use `layout="position"` for images to avoid distortion |
| Shared element between two components | same `layoutId` on both (crossfade is automatic) |
| Drag an element | `drag` / `drag="x"`, add `dragConstraints` + `whileDrag` for feel |
| Drag handle / imperative drag start | `useDragControls()` + `dragListener={false}` |
| Reorderable list | `<Reorder.Group>` + `<Reorder.Item value={item} key={item.id}>` |
| Imperative timeline / sequence | `const [scope, animate] = useAnimate()`; `await animate(...)` |
| Custom drawing (SVG path, ticking counter, canvas) | `useMotionValue` + `useMotionValueEvent` or render `<motion.pre>{mv}</motion.pre>` |
| Slideshow / page transition | Change the `key` on the single `AnimatePresence` child |
| Only run animation when content scrolls into view and then stop | `useInView(ref, { once: true })` + effect, or `whileInView` + `viewport={{ once: true }}` |
| Need a value measured on every frame (e.g. pointer, time) | `useAnimationFrame` or `useTime` |

## The animation props (quick reference)

The most common props on `<motion.X />`:

| Prop | Purpose |
|---|---|
| `initial` | Values at mount. `initial={false}` disables the enter animation (use current DOM values). |
| `animate` | Target on enter and on update. Object OR variant label (string or string[]). |
| `exit` | Animate to this when the component leaves a `<AnimatePresence>`. |
| `transition` | Default transition for this component. Can be per-value: `{ default: {...}, opacity: { ease: "linear" } }`. |
| `variants` | Named animation states (see `references/variants.md`). |
| `whileHover` / `whileTap` / `whileFocus` / `whileDrag` / `whileInView` | Temporary animation targets while the gesture is active. |
| `viewport` | Options for `whileInView` / useInView — `{ once, root, margin, amount }`. |
| `style` | Normal React style prop PLUS independent transform shorthands (`x`, `y`, `scale`, `rotate`, …) and motion-value support. |
| `drag` / `dragConstraints` / `dragElastic` / `dragMomentum` / `dragSnapToOrigin` / `dragDirectionLock` / `dragTransition` / `dragControls` / `dragListener` / `dragPropagation` | The whole drag API. |
| `layout` | `true` / `"position"` / `"size"` — enable layout animation. |
| `layoutId` | Match two components for shared-element animation. |
| `layoutDependency` | Only re-measure when this value changes. |
| `layoutScroll` | Mark a scrollable container so Motion accounts for its offset. |
| `layoutRoot` | Mark a `position: fixed` container so Motion accounts for page scroll. |
| `layoutAnchor` | `{ x, y }` in 0-1 progress, where the child's position is measured from its parent. |
| `custom` | Value passed to dynamic variants: `(custom) => ({ … })`. |
| `propagate` | Currently `{ tap: false }` to stop tap bubbling up to a parent motion component. |
| `onUpdate` / `onAnimationStart` / `onAnimationComplete` | Animation lifecycle callbacks. |
| `onHoverStart` / `onHoverEnd` / `onTapStart` / `onTap` / `onTapCancel` / `onPanStart` / `onPan` / `onPanEnd` / `onDragStart` / `onDrag` / `onDragEnd` / `onDirectionLock` / `onViewportEnter` / `onViewportLeave` / `onLayoutAnimationStart` / `onLayoutAnimationComplete` | Gesture & layout lifecycle callbacks. |
| `transformTemplate` | Override the generated transform string. |
| `inherit` | `false` to opt out of parent variants. |

For the **full reference** of every prop with example usage, read `references/motion-component.md`.

## Transitions at a glance

```ts
transition = {
  type: "spring" | "tween" | "inertia", // default is dynamic: spring for physical values, tween for visual
  duration: 0.4,          // seconds
  delay: 0.1,
  ease: "easeOut" | [0, 0.71, 0.2, 1.01] | "linear" | "easeIn" | "easeInOut" | "circIn" | "circOut" | "circInOut" | "backIn" | "backOut" | "backInOut" | "anticipate",
  times: [0, 0.3, 1],     // for keyframe arrays

  // spring
  stiffness: 200, damping: 20, mass: 1,
  bounce: 0.25, visualDuration: 0.5, velocity,
  restSpeed: 0.1, restDelta: 0.01,

  // orchestration (variants)
  when: "beforeChildren" | "afterChildren",
  delayChildren: 0.2,     // number or stagger(step, options)
  staggerChildren: 0.07,  // legacy - prefer stagger()

  // repeat
  repeat: Infinity, repeatType: "loop" | "reverse" | "mirror", repeatDelay: 0,
}
```

Two spring styles:
- **Duration-based** (`duration` + `bounce` or `visualDuration` + `bounce`) — intuitive, pairs with tween timelines.
- **Physics-based** (`stiffness` + `damping` + `mass`) — incorporates existing velocity, feels alive; best for gestures.

Full detail including inheritance rules: `references/transitions.md`.

## Motion values — when and why

A `MotionValue<T>` is a signal-like primitive that holds animated state **outside React's render
cycle**. Motion components read from motion values without triggering re-renders. Reach for them
when:
- You need per-frame updates (scroll position, pointer position, time) to drive styles.
- Two elements need to share an animated value.
- You want to compose animations (map, smooth, invert).
- You need to read velocity or subscribe to changes.

```tsx
const x = useMotionValue(0)
const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])
return <motion.div drag="x" style={{ x, opacity }} />
```

Most React state-like APIs have a motion-value counterpart. Reach for the motion-value version
when you'd otherwise rapidly `setState`:

| Instead of | Use |
|---|---|
| `useState<number>` that updates every scroll / frame | `useMotionValue` + `useMotionValueEvent` for effects |
| Deriving `b` from `a` with `useMemo` | `useTransform(() => a.get() * 2)` |
| Smoothing with a timer | `useSpring(source)` |
| Measuring scroll | `useScroll()` |
| Animating text content | put a `MotionValue` as the child of a `motion` element: `<motion.pre>{count}</motion.pre>` |
| Composing into a CSS string | `useMotionTemplate\`blur(${blur}px)\`` |

Full motion-value reference: `references/motion-values.md`.

## Deeper topics — pointers only

Each of these has a dedicated reference file with full detail. The one-line summaries below are for recognising which file to open when a task comes in.

- **Variants + stagger orchestration** — named animation states that propagate from parent to children; use when >1 element needs coordinated timing. `stagger()` in the parent's `delayChildren` is the modern way. Full worked example (hamburger menu with orchestrated open/close) and dynamic variants in `references/variants.md`.
- **AnimatePresence** — three modes: `sync` (default, simultaneous), `wait` (single child, sequential — slideshows), `popLayout` (exiting element pops out of flow so siblings reflow — lists with `layout`). `popLayout` requires parent `position: relative` and custom children with `forwardRef`. Presence hooks (`useIsPresent`, `usePresence`, `usePresenceData`) and `custom` prop in `references/animatepresence.md`.
- **Layout animations (`layout`, `layoutId`, `LayoutGroup`)** — the marketing-page superpower: size/position changes and shared-element transitions via transform, not via animating width/height. Critical footgun: don't `layoutId` both a container AND its children unless you hide the source with `visibility: hidden` during the morph. Scale-distortion correction rules (border-radius/box-shadow via `style`), `layoutScroll`, `layoutRoot`, `layoutAnchor`, `layoutDependency` in `references/layout-animations.md`.
- **Scroll animations** — scroll-triggered (`whileInView` + `viewport.once`, or `useInView`) vs scroll-linked (`useScroll` → `useTransform` → `style`). Scroll-linked outputs to `opacity`/`transform`/`clipPath`/`filter` run on the GPU via ScrollTimeline. **`useSpring(scrollYProgress)` is OK for progress indicators** (value crossing a threshold) but **wrong for scrub-linked translation** (horizontal scroll, parallax y, zoom) — the spring lag decouples visual motion from scroll input and feels broken. Pipe `scrollYProgress` straight through `useTransform` for scrubbed values. Parallax, horizontal-scroll sections, progress bars, clip-path reveal, hide-on-scroll header — all in `references/scroll-animations.md` and `references/recipes.md`.
- **Gestures (hover/tap/focus/pan/drag)** — Tap is keyboard-accessible automatically. Pan + drag need `touch-action: none` on touch. Drag on `<img>` needs `draggable={false}`. Use `useDragControls()` + `dragListener={false}` for handle-only drag. Full prop table + recipes in `references/gestures.md`.
- **SVG (path drawing, morphing, viewBox)** — `pathLength`/`pathSpacing`/`pathOffset` are 0-1 progress values for stroke-drawing effects. Path morphing works when two paths share command shape; use Flubber via `useTransform`'s `mixer` for dissimilar paths. SVG transform origin is normalised to element center. No layout animations — animate attributes directly. Full detail in `references/svg-animations.md`.
- **Imperative control (`useAnimate`)** — reach for it when you need sequences, playback controls (`play`/`pause`/`speed`/`time`), or to animate non-motion DOM elements. Returns `[scope, animate]` with scoped selectors. Example + cleanup in `references/hooks.md`.
- **Providers** — `<MotionConfig transition reducedMotion>` for app-wide defaults; `<LayoutGroup>` to sync layout across independently-rendering siblings; `<AnimatePresence>` for exit scope; `<Reorder.Group>` for drag-to-reorder lists (custom case — shadcn has no reorder primitive). `<LazyMotion>` exists but is a niche bundle-size optimisation; skip unless the user asks.

## Where to look next

- **shadcn/Radix + Motion integration (`asChild`, Slot, token usage)**: `references/shadcn-integration.md`
- **Every `<motion />` prop explained**: `references/motion-component.md`
- **Every hook with signatures**: `references/hooks.md`
- **AnimatePresence deep dive**: `references/animatepresence.md`
- **Variants + orchestration**: `references/variants.md`
- **Layout / layoutId / LayoutGroup**: `references/layout-animations.md`
- **Scroll patterns**: `references/scroll-animations.md`
- **Gesture details**: `references/gestures.md`
- **Motion values**: `references/motion-values.md`
- **Transitions / easings / springs / inertia**: `references/transitions.md`
- **SVG & path drawing**: `references/svg-animations.md`
- **Copy-paste recipes** (landing hero, feature grid, shared-element transitions, parallax,
  horizontal scroll, hide-on-scroll header, animated counter, tilt-on-hover, plus Tailwind + shadcn
  integration patterns): `references/recipes.md`
- **Common mistakes and pitfalls**: `references/gotchas.md`

## House style when you write Motion code

- **TypeScript first.** Even in JS projects, prefer typed variant objects
  (`const list: Variants = { ... }` via `import type { Variants, Transition } from "motion/react"`).
- **Keep animation definitions outside the component** when they don't depend on props/state. Stops
  recreating the object every render and makes it trivial to memoise.
- **One source of intent per animation.** If you reach for both `animate` and `whileHover`, let the
  transition on `whileHover` be terse — it inherits nothing from `animate`'s transition unless you
  set `inherit: true`.
- **Pick spring vs tween based on what the value means.** Physical position → spring. Opacity, color
  → tween. Override only with reason.
- **`initial={false}` for app-shell elements** that already exist on first paint — avoids a janky
  enter animation on mount.
- **Use `useReducedMotion()` or `<MotionConfig reducedMotion="user">`** for any animation a user
  could feasibly disable. Respects `prefers-reduced-motion`.
- **Memoise heavy variant functions** that read props/state with `useMemo` — the function is called
  once per variant activation.
- **Don't over-stagger.** `stagger(0.05)` for items, `stagger(0.1)` for big reveal. Over ~0.15s
  per item starts to feel slow.
- **Skip animation for server-rendered initial state.** `<AnimatePresence initial={false}>` and
  `initial={false}` keep SSR output clean.
- **When the user asks for "the Motion+ ticking-number component"** or similar: politely note that
  Motion+ is paid and implement the effect manually (see `references/recipes.md` → "Animated
  counter"). Don't install Motion+.

## When unsure, read the reference

The `references/` folder is authoritative — it's the condensed motion.dev docs for every API this
skill covers. If you catch yourself guessing a prop name or trying to remember which hook returns
what, open the relevant reference file. It's cheaper than writing code the user has to correct.
