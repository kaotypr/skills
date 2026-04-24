# Gotchas — common mistakes to avoid

These bite almost everyone at least once. Read before writing Motion code; read again before debugging.

## Installation / imports

- **Use `motion`, not `framer-motion`**. The package has been renamed. Imports come from `motion/react`. `framer-motion` is the old name — still on npm, still works, but frozen. New projects use `motion`.
- **React Server Components**: import from `motion/react-client`, with the `import * as motion` form:
  ```tsx
  import * as motion from "motion/react-client"
  ```
- **Do NOT install Motion+.** Motion+ is a separate paid tier. This skill implements everything without it. If you see `<Cursor>`, `<AnimateNumber>`, `<Ticker>`, or a Motion Studio MCP reference, substitute a hand-rolled equivalent.

## `<motion />` component

- **Inline display can't transform.** `display: inline` ignores `transform`. Layout animations and most transforms will silently fail. Use `inline-block`, `block`, or `flex`. (This is the #1 cause of "my layout animation does nothing" bug reports.)
- **`motion.create()` at module scope.** Calling it inside render creates a new component every render and breaks animations. Hoist it out.
- **Custom components need a ref.** `motion.create(MyBox)` requires `MyBox` to forward a ref to the DOM node. React 18: `forwardRef`. React 19: forward `props.ref`.
- **Don't compose with Tailwind `transition-*`.** Tailwind's CSS transitions will fight Motion's animations and produce janky results. Strip `transition-all`, `duration-*`, etc. from motion components.
- **Don't layer Motion on `tw-animate-css` output.** shadcn components like `DialogContent` already ship `data-[state=open]:animate-in` + `fade-in-0` / `zoom-in-95` classes via `tw-animate-css`. Adding a Motion `animate` prop on top makes both systems drive opacity/transform at once — janky. Either keep the default (most of the time), or strip the `tw-animate-css` classes and use `asChild` + motion for full Motion control. See `references/shadcn-integration.md`.
- **Use shadcn theme tokens, not `neutral-*`/`white`/`black`, in a shadcn project.** `text-foreground`, `bg-card`, `border-border`, `bg-primary`, `text-primary-foreground`, etc. resolve to CSS variables and support dark mode automatically. Hardcoded colours won't theme correctly. If the project is vanilla Tailwind (no `@theme`, no `components/ui/`), fall back to concrete utilities.

## AnimatePresence

- **Stable unique keys.** `key={index}` breaks exit when items reorder. Use `key={item.id}`.
- **AnimatePresence must outlive its children.** Don't mount it inside the conditional — keep the conditional inside.
- **Direct-child rule.** The component whose `exit` prop should fire must be a direct child of `<AnimatePresence>`.
- **`wait` mode: single child.** Don't render multiple children of `<AnimatePresence mode="wait">`.
- **`popLayout` and `position`.** When using `popLayout`, the parent must be `position: relative` (or any non-static). Custom-component children need `forwardRef`.

## Layout animations

- **Don't double-drive.** If a prop is being animated by `layout`, don't also animate it via `animate={{ width: … }}`.
- **Layout changes go through `style` / `className`.** `animate` is for values Motion fully owns.
- **SVG isn't supported by layout animations.** Animate attributes (`cx`, `d`, `width`, …) directly.
- **Border-radius / box-shadow scale distortion** is corrected only when set via `style` (or an animation prop), not CSS classes.
- **Image aspect-ratio stretch**: use `layout="position"` rather than `layout`.
- **Border looks stretched**: `border` can't render <1px so scale correction is limited. Use a padded parent as faux-border.
- **Scrollbar appearing triggers layout animation**: `scrollbar-gutter: stable` on body/container.
- **Layout changes in sibling components that don't re-render together** won't sync. Wrap in `<LayoutGroup>`.
- **`layoutId` is global**. Multiple component instances using the same `layoutId` collide. Namespace with `<LayoutGroup id="…">`.
- **Don't combine `layout="position"` with `layoutId`.** `layout="position"` disables size animation; `layoutId` needs both size and position to morph. Paired, the element snaps to the new size and then slides. Use `layoutId` alone.
- **Shared-element modal wrapper chrome must also exit.** If the bg/border/shadow container around your shared elements is a plain `<div>`, it will linger as a ghost card during the close-morph. Wrap it in a `motion.div` with a short opacity exit (~120ms). Use opacity only, not scale — scale on the wrapper compounds with the children's layoutId transform and distorts the morph.

## Drag

- **Image drag ghost.** `<img>` inside a draggable shows the browser's drag-image. Set `draggable={false}` on the inner `<img>`.
- **Touch-action.** For drag / pan to work on touch, add `touch-action: none` (on the draggable and on any custom `onPointerDown` element that starts a drag).
- **Tap inside drag auto-cancels** after 3px movement. That's usually what you want, but if a child needs its own tap, stop propagation with `propagate={{ tap: false }}`.

## Gestures

- **`onHoverStart/End` doesn't fire on touch.** That's deliberate. If you need touch "hover", you're probably looking for `onPointerDown` or a press gesture.
- **Filter elements (`<feGaussianBlur>` …) can't receive gestures.** They have no physical presence. Put `while-` on a parent `<motion.svg>` and drive the filter via variants.
- **`onPan` needs `touch-action: none`** on the element on touch, or the browser's scroll handling conflicts.

## Variants

- **Variants don't merge across levels** — more specific targets replace less specific. Use `inherit: true` on the transition to opt in.
- **Variants and inline targets can't coexist on the same prop.** Pick one.
- **Dynamic variants (function variants) get `custom` from the child.** On `<AnimatePresence>` you can set `custom` there so exiting children still receive data.

## Motion values

- **Don't pass a motion value where a number is expected**. `animate` reads fresh values; `style` + motion value reads a reactive reference. Mixing them breaks updates.
- **`useMotionValueEvent` is cleanup-safe.** If you call `mv.on(...)` directly in a `useEffect`, remember to return the unsubscribe.
- **Jump vs set.** `x.set(0)` animates (if there's an attached spring / animation). `x.jump(0)` doesn't — use `jump` when you want to reset without a transition.

## Transitions

- **No merging by default.** `<MotionConfig transition={...}>` defaults are *replaced* by component-level `transition`, not merged. Set `inherit: true` to merge.
- **`stiffness`/`damping`/`mass` override `duration`/`bounce`.** Don't set both.
- **`duration` default is 0.3 for single value, 0.8 for keyframes.**
- **`delay: -1` starts the animation 1s in.** Useful for desyncing loops.

## Scroll

- **Don't `useSpring` a scroll-linked value that drives continuous scrubbed motion** (horizontal scroll, parallax y, scroll-zoom, scroll-driven rotation). The spring lags behind the scroll and decouples visual motion from user input — feels broken. Pipe `scrollYProgress` / `scrollY` straight through `useTransform` instead. `useSpring` is only appropriate for progress-indicator outputs (a progress bar's `scaleX`, a threshold-crossing badge reveal). See `references/scroll-animations.md` → "Smoothed progress".

## SSR / Next.js

- **RSC files need `motion/react-client`**. Client components use `motion/react`. Don't mix.
- **Initial state is server-rendered.** `<motion.div initial={false} animate={{ x: 100 }} />` will SSR `translateX(100px)` — no hydration flash.
- **`useReducedMotion()` starts `false` on server** (no matchMedia there). Expect a flip on hydration — don't rely on it for anything SSR-critical.

## Accessibility

- **Respect `prefers-reduced-motion`.** For any non-trivial movement, gate on `useReducedMotion()` or wrap the app in `<MotionConfig reducedMotion="user">` (disables transforms & layout; keeps opacity/color).
- **Keyboard-trap modals.** Motion doesn't manage focus — combine with a focus-trap library (or your own) for dialog UX.
- **Tap is keyboard-accessible** automatically — Enter triggers it on focused elements. Don't add your own `onKeyDown` handler that duplicates it.

## Performance

- **Stick to compositor-friendly props.** `transform` (including `x`/`y`/`scale`/`rotate`) and `opacity` run on the GPU. `width`/`height`/`top`/`left`/`margin`/`padding` trigger layout and paint every frame — avoid.
- **`useMotionValue` over `useState`** for high-frequency driving values (scroll, pointer).
- **`layoutDependency`** cuts measurements when you know when layout changes.
- **`usePageInView()`** to pause RAF loops / video when tab is hidden.
- **`LazyMotion`** cuts the bundle from ~34 kB to ~4.6 kB initial + on-demand features.

## "But it worked on desktop!"

- **Hover gestures** don't fire on touch. Use `tap` or `pointer` instead if the experience needs to work there.
- **Drag on mobile** needs `touch-action: none` to beat the browser's scroll.
- **`env(safe-area-inset-*)`** matters for modal / drawer positioning on iOS. Motion animates whatever CSS you give it; provide safe-area-aware styles.

## When something just won't animate, check in this order

1. Is the element `display: inline`?
2. Did you put the exit prop on a direct child of `<AnimatePresence>`?
3. Is the `key` stable and unique?
4. Is the value a string matching units (e.g. animating `"100"` to `"100px"` won't work)?
5. Is there a conflicting Tailwind `transition-*` class?
6. Is `MotionConfig reducedMotion="always"` debugging-disabled?
7. Are you animating width/height/top/left on a `layout`-flagged component (double-drive)?
