import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { testimonials } from "@/data"

type T = (typeof testimonials)[number]

export function Testimonials() {
  const columns: [T[], T[], T[]] = [[], [], []]
  for (const t of testimonials) columns[t.column as 0 | 1 | 2].push(t)

  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="subtle" className="px-3 py-1 text-[11px] uppercase tracking-widest">
            Loved by
          </Badge>
          <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            The people <span className="text-gradient">shipping on Nebula</span>
          </h2>
        </motion.div>

        <div
          className="relative mt-16 grid max-h-[640px] grid-cols-1 gap-6 overflow-hidden md:grid-cols-3"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)",
          }}
        >
          {columns.map((col, i) => (
            <Column key={i} items={[...col, ...col]} direction={i % 2 === 0 ? "up" : "down"} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Column({ items, direction }: { items: T[]; direction: "up" | "down" }) {
  return (
    <motion.div
      className="flex flex-col gap-5"
      animate={{ y: direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      {items.map((t, i) => (
        <figure
          key={i}
          className="rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur"
        >
          <blockquote className="text-sm leading-relaxed text-foreground/90">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-4 flex items-center gap-3">
            <div
              className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-brand-1 to-brand-3 text-xs font-semibold text-black"
              aria-hidden
            >
              {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="text-sm font-medium">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </figcaption>
        </figure>
      ))}
    </motion.div>
  )
}
