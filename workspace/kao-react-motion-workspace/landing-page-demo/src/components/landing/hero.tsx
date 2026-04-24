import { useRef } from "react"
import { motion, useScroll, useTransform, type Variants } from "motion/react"
import { ArrowRight, Sparkles, Check, Play, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const line: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 200, damping: 26 },
  },
}
const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  // Parallax on the mock app card
  const mockY = useTransform(scrollYProgress, [0, 1], [0, -180])
  const mockRotate = useTransform(scrollYProgress, [0, 1], [0, -6])
  const mockScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const mockOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2])

  // Aurora drift
  const auroraY = useTransform(scrollYProgress, [0, 1], [0, 140])

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden pt-36 pb-32 sm:pt-44 sm:pb-40"
    >
      {/* Background aurora */}
      <motion.div className="aurora left-[-10%] top-[-10%] size-[480px] bg-brand-1" style={{ y: auroraY }}
        animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="aurora right-[-10%] top-[8%] size-[520px] bg-brand-2" style={{ y: auroraY }}
        animate={{ scale: [1, 1.05, 1], x: [0, -24, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="aurora left-1/2 top-1/3 size-[360px] -translate-x-1/2 bg-brand-3"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid backdrop */}
      <div className="absolute inset-0 -z-10 bg-grid mask-radial-fade opacity-40" />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.div variants={fade}>
            <Badge variant="subtle" className="gap-2 px-3 py-1 text-[11px] uppercase tracking-widest">
              <Sparkles className="size-3" />
              v3.0 — now with layout timelines
            </Badge>
          </motion.div>

          <h1 className="mt-8 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            <motion.span variants={line} className="block">
              A universe of primitives
            </motion.span>
            <motion.span variants={line} className="block text-gradient">
              for the modern web.
            </motion.span>
          </h1>

          <motion.p variants={fade} className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            Nebula is the motion, layout, and interaction layer your product deserves — shipped as
            composable headless primitives you drop onto shadcn, Radix, or your own stack.
          </motion.p>

          <motion.div variants={fade} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="glow" size="xl">
              <motion.a href="#pricing" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Start building free
                <ArrowRight className="size-4" />
              </motion.a>
            </Button>
            <Button asChild variant="outline" size="xl">
              <motion.a href="#showcase" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Play className="size-4" />
                Watch 90s demo
              </motion.a>
            </Button>
          </motion.div>

          <motion.ul variants={fade} className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Check className="size-4 text-brand-3" /> MIT-licensed</li>
            <li className="flex items-center gap-2"><Check className="size-4 text-brand-3" /> 1kb runtime</li>
            <li className="flex items-center gap-2"><Check className="size-4 text-brand-3" /> RSC-safe</li>
          </motion.ul>
        </motion.div>

        {/* Mock product card with parallax */}
        <motion.div
          style={{ y: mockY, rotate: mockRotate, scale: mockScale, opacity: mockOpacity }}
          className="relative mx-auto mt-20 max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200 }}
            className="group relative rounded-2xl border border-border/70 bg-card/70 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            {/* Top bar */}
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="size-2.5 rounded-full bg-destructive/70" />
              <div className="size-2.5 rounded-full bg-brand-4/70" />
              <div className="size-2.5 rounded-full bg-brand-3/70" />
              <div className="ml-3 flex-1 rounded-md border border-border/60 bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                nebula.dev/dashboard
              </div>
            </div>

            {/* Mock screen */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-background to-muted">
              <div className="absolute inset-0 bg-grid opacity-40" />
              <div className="relative grid h-full grid-cols-12 grid-rows-6 gap-3 p-5">
                <MockTile className="col-span-3 row-span-2" accent="from-brand-1 to-brand-2" delay={0.6}>
                  <span className="text-xs font-medium text-muted-foreground">Revenue</span>
                  <span className="mt-1 block text-2xl font-semibold">$248k</span>
                </MockTile>
                <MockTile className="col-span-3 row-span-2" accent="from-brand-2 to-brand-3" delay={0.7}>
                  <span className="text-xs font-medium text-muted-foreground">Active users</span>
                  <span className="mt-1 block text-2xl font-semibold">12,480</span>
                </MockTile>
                <MockTile className="col-span-6 row-span-4" accent="from-brand-3 to-brand-4" delay={0.8}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Throughput</span>
                    <Badge variant="subtle" className="gap-1 text-[10px]"><Zap className="size-3" /> live</Badge>
                  </div>
                  <svg viewBox="0 0 200 80" className="mt-4 h-16 w-full">
                    <motion.path
                      d="M0,60 C20,40 40,65 60,45 C80,25 100,55 120,35 C140,20 160,45 200,10"
                      fill="none"
                      stroke="url(#g1)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.0, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <defs>
                      <linearGradient id="g1" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="var(--brand-1)" />
                        <stop offset="100%" stopColor="var(--brand-3)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </MockTile>
                <MockTile className="col-span-6 row-span-2" accent="from-brand-4 to-brand-1" delay={0.9}>
                  <span className="text-xs font-medium text-muted-foreground">Recent events</span>
                  <div className="mt-2 space-y-1.5">
                    {["Checkout v2 deployed", "Payment reconciled", "Feature flag toggled"].map((e) => (
                      <div key={e} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-brand-3" />
                        {e}
                      </div>
                    ))}
                  </div>
                </MockTile>
              </div>
            </div>
          </motion.div>

          {/* Floating chip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 200, damping: 20 }}
            className="absolute -right-4 top-16 hidden rounded-2xl border border-border/70 bg-card/90 px-4 py-3 shadow-xl shadow-black/30 backdrop-blur md:block"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-brand-1 to-brand-3 text-black"
              >
                <Sparkles className="size-4" />
              </motion.div>
              <div>
                <div className="text-xs font-semibold">Build time</div>
                <div className="text-[11px] text-muted-foreground">↓ 62% vs. baseline</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function MockTile({
  children, className, accent, delay,
}: {
  children: React.ReactNode
  className?: string
  accent: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={`${className} relative rounded-lg border border-border/60 bg-card/80 p-3 overflow-hidden`}
    >
      <div className={`pointer-events-none absolute inset-x-0 -top-10 h-20 bg-gradient-to-r ${accent} opacity-40 blur-2xl`} />
      <div className="relative">{children}</div>
    </motion.div>
  )
}
