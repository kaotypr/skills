# `<motion />` component — full prop reference

Every HTML and SVG tag has a motion counterpart: `motion.div`, `motion.button`, `motion.a`,
`motion.circle`, `motion.path`, `motion.feTurbulence`, etc. Use identically to the plain element,
with extra animation props below.

Import:
```ts
import { motion } from "motion/react"
import * as motion from "motion/react-client"   // Next.js RSC files
```

## Animation props

### `initial`
Values at mount.
- Object: `initial={{ opacity: 0, x: 0 }}`
- Variant label: `initial="hidden"` or `initial={["hidden", "inactive"]}`
- `initial={false}` — skip the enter animation; use the current DOM/`animate` value immediately.

### `animate`
Target on enter and update. Same shape options as `initial`. When values in `animate` change between renders, Motion animates from the previous value.

### `exit`
Target to animate to when the component unmounts inside an `<AnimatePresence>`. Same shape options. Must be a direct child of `<AnimatePresence>` for this to fire.

### `transition`
Default transition for this component. See `transitions.md` for full options. Can be per-value:
```tsx
transition={{
  default: { type: "spring" },
  opacity: { ease: "linear" },
}}
```
Transitions on specific animation props (e.g. `whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}`) override this.

### `variants`
Object mapping variant names to targets. Names propagate through descendants via `animate`, `initial`, `exit`, `whileHover`, etc.
```tsx
const v = { active: { backgroundColor: "#f00" }, inactive: { backgroundColor: "#fff", transition: { duration: 2 } } }
<motion.div variants={v} animate={isActive ? "active" : "inactive"} />
```

### `style`
Plain React `style` PLUS:
- Independent transform shorthands: `x`, `y`, `z`, `scale`, `scaleX`, `scaleY`, `rotate`, `rotateX`, `rotateY`, `rotateZ`, `skewX`, `skewY`, `transformPerspective`, `originX`, `originY`, `originZ`.
- Motion values: `style={{ x: motionValue, opacity: otherMotionValue }}`.

### Animation lifecycle callbacks
- `onUpdate(latest)` — every frame, with all animating values.
- `onAnimationStart(target)` — animation starts (except layout).
- `onAnimationComplete(target)` — animation completes.
- `onLayoutAnimationStart()` / `onLayoutAnimationComplete()` — layout-specific.

## Gesture props

### Hover
- `whileHover={{ … }}` or `whileHover="hovered"`.
- `onHoverStart(PointerEvent)`, `onHoverEnd(PointerEvent)`.
- Only fires on real hover-capable devices — won't trigger on touch.

### Tap
- `whileTap={{ … }}` or `whileTap="tapped"`.
- `onTapStart(PointerEvent)` — on press.
- `onTap(PointerEvent)` — released on same component.
- `onTapCancel(PointerEvent)` — released elsewhere or moved >3px inside a draggable parent.
- Keyboard-accessible automatically: Enter fires tap on focused elements.

### Focus
- `whileFocus={{ outline: "dashed" }}` or variant label. Uses `:focus-visible` rules.

### Pan
- `onPan(event, info)`, `onPanStart`, `onPanEnd`. No `whilePan`.
- `info` fields: `point`, `delta`, `offset`, `velocity` — each with `{ x, y }`.
- Requires `touch-action: none` on touch if you want to override scroll.

### Drag
- `drag` — `true`, `"x"`, `"y"`, or `false`.
- `whileDrag={{ scale: 1.1 }}` or variant.
- `dragConstraints` — `{ top, left, right, bottom }` object (pixels) or a `ref` to another element.
- `dragSnapToOrigin` — `true` to spring back on release.
- `dragElastic` — `0`–`1`, or per-side object, or `false` (default `0.5`).
- `dragMomentum` — `true` (default) to apply inertia on release.
- `dragTransition` — inertia options (`bounceStiffness`, `bounceDamping`, `power`, `timeConstant`, `modifyTarget`, `min`, `max`).
- `dragDirectionLock` — `true` to lock to first-detected axis.
- `dragPropagation` — `true` to let drag gestures bubble.
- `dragControls` — from `useDragControls()`, for imperative drag start.
- `dragListener` — `false` to disable native pointerdown listener (use with `dragControls`).
- `onDragStart(event, info)`, `onDrag(event, info)`, `onDragEnd(event, info)`, `onDirectionLock(axis)`.

### Gesture propagation
- `propagate={{ tap: false }}` — stop tap from bubbling to parent motion components (currently tap only).

## Viewport (scroll-triggered)
- `whileInView={{ opacity: 1 }}` or variant.
- `viewport={{ once, root, margin, amount }}`:
  - `once`: stop observing after first entry.
  - `root`: ref of a scrollable ancestor (defaults to window).
  - `margin`: CSS-margin-style string, e.g. `"0px -20px 0px 100px"`.
  - `amount`: `"some" | "all" | 0–1`.
- `onViewportEnter(IntersectionObserverEntry)`, `onViewportLeave(IntersectionObserverEntry)`.

## Layout
- `layout` — `true`, `"position"`, `"size"`. Enables layout animation.
- `layoutId` — matches two components for shared-element animation.
- `layoutDependency` — only re-measure when this value changes.
- `layoutScroll` — mark an ancestor with `overflow: scroll` to factor in its scroll offset.
- `layoutRoot` — mark a `position: fixed` ancestor to factor in page scroll.
- `layoutAnchor` — `{ x, y }` 0–1 progress (default `{ 0, 0 }` = top-left). Where the child's position is measured from its parent.

## Advanced
- `inherit` — `false` to stop inheriting or propagating parent variants.
- `custom` — value passed to dynamic variants: `(custom) => ({ … })`.
- `transformTemplate({ x, scale }, generated) => string` — override the transform string order/shape.

## Custom components with `motion.create()`

```tsx
// Module scope — never in render!
const MotionMyBox = motion.create(MyBox)
```
- The wrapped component must forward a ref.
- React 18: wrap with `forwardRef`.
- React 19: ref is a prop; just forward `props.ref`.
- `motion.create("custom-element")` — custom HTML element by tag name.
- `motion.create(Component, { forwardMotionProps: true })` — let the wrapped component receive animation props (default filters them out).

## Server-side rendering

`motion` components render their `initial`/`animate` values on the server (`initial={false}` → SSR shows the `animate` state), so SSR pages are stable before hydration.

## SVG specifics (quick)

- Transform origin normalised to element center. Restore SVG default with `style={{ transformBox: "view-box" }}`.
- `x`, `y`, `scale` shortcuts go through style. For actual SVG attributes, use `attrX`, `attrY`, `attrScale`.
- `motion.svg` can animate `viewBox` directly.
- See `svg-animations.md` for path drawing, morphing.
