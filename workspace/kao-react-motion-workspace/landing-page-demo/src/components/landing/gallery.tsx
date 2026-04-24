import { useState } from "react"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { showcase } from "@/data"

const gallery = showcase.slice(0, 4)

export function Gallery() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = gallery.find((p) => p.id === activeId) ?? null

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="subtle" className="px-3 py-1 text-[11px] uppercase tracking-widest">
            Gallery
          </Badge>
          <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Tap any card. <span className="text-gradient">Watch it morph.</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Shared-element transitions via <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">layoutId</code> —
            no canvas, no GSAP, 60fps everywhere.
          </p>
        </motion.div>

        <LayoutGroup id="project-gallery">
          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {gallery.map((p) => (
              <li key={p.id}>
                <motion.button
                  type="button"
                  onClick={() => setActiveId(p.id)}
                  whileHover={{ y: -4 }}
                  className="group block w-full overflow-hidden rounded-2xl border border-border/70 bg-card/50 text-left backdrop-blur"
                >
                  <motion.div
                    layoutId={`preview-${p.id}`}
                    className={`relative aspect-[4/3] bg-gradient-to-br ${p.color} overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-grid opacity-20 mix-blend-overlay" />
                  </motion.div>
                  <div className="p-4">
                    <motion.h3 layoutId={`title-${p.id}`} className="font-semibold tracking-tight">
                      {p.title}
                    </motion.h3>
                    <motion.p layoutId={`desc-${p.id}`} className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {p.description}
                    </motion.p>
                  </div>
                </motion.button>
              </li>
            ))}
          </motion.ul>

          <AnimatePresence>
            {active && (
              <>
                <motion.div
                  key="overlay"
                  className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveId(null)}
                />
                <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-6">
                  <motion.div
                    key="chrome"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.05 } }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    className="pointer-events-auto relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border/70 bg-card shadow-2xl shadow-black/60"
                  >
                    <button
                      onClick={() => setActiveId(null)}
                      className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-full border border-border bg-background/80 backdrop-blur transition-colors hover:bg-muted"
                      aria-label="Close"
                    >
                      <X className="size-4" />
                    </button>

                    <motion.div
                      layoutId={`preview-${active.id}`}
                      className={`relative aspect-video bg-gradient-to-br ${active.color}`}
                    >
                      <div className="absolute inset-0 bg-grid opacity-20 mix-blend-overlay" />
                    </motion.div>
                    <div className="p-8">
                      <motion.h3 layoutId={`title-${active.id}`} className="text-3xl font-semibold tracking-tight">
                        {active.title}
                      </motion.h3>
                      <motion.p layoutId={`desc-${active.id}`} className="mt-3 text-muted-foreground">
                        {active.description}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
                        className="mt-6 flex flex-wrap gap-2"
                      >
                        {["Layout", "Scroll", "Gestures", "Variants"].map((t) => (
                          <Badge key={t} variant="outline">{t}</Badge>
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  )
}
