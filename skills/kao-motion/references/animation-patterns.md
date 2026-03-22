# Motion Animation Patterns

Ready-to-use patterns organized by category. Each shows the Motion API approach with code.

## Table of Contents

1. [Hero & Entry Choreography](#hero--entry-choreography)
2. [Navigation & Menus](#navigation--menus)
3. [Cards & Hover Effects](#cards--hover-effects)
4. [Modals & Overlays](#modals--overlays)
5. [Lists & Grids](#lists--grids)
6. [Tabs](#tabs)
7. [Accordion & Collapse](#accordion--collapse)
8. [Carousel & Slider](#carousel--slider)
9. [Toast & Notifications](#toast--notifications)
10. [Text Animations](#text-animations)
11. [SVG Path Drawing & Morphing](#svg-path-drawing--morphing)
12. [Scroll Effects & Parallax](#scroll-effects--parallax)
13. [Page & Route Transitions](#page--route-transitions)
14. [Image Gallery & Lightbox](#image-gallery--lightbox)
15. [Loading & Skeleton States](#loading--skeleton-states)
16. [Micro-interactions](#micro-interactions)
17. [Background & Ambient Effects](#background--ambient-effects)
18. [Cursor & Magnetic Effects](#cursor--magnetic-effects)
19. [Counter & Number Animations](#counter--number-animations)
20. [3D Transforms](#3d-transforms)
21. [Marquee & Ticker](#marquee--ticker)
22. [Progress Indicators](#progress-indicators)

---

## Hero & Entry Choreography

Staggered entry of hero elements using variants:

```jsx
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
}
const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
}

function Hero() {
  return (
    <motion.section initial="hidden" animate="visible" variants={container}>
      <motion.h1 variants={item}>Welcome</motion.h1>
      <motion.p variants={item}>Subtitle text here</motion.p>
      <motion.button variants={item}>Get Started</motion.button>
    </motion.section>
  )
}
```

## Navigation & Menus

### Sidebar with staggered items

```jsx
<AnimatePresence>
  {isOpen && (
    <motion.nav
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {links.map((link, i) => (
        <motion.a
          key={link.href}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
          href={link.href}
        >
          {link.label}
        </motion.a>
      ))}
    </motion.nav>
  )}
</AnimatePresence>
```

### Hamburger SVG morph

Animate SVG path `d` attributes or use `rotate`/`y` transforms on three `motion.line` elements to morph between hamburger and X.

## Cards & Hover Effects

### Hover lift with shadow

```jsx
<motion.div
  whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
  <CardContent />
</motion.div>
```

### 3D tilt on hover

```jsx
function TiltCard({ children }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10])
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10])

  function handleMouse(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, perspective: 800 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}
```

### Card flip

```jsx
function FlipCard({ front, back }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div style={{ perspective: 800 }} onClick={() => setFlipped(!flipped)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformStyle: "preserve-3d", position: "relative" }}
      >
        <div style={{ backfaceVisibility: "hidden" }}>{front}</div>
        <div style={{ backfaceVisibility: "hidden", rotateY: 180, position: "absolute", inset: 0 }}>
          {back}
        </div>
      </motion.div>
    </div>
  )
}
```

### Expandable card with layoutId

```jsx
// Thumbnail
<motion.div layoutId={`card-${id}`} onClick={() => setSelected(id)}>
  <motion.img layoutId={`img-${id}`} src={item.image} />
  <motion.h3 layoutId={`title-${id}`}>{item.title}</motion.h3>
</motion.div>

// Expanded view
<AnimatePresence>
  {selected && (
    <motion.div layoutId={`card-${selected}`} className="expanded">
      <motion.img layoutId={`img-${selected}`} src={item.image} />
      <motion.h3 layoutId={`title-${selected}`}>{item.title}</motion.h3>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {item.description}
      </motion.p>
    </motion.div>
  )}
</AnimatePresence>
```

## Modals & Overlays

### Scale-up modal with backdrop

```jsx
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        key="backdrop"
        className="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        key="modal"
        className="modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {children}
      </motion.div>
    </>
  )}
</AnimatePresence>
```

### Shared element modal (card → modal)

Use matching `layoutId` on both the trigger card and the modal — Motion auto-animates the transition between positions and sizes.

## Lists & Grids

### Auto-animating list changes

```jsx
<AnimatePresence>
  {items.map(item => (
    <motion.li
      key={item.id}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {item.label}
    </motion.li>
  ))}
</AnimatePresence>
```

The `layout` prop makes items smoothly reposition when siblings are added/removed.

### Grid ↔ list toggle

Add `layout` to every grid item. Toggling CSS between grid and list layout triggers automatic position animation via FLIP transforms.

## Tabs

### Animated underline indicator

```jsx
{tabs.map(tab => (
  <button key={tab.id} onClick={() => setActive(tab.id)} style={{ position: "relative" }}>
    {tab.label}
    {active === tab.id && (
      <motion.div
        layoutId="tab-underline"
        className="underline"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </button>
))}
```

### Direction-aware tab content

```jsx
<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={activeTab}
    custom={direction}
    variants={{
      enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (d) => ({ x: d > 0 ? -300 : 300, opacity: 0 })
    }}
    initial="enter"
    animate="center"
    exit="exit"
  >
    {tabContent}
  </motion.div>
</AnimatePresence>
```

## Accordion & Collapse

Motion can animate to `height: "auto"` directly:

```jsx
<motion.div
  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
  style={{ overflow: "hidden" }}
>
  <div style={{ padding: "1rem" }}>{content}</div>
</motion.div>
```

Wrap multiple accordions in `<LayoutGroup>` so collapsing one smoothly pushes siblings.

## Carousel & Slider

### Gesture-based swipe

```jsx
const [index, setIndex] = useState(0)

<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(_, info) => {
    if (info.offset.x > 100) setIndex(i => Math.max(i - 1, 0))
    else if (info.offset.x < -100) setIndex(i => Math.min(i + 1, slides.length - 1))
  }}
  animate={{ x: -index * slideWidth }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  {slides.map(slide => <div key={slide.id}>{slide.content}</div>)}
</motion.div>
```

### AnimatePresence slideshow

Use `AnimatePresence mode="wait"` with direction-aware variants (slide in from left or right based on navigation direction).

## Toast & Notifications

```jsx
<AnimatePresence>
  {toasts.map(toast => (
    <motion.div
      key={toast.id}
      layout
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {toast.message}
    </motion.div>
  ))}
</AnimatePresence>
```

The `layout` prop ensures the stack repositions smoothly when toasts are added/removed.

## Text Animations

### Word-by-word reveal

```jsx
const words = text.split(" ")

<motion.div initial="hidden" animate="visible"
  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
  {words.map((word, i) => (
    <motion.span
      key={i}
      variants={{
        hidden: { opacity: 0, y: "0.5em" },
        visible: { opacity: 1, y: 0 }
      }}
      style={{ display: "inline-block", marginRight: "0.25em" }}
    >
      {word}
    </motion.span>
  ))}
</motion.div>
```

### Character-by-character

Same pattern but split into characters with `staggerChildren: 0.03`.

### Typewriter effect (DIY)

```jsx
const [scope, animate] = useAnimate()
const [displayed, setDisplayed] = useState("")

useEffect(() => {
  animate(0, text.length, {
    duration: text.length * 0.05,
    ease: "linear",
    onUpdate: (v) => setDisplayed(text.slice(0, Math.round(v)))
  })
}, [text])
```

## SVG Path Drawing & Morphing

### Line drawing animation

```jsx
<motion.svg viewBox="0 0 100 100">
  <motion.path
    d="M10 80 Q 52.5 10, 95 80"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2, ease: "easeInOut" }}
  />
</motion.svg>
```

### Path morphing (same point count)

```jsx
<motion.path animate={{ d: isToggled ? pathA : pathB }} transition={{ duration: 0.5 }} />
```

For different point counts, use Flubber.js for interpolation and drive it with `animate()`.

## Scroll Effects & Parallax

### Parallax layers

```jsx
function Parallax() {
  const { scrollYProgress } = useScroll()
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const fgY = useTransform(scrollYProgress, [0, 1], [0, -300])

  return (
    <>
      <motion.div className="bg-layer" style={{ y: bgY }} />
      <motion.div className="fg-layer" style={{ y: fgY }} />
    </>
  )
}
```

### Element fade-in on scroll

```jsx
function ScrollReveal({ children }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"]
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [50, 0])

  return <motion.div ref={ref} style={{ opacity, y }}>{children}</motion.div>
}
```

### Horizontal scroll story

```jsx
function HorizontalScroll({ sections }) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(sections.length - 1) * 100}%`])

  return (
    <div ref={containerRef} style={{ height: `${sections.length * 100}vh` }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <motion.div style={{ x, display: "flex" }}>
          {sections.map(s => <div key={s.id} style={{ minWidth: "100vw" }}>{s.content}</div>)}
        </motion.div>
      </div>
    </div>
  )
}
```

## Page & Route Transitions

### Next.js App Router

```jsx
// app/template.tsx
"use client"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"

export default function Template({ children }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

## Image Gallery & Lightbox

```jsx
// Grid thumbnails
{images.map(img => (
  <motion.img
    key={img.id}
    layoutId={`gallery-${img.id}`}
    src={img.thumb}
    onClick={() => setSelected(img)}
    whileHover={{ scale: 1.05 }}
  />
))}

// Lightbox overlay
<AnimatePresence>
  {selected && (
    <>
      <motion.div className="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.img
        layoutId={`gallery-${selected.id}`}
        src={selected.full}
        drag="y"
        onDragEnd={(_, info) => Math.abs(info.offset.y) > 100 && setSelected(null)}
      />
    </>
  )}
</AnimatePresence>
```

## Loading & Skeleton States

### Bouncing dots

```jsx
const dotVariants = {
  bounce: (i) => ({
    y: [0, -15, 0],
    transition: { duration: 0.6, repeat: Infinity, delay: i * 0.15 }
  })
}

<div style={{ display: "flex", gap: 8 }}>
  {[0, 1, 2].map(i => (
    <motion.div key={i} custom={i} variants={dotVariants} animate="bounce"
      style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "currentColor" }} />
  ))}
</div>
```

### Skeleton shimmer

```jsx
<motion.div
  animate={{ opacity: [0.5, 1, 0.5] }}
  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  className="skeleton-block"
/>
```

## Micro-interactions

### Button press

```jsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  Click me
</motion.button>
```

### Toggle switch

```jsx
<motion.div className="switch" onClick={toggle}
  animate={{ backgroundColor: isOn ? "#4CAF50" : "#ccc" }}>
  <motion.div className="handle" layout transition={{ type: "spring", stiffness: 700, damping: 30 }} />
</motion.div>
// CSS: .switch { display: flex; justify-content: isOn ? "flex-end" : "flex-start" }
```

### Error shake

```jsx
animate={{ x: hasError ? [0, -10, 10, -10, 10, 0] : 0 }}
transition={{ duration: 0.4 }}
```

### Like button burst

```jsx
const [scope, animate] = useAnimate()

async function handleLike() {
  await animate(scope.current, { scale: [1, 1.3, 1] }, { duration: 0.3 })
  // Spawn particle animations here
}
```

## Background & Ambient Effects

### Floating blobs

```jsx
{[0, 1, 2].map(i => (
  <motion.div
    key={i}
    className="blob"
    animate={{
      x: [0, Math.random() * 100 - 50, 0],
      y: [0, Math.random() * 100 - 50, 0],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 8 + i * 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    }}
  />
))}
// CSS: .blob { border-radius: 50%; filter: blur(60px); mix-blend-mode: multiply; }
```

### Animated gradient background

```jsx
<motion.div
  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
  style={{ backgroundSize: "200% 200%", background: "linear-gradient(270deg, #ff6b6b, #4ecdc4, #45b7d1)" }}
/>
```

## Cursor & Magnetic Effects

### Custom cursor follower

```jsx
function CustomCursor() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springX = useSpring(cursorX, { stiffness: 300, damping: 30 })
  const springY = useSpring(cursorY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const handler = (e) => { cursorX.set(e.clientX); cursorY.set(e.clientY) }
    window.addEventListener("pointermove", handler)
    return () => window.removeEventListener("pointermove", handler)
  }, [])

  return <motion.div className="cursor" style={{ x: springX, y: springY, position: "fixed" }} />
}
```

### Magnetic button

Calculate distance from button center on hover, pull toward cursor via `useSpring`, reset on pointer leave.

## Counter & Number Animations

```jsx
function AnimatedCounter({ target }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(count, target, { duration: 2, ease: "easeOut" })
    return () => controls.stop()
  }, [target])

  return <motion.span>{rounded}</motion.span>
}
```

## 3D Transforms

Apply `perspective` on parent, use `rotateX`/`rotateY`/`rotateZ` on children:

```jsx
<div style={{ perspective: 800 }}>
  <motion.div
    whileHover={{ rotateX: 5, rotateY: -5, scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    3D tilt card
  </motion.div>
</div>
```

## Marquee & Ticker

### DIY infinite marquee

```jsx
<div style={{ overflow: "hidden" }}>
  <motion.div
    animate={{ x: [0, "-50%"] }}
    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    style={{ display: "flex", width: "max-content" }}
  >
    {[...items, ...items].map((item, i) => (
      <div key={i} style={{ flexShrink: 0 }}>{item}</div>
    ))}
  </motion.div>
</div>
```

Content is duplicated so the loop appears seamless.

## Progress Indicators

### Scroll progress bar

```jsx
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left", position: "fixed", top: 0, left: 0, right: 0, height: 3 }}
      className="progress-bar"
    />
  )
}
```

### Circular progress

```jsx
<motion.svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="40" fill="none" stroke="#eee" strokeWidth="8" />
  <motion.circle
    cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8"
    strokeLinecap="round"
    initial={{ pathLength: 0 }}
    animate={{ pathLength: progress }}
    style={{ rotate: -90 }}
  />
</motion.svg>
```
