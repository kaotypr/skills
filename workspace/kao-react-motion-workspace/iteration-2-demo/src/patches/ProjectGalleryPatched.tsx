/*
 * Patched version of the iter-2 with-skill ProjectGallery output.
 *
 * Preserves everything from the original EXCEPT two bugs:
 *
 * 1. Removed `layout="position"` from both shared motion.img elements.
 *    `layout="position"` disables size animation, and `layoutId` needs both size
 *    and position to morph. The original paired them, making the image snap to
 *    modal-size instantly then slide into place instead of growing smoothly
 *    from the card.
 *
 * 2. Changed the modal wrapper (the bg-card/border/shadow container) from a
 *    plain <div> to a motion.div with an opacity-only exit. Without this, the
 *    chrome stays visible during the close-morph, leaving a ghost card in the
 *    centre of the screen for ~300ms while the image/title/desc fly back.
 *    Opacity only — a scale exit on the parent would compound with the shared
 *    elements' layoutId transform and distort the morph.
 *
 * Both fixes now live in the skill's recipes.md and layout-animations.md.
 * This file is NOT eval evidence; it exists only so the demo app can render
 * the corrected behaviour alongside the original (broken) output.
 */

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
  extendedDescription?: string
  image: string
}

type ProjectGalleryProps = {
  projects: Project[]
}

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = projects.find((p) => p.id === activeId) ?? null
  const reduce = useReducedMotion()

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
                  {/* FIX 1: removed layout="position" so the image morphs size + position together */}
                  <motion.img
                    layoutId={`project-image-${p.id}`}
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
  const revealDelay = reduce ? 0 : 0.28

  return (
    <>
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

      {/*
        Centring wrapper is pointer-events-none so backdrop clicks pass through
        to the overlay above; the inner chrome is pointer-events-auto to capture
        its own clicks.
      */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`project-modal-title-${project.id}`}
      >
        {/*
          FIX 2: wrapper chrome is now a motion.div with an opacity-only exit.
          Without this, it stayed visible as a ghost card during the close-morph.
          Opacity only — scale would compound with the shared elements' layoutId
          transform and distort the morph.
        */}
        <motion.div
          className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.05 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
        >
          <motion.img
            layoutId={`project-image-${project.id}`}
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

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4, transition: { duration: 0.1 } }}
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
        </motion.div>
      </div>
    </>
  )
}

export default ProjectGallery
