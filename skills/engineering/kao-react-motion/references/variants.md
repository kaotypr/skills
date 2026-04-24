# Variants — named animation states and orchestration

Variants are named targets. Once defined on a component, they propagate through descendants, so a single `animate={state}` on the parent drives the whole subtree.

```tsx
const variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
}

<motion.div variants={variants} initial="hidden" animate="visible" exit="hidden" />
```

## Why variants (not plain objects)?

- **Reuse**: define once, reference by name everywhere (`initial`, `animate`, `exit`, `whileHover`, `whileInView`).
- **Orchestration**: parent variants activate matching named variants on all descendant motion components automatically.
- **Timing**: parent's `transition.when`, `delayChildren`, and `stagger()` coordinate when children animate relative to the parent.

## Propagation

When a parent motion component has `variants` and an animation prop set to a string, every descendant motion component with a matching variant name switches to that state.

```tsx
const list = {
  visible: { opacity: 1 },
  hidden:  { opacity: 0 },
}
const item = {
  visible: { opacity: 1, x: 0 },
  hidden:  { opacity: 0, x: -100 },
}

<motion.ul variants={list} initial="hidden" whileInView="visible">
  <motion.li variants={item} />
  <motion.li variants={item} />
</motion.ul>
```

Stop propagation on a child with `inherit={false}`.

## Multiple variants at once

Array of labels:
```tsx
<motion.div animate={["visible", "danger"]} />
```

## Orchestration transition options (parent-only)

```ts
transition: {
  when: "beforeChildren" | "afterChildren",  // parent finishes before/after children
  delayChildren: 0.2,                        // number OR stagger(step, opts)
}
```

### `stagger(step, options)` — the right way to stagger
```ts
import { stagger } from "motion/react"

transition: { delayChildren: stagger(0.07, { startDelay: 0.2, from: "first" | "last" | "center" | number }) }
```
- `step` — seconds between each child.
- `startDelay` — delay before the first child starts.
- `from` — direction: `"first"` (default), `"last"`, `"center"`, or an index.

## Dynamic variants — per-child values

Variants can be functions. Each child's `custom` prop is passed in.
```tsx
const variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.3 },
  }),
}

items.map((item, i) => (
  <motion.div key={item.id} custom={i} variants={variants} initial="hidden" animate="visible" />
))
```

`custom` can also be set on the enclosing `<AnimatePresence custom={…}>` so exiting children (which can no longer receive props) still get data.

## Variant values can include transition

Per-variant transition override:
```ts
const v = {
  visible: { opacity: 1, transition: { duration: 0.3 } },
  hidden:  { opacity: 0, transition: { duration: 2 } },
}
```

## Variants + exit

Use the same variants object; let the parent's `exit` drive a named state that children also respond to:
```tsx
<motion.div initial="hidden" animate="visible" exit="hidden" variants={list}>
  <motion.div variants={item} />
</motion.div>
```

`when: "afterChildren"` on the exit variant delays the parent's exit until its children have finished theirs.

## Worked example — hamburger menu

```tsx
import { motion, stagger } from "motion/react"
import { useState } from "react"

const navVariants = {
  open:   { transition: { delayChildren: stagger(0.07, { startDelay: 0.2 }) } },
  closed: { transition: { delayChildren: stagger(0.05, { from: "last" }) } },
}

const itemVariants = {
  open:   { opacity: 1, y: 0,  transition: { type: "spring", stiffness: 1000, velocity: -100 } },
  closed: { opacity: 0, y: 50, transition: { type: "spring", stiffness: 1000 } },
}

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: { type: "spring", stiffness: 20, restDelta: 2 },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: { type: "spring", stiffness: 400, damping: 40, delay: 0.5 },
  },
}

export function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <motion.nav initial={false} animate={isOpen ? "open" : "closed"} custom={600}>
      <motion.div className="bg" variants={sidebarVariants} />
      <motion.ul variants={navVariants}>
        {items.map(i => (
          <motion.li key={i.id} variants={itemVariants} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            {i.label}
          </motion.li>
        ))}
      </motion.ul>
      <button onClick={() => setIsOpen(o => !o)}>toggle</button>
    </motion.nav>
  )
}
```

Note the single `animate={isOpen ? "open" : "closed"}` on the parent drives every child.

## Tips

- **Keep variant objects outside the component** when they don't depend on props — stops the parent re-rendering from recreating the identity. Memoise dynamic ones.
- **Type them**: `import type { Variants } from "motion/react"` and annotate.
- **Over-staggering feels slow.** 0.05–0.1s per child is the sweet spot for most lists. Up to 0.2s on reveal-heavy content.
- **Don't mix variants and inline target objects** on the same prop. Pick one.
