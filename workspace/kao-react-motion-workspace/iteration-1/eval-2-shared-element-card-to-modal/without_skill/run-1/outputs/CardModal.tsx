import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { Project } from "./Gallery";

type CardModalProps = {
  project: Project;
  onClose: () => void;
};

export function CardModal({ project, onClose }: CardModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Move focus into the modal when it opens (basic a11y).
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  return (
    <div
      className="modal-root"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${project.id}`}
    >
      {/* Backdrop — plain fade, NOT a layout animation */}
      <motion.div
        className="modal-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* Shared-element container.
         Using the same layoutId as the card wrapper is optional; here we
         animate each child independently so the image, title, and description
         each morph from their grid position to their modal position. */}
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        className="modal-card"
        // We don't give the outer card a layoutId — individual children own
        // the shared-element animation. This keeps the layout flexible and
        // avoids distortion on the container itself.
      >
        <motion.img
          layoutId={`card-image-${project.id}`}
          src={project.image}
          alt=""
          className="modal-card__image"
          draggable={false}
        />

        <div className="modal-card__body">
          <motion.h3
            layoutId={`card-title-${project.id}`}
            id={`modal-title-${project.id}`}
            className="modal-card__title"
          >
            {project.title}
          </motion.h3>

          <motion.p
            layoutId={`card-desc-${project.id}`}
            className="modal-card__desc"
          >
            {project.description}
          </motion.p>

          {/* Extra content that only appears in the modal.
             It fades in after the shared elements settle. */}
          <motion.div
            className="modal-card__extra"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, delay: 0.25 }}
          >
            <button
              type="button"
              className="modal-card__close"
              onClick={onClose}
            >
              Close
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
