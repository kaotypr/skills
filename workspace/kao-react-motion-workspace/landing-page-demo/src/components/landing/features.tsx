import { motion, type Variants } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { features, capabilities } from "@/data"

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 220, damping: 24 },
  },
}

export function Features() {
  return (
    <section id="features" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="subtle" className="px-3 py-1 text-[11px] uppercase tracking-widest">
            Features
          </Badge>
          <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            An animation system that <span className="text-gradient">thinks in primitives</span>
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Four ideas that make Nebula disappear into your stack — and a long tail of quality-of-life features
            underneath.
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {features.map((f) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                variants={item}
                whileHover={{ y: -4 }}
                className={`group relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-7 backdrop-blur ${f.span}`}
              >
                <div className={`pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br ${f.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-20`} />
                <div className={`pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-gradient-to-br ${f.accent} opacity-20 blur-3xl`} />

                <div className="relative z-10 flex size-10 items-center justify-center rounded-lg border border-border/60 bg-background/60">
                  <Icon className="size-5" />
                </div>
                <h3 className="relative z-10 mt-5 text-xl font-semibold tracking-tight">{f.title}</h3>
                <p className="relative z-10 mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {f.body}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Small capabilities grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {capabilities.map((c) => {
            const Icon = c.icon
            return (
              <motion.div
                key={c.title}
                variants={item}
                whileHover={{ y: -2, borderColor: "color-mix(in oklab, var(--brand-2) 60%, var(--border))" }}
                className="flex gap-4 rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur transition-colors"
              >
                <div className="shrink-0">
                  <div className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-brand-2/30 to-brand-1/30 text-foreground">
                    <Icon className="size-4" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{c.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{c.body}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
