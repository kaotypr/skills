import { useRef, useState } from "react"
import { motion, useMotionTemplate, useMotionValue } from "motion/react"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { pricing } from "@/data"
import { cn } from "@/lib/utils"

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="subtle" className="px-3 py-1 text-[11px] uppercase tracking-widest">
            Pricing
          </Badge>
          <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Free to start. <span className="text-gradient">Honest when you scale.</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            The library is MIT forever. Upgrade when your team needs the governance bits.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pricing.map((tier, i) => (
            <PricingCard key={tier.name} tier={tier} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingCard({
  tier, index,
}: {
  tier: (typeof pricing)[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [active, setActive] = useState(false)

  const background = useMotionTemplate`radial-gradient(360px circle at ${mouseX}px ${mouseY}px, color-mix(in oklab, var(--brand-2) 35%, transparent), transparent 60%)`

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-8 backdrop-blur",
        tier.highlight
          ? "border-brand-2/60 bg-card/80 shadow-2xl shadow-brand-2/20"
          : "border-border/60 bg-card/40",
      )}
    >
      {/* Glow follows the cursor */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background, opacity: active ? 1 : 0 }}
      />

      {tier.highlight && (
        <div className="absolute right-6 top-6">
          <Badge className="bg-gradient-to-r from-brand-1 to-brand-3 text-black">Most popular</Badge>
        </div>
      )}

      <div className="relative z-10">
        <h3 className="text-lg font-semibold">{tier.name}</h3>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">{tier.blurb}</p>

        <div className="mt-6 flex items-baseline gap-1">
          {tier.price === null ? (
            <span className="text-4xl font-semibold tracking-tight">Custom</span>
          ) : (
            <>
              <span className="text-5xl font-semibold tracking-tight">${tier.price}</span>
              <span className="text-sm text-muted-foreground">/ {tier.cadence}</span>
            </>
          )}
        </div>

        <Button asChild variant={tier.highlight ? "glow" : "outline"} size="lg" className="mt-6 w-full">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {tier.cta}
            <ArrowRight className="size-4" />
          </motion.button>
        </Button>

        <ul className="mt-8 space-y-3 text-sm">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <Check className="mt-0.5 size-4 shrink-0 text-brand-3" />
              <span className="text-muted-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
