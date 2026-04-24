# Gestures — hover, tap, focus, pan, drag

Every gesture on a motion component has a `while-` prop AND lifecycle callbacks. `while-` targets are ephemeral: they apply while the gesture is active, then the element returns to its `animate` / `initial` state.

## Hover

```tsx
<motion.button
  whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
  transition={{ duration: 0.3 }}                // used when hover ends
  onHoverStart={(e) => …}
  onHoverEnd={(e) => …}
/>
```

Notes:
- Only fires on hover-capable devices — filters out touch emulation (no sticky states on mobile).
- Pointer-capture-based — robust against the browser's weirder hover edge cases.

For a lightweight imperative version outside the motion component:
```tsx
import { hover } from "motion"
useEffect(() => hover(ref.current, () => { /* start */ return () => { /* end */ } }), [])
```

## Tap

```tsx
<motion.button whileTap={{ scale: 0.9 }} onTap={(e) => submit()} />
```

- Fires `onTap` when pointer is released on the *same* element.
- Fires `onTapCancel` when released outside OR when pointer moves >3px inside a draggable parent.
- **Keyboard accessible** — Enter on a focused element fires `onTapStart` + `whileTap`, release fires `onTap`, blur mid-press fires `onTapCancel`.
- Inside a draggable parent, tap auto-cancels after 3px.
- Block tap from bubbling to a parent motion component:
  ```tsx
  <motion.div whileTap={{ scale: 2 }}>
    <motion.button whileTap={{ opacity: 0.8 }} propagate={{ tap: false }} />
  </motion.div>
  ```
  `stopPropagation()` doesn't work here because motion gesture handlers are deferred.

## Focus

```tsx
<motion.a whileFocus={{ outline: "2px dashed currentColor" }} href="#" />
```

Uses the same rules as CSS `:focus-visible` — fires when focus arrives via accessible means (keyboard, programmatic, input interaction) but not on every mouse focus.

## Pan

Lightweight pointer-motion recogniser (no `whilePan`):

```tsx
<motion.div
  onPanStart={(e, info) => …}
  onPan={(e, info) => {
    // info.point  — pointer in page coords
    // info.delta  — movement since last event
    // info.offset — movement since start
    // info.velocity — current pointer velocity
  }}
  onPanEnd={(e, info) => …}
  style={{ touchAction: "none" }}  // necessary on touch
/>
```

## Drag

### Minimum viable drag

```tsx
<motion.div drag whileDrag={{ scale: 1.1, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }} />
```

### Axis lock
```tsx
<motion.div drag="x" />
// or
<motion.div drag dragDirectionLock onDirectionLock={(axis) => …} />
```

### Constraints

Pixel box (relative to start):
```tsx
<motion.div drag dragConstraints={{ top: -50, left: -50, right: 50, bottom: 50 }} />
```

Ref to container:
```tsx
const containerRef = useRef(null)
<motion.div ref={containerRef}>
  <motion.div drag dragConstraints={containerRef} />
</motion.div>
```

Elasticity (bounce past constraints):
```tsx
<motion.div drag dragConstraints={{ left: 0, right: 300 }} dragElastic={0.1} />  // 0 = hard stop, 1 = free, default 0.5
```

### Momentum / inertia
```tsx
<motion.div drag dragMomentum={false} />
<motion.div drag dragTransition={{ power: 0.3, timeConstant: 300, bounceStiffness: 600, bounceDamping: 10 }} />
<motion.div drag dragTransition={{ power: 0, modifyTarget: t => Math.round(t / 50) * 50 }} />  // snap-to-grid
```

### Snap back to origin
```tsx
<motion.div drag dragSnapToOrigin />
```

### Manual control — drag from elsewhere

```tsx
const controls = useDragControls()

<div onPointerDown={(e) => controls.start(e, { snapToCursor: true, distanceThreshold: 10 })} style={{ touchAction: "none" }} />
<motion.div drag dragListener={false} dragControls={controls} />
```

Use `dragListener={false}` on the draggable so only the control initiates the gesture.

### Drag callbacks
```tsx
<motion.div
  drag
  onDragStart={(e, info) => …}
  onDrag={(e, info) => …}
  onDragEnd={(e, info) => …}
/>
```
`info` is the same shape as pan info: `point`, `delta`, `offset`, `velocity`.

### Gotchas

- `<img>` children show a ghost image on drag. Set `draggable={false}` on the inner `<img>`.
  ```tsx
  <motion.li drag><img draggable={false} /></motion.li>
  ```
- For touch, the draggable *or* its handle needs `touch-action: none`.
- `dragPropagation` defaults to `false` — child drags don't bubble to parents unless explicitly enabled.

## `<Reorder.Group>` — drag-to-reorder lists

For simple single-axis lists (no cross-column, no nested). For complex DnD reach for DnD Kit. shadcn has no reorder primitive, so this is the go-to when users ask for drag-to-reorder.

```tsx
import { Reorder } from "motion/react"

const [items, setItems] = useState([0, 1, 2, 3])

<Reorder.Group axis="y" values={items} onReorder={setItems}>
  {items.map(item => (
    <Reorder.Item key={item} value={item} style={{ position: "relative" }}>
      {item}
    </Reorder.Item>
  ))}
</Reorder.Group>
```

Props on `Reorder.Group`: `as` (default `"ul"`), `axis` (default `"y"`), `values`, `onReorder`.
Props on `Reorder.Item`: `as` (default `"li"`), `value` + all motion component props.

- **Stable keys matter.** `key={item.id}` (never `key={index}`) AND `value={item}` both required.
- Items already `layout`-animate; surrounding items smoothly reflow.
- Use `<AnimatePresence>` *around* the `Reorder.Item`s for enter/exit.
- Drag handle — `dragListener={false}` + `dragControls={useDragControls()}`, attach `onPointerDown={e => controls.start(e)}` to the handle. Handle also needs `touch-action: none`.
- Auto-scrolls when near top/bottom of a scrollable container.
- Items get an elevated `z-index` during drag — only works with non-`static` `position`.

## SVG filter gestures

Filter elements have no physical presence, so gestures don't recognize on them directly. Put `while-` on a parent and use variants to drive the filter:
```tsx
<motion.svg whileHover="hover">
  <filter id="blur">
    <motion.feGaussianBlur stdDeviation={0} variants={{ hover: { stdDeviation: 2 } }} />
  </filter>
</motion.svg>
```
