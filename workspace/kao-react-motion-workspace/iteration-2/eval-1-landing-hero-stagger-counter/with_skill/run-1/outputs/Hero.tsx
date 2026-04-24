"use client"

import { useEffect, useRef } from "react"
import {
  animate,
  motion,
  stagger,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "motion/react"

import { Button } from "@/components/ui/button"

// ---------- Animation definitions (module scope — no per-render churn) ----------

const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.12) },
  },
}

const heroItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
}

const statsContainer: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.08) },
  },
}

const statItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
}

const gridContainer: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: stagger(0.07) },
  },
}

const gridItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 22 },
  },
}

// ---------- Data ----------

type Stat = { id: string; value: number; label: string; suffix?: string }
const stats: Stat[] = [
  { id: "users", value: 1234, label: "users" },
  { id: "growth", value: 42, label: "growth", suffix: "%" },
  { id: "reviews", value: 356, label: "reviews" },
]

type Feature = { id: string; title: string; description: string }
const features: Feature[] = [
  { id: "f1", title: "Lightning fast", description: "Ship in minutes, not days, with zero-config deploys." },
  { id: "f2", title: "Secure by default", description: "SOC 2, SSO, and granular RBAC baked in from day one." },
  { id: "f3", title: "Built to scale", description: "Handle millions of requests without changing a line." },
  { id: "f4", title: "Deep integrations", description: "Native connectors for Slack, Linear, GitHub, and more." },
  { id: "f5", title: "Actionable insights", description: "Dashboards that tell you what matters, when it matters." },
  { id: "f6", title: "World-class support", description: "Real engineers, 24/7, with a median response under 5m." },
]

// ---------- Animated counter (no Motion+, hand-rolled primitive) ----------

function AnimatedCounter({
  target,
  play,
  duration = 1.4,
  className,
}: {
  target: number
  play: boolean
  duration?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const count = useMotionValue(0)
  const rounded = useTransform(() => count.get().toLocaleString("en-US", { maximumFractionDigits: 0 }))

  useEffect(() => {
    if (!play) return
    if (reduce) {
      count.set(target)
      return
    }
    count.set(0)
    const controls = animate(count, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    })
    return () => controls.stop()
  }, [play, target, duration, reduce, count])

  return <motion.span className={className}>{rounded}</motion.span>
}

// ---------- Hero ----------

export function Hero() {
  // Single source of truth for "section has entered viewport once". Drives:
  //   1) staggered reveal of hero / stats / grid (via `animate` prop)
  //   2) the counter tick-up start
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.25 })
  const state = inView ? "visible" : "hidden"

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-24 sm:py-32"
    >
      {/* Headline + sub + CTA */}
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate={state}
        className="flex flex-col items-center gap-6 text-center"
      >
        <motion.h1
          variants={heroItem}
          className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl"
        >
          Ship faster. Sleep better.
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="max-w-xl text-lg text-muted-foreground sm:text-xl"
        >
          The all-in-one platform teams choose to launch, measure, and grow — without the
          plumbing.
        </motion.p>

        <motion.div variants={heroItem}>
          <Button size="lg">Get started</Button>
        </motion.div>

        {/* Stats row */}
        <motion.ul
          variants={statsContainer}
          className="mt-6 flex flex-col items-center gap-4 text-base text-muted-foreground sm:flex-row sm:gap-10"
          aria-label="Product stats"
        >
          {stats.map((s) => (
            <motion.li key={s.id} variants={statItem} className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tabular-nums text-foreground sm:text-4xl">
                <AnimatedCounter target={s.value} play={inView} />
                {s.suffix}
              </span>
              <span className="text-sm text-muted-foreground sm:text-base">{s.label}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Feature grid */}
      <motion.ul
        variants={gridContainer}
        initial="hidden"
        animate={state}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((f) => (
          <motion.li
            key={f.id}
            variants={gridItem}
            className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm"
          >
            <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}

export default Hero
