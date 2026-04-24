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
