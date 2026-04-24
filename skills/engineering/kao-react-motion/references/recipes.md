# Recipes — copy-paste patterns

Ready-to-adapt implementations for the things users ask for most often in a Tailwind + shadcn/ui project. Recipes use shadcn theme tokens (`bg-card`, `text-foreground`, `bg-primary`, `border-border`, …) by default. Only use concrete utilities like `bg-white` / `text-neutral-900` if the project clearly doesn't use shadcn (no `@theme`, no `components/ui/`).

All recipes use only the free Motion API — no Motion+.

> **Before copying a recipe**: check whether shadcn or `tw-animate-css` already covers the case. shadcn has Dialog, Sheet, Popover, Tooltip, Dropdown, Accordion, Tabs, Carousel (Embla), Sonner (toast), Skeleton, NavigationMenu, ContextMenu, and more. The recipes in this file are for *custom* patterns beyond those, or for explicit opt-out cases where the user wants a Motion-driven override.

## Enter + exit fade/slide (custom element, not a shadcn primitive)

```tsx
<AnimatePresence>
  {show && (
    <motion.div
      key="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-xl border border-border bg-card p-6 text-card-foreground"
    />
  )}
</AnimatePresence>
```

## Modal / dialog

> shadcn `Dialog` handles this. Prefer it. Use the recipe below ONLY when the user wants a custom animation shape (`tw-animate-css` can't do layout-aware or spring-based morphs). The recommended override path is to wrap the shadcn `DialogContent` with `asChild` — see `references/shadcn-integration.md`. The from-scratch version below exists for fully-custom overlays (e.g. command palettes, cinematic hero dialogs) where shadcn's Dialog semantics aren't needed.

```tsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        key="overlay"
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      />
      <motion.div
        key="dialog"
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 top-20 mx-auto max-w-lg rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        …
      </motion.div>
    </>
  )}
</AnimatePresence>
```

## Drawer / side panel

> shadcn `Sheet` handles this. Only use the recipe below for drawers with Motion-specific behaviour — swipe-to-dismiss velocity, shared-element links to the trigger, or custom spring release.

```tsx
<AnimatePresence>
  {open && (
    <motion.aside
      key="drawer"
      className="fixed inset-y-0 left-0 w-80 border-r border-border bg-card p-6 text-card-foreground"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.2, right: 0 }}
      onDragEnd={(_, info) => { if (info.offset.x < -100) close() }}
    />
  )}
</AnimatePresence>
```

## Staggered list reveal on scroll (prime landing-page pattern)

```tsx
import { motion, stagger } from "motion/react"

const container = { visible: { transition: { delayChildren: stagger(0.08) } } }
const item = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
}

<motion.ul
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={container}
  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
>
  {items.map(i => (
    <motion.li
      key={i.id}
      variants={item}
      className="rounded-xl border border-border bg-card p-6 text-card-foreground"
    >
      {i.label}
    </motion.li>
  ))}
</motion.ul>
```

## Shared-element transition (tabs underline)

> shadcn `Tabs` ships its own selected-state styling. Use this Motion-based underline only when the visual call is *animated morph between tabs* (shadcn Tabs does instant highlight).

```tsx
{tabs.map(t => (
  <button key={t.id} onClick={() => setActive(t.id)} className="relative px-4 py-2 text-sm font-medium text-muted-foreground">
    {t.label}
    {t.id === active && (
      <motion.div
        layoutId="tabs-underline"
        className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </button>
))}
```

## Shared-element morph (card → fullscreen)

Classic marketing pattern: a grid card morphs into a fullscreen view. Two valid shapes — see `references/layout-animations.md` for the full explanation. This recipe uses **Shape A** (morph individual children) because it's easier to get right.

```tsx
type Project = { id: string; title: string; description: string; image: string }

function ProjectGallery({ projects }: { projects: Project[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = projects.find(p => p.id === activeId) ?? null

  return (
    <LayoutGroup id="project-gallery">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(p => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setActiveId(p.id)}
              className="block w-full overflow-hidden rounded-xl border border-border bg-card text-left"
            >
              <motion.img
                layoutId={`img-${p.id}`}
                src={p.image}
                alt=""
                className="aspect-video w-full object-cover"
                draggable={false}
              />
              <div className="p-4">
                <motion.h3 layoutId={`title-${p.id}`} className="font-semibold text-card-foreground">
                  {p.title}
                </motion.h3>
                <motion.p layoutId={`desc-${p.id}`} className="text-sm text-muted-foreground">
                  {p.description}
                </motion.p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveId(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
              {/*
                The modal "card chrome" (bg/border/shadow) is a motion.div
                that fades in on mount and — critically — fades OUT fast on
                exit. Without this, the chrome stays rendered during the
                back-morph of the shared elements, leaving a white box
                hovering at the centre of the screen for ~300ms.

                Opacity only (no scale) so we don't multiply our children's
                layoutId transform with a parent transform.
              */}
              <motion.div
                key="modal-chrome"
                className="max-w-3xl w-full overflow-hidden rounded-2xl border border-border bg-card pointer-events-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.05 } }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
              >
                <motion.img
                  layoutId={`img-${active.id}`}
                  src={active.image}
                  alt=""
                  className="aspect-video w-full object-cover"
                  draggable={false}
                />
                <div className="p-6">
                  <motion.h3 layoutId={`title-${active.id}`} className="text-2xl font-semibold text-card-foreground">
                    {active.title}
                  </motion.h3>
                  <motion.p layoutId={`desc-${active.id}`} className="mt-2 text-muted-foreground">
                    {active.description}
                  </motion.p>
                  {/* modal-only content — fades in separately, no layoutId */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="mt-4"
                  >
                    <Button onClick={() => setActiveId(null)}>Close</Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}
```

Notes:
- The card container has no `layoutId` — only the image, title, and description do. See `references/layout-animations.md` for why *not* to put `layoutId` on both the container AND its children.
- **The modal "chrome" (bg/border/shadow) is itself a `motion.div` with a short opacity exit.** A plain `<div>` wrapper would stay visible during the back-morph of the shared elements, leaving a ghost card at the centre of the screen for ~300ms. Don't give the chrome a `scale` exit — it would compound with the shared-elements' layoutId transform and distort the morph. Opacity only.
- **Don't combine `layout="position"` with `layoutId`** on shared elements. `layout="position"` prevents size animation; `layoutId`'s whole job is to morph size and position together. Pairing them makes the image snap to the new size and then translate — breaks the illusion. Use `layoutId` alone.
- `LayoutGroup id="project-gallery"` namespaces the ids so they don't collide with other shared-element sections on the page.
- `pointer-events-none` on the outer centring wrapper + `pointer-events-auto` on the chrome so backdrop clicks pass through to the overlay.
- Escape-to-close and body-scroll-lock are omitted for brevity — add them in a `useEffect` tied to `active`.
- Reduced motion: wrap the whole thing in `<MotionConfig reducedMotion="user">` at the app root, or gate the morph with `useReducedMotion()`.

## Carousel (custom swipe; prefer shadcn Carousel for most cases)

> shadcn `Carousel` (Embla) handles most carousels with gestures. Use this Motion-based version only when you need custom drag physics or shared-element transitions between slides.

```tsx
const x = useMotionValue(0)
const [page, setPage] = useState(0)
const SWIPE_THRESHOLD = 80

<motion.div
  drag="x"
  style={{ x }}
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.2}
  onDragEnd={(_, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD && page < slides.length - 1) setPage(p => p + 1)
    else if (info.offset.x > SWIPE_THRESHOLD && page > 0) setPage(p => p - 1)
  }}
  className="relative overflow-hidden rounded-xl border border-border bg-card"
>
  <AnimatePresence mode="wait" custom={page}>
    <motion.img
      key={slides[page].src}
      src={slides[page].src}
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    />
  </AnimatePresence>
</motion.div>
```

## Notifications stack (custom; prefer shadcn Sonner for most cases)

> shadcn ships `Sonner` for toast notifications — use it. This custom stack is for cases where Sonner's API doesn't fit (e.g. a stacked activity feed, in-page notification rail).

```tsx
<ul className="fixed bottom-6 right-6" style={{ position: "relative" }}>
  <AnimatePresence mode="popLayout">
    {toasts.map(t => (
      <motion.li
        key={t.id}
        layout
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        className="mb-2 rounded-lg border border-border bg-card px-4 py-3 text-card-foreground shadow-lg"
      >
        {t.text}
      </motion.li>
    ))}
  </AnimatePresence>
</ul>
```

## Reorderable list (Reorder.Group)

> shadcn has no reorder primitive. For simple single-axis reorder, use Motion's `Reorder`. For complex cases (cross-column, nested, keyboard accessibility), reach for DnD Kit.

```tsx
const [items, setItems] = useState(initial)

<Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
  <AnimatePresence>
    {items.map(item => (
      <Reorder.Item
        key={item.id}
        value={item}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileDrag={{ scale: 1.02, boxShadow: "0 10px 20px rgb(0 0 0 / 0.15)", zIndex: 1 }}
        style={{ position: "relative" }}  // required for z-index during drag
        className="rounded-lg border border-border bg-card p-3 text-card-foreground"
      >
        {item.text}
      </Reorder.Item>
    ))}
  </AnimatePresence>
</Reorder.Group>
```

For a drag-handle-only reorder (rest of the row doesn't start the drag), see `references/gestures.md` → `useDragControls`.

## Hide-on-scroll-down header (prime landing pattern)

```tsx
const { scrollY } = useScroll()
const [hidden, setHidden] = useState(false)

useMotionValueEvent(scrollY, "change", current => {
  const diff = current - scrollY.getPrevious()
  setHidden(diff > 0 && current > 100)
})

<motion.header
  variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
  animate={hidden ? "hidden" : "visible"}
  transition={{ duration: 0.25, ease: "easeInOut" }}
  className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm"
/>
```

## Scroll progress bar

A progress indicator is the one case where smoothing with `useSpring` is appropriate — it's a value crossing a threshold, not a continuous scrub.

```tsx
const { scrollYProgress } = useScroll()
const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, skipInitialAnimation: true })

<motion.div
  style={{ scaleX, originX: 0 }}
  className="fixed inset-x-0 top-0 z-50 h-1 bg-primary"
/>
```

Don't copy this spring into scrub-linked recipes (horizontal scroll, parallax, scroll-zoom). The lag feels broken when the user is effectively scrubbing a timeline. See `references/scroll-animations.md` → "Smoothed progress — ONLY for progress indicators".

## Parallax (multi-layer hero)

```tsx
const { scrollY } = useScroll()
const bg = useTransform(scrollY, [0, 1000], [0, -200])
const fg = useTransform(scrollY, [0, 1000], [0, -500])

<section className="relative h-screen overflow-hidden bg-background">
  <motion.div style={{ y: bg }} className="absolute inset-0 …bg-layer…" />
  <motion.div style={{ y: fg }} className="relative z-10 …fg-content…" />
</section>
```

## Horizontal scroll section (case studies, product walkthrough)

**Do NOT wrap `scrollYProgress` in `useSpring` here.** Pipe it straight through `useTransform`. A spring between scroll input and horizontal output introduces frame-level lag — the user scrolls, the cards trail, and the whole section feels broken. For scrub-linked translation, direct mapping via the browser's ScrollTimeline (which Motion uses automatically when the output is a transform) is the right answer.

```tsx
const ref = useRef<HTMLDivElement>(null)
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
// Straight through — no useSpring. End % = -(count-1)/count * 100 so last card lands flush.
const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"])  // 5 cards → -80%

<section ref={ref} className="relative bg-background" style={{ height: "300vh" }}>
  <div className="sticky top-0 h-screen overflow-hidden">
    <motion.div style={{ x }} className="flex h-full">
      {items.map(i => (
        <section key={i.id} className="flex h-full w-screen shrink-0 items-center justify-center">
          {i.content}
        </section>
      ))}
    </motion.div>
  </div>
</section>
```

Raise outer height (`300vh` → `500vh`) to slow the scroll further.

## Scroll-reveal image (clip-path)

```tsx
const ref = useRef<HTMLDivElement>(null)
const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] })
const clipPath = useTransform(scrollYProgress, [0, 1], ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"])

<motion.div ref={ref} style={{ clipPath }}>
  <img src={src} alt="" className="w-full" />
</motion.div>
```

## Animated counter (landing-page hero stat)

No Motion+ `<AnimateNumber>`; implement with primitives.

```tsx
import { animate, motion, useMotionValue, useTransform } from "motion/react"
import { useEffect } from "react"

export function AnimatedCounter({ target, duration = 1, className }: { target: number; duration?: number; className?: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(() => Math.round(count.get()))

  useEffect(() => {
    count.set(0)
    const c = animate(count, target, { duration, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [target, duration])

  return <motion.span className={className}>{rounded}</motion.span>
}

// Hero usage
<div className="text-6xl font-semibold tabular-nums text-foreground">
  <AnimatedCounter target={stats.users} />
  <span className="text-muted-foreground text-4xl ml-2">users</span>
</div>
```

## Path-drawing checkmark (icon animation)

```tsx
<motion.svg viewBox="0 0 24 24" className="h-8 w-8 text-primary" initial="hidden" animate="visible">
  <motion.path
    d="M5 13l4 4L19 7"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none"
    variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  />
</motion.svg>
```

## Tilt on hover (3D card)

```tsx
const x = useMotionValue(0.5)
const y = useMotionValue(0.5)
const rx = useTransform(y, [0, 1], [8, -8])
const ry = useTransform(x, [0, 1], [-8, 8])

<motion.div
  className="rounded-xl border border-border bg-card p-6 text-card-foreground"
  style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
  onMouseMove={(e) => {
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width)
    y.set((e.clientY - r.top)  / r.height)
  }}
  onMouseLeave={() => { x.set(0.5); y.set(0.5) }}
/>
```

## Magnetic CTA (follow pointer)

```tsx
const mx = useSpring(0, { stiffness: 500, damping: 50 })
const my = useSpring(0, { stiffness: 500, damping: 50 })

<Button asChild>
  <motion.a
    href="/signup"
    style={{ x: mx, y: my }}
    onMouseMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect()
      mx.set((e.clientX - r.left - r.width / 2) * 0.3)
      my.set((e.clientY - r.top  - r.height / 2) * 0.3)
    }}
    onMouseLeave={() => { mx.set(0); my.set(0) }}
  >
    Get started
  </motion.a>
</Button>
```

## Accordion with auto height (custom; prefer shadcn Accordion)

> shadcn `Accordion` already animates via `tw-animate-css`. Only use this pattern if you need a layout-aware or sibling-aware animation shadcn's accordion can't do.

```tsx
<motion.div
  initial={false}
  animate={{ height: isOpen ? "auto" : 0 }}
  style={{ overflow: "hidden" }}
>
  <div>{children}</div>
</motion.div>
```

Animating `height: "auto"` requires Motion to measure the child; the wrapping div must not have its own `height` style. If combining with `display: none`, use `visibility: hidden` instead (collapsed `display: none` elements can't be measured).

## Next.js App Router page transitions

```tsx
// app/template.tsx — runs on every route change
"use client"
import { motion } from "motion/react"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
```

For exit-on-navigate (harder; Next doesn't unmount pages cleanly during navigation), you typically combine `usePathname()` + `AnimatePresence mode="wait"` at a layout boundary — pair with a route group if you want different transitions per section.

## Reduced motion

```tsx
const reduce = useReducedMotion()
<motion.div animate={{ x: reduce ? 0 : -100, opacity: 1 }} />
```

Or globally at the app root:

```tsx
<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>
```

With `reducedMotion="user"`, transforms and layout animations skip for users who prefer reduced motion, while opacity/color still animate.

## Tailwind + shadcn integration reference

For the full `asChild` + theme-token playbook, see `references/shadcn-integration.md`. Summary:

- **Use shadcn theme tokens** (`bg-card`, `text-foreground`, `bg-primary`, `border-border`) throughout.
- **Don't layer Motion on `tw-animate-css` output** — shadcn's built-in Dialog/Sheet/Popover/etc. transitions are driven by `data-[state=open]:animate-*` classes. Adding Motion `animate` on top causes conflicts.
- **Don't double-drive transitions**: Tailwind `transition-*` utilities and Motion animations on the same property fight each other.
- **Wrap shadcn primitives with `asChild`** to put a motion component underneath (`<Button asChild><motion.a whileHover={...}>…</motion.a></Button>`).
