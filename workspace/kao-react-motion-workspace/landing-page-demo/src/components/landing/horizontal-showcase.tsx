import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import { showcase } from "@/data"

export function HorizontalShowcase() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: targetRef })

  // Drive cards horizontally through the sticky section.
  // Pipe scrollYProgress straight (no spring) — skill gotcha #9.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-78%"])

  return (
    <section
      ref={targetRef}
      id="showcase"
      className="relative"
      style={{ height: `${showcase.length * 80}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />

        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Built for <span className="text-gradient">real products.</span>
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                A few patterns shipped by teams using Nebula in production.
              </p>
            </div>
            <div className="hidden shrink-0 text-xs text-muted-foreground md:block">
              Scroll →
            </div>
          </div>
        </div>

        <motion.div
          style={{ x }}
          className="flex gap-6 pl-[10vw] pr-[10vw]"
        >
          {showcase.map((s, i) => (
            <Card key={s.id} item={s} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Card({
  item, index,
}: {
  item: (typeof showcase)[number]
  index: number
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group relative flex h-[60vh] w-[75vw] shrink-0 flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-8 shadow-xl shadow-black/20 backdrop-blur sm:w-[60vw] md:w-[50vw] lg:w-[42vw]"
    >
      <div className={`pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br ${item.color} opacity-30 transition-opacity duration-500 group-hover:opacity-50`} />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-xs text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(showcase.length).padStart(2, "0")}
        </span>
        <span className="rounded-full border border-border/60 bg-background/50 px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur">
          Showcase
        </span>
      </div>

      <div className="relative z-10 mt-auto">
        <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">{item.title}</h3>
        <p className="mt-3 max-w-md text-muted-foreground">{item.description}</p>
      </div>

      {/* Stylised preview block */}
      <div className="relative z-10 mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-4">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative grid h-full grid-cols-4 grid-rows-3 gap-2">
          {Array.from({ length: 8 }).map((_, k) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + k * 0.04, duration: 0.4 }}
              className={`rounded-md border border-border/60 bg-card/70 ${k === 0 ? "col-span-2 row-span-2" : ""}`}
            />
          ))}
        </div>
      </div>
    </motion.article>
  )
}
