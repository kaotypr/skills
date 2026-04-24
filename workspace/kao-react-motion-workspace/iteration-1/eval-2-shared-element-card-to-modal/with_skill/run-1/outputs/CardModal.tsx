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
