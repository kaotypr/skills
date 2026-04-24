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
