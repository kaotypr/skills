import { motion } from "motion/react"
import { logoCompanies } from "@/data"

export function LogoMarquee() {
  const row = [...logoCompanies, ...logoCompanies]
  return (
    <section className="relative border-y border-border/60 bg-card/30 py-10">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Teams shipping on Nebula
      </p>
      <div
        className="relative flex overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <motion.div
          className="flex shrink-0 items-center gap-14 pr-14"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        >
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="shrink-0 text-2xl font-semibold tracking-tight text-muted-foreground/80"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
