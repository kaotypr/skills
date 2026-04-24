# Shared-element Card to Modal with Motion

Below are two components plus a plain-CSS stylesheet that implement a shared-element transition from a grid of project cards into a full-screen modal, using [Motion](https://motion.dev/) (the library formerly known as Framer Motion — the React package is now `motion/react`). It targets React 19 + TypeScript, no Tailwind.

Install:

```bash
npm install motion
```

## `Gallery.tsx`

```tsx
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
```

## `CardModal.tsx`

```tsx
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
```

## `gallery.css`

```css
/* --- Grid --- */
.gallery-grid {
  list-style: none;
  margin: 0;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.gallery-item {
  list-style: none;
}

.gallery-card {
  display: block;
  width: 100%;
  text-align: left;
  background: #14141a;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  font: inherit;
}

.gallery-card__image {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.gallery-card__title {
  font-size: 1.05rem;
  margin: 12px 16px 4px;
}

.gallery-card__desc {
  font-size: 0.9rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 16px 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* --- Modal --- */
.modal-root {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
}

.modal-card {
  position: relative;
  width: min(720px, 100%);
  max-height: calc(100vh - 48px);
  background: #14141a;
  color: #fff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  outline: none;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}

.modal-card__image {
  display: block;
  width: 100%;
  height: 320px;
  object-fit: cover;
}

.modal-card__body {
  padding: 20px 24px 28px;
  overflow-y: auto;
}

.modal-card__title {
  font-size: 1.6rem;
  margin: 0 0 8px;
}

.modal-card__desc {
  font-size: 1rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 20px;
}

.modal-card__extra {
  display: flex;
  justify-content: flex-end;
}

.modal-card__close {
  background: #fff;
  color: #14141a;
  border: 0;
  border-radius: 10px;
  padding: 10px 18px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## How the shared-element transition works

The trick is Motion's `layoutId` prop. When two `motion` elements share the same `layoutId` and only one is mounted at a time, Motion measures the outgoing element's box, then animates the incoming element from those coordinates to its new ones using FLIP. Because both source (grid card children) and destination (modal children) use the same `layoutId`, they appear as the *same* element morphing.

`AnimatePresence` wraps the modal so Motion can coordinate the enter/exit: on open, the modal mounts and takes over the `layoutId`s; on close, it unmounts and the grid card re-takes them, animating back into place.

## Gotchas to know about

1. **Matching `layoutId`s, one active at a time.** A `layoutId` must be unique per "shared instance." If you use the same `layoutId` on two mounted elements simultaneously, Motion picks one and you get jumps. That's why the grid card is hidden with `visibility: hidden` while its modal twin is mounted — removing it entirely (`display: none`) would also work but can change grid layout mid-animation. Never use `display: none` on the source; use `visibility` or opacity.

2. **`layoutId` vs `layout`.** `layout` animates an element's own size/position changes between renders. `layoutId` is specifically for the "shared element across unmount/mount" case you want here. Don't mix them on the same element unless you know why.

3. **`AnimatePresence` is required for the exit animation.** Without it, unmounting the modal removes it instantly and you lose the "animate back to grid" effect. Also give the modal a stable `key` (the project id) so AnimatePresence treats different projects as distinct.

4. **Image flicker / distortion during morph.** The `<img>` itself morphs size with `layoutId`, but Motion animates `width`/`height` via transforms, not via re-layout. Always set `object-fit: cover` on both the grid and modal image so aspect-ratio differences morph smoothly instead of stretching. Avoid `background-image` — use a real `<img>` so the pixels are the literal shared element.

5. **Don't wrap the outer card itself in a `layoutId`.** It's tempting to give the entire modal container a `layoutId` matching the entire grid card. In practice this warps padding, border-radius, and inner text badly because all children get scaled with the parent transform. Animate the image, title, and description as *separate* shared elements, and let the modal body (button, extra copy) fade in with a normal `initial`/`animate` after the morph settles.

6. **Border-radius and shadows can "pop".** Motion applies transforms that include a scale; scaled `border-radius` and `box-shadow` look distorted. Two fixes: (a) use `borderRadius` as an animated style value on the shared element so Motion corrects for scale (Motion does this automatically when `borderRadius` is a CSS number/string on a `motion` element), or (b) put the border-radius on the image itself via `overflow: hidden` on the container and let the image morph cleanly.

7. **Text re-flow.** The title goes from ~1rem in the grid to ~1.6rem in the modal, and the description line-clamp is different. Motion can't actually morph `font-size` smoothly in FLIP — it crossfades the old and new boxes while animating position/size. If you want a crisper feel, animate font-size on the `motion.h3` style prop (`style={{ fontSize }}`) so Motion animates it as a value, not a box swap. For most portfolios the default is fine.

8. **Scroll position and stacking.** When the modal opens, lock `body` overflow (done in `useEffect`) so the page behind doesn't scroll. Put the modal at a high `z-index` and at the DOM root (or via a portal) so it isn't clipped by an ancestor's `overflow: hidden` or `transform`. In this example, `.modal-root` is `position: fixed` which is usually enough; for complex apps, wrap the modal in `createPortal(..., document.body)`.

9. **Ancestors with `transform` break `position: fixed`.** If any ancestor of the modal uses CSS `transform`, `filter`, or `will-change: transform`, `position: fixed` becomes relative to that ancestor and the modal won't cover the viewport. Render via a portal to `document.body` to avoid this — it's the safest production setup.

10. **Click-outside vs click-on-card.** The backdrop `motion.div` calls `onClose` on click. The modal card is a *sibling* inside `.modal-root`, not a child of the backdrop, so clicks on the card don't bubble to the backdrop — no need for `stopPropagation`. If you instead nest the card inside the backdrop, you'll need `e.stopPropagation()` on the card's click.

11. **Escape handling and focus.** The Escape listener is attached only when the modal is open and cleaned up on close — don't register it globally. For real a11y you'd also want a focus trap (e.g. `focus-trap-react` or the native `<dialog>` element); the example above just moves initial focus. Consider `inert` on the background content for screen readers.

12. **`prefers-reduced-motion`.** Motion reads this automatically for its default spring transitions, but layout animations can still be jarring. The CSS media query in the stylesheet is a hard fallback; you can also pass `transition={{ duration: 0 }}` conditionally via `useReducedMotion()` from `motion/react` for finer control.

13. **StrictMode double-mount in dev.** React 19 dev StrictMode mounts/unmounts once to flush effects. With `AnimatePresence` this can cause a one-time flash the first render — it's a dev-only artifact, not a bug in your code.

14. **SSR.** If you're on Next.js or another SSR framework, both components must be in a `"use client"` file. Motion animations don't run on the server, and `layoutId` measurements require the DOM.

15. **Large grids & performance.** Every `motion.*` element is a tiny overhead. If you have hundreds of cards, consider only wrapping the clicked card's children in `motion.*` (render a plain card by default and swap to a `motion` version when hovered/active) or use `LayoutGroup` to scope layout measurements.

16. **The package name.** Motion used to be `framer-motion`. The current package is `motion` and the React entry is `motion/react`. If you're following older tutorials that import from `framer-motion`, the API is mostly the same but you should use the new package for React 19 support.
