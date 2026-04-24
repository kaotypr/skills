# ProjectGallery — shared-element morph with shadcn Card

Below is a single-file implementation using **Framer Motion's `layoutId`** as the shared-element primitive. The image, title, and description each carry a matching `layoutId` between the grid card and the modal, so Framer Motion's FLIP engine interpolates their geometry automatically. Everything *outside* the morph (scrim, close button, extended description) fades in on a delay so the user's eye lands on a settled layout before new content appears.

```tsx
"use client";

import * as React from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  /** Optional long-form description that only appears in the modal. */
  extendedDescription?: string;
};

type ProjectGalleryProps = {
  projects: Project[];
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*                               Motion Tokens                                */
/* -------------------------------------------------------------------------- */

/**
 * Use ONE spring for every shared-element transition so image, title, and
 * description arrive at their new positions in lockstep. Mixing springs is
 * the #1 source of visible "tearing" between shared elements.
 */
const MORPH_SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  mass: 0.9,
} as const;

/** Fade for modal-only chrome (close button, extended description). */
const FADE = {
  duration: 0.22,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

export function ProjectGallery({ projects, className }: ProjectGalleryProps) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const activeProject = React.useMemo(
    () => projects.find((p) => p.id === activeId) ?? null,
    [projects, activeId],
  );

  // Close on Escape
  React.useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  // Prevent body scroll while modal is open
  React.useEffect(() => {
    if (!activeId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeId]);

  return (
    // LayoutGroup scopes layoutId matching to this gallery — important if
    // multiple galleries live on the same page.
    <LayoutGroup id="project-gallery">
      <div
        className={cn(
          "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
          className,
        )}
      >
        {projects.map((project) => (
          <ProjectGridCard
            key={project.id}
            project={project}
            isActive={project.id === activeId}
            onOpen={() => setActiveId(project.id)}
            reducedMotion={!!prefersReducedMotion}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeProject && (
          <ProjectModal
            key={activeProject.id}
            project={activeProject}
            onClose={() => setActiveId(null)}
            reducedMotion={!!prefersReducedMotion}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Grid Card                                  */
/* -------------------------------------------------------------------------- */

type ProjectGridCardProps = {
  project: Project;
  isActive: boolean;
  onOpen: () => void;
  reducedMotion: boolean;
};

function ProjectGridCard({
  project,
  isActive,
  onOpen,
  reducedMotion,
}: ProjectGridCardProps) {
  // While the modal is open for THIS project, we hide the grid card (but keep
  // it in layout) so there's no duplicated element competing with the modal's
  // shared-element copy. `visibility: hidden` preserves grid geometry so when
  // the modal closes, the layout-id animation lands on the correct spot.
  return (
    <div
      style={{ visibility: isActive ? "hidden" : "visible" }}
      aria-hidden={isActive}
    >
      <motion.button
        type="button"
        onClick={onOpen}
        layoutId={`card-${project.id}`}
        transition={reducedMotion ? { duration: 0 } : MORPH_SPRING}
        className="group block w-full cursor-pointer rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        whileHover={reducedMotion ? undefined : { y: -2 }}
      >
        <Card className="overflow-hidden border-border/60 bg-card transition-colors group-hover:border-border">
          <motion.div
            layoutId={`image-${project.id}`}
            transition={reducedMotion ? { duration: 0 } : MORPH_SPRING}
            className="relative aspect-[16/10] w-full overflow-hidden bg-muted"
          >
            <img
              src={project.image}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </motion.div>
          <CardHeader>
            <motion.div
              layoutId={`title-${project.id}`}
              transition={reducedMotion ? { duration: 0 } : MORPH_SPRING}
            >
              <CardTitle className="text-lg">{project.title}</CardTitle>
            </motion.div>
            <motion.div
              layoutId={`description-${project.id}`}
              transition={reducedMotion ? { duration: 0 } : MORPH_SPRING}
            >
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            </motion.div>
          </CardHeader>
        </Card>
      </motion.button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Modal                                    */
/* -------------------------------------------------------------------------- */

type ProjectModalProps = {
  project: Project;
  onClose: () => void;
  reducedMotion: boolean;
};

function ProjectModal({ project, onClose, reducedMotion }: ProjectModalProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-title-${project.id}`}
    >
      {/* Scrim — fades only; does NOT share a layoutId with anything. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={FADE}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      {/* Shared-element container. The card itself morphs via layoutId. */}
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        layoutId={`card-${project.id}`}
        transition={reducedMotion ? { duration: 0 } : MORPH_SPRING}
        className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl focus:outline-none"
      >
        <motion.div
          layoutId={`image-${project.id}`}
          transition={reducedMotion ? { duration: 0 } : MORPH_SPRING}
          className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-muted"
        >
          <img
            src={project.image}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        </motion.div>

        <div className="flex flex-col gap-4 overflow-y-auto p-6 sm:p-8">
          <motion.div
            layoutId={`title-${project.id}`}
            transition={reducedMotion ? { duration: 0 } : MORPH_SPRING}
          >
            <h2
              id={`project-title-${project.id}`}
              className="text-2xl font-semibold tracking-tight"
            >
              {project.title}
            </h2>
          </motion.div>

          <motion.div
            layoutId={`description-${project.id}`}
            transition={reducedMotion ? { duration: 0 } : MORPH_SPRING}
          >
            <p className="text-muted-foreground">{project.description}</p>
          </motion.div>

          {/* Modal-only content: fades in AFTER the morph settles. */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                delay: reducedMotion ? 0 : 0.22,
                duration: reducedMotion ? 0 : 0.28,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              y: 4,
              transition: { duration: reducedMotion ? 0 : 0.12 },
            }}
            className="pt-2"
          >
            <CardContent className="p-0">
              <p className="text-sm leading-relaxed text-foreground/90">
                {project.extendedDescription ??
                  "No extended description provided for this project yet."}
              </p>
            </CardContent>
          </motion.div>
        </div>

        {/* Close button — modal-only, fades in, positioned outside the scroll area. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              delay: reducedMotion ? 0 : 0.22,
              duration: reducedMotion ? 0 : 0.2,
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            transition: { duration: reducedMotion ? 0 : 0.1 },
          }}
          className="absolute right-3 top-3 z-20"
        >
          <Button
            variant="secondary"
            size="icon"
            onClick={onClose}
            aria-label="Close project details"
            className="rounded-full shadow-md"
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ProjectGallery;
```

## How it works

- **`layoutId` does the morphing.** The card container, image, title, and description each have a matching `layoutId` in both the grid card and the modal. Framer Motion measures the "before" and "after" boxes and FLIPs between them — that's the morph.
- **`LayoutGroup id="project-gallery"`** scopes the `layoutId` namespace so you can have multiple galleries on one page without their shared elements colliding.
- **`AnimatePresence`** drives the modal's enter/exit. The morph *out* (close) works because the modal element leaves while still owning the `layoutId`, so Framer Motion animates it back into the grid card's geometry before removing it.
- **Staggered reveal of modal-only content.** The close button and extended description start `opacity: 0` and animate in with `delay: 0.22` — roughly when the spring settles — so they never appear *during* geometric motion.
- **Escape + outside click** both call `onClose()`. The scrim catches outside clicks; the `keydown` listener only binds while a modal is open.
- **Reduced-motion respect.** `useReducedMotion()` collapses every transition to `duration: 0`, so keyboard users with `prefers-reduced-motion: reduce` get an instant open/close.
- **Accessibility.** `role="dialog"`, `aria-modal`, `aria-labelledby`, focused container, and body-scroll lock while open.

## How to avoid the flicker/overlap you've seen elsewhere

The flicker in most shared-element demos comes from a small set of reproducible mistakes. This component is written to avoid each one:

1. **Don't render the source element while the destination is mounted.**
   The grid card is wrapped in a `visibility: hidden` container while its modal is open. If you leave the grid card visible, the browser shows *two* rendered copies at the same moment the morph starts — that's the overlap. `visibility: hidden` (not `display: none`) preserves grid layout so the return morph lands on the correct rectangle.

2. **Use one spring, applied everywhere.**
   Image, title, description, and the card container all share the exact same `transition={MORPH_SPRING}`. If you give title/description a different duration or easing, they visibly "tear" away from the image. Same spring = lockstep arrival.

3. **Wrap children in `motion.div` rather than animating shadcn components directly.**
   Animating `<CardTitle layoutId=…>` can double-trigger layout measurements because shadcn components forward refs and apply their own classes. A thin `motion.div` wrapper is a clean measurement target and keeps shadcn's typography tokens untouched.

4. **Don't reuse a `layoutId` on something that *fades*.**
   The scrim and close button never use `layoutId` — they use `initial/animate/exit`. Mixing a fade with a layout animation on the same element produces a jump because Framer Motion has to reconcile opacity keyframes against FLIP deltas.

5. **Delay modal-only content until after the morph.**
   The extended description and close button animate in with `delay ≈ spring-settle-time` (~220ms here). If you fade them in at `t=0`, they appear *inside* a container that is still resizing, which reads as flicker even if technically nothing is wrong.

6. **Lock body scroll while the modal is open.**
   Scrollbar-induced layout shifts change the grid card's measured rect mid-animation — the return morph then snaps. Setting `document.body.style.overflow = "hidden"` while open keeps measurements stable.

7. **Use `AnimatePresence` at exactly one level — the modal root.**
   Nesting `AnimatePresence` around each shared child is a common footgun; it unmounts pieces independently and you lose the coordinated exit. Only the modal itself is inside `AnimatePresence`; its internal shared elements ride along.

8. **Scope with `LayoutGroup`.**
   Without it, two galleries on the same route with overlapping IDs will race, and you'll see the wrong card fly across the screen. `LayoutGroup id="project-gallery"` sandboxes matching.

9. **Prefix IDs per-role.**
   `card-${id}`, `image-${id}`, `title-${id}`, `description-${id}` — never share a `layoutId` between semantically different nodes. Sharing IDs across roles causes Framer Motion to try to morph an image into a text node on re-render, which manifests as a one-frame flash.

10. **Avoid `transform`-affecting parents (CSS `filter`, `backdrop-filter`, `transform: translateZ`) *between* the two shared elements.**
    These create new stacking/containing blocks that change what `getBoundingClientRect` returns, and your morph will land a few pixels off. The scrim uses `backdrop-blur` but lives as a *sibling* of the morphing card, not an ancestor — keep it that way.

## Files saved

- `/Users/kao/workspace/kaotypr/skills/workspace/kao-react-motion-workspace/iteration-2/eval-2-shared-element-portfolio-morph/without_skill/run-1/outputs/ProjectGallery.tsx`
- `/Users/kao/workspace/kaotypr/skills/workspace/kao-react-motion-workspace/iteration-2/eval-2-shared-element-portfolio-morph/without_skill/run-1/outputs/response.md`
