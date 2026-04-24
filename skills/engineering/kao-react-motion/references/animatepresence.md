# AnimatePresence — exit animations

Wrap elements you want to animate *out* of the DOM.

```tsx
import { AnimatePresence } from "motion/react"

<AnimatePresence>
  {show && <motion.div key="modal" exit={{ opacity: 0 }} />}
</AnimatePresence>
```

## Triggering conditions

Exit fires when a direct child's React presence changes:
- Component unmounts (`{show && <Component key="x" />}`).
- Direct child's `key` changes (slideshows).
- Items added/removed from a list mapped inside AnimatePresence.

## Must-haves

- **Every direct child needs a unique, stable `key`.** Use IDs, not array indices — indices break when items reorder.
- **AnimatePresence itself must NOT unmount** along with its child. The conditional belongs *inside* AnimatePresence, not outside.
- **The exiting component must be a direct child of `<AnimatePresence>`** for its `exit` prop to fire.

```tsx
// GOOD
<AnimatePresence>
  {isOpen && <Modal key="m" />}
</AnimatePresence>

// BAD
{isOpen && (
  <AnimatePresence>
    <Modal key="m" />
  </AnimatePresence>
)}
```

## Exit targets

Same shape as `initial` / `animate`:
```tsx
<motion.div exit={{ opacity: 0, y: -20 }} />
<motion.div exit="hidden" variants={modalVariants} />
```

Nested children without `exit` set won't animate unless their ancestor's `exit` triggers them through variants.

## `mode`

### `"sync"` (default)
Enter and exit play simultaneously. Use for cross-fades and `position: absolute` overlays where simultaneous visibility is OK. Layouts may jump if siblings reflow around the exiting element.

### `"wait"`
Next child waits for the exiting child to finish. **Single child only** — pass one element, not a list.
```tsx
<AnimatePresence mode="wait">
  <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
</AnimatePresence>
```
Good for: wizards, tab content, only-one-at-a-time UI. Pair with complementary easings: `exit: { ease: "easeIn" }`, `animate: { ease: "easeOut" }` for an overall easeInOut feel.

### `"popLayout"`
Exiting element is `position: absolute`-popped so siblings reflow immediately while it animates out. Pairs with `layout` on list items.
```tsx
<motion.ul layout style={{ position: "relative" }}>
  <AnimatePresence mode="popLayout">
    {items.map(item => (
      <motion.li layout key={item.id} exit={{ opacity: 0, scale: 0.8 }}>{item.label}</motion.li>
    ))}
  </AnimatePresence>
</motion.ul>
```
Constraints:
- The *parent* of the popping children must have `position !== "static"` — `relative` typically.
- Any custom-component direct child of `AnimatePresence` must use `forwardRef` to forward the ref to the DOM node that pops out.

## Props

- `initial={false}` — disable enter animations on children that are present on first render (helpful for SSR / stable initial UI).
- `custom={value}` — passed to dynamic variants and accessible via `usePresenceData()` in an exiting child. Use when you need to change the exit animation based on state the exiting component can no longer see (e.g. swipe direction in a slideshow).
- `onExitComplete()` — fires when all exiting children have finished.
- `propagate={true}` — allow exit animations to cascade when a parent `<AnimatePresence>` unmounts this one.
- `root` — ShadowRoot to inject `popLayout` styles into.

## Presence hooks

### `useIsPresent()` — simple
```tsx
const isPresent = useIsPresent()
return isPresent ? "Here!" : "Exiting..."
```

### `usePresence()` — imperative
```tsx
const [isPresent, safeToRemove] = usePresence()
useEffect(() => { !isPresent && setTimeout(safeToRemove, 1000) }, [isPresent])
```

### `usePresenceData()` — read `custom` during exit
```tsx
<AnimatePresence custom={swipeDirection}>
  <Slide key={id} />
</AnimatePresence>

function Slide() {
  const dir = usePresenceData()
  return <motion.div exit={{ x: dir === 1 ? -300 : 300 }} />
}
```

## Common recipes

### Slideshow (change `key` to trigger exit/enter)
```tsx
<AnimatePresence mode="wait">
  <motion.img
    key={image.src}
    src={image.src}
    initial={{ x: 300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -300, opacity: 0 }}
  />
</AnimatePresence>
```

### Notifications stack (popLayout + layout)
```tsx
<ul style={{ position: "relative" }}>
  <AnimatePresence mode="popLayout">
    {toasts.map(t => (
      <motion.li
        key={t.id}
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        {t.text}
      </motion.li>
    ))}
  </AnimatePresence>
</ul>
```

## Troubleshooting

- **Exit isn't animating?** Check the key is unique and stable. Check that `AnimatePresence` stays mounted.
- **Layout animations broken alongside exit?** Wrap in `<LayoutGroup>` so layout measurement syncs across siblings that don't render together.
- **`popLayout` children appearing in the wrong spot?** Active transform makes the animated parent the offset parent. Make sure `popLayout`'s parent has `position: relative` (or similar non-static).
