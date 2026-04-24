# Hero.tsx — SaaS landing hero with staggered reveal + tick-up stats

## Quick answer on `<AnimateNumber>`

No — `<AnimateNumber>` is a **Motion+ (paid)** component, and you don't need it. The same ticking-number effect is a five-line recipe against the free Motion API using `useMotionValue` + `animate()` + `useTransform()`. That's what the `AnimatedCounter` below does. You keep full control over easing, `toLocaleString` formatting (for the `1,234` comma), reduced-motion handling, and — critically — you can defer the tick-up until the section scrolls into view. Paid components would also pull in their own bundle and licensing that isn't needed for three numbers on a hero.

## What this file does

- **Single `useInView(ref, { once: true, amount: 0.25 })`** on the section wrapper is the source of truth for "has scrolled into view." That same `inView` boolean gates both the variant animations *and* the counter start, so everything triggers in lockstep and only once per page load.
- **Three orchestrated variant trees** (hero block, stats row, feature grid) each drive their children via `stagger()` in `delayChildren`. Children use spring transitions for the physical `y` + `opacity` reveal — per skill rule "spring for physical values."
- **`AnimatedCounter`** uses `useMotionValue(0)` + `animate(count, target, …)` in an effect, with a `useTransform` that rounds and formats via `toLocaleString("en-US")` so `1234` renders as `1,234`. The `<motion.span>{rounded}</motion.span>` pattern renders the motion value as text without React re-renders per frame.
- **`prefers-reduced-motion`** is honored two ways:
  1. `useReducedMotion()` inside `AnimatedCounter` — when true, it snaps to the target instead of animating the tick.
  2. For the rest, set `<MotionConfig reducedMotion="user">` at your app root (e.g. in `app/layout.tsx` inside a client boundary, or in a top-level `providers.tsx`). With that enabled, Motion automatically skips transform animations for reduced-motion users while keeping opacity — so the stagger reveals collapse to a safe cross-fade without per-component changes. If you don't want to add that provider, replace `initial="hidden"` with `initial={reduce ? false : "hidden"}` using `useReducedMotion()` in `Hero` itself.
- **shadcn tokens throughout**: `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `text-card-foreground`. No hardcoded neutrals.
- **shadcn Button** stays untouched — no `asChild` needed here because the CTA doesn't need gesture animation on top of Tailwind's default hover/press transitions. If you later want a magnetic or scale-on-press CTA, that's the moment for `<Button asChild><motion.a ...></motion.a></Button>`.
- **Package is `motion`** (imports from `motion/react`), not `framer-motion`.
- **Only animating `opacity` + `y`** — compositor-friendly transforms, no layout thrash.

## The code

```tsx
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
```

## Notes on design choices

- **Why `useInView` + one `animate={state}` gate instead of `whileInView`?** `whileInView` works great for a single element, but here the counters need to know when to *start ticking* too — not just when to reveal. A single `inView` boolean from `useInView` drives both, and `once: true` on the hook side means the whole thing fires exactly once on first entry.
- **`amount: 0.25`** — fires when 25% of the section is visible, which lines up naturally with the stats row being on-screen. Tune higher (0.4–0.5) if the hero sits below the fold and you want the reveal to trigger mid-scroll rather than on first paint.
- **`tabular-nums`** on the stat numbers keeps the digits from jiggling as they tick up; without it, proportional digits cause width jitter.
- **Spring over tween for transforms.** Per skill guidance — physical values get springs, and the numbers are tuned on the snappy side (`stiffness` 240–300, `damping` 22–26) so the reveal feels crisp on a landing page, not floaty.
- **Stagger step sizes** — 0.12s for the three hero elements (large, dramatic), 0.08s for three stats (tight, keeps them as one row), 0.07s for six feature cards (per skill guidance, beyond ~0.08s it starts to feel slow with 6 items).
- **Module-scope variant objects** — they don't depend on props/state, so defining them outside the component stops React from recreating them each render.
- **`initial="hidden"` on the outer wrappers** means SSR markup will render with `opacity: 0`. If you'd rather not ship an invisible hero that depends on JS to reveal (a concern for flash-of-invisible-content on slow networks), add a CSS fallback or switch `initial` to `false` and do the reveal only once hydrated — the tradeoff is a brief flash before the stagger kicks in.

## To wire it up

1. `pnpm add motion` (package is `motion`, not `framer-motion`).
2. Drop the file at `app/_components/Hero.tsx` (or wherever your client components live) and render `<Hero />` from `app/page.tsx`.
3. Optional but recommended: add `<MotionConfig reducedMotion="user">` around your root providers so the transform-based reveals automatically collapse for reduced-motion users.

## What I did *not* use (and why)

- **`<AnimateNumber>` / `<Ticker>`** — Motion+ paid. The hand-rolled counter is shorter and more flexible.
- **`whileInView`** — works, but doesn't expose "has this element entered viewport" as a value that can also gate the counter start. `useInView` does.
- **`layout` / `layoutId`** — no layout-size changes in this section, so no need.
- **`AnimatePresence`** — nothing unmounts; the reveal is one-shot.
- **Tailwind `animate-in` / `tw-animate-css`** utilities — they can't stagger a variable number of children nor drive a counter tick, so Motion earns its keep here.
