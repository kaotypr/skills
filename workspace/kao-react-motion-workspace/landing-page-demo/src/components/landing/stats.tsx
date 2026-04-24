import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { stats } from "@/data"
import { useCounter } from "@/lib/use-counter"

export function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <section ref={ref} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <StatCell key={s.label} stat={s} inView={inView} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCell({
  stat, inView, delay,
}: {
  stat: (typeof stats)[number]
  inView: boolean
  delay: number
}) {
  const decimals = stat.value % 1 !== 0 ? 2 : 0
  const display = useCounter(stat.value, inView, { decimals })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur"
    >
      <div className="pointer-events-none absolute -top-12 left-4 size-24 rounded-full bg-gradient-to-br from-brand-1 to-brand-3 opacity-20 blur-2xl" />
      <div className="relative flex items-baseline gap-1 font-semibold tracking-tight">
        <motion.span className="text-4xl sm:text-5xl text-gradient">{display}</motion.span>
        <span className="text-2xl text-muted-foreground">{stat.suffix}</span>
      </div>
      <p className="relative mt-2 text-sm text-muted-foreground">{stat.label}</p>
    </motion.div>
  )
}
