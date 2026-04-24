# Layout animations — `layout`, `layoutId`, LayoutGroup

Layout animations automatically animate any size/position change caused by a React render. Motion measures before and after, then animates the transform.

## `layout` prop

```tsx
<motion.div layout style={{ width: isExpanded ? 400 : 100 }} />
```

Values:
- `layout={true}` — animate both size and position.
- `layout="position"` — only animate position (good for images / aspect-ratio changes caused by their parent's layout shift). **Do NOT combine with `layoutId`** — see shared-element caveat below.
- `layout="size"` — only size.

**Change layout through `style` / `className`, not `animate`.** Motion owns the transition.

## Shared-element animations with `layoutId`

Give two components the same `layoutId` across renders. Motion animates between them.

```tsx
{items.map(tab => (
  <button key={tab.id}>
    {tab.label}
    {tab.id === active && <motion.div layoutId="underline" />}
  </button>
))}
```

When the new `layoutId` element mounts, it animates out from the previous one's position/size. If both remain in the DOM briefly, they crossfade. Pair with `<AnimatePresence>` to animate back to origin.

```tsx
<AnimatePresence>
  {isOpen && <motion.div layoutId="card" />}
</AnimatePresence>
```

**The transition defined on the NEW element** governs the animation direction. When animating back, the original's transition takes over.

### Pick ONE level of granularity — don't `layoutId` the container AND its children

The single most common shared-element footgun. Say a grid card (image + title + description) morphs into a fullscreen modal. Two valid shapes:

**Shape A — morph individual children only** (simpler, recommended by default):
```tsx
// Grid card
<article onClick={open}>
  <motion.img layoutId={`img-${id}`}   src={img} />
  <motion.h3  layoutId={`title-${id}`}>{title}</motion.h3>
  <motion.p   layoutId={`desc-${id}`}>{desc}</motion.p>
</article>

// Modal (inside AnimatePresence)
<div className="fixed inset-0">
  <motion.img layoutId={`img-${id}`}   />
  <motion.h3  layoutId={`title-${id}`} />
  <motion.p   layoutId={`desc-${id}`}  />
  {/* modal-only content fades in separately */}
</div>
```

**Shape B — morph the container, and hide the source during the morph**:
```tsx
// Grid card — note the visibility toggle
<motion.article
  layoutId={`card-${id}`}
  style={{ visibility: activeId === id ? "hidden" : "visible" }}  // ← load-bearing
  onClick={open}
>
  …
</motion.article>

// Modal twin
<motion.div layoutId={`card-${id}`} className="fixed inset-0">
  …
</motion.div>
```

**Never combine both without the `visibility: hidden` compensator.** Motion will track the container `layoutId` AND each child's `layoutId` in parallel — the grid card and its modal twin both stay visible during the morph, producing flicker, overlap, or a ghostly "second card" at the origin. `visibility: hidden` is the right fix because the element still participates in layout measurement (`display: none` would break that).

`AnimatePresence` must sit *outside* the conditional in both shapes so the return morph has something to exit from.

### `layout="position"` is NOT compatible with `layoutId`

`layout="position"` tells Motion to animate only position, not size. `layoutId`'s whole job is to morph both size AND position between matched elements. Pairing them makes the image/element **snap to the new size instantly and then slide to the new position** — breaks the illusion of a single element growing from small to big.

```tsx
// BAD — the image snaps to modal size, then translates. Doesn't look like a morph.
<motion.img layoutId={`img-${id}`} layout="position" src={...} />

// GOOD — layoutId alone morphs both size and position
<motion.img layoutId={`img-${id}`} src={...} />
```

`layout="position"` is only useful in non-shared contexts where a single element's parent layout changes and you don't want the image scaling to fight its aspect ratio.

### The modal "chrome" trap

If your modal has framing around the shared elements (bg/border/shadow on an outer container) and you render that container as a plain `<div>`, it will stay fully visible during the close-morph while the shared elements fly back to the grid — leaving a ghost card at the centre of the screen for the morph duration.

Fix: make the chrome a `motion.div` with `exit={{ opacity: 0, transition: { duration: 0.12 } }}`. Use **opacity only** — a `scale` exit on the parent would compound with the children's layoutId transform and distort the morph.

```tsx
// Inside <AnimatePresence>, around the shared elements
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.05 } }}
  exit={{ opacity: 0, transition: { duration: 0.12 } }}
  className="max-w-3xl w-full overflow-hidden rounded-2xl border border-border bg-card"
>
  <motion.img layoutId={`img-${id}`} … />
  <motion.h3 layoutId={`title-${id}`}>{title}</motion.h3>
  …
</motion.div>
```

## Per-layout transition

```tsx
<motion.div
  layout
  animate={{ opacity: 0.5 }}
  transition={{
    ease: "linear",              // used for opacity
    layout: { duration: 0.3 },   // used for layout only
  }}
/>
```

## `LayoutGroup`

When sibling motion components each have their own `layout` but re-render independently (e.g. accordions with separate state), they can't detect each other's layout changes. Group them:

```tsx
import { LayoutGroup } from "motion/react"

<LayoutGroup>
  <Accordion />
  <Accordion />
</LayoutGroup>
```

### Namespacing `layoutId`

`layoutId` is global. If you render multiple identical components using the same `layoutId` (e.g. two independent tab rows both using `layoutId="underline"`), namespace them:

```tsx
<LayoutGroup id="tabs-left"><TabRow /></LayoutGroup>
<LayoutGroup id="tabs-right"><TabRow /></LayoutGroup>
```

## Scrollable containers — `layoutScroll`

Without this, Motion doesn't account for the container's scroll offset and children jump.

```tsx
<motion.div layoutScroll style={{ overflow: "scroll" }}>
  <motion.div layout />
</motion.div>
```

## Fixed containers — `layoutRoot`

For `position: fixed` ancestors, page-scroll offsets would otherwise be applied twice:

```tsx
<motion.div layoutRoot style={{ position: "fixed", top: 0 }}>
  <motion.div layout />
</motion.div>
```

## Relative / anchored animations

By default, children are measured from their parent's top-left. Change with `layoutAnchor`:

```tsx
<motion.ul layout>
  <motion.li layout layoutAnchor={{ x: 0.5, y: 0.5 }} transition={{ delay: 1 }} />
</motion.ul>
```

- `0` = top/left, `0.5` = center, `1` = bottom/right.
- `layoutAnchor={false}` — disable relative projection entirely; animate as page-relative.

## Scale-distortion correction

Layout animations use `transform: scale()` — fast, but naïvely distorts children and some CSS properties. Motion corrects for these when possible:

- **Children**: add `layout` to direct children too. Motion counter-scales them.
- **Border radius**: set via `style`, not CSS. Motion corrects the radius.
  ```tsx
  <motion.div layout style={{ borderRadius: 16 }} />
  ```
- **Box shadow**: same — set via `style`.

### Aspect-ratio / image changes
Use `layout="position"` on images so they jump to the new size (which is natural for images) instead of scaling.
```tsx
<motion.img layout="position" />
```

### Border
`border` can't render below 1px, so scale correction is limited. Use padding on a parent instead:
```tsx
<motion.div layout style={{ borderRadius: 10, padding: 5 }}>
  <motion.div layout style={{ borderRadius: 5 }} />
</motion.div>
```

## `layoutDependency`

By default layout is measured every render. To avoid unnecessary work:
```tsx
<motion.nav layout layoutDependency={isOpen} />
```
Only re-measure when `isOpen` changes.

## Callbacks

- `onLayoutAnimationStart()`
- `onLayoutAnimationComplete()`

## Troubleshooting

- **Not animating?** Is the element `display: inline`? Browsers ignore transform on inline. Change to `inline-block`/`block`.
- **SVG isn't animating?** Layout animations don't support SVG. Animate the attributes directly (`cx`, `cy`, `d`, `width`, `height`, etc.).
- **Content stretches?** Add `layout` to distorted children, or use `layout="position"`.
- **Scrollbar appearance causes unwanted animation?** Set `scrollbar-gutter: stable` on the scrollable container.
- **Layout animations interfering with exit animations?** Wrap in `<LayoutGroup>` and use `<AnimatePresence mode="popLayout">`.

## `layout` vs. the View Transitions API

Motion layout animations:
- Animate real elements with transforms (not snapshots).
- Are interruptible, don't block pointer events, handle multiple simultaneous animations.
- Respect scroll during animation, support relative-to-parent animations, support multiple elements with the same `layoutId`.

Reach for View Transitions only for full-page wipes or effects that explicitly need the snapshot/crossfade technique.
