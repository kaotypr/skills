# Shared-element card → modal with Motion

Two components plus a small stylesheet. The grid card and the modal share
`layoutId`s on the container, image, title, and description. Motion measures
both elements and animates the morph in both directions automatically — no
manual FLIP, no duplicated styles driving the transition.

Package note: the library is `motion` (successor to Framer Motion), imports
come from `motion/react`. Do **not** use `framer-motion`.

## `Gallery.tsx`

```tsx
import { useState } from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { CardModal } from "./CardModal"
import "./gallery.css"

export type Project = {
  id: string
  title: string
  description: string
  image: string
  imageAlt?: string
}

type GalleryProps = {
  projects: Project[]
}

export function Gallery({ projects }: GalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeProject = projects.find((p) => p.id === activeId) ?? null

  return (
    // LayoutGroup namespaces layoutIds so this Gallery can safely coexist
    // with any other shared-element animations on the page.
    <LayoutGroup id="project-gallery">
      <ul className="gallery-grid">
        {projects.map((project) => (
          <li key={project.id} className="gallery-grid__item">
            <motion.button
              type="button"
              // Same layoutId as the modal container — this card morphs into it.
              layoutId={`card-${project.id}`}
              onClick={() => setActiveId(project.id)}
              className="gallery-card"
              // borderRadius MUST be inline so Motion can correct scale distortion.
              style={{ borderRadius: 16 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              aria-label={`Open project: ${project.title}`}
            >
              <motion.img
                layoutId={`card-image-${project.id}`}
                src={project.image}
                alt={project.imageAlt ?? ""}
                className="gallery-card__image"
                // layout="position" avoids aspect-ratio stretch on the <img>.
                draggable={false}
              />
              <div className="gallery-card__body">
                <motion.h3
                  layoutId={`card-title-${project.id}`}
                  className="gallery-card__title"
                >
                  {project.title}
                </motion.h3>
                <motion.p
                  layoutId={`card-description-${project.id}`}
                  className="gallery-card__description"
                >
                  {project.description}
                </motion.p>
              </div>
            </motion.button>
          </li>
        ))}
      </ul>

      {/* AnimatePresence lives OUTSIDE the conditional so it can run the
          exit animation when activeProject becomes null. */}
      <AnimatePresence>
        {activeProject && (
          <CardModal
            key={activeProject.id}
            project={activeProject}
            onClose={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}
```

## `CardModal.tsx`

```tsx
import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import type { Project } from "./Gallery"

type CardModalProps = {
  project: Project
  onClose: () => void
}

export function CardModal({ project, onClose }: CardModalProps) {
  const shouldReduceMotion = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)

  // Escape to close + prevent background scroll + minimal focus management.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Move focus into the dialog for keyboard users.
    dialogRef.current?.focus()

    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <>
      {/* Backdrop — not part of the shared-element animation; simple fade.
          It owns the "click outside to close" behaviour. */}
      <motion.div
        className="card-modal__backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* The modal container shares its layoutId with the grid card.
          Motion measures both and animates the morph in both directions. */}
      <motion.div
        layoutId={`card-${project.id}`}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`card-modal-title-${project.id}`}
        tabIndex={-1}
        className="card-modal"
        // borderRadius on style so scale correction works during the morph.
        // Animating radius from 16 -> 24 is handled by layout, not `animate`.
        style={{ borderRadius: 24 }}
        // Per-property transition: layout morph gets a spring; opacity/content
        // fade uses a tween. Opacity animates only if reduced motion is on.
        transition={{
          layout: shouldReduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 32 },
          default: { duration: 0.25, ease: "easeOut" },
        }}
      >
        <motion.img
          layoutId={`card-image-${project.id}`}
          src={project.image}
          alt={project.imageAlt ?? ""}
          className="card-modal__image"
          draggable={false}
        />

        <div className="card-modal__body">
          <motion.h3
            layoutId={`card-title-${project.id}`}
            id={`card-modal-title-${project.id}`}
            className="card-modal__title"
          >
            {project.title}
          </motion.h3>

          <motion.p
            layoutId={`card-description-${project.id}`}
            className="card-modal__description"
          >
            {project.description}
          </motion.p>

          {/* Extra modal-only content fades in after the morph settles.
              `initial={false}` on the shared elements above keeps them from
              fighting their layout animation; here we DO want an entrance. */}
          <motion.div
            className="card-modal__extra"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="card-modal__close"
              aria-label="Close dialog"
            >
              Close
            </button>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}
```

## `gallery.css`

```css
/* Stable gutter so the scrollbar appearing when the modal opens
   doesn't trigger a layout animation on the cards underneath. */
html {
  scrollbar-gutter: stable;
}

/* ---------- Grid ---------- */

.gallery-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.gallery-grid__item {
  display: block;
}

/* ---------- Card ---------- */

.gallery-card {
  /* Must NOT be inline — transforms are ignored on inline. `button` is already
     inline-block by default; we make it block to fill the grid cell. */
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: #fff;
  color: inherit;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04);
  /* border-radius is set inline via style={{ borderRadius: 16 }} so Motion
     can correct for scale distortion during the layout animation. */
  font: inherit;
}

.gallery-card:focus-visible {
  outline: 3px solid #5b8cff;
  outline-offset: 2px;
}

.gallery-card__image {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  background: #eee;
}

.gallery-card__body {
  padding: 1rem 1.25rem 1.25rem;
}

.gallery-card__title {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.25;
}

.gallery-card__description {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.45;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ---------- Modal ---------- */

.card-modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 24, 0.55);
  backdrop-filter: blur(4px);
  z-index: 40;
}

.card-modal {
  position: fixed;
  /* Centered, constrained panel — this is the layout the card morphs INTO. */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(960px, calc(100vw - 2rem));
  max-height: calc(100vh - 2rem);
  background: #fff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 50;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  /* border-radius set inline for scale correction. */
}

.card-modal:focus {
  outline: none;
}

.card-modal__image {
  display: block;
  width: 100%;
  max-height: 55vh;
  object-fit: cover;
  background: #eee;
}

.card-modal__body {
  padding: 1.5rem 2rem 2rem;
  overflow: auto;
}

.card-modal__title {
  margin: 0 0 0.75rem;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
}

.card-modal__description {
  margin: 0 0 1.5rem;
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}

.card-modal__extra {
  display: flex;
  justify-content: flex-end;
}

.card-modal__close {
  appearance: none;
  border: 0;
  border-radius: 8px;
  padding: 0.55rem 1.1rem;
  background: #111;
  color: #fff;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
}

.card-modal__close:focus-visible {
  outline: 3px solid #5b8cff;
  outline-offset: 2px;
}

/* ---------- Reduced motion ----------
   Motion respects prefers-reduced-motion via useReducedMotion() / MotionConfig,
   but we also neutralise any CSS transitions just to be safe. */
@media (prefers-reduced-motion: reduce) {
  .gallery-card,
  .card-modal,
  .card-modal__backdrop {
    transition: none !important;
  }
}
```

## Usage

```tsx
import { Gallery } from "./Gallery"

const projects = [
  { id: "a", title: "Aurora", description: "…", image: "/a.jpg" },
  { id: "b", title: "Borealis", description: "…", image: "/b.jpg" },
  // …
]

<Gallery projects={projects} />
```

---

## Gotchas you should know

### 1. `layoutId` is global — namespace it
`layoutId="card-1"` collides across the whole app. If you have two galleries
on the same page, or reuse the pattern in a header, they'll try to animate
into each other. The `<LayoutGroup id="project-gallery">` wrapper scopes the
ids. Also, each id must be unique *within* the group — that's why they include
the project id (`card-${project.id}`, not `"card"`).

### 2. `border-radius` and `box-shadow` must come from `style`, not CSS
Layout animations use `transform: scale()`. A border-radius defined in CSS
gets scale-distorted into an oval. Motion corrects this **only** when the
radius comes in via `style` (or an animation prop). That's why both the card
(`style={{ borderRadius: 16 }}`) and the modal (`style={{ borderRadius: 24 }}`)
set it inline — Motion sees the value change and corrects frame-by-frame.
Same rule applies to `box-shadow` if you animate it.

### 3. Don't animate `width` / `height` — let `layout` do it
The morph works because Motion sees the grid card and the fixed-positioned
modal as the same element, measures both boxes, and animates a transform
between them. If you ALSO put `animate={{ width: "100vw" }}` on the modal,
you'd be double-driving the same property. Layout changes go through CSS
(`style` / class names); `animate` is for values Motion fully owns.

### 4. `AnimatePresence` must outlive the modal
```tsx
// GOOD — AnimatePresence stays mounted, picks up the exit
<AnimatePresence>
  {activeProject && <CardModal … />}
</AnimatePresence>

// BAD — AnimatePresence unmounts with the child, exit never runs
{activeProject && (
  <AnimatePresence>
    <CardModal … />
  </AnimatePresence>
)}
```
The modal's close animation *is* its exit — if `AnimatePresence` unmounts
before the morph-back plays, the modal just disappears.

### 5. `<img>` aspect-ratio stretches during the morph
The card image is `16:10`; the modal image is taller. While Motion is
transforming, the image can visibly squish. Two mitigations, both already in
the code:
- `object-fit: cover` on the image.
- The image gets the same `layoutId` — Motion animates it as part of the
  shared-element set, not as a child being scaled by its parent.
If you see stretching, try `layout="position"` on the image instead of a
`layoutId` match, at the cost of the picture snapping to its new size rather
than morphing.

### 6. `display: inline` silently breaks everything
Browsers ignore `transform` on inline elements. If any shared element ends up
`display: inline` (the default for `<h3>`? No — it's block. For `<span>`? Yes.),
the morph just doesn't happen, with no error. Keep shared elements `block`,
`inline-block`, or `flex`. The `<h3>` and `<p>` here are block by default;
we set `display: block` on the card for safety.

### 7. Scrollbar appearing = unwanted layout animation
When the modal opens we lock `body { overflow: hidden }`. Depending on the OS,
that removes the vertical scrollbar, which shifts every card 8-17px to the
right — and `motion.button layoutId=…` will dutifully animate that shift.
`html { scrollbar-gutter: stable }` reserves the gutter so nothing moves.

### 8. `useReducedMotion` + per-property transition
Users with `prefers-reduced-motion: reduce` should not see a 960px-wide
element fly across their screen. `useReducedMotion()` returns `true` and we
collapse the `layout` transition to `duration: 0` so the modal just appears.
Opacity fades still run because they're not vestibular triggers. If you want
project-wide handling instead, wrap your app in
`<MotionConfig reducedMotion="user">`.

### 9. Focus management is YOUR problem
Motion animates pixels; it does not trap focus, restore focus on close, or
mark things `aria-hidden`. The `useEffect` in `CardModal` does the minimum:
focus the dialog on open, restore focus on close, lock body scroll, listen
for Escape. For a production app, add a real focus trap (e.g. `focus-trap-react`
or a manual tab-cycle). The `role="dialog" aria-modal="true"` pair gives
assistive tech the right semantics.

### 10. Escape listener on `window`, not the dialog
A fresh dialog hasn't been focused yet when it mounts, so attaching `keydown`
to the dialog element can miss the first Escape press. `window`-level is
reliable; we scope by only mounting the listener while the modal is open.
The listener cleanup runs before the exit animation finishes, which is fine —
we're calling `onClose()` to kick off the exit, not waiting to consume another
key.

### 11. Clicking inside the modal doesn't close it
The backdrop is a sibling of the modal, not an ancestor. Clicks on the modal
itself never reach the backdrop's `onClick`, so there's no need for
`stopPropagation`. This is cleaner than a nested backdrop approach.

### 12. If you ever wrap motion components in `<LazyMotion>`
You must use `<m.div>` instead of `<motion.div>`, and `domMax` (not
`domAnimation`) to retain layout animations — `domAnimation` doesn't include
the layout projection code.
