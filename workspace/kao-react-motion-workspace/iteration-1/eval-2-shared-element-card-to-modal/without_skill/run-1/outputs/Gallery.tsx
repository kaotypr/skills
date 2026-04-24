import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CardModal } from "./CardModal";
import "./gallery.css";

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
};

type GalleryProps = {
  projects: Project[];
};

export function Gallery({ projects }: GalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeProject = projects.find((p) => p.id === activeId) ?? null;

  // Close on Escape
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!activeId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeId]);

  return (
    <>
      <ul className="gallery-grid">
        {projects.map((project) => (
          <li key={project.id} className="gallery-item">
            <motion.button
              type="button"
              className="gallery-card"
              onClick={() => setActiveId(project.id)}
              // Hide the source card while its modal twin is on screen
              // so the two don't visually overlap.
              style={{
                visibility: activeId === project.id ? "hidden" : "visible",
              }}
              aria-label={`Open ${project.title}`}
            >
              <motion.img
                layoutId={`card-image-${project.id}`}
                src={project.image}
                alt=""
                className="gallery-card__image"
                draggable={false}
              />
              <motion.h3
                layoutId={`card-title-${project.id}`}
                className="gallery-card__title"
              >
                {project.title}
              </motion.h3>
              <motion.p
                layoutId={`card-desc-${project.id}`}
                className="gallery-card__desc"
              >
                {project.description}
              </motion.p>
            </motion.button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {activeProject && (
          <CardModal
            key={activeProject.id}
            project={activeProject}
            onClose={() => setActiveId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
