import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { ArrowRight, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  return (
    <section className="relative px-6 py-24 sm:py-32">
      <div ref={ref} className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-border/70 p-14 text-center shadow-2xl shadow-black/30">
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-1/30 via-brand-2/20 to-brand-3/30"
        />
        <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-2/30 blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-1 via-brand-2 to-brand-3 text-black shadow-[0_0_60px_-10px_var(--brand-2)]"
        >
          <Rocket className="size-6" />
        </motion.div>

        <h2 className="mt-8 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Ship an animation system <span className="text-gradient">this afternoon.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
          Install the CLI, pick your primitives, drop them into the stack you already use. We'll get out of your way.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="glow" size="xl">
            <motion.a href="#" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Get started free
              <ArrowRight className="size-4" />
            </motion.a>
          </Button>
          <Button asChild variant="outline" size="xl">
            <motion.a href="#" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Read the docs
            </motion.a>
          </Button>
        </div>

        <div className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/50 px-4 py-2 font-mono text-xs text-muted-foreground backdrop-blur">
          <span className="size-2 rounded-full bg-brand-3" />
          npx nebula@latest init
        </div>
      </div>
    </section>
  )
}
