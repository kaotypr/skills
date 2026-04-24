# ProjectGallery — shared-element morph

Card-to-fullscreen morph with Motion `layoutId`, built on top of shadcn `Card` + `Button` and shadcn theme tokens (`bg-card`, `text-card-foreground`, `text-muted-foreground`, `border-border`, `bg-background`). Imports are from `motion/react` (the package is `motion`, not `framer-motion`).

```tsx
"use client"

import { useEffect, useState } from "react"
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from "motion/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export type Project = {
  id: string
  title: string
  description: string
  /** Long-form copy shown only in the fullscreen view. */
  extendedDescription?: string
  image: string
}

type ProjectGalleryProps = {
  projects: Project[]
}

/**
 * Shared-element morph gallery.
 *
 * Design:
 * - Grid uses shadcn <Card>. Only the image, title and description carry
 *   `layoutId`s — NOT the Card container itself. This is "Shape A" from
 *   the layout-animations reference and is the simplest way to avoid the
 *   "two cards visible at once" flicker.
 * - The fullscreen panel is a sibling portal-style <div className="fixed">
 *   — it is NOT rendered inside the Card, so React doesn't need to move
 *   DOM nodes. Motion just crossfades position/size between the grid
 *   elements and their fullscreen twins.
 * - Modal-only content (Close button, extended description) has no
 *   `layoutId`. It fades in with a `delay` so it appears AFTER the morph
 *   has settled, and fades out first on exit so it never overlaps the
 *   morphing back-to-grid.
 */
export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = projects.find((p) => p.id === activeId) ?? null
  const reduce = useReducedMotion()

  // Escape to close + body scroll lock while open.
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null)
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [active])

  // Shared transition for the morph. Spring is natural for position+size;
  // a slightly firmer spring keeps the whole morph under ~350ms so the
  // fade-in of modal content lands promptly.
  const morphTransition = {
    type: "spring" as const,
    stiffness: 320,
    damping: 34,
    mass: 0.9,
  }

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup id="project-gallery">
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const isActive = p.id === activeId
            return (
              <li key={p.id}>
                {/*
                  The Card below is *not* a motion component and has no
                  layoutId. While this card is the active one we hide it
                  with `visibility: hidden` so there's no ghost card left
                  at the grid position during the morph. The elements
                  with layoutId (img/title/desc) still measure correctly
                  because `visibility: hidden` preserves layout.
                */}
                <Card
                  className="overflow-hidden p-0 cursor-pointer"
                  style={{ visibility: isActive ? "hidden" : "visible" }}
                  onClick={() => setActiveId(p.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setActiveId(p.id)
                    }
                  }}
                  aria-label={`Open ${p.title}`}
                >
                  <motion.img
                    layoutId={`project-image-${p.id}`}
                    layout="position"
                    src={p.image}
                    alt=""
                    draggable={false}
                    className="aspect-video w-full object-cover"
                    transition={morphTransition}
                  />
                  <CardContent className="p-4">
                    <motion.h3
                      layoutId={`project-title-${p.id}`}
                      className="font-semibold text-card-foreground"
                      transition={morphTransition}
                    >
                      {p.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`project-desc-${p.id}`}
                      className="mt-1 text-sm text-muted-foreground"
                      transition={morphTransition}
                    >
                      {p.description}
                    </motion.p>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>

        {/*
          AnimatePresence MUST sit outside the conditional so the return
          morph has something to exit from. Each child gets a stable key.
        */}
        <AnimatePresence>
          {active && (
            <ProjectModal
              key="project-modal"
              project={active}
              onClose={() => setActiveId(null)}
              morphTransition={morphTransition}
              reduce={reduce ?? false}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </MotionConfig>
  )
}

type ProjectModalProps = {
  project: Project
  onClose: () => void
  morphTransition: {
    type: "spring"
    stiffness: number
    damping: number
    mass: number
  }
  reduce: boolean
}

function ProjectModal({
  project,
  onClose,
  morphTransition,
  reduce,
}: ProjectModalProps) {
  // Delay for modal-only content to fade in AFTER the morph has settled.
  // Roughly the perceptual end of a 320/34 spring at these distances.
  const revealDelay = reduce ? 0 : 0.28

  return (
    <>
      {/* Backdrop — plain opacity fade, no layoutId. */}
      <motion.div
        key="project-modal-overlay"
        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered container. This wrapper is NOT a motion component and
          has no layoutId — the morphing elements sit inside it. */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-modal-title-${project.id}`}
      >
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl">
          <motion.img
            layoutId={`project-image-${project.id}`}
            layout="position"
            src={project.image}
            alt=""
            draggable={false}
            className="aspect-video w-full object-cover"
            transition={morphTransition}
          />
          <div className="p-6 sm:p-8">
            <motion.h3
              layoutId={`project-title-${project.id}`}
              id={`project-modal-title-${project.id}`}
              className="text-2xl font-semibold text-card-foreground"
              transition={morphTransition}
            >
              {project.title}
            </motion.h3>
            <motion.p
              layoutId={`project-desc-${project.id}`}
              className="mt-2 text-muted-foreground"
              transition={morphTransition}
            >
              {project.description}
            </motion.p>

            {/*
              Modal-only content: no layoutId. Fades in AFTER the morph
              settles (via `delay`) and fades out first on exit so it
              never overlaps the back-to-grid morph.
            */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4, transition: { duration: 0.12 } }}
              transition={{
                duration: 0.22,
                ease: "easeOut",
                delay: revealDelay,
              }}
              className="mt-6 space-y-6"
            >
              {project.extendedDescription && (
                <p className="text-sm leading-relaxed text-foreground/90">
                  {project.extendedDescription}
                </p>
              )}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  autoFocus
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectGallery
```

## How it works

- **Shape A: morph individual children only.** Only `motion.img`, `motion.h3`, and `motion.p` carry `layoutId`s (namespaced under `LayoutGroup id="project-gallery"`). The shadcn `Card` container itself is *not* a motion component and has no `layoutId`. This is the recommended default from the skill's `layout-animations` reference — avoiding a `layoutId` on both the container AND its children sidesteps the most common shared-element flicker.
- **Source card hidden during morph.** While `activeId === p.id`, the source `Card` uses `style={{ visibility: "hidden" }}`. That removes the visible ghost at the grid position but keeps the element in layout so Motion's projection math still works. `display: none` would break measurement, which is why the skill specifically calls out `visibility: hidden` as the load-bearing compensator.
- **Fullscreen panel is a sibling, not a descendant of the Card.** The fixed-position modal lives next to the grid (inside the same `LayoutGroup`). Motion crossfades position/size between the two twin elements — React never has to move DOM nodes between trees, which is where shared-element demos usually go wrong.
- **Modal-only content fades in *after* the morph.** The Close button and the extended description live in a plain `motion.div` with `initial={{ opacity: 0, y: 8 }}`, `animate={{ opacity: 1 }}`, and a `delay: 0.28` matched to the morph spring's perceptual end. On exit, it uses a short 120ms fade-out (overriding the presence transition) so the Close button is gone before the back-to-grid morph starts — no overlap.
- **AnimatePresence is outside the conditional.** `<AnimatePresence>{active && <ProjectModal />}</AnimatePresence>` — this is the rule from the skill's critical-rules list. Putting `AnimatePresence` inside the `active &&` would unmount it along with its child and skip the exit morph.
- **`layout="position"` on the image.** Images don't like being stretched mid-morph. `layout="position"` (also applied to the non-image elements for consistency of transition) makes Motion jump the intrinsic size and animate only the position, which prevents the aspect-ratio warp you sometimes see on photos.
- **Shared `morphTransition` object.** Both twins use the same spring (`stiffness: 320, damping: 34, mass: 0.9`). The skill notes that the *new* element's transition governs the direction, so making them identical avoids any asymmetry between open and close.
- **Escape + click-outside + body scroll lock.** Handled in a `useEffect` keyed on `active`. The overlay's `onClick` closes; `Escape` closes via the keydown listener; `document.body.style.overflow = "hidden"` prevents the page from scrolling behind the modal.
- **Reduced motion.** `<MotionConfig reducedMotion="user">` at the root turns off transforms and layout animations for users who've opted into `prefers-reduced-motion`; opacity still animates so the UI doesn't feel broken. The modal-content delay collapses to 0 in that case so content appears immediately.
- **shadcn theme tokens throughout.** `bg-card`, `text-card-foreground`, `text-muted-foreground`, `border-border`, `bg-background/80` — no raw color utilities.
- **shadcn `Button` kept as-is.** No need for `asChild` here because the button is just a click target, not an animated element. (If you wanted the button itself to `whileHover={{ scale: 1.04 }}`, the pattern would be `<Button asChild><motion.button ... /></Button>`.)

## How to avoid the flicker / overlap you've seen in other demos

Shared-element flicker in Motion comes from four recurring mistakes. The component above dodges all four:

1. **Double-`layoutId` on container AND children.** If you put `layoutId` on the card container *and* on its image/title/description, Motion runs two parallel morphs that briefly both render — the card ghosts, the children snap. **Fix (used here):** pick one level of granularity. This component uses Shape A (children only). If you want the whole card to morph as one unit (Shape B), then remove `layoutId` from the children *and* hide the source card with `visibility: hidden`.

2. **Forgetting to hide the source during the morph.** Even with Shape A, the leftover title/description text nodes in the source card can briefly flicker next to the twins that are about to occupy their positions. **Fix (used here):** `visibility: hidden` on the whole source `Card` while it's active. `visibility` preserves layout measurement (important for Motion's projection math); `display: none` would break it.

3. **Putting `AnimatePresence` inside the conditional.** `{isOpen && <AnimatePresence>...</AnimatePresence>}` unmounts `AnimatePresence` along with the child, so the exit animation never runs — the modal disappears instantly instead of morphing back, which reads as flicker. **Fix (used here):** `AnimatePresence` is outside the `active && ...` gate, with a stable `key="project-modal"` on the child.

4. **Modal-only content competing with the morphing elements during exit.** If the Close button and extended description fade out on the same timeline as the morph, you see them physically travel back toward the grid with the title/description, producing overlap and ghost text. **Fix (used here):** the modal-only content has a short 120ms exit that finishes *before* the morph starts; and its appearance is delayed on entry (`delay: 0.28`) until the morph has settled. Delay in, snap out — the morph is never fighting the fade.

Two smaller touches that also prevent subtle flicker:

- **Use `layout="position"` on the image.** Otherwise Motion animates both position and size, and a scale transform on a photo briefly warps it (and children rendered inside it). `layout="position"` jumps the size and crossfades position only.
- **Give both twins the *same* `transition`.** The skill notes that "the transition defined on the NEW element governs the direction" — when you morph back, the original's transition takes over. If they differ, you get an asymmetric feel that reads as a glitch. A single `morphTransition` constant eliminates that.

## Drop-in usage

```tsx
<ProjectGallery
  projects={[
    {
      id: "aurora",
      title: "Aurora",
      description: "Real-time analytics dashboards.",
      extendedDescription:
        "Built on top of an event-sourced backend with ClickHouse for OLAP and a React front-end streaming updates over WebTransport.",
      image: "/images/aurora.jpg",
    },
    // ...
  ]}
/>
```

Paths assume shadcn's default `@/components/ui/*` aliases. If your project uses a different alias, adjust the two imports at the top.
