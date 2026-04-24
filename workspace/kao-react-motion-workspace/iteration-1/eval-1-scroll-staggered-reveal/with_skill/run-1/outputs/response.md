# Features.tsx — scroll-triggered staggered reveal

Drop this into `app/(marketing)/_components/Features.tsx` (or wherever you keep
section components) and pass your `features` array in. It's a Client Component
because it uses `whileInView` and `useReducedMotion`, both of which need the
browser.

```tsx
"use client"

import { motion, stagger, useReducedMotion } from "motion/react"
import type { Variants } from "motion/react"
import { useMemo, type ComponentType, type ReactNode } from "react"

export type Feature = {
  id: string | number
  icon: ComponentType<{ className?: string }> | ReactNode
  title: string
  description: string
}

type FeaturesProps = {
  features: Feature[]
  heading?: string
  subheading?: string
  className?: string
}

export function Features({
  features,
  heading = "Features",
  subheading,
  className,
}: FeaturesProps) {
  const shouldReduceMotion = useReducedMotion()

  // Variants live inside the component only because they depend on
  // `shouldReduceMotion`. Memoised so we don't rebuild them each render.
  const { listVariants, itemVariants } = useMemo(() => {
    const list: Variants = {
      hidden: {},
      visible: {
        transition: {
          // stagger() is the modern orchestration helper — one tick per child.
          // A small startDelay lets the section settle before the cascade begins.
          delayChildren: stagger(shouldReduceMotion ? 0 : 0.08, {
            startDelay: shouldReduceMotion ? 0 : 0.1,
          }),
        },
      },
    }

    const item: Variants = {
      hidden: {
        opacity: 0,
        // Skip the translate for users who asked for reduced motion — fade only.
        y: shouldReduceMotion ? 0 : 24,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: shouldReduceMotion
          ? { duration: 0.2, ease: "easeOut" }
          : {
              // Spring for the physical translate, tween default for opacity.
              y: { type: "spring", stiffness: 260, damping: 24, mass: 0.9 },
              opacity: { duration: 0.4, ease: "easeOut" },
            },
      },
    }

    return { listVariants: list, itemVariants: item }
  }, [shouldReduceMotion])

  return (
    <section
      className={
        "relative mx-auto w-full max-w-6xl px-6 py-24 sm:py-32 " +
        (className ?? "")
      }
    >
      <div className="mb-12 max-w-2xl sm:mb-16">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {heading}
        </h2>
        {subheading ? (
          <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
            {subheading}
          </p>
        ) : null}
      </div>

      <motion.ul
        role="list"
        initial="hidden"
        whileInView="visible"
        // `once: true` — this is the "don't re-animate on scroll back" contract.
        // `amount: 0.2` — start as soon as ~20% of the grid is visible.
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
        variants={listVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature) => (
          <motion.li
            key={feature.id}
            variants={itemVariants}
            className="group relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-sm transition-colors hover:border-border"
          >
            <FeatureIcon icon={feature.icon} />
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}

function FeatureIcon({ icon }: { icon: Feature["icon"] }) {
  // Support both a component reference (`icon: LucideStar`) and a ready node
  // (`icon: <LucideStar />`) — whichever the caller prefers.
  if (typeof icon === "function") {
    const Icon = icon as ComponentType<{ className?: string }>
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
    )
  }

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
      {icon as ReactNode}
    </span>
  )
}

export default Features
```

## Why this shape

- **`motion/react`, not `framer-motion`.** The package was renamed; Motion ships
  all the old Framer Motion React APIs from `motion/react`. Don't install
  `framer-motion` on greenfield work.
- **`whileInView` + `viewport={{ once: true }}` is the idiomatic "animate on
  scroll in, only once" pattern.** It's cheaper than wiring up `useInView` +
  `useEffect` yourself, and `once: true` is exactly the "don't re-animate on
  scroll back" contract you asked for. `amount: 0.2` triggers as soon as
  roughly 20% of the grid is visible — feels natural on tall grids; change to
  `0.4` or `"some"` if you want to wait longer. The negative bottom `margin`
  makes it start a touch earlier on long pages.
- **Parent + child variants with `stagger()`.** Rather than hand-delaying each
  card with `transition: { delay: i * 0.08 }`, the parent `<motion.ul>` owns the
  orchestration via `delayChildren: stagger(0.08)`. That's the variants-powered
  way to do it, so `initial="hidden"` / `whileInView="visible"` cascade down the
  whole tree automatically — the children don't need their own `initial` or
  `whileInView`.
- **`stagger(0.08)`** stays under the ~0.15s-per-item threshold where things
  start to feel draggy, and `startDelay: 0.1` gives the section a beat to
  settle before cards begin flying in.
- **Spring for `y`, tween for `opacity`.** Physical movement wants a spring so
  it feels alive; opacity is a visual value and reads better on a short ease.
  Per-value transitions (`transition: { y: {...}, opacity: {...} }`) keep both
  correct.
- **`useReducedMotion()` is the real accessibility hook here.** When a user has
  `prefers-reduced-motion: reduce` we:
  - zero out the `y` translate entirely (the "anything that moves more than a
    few pixels" rule),
  - strip the stagger cascade (`stagger(0)` + `startDelay: 0`) so everything
    appears together instead of rolling in,
  - swap the spring for a short `easeOut` tween so opacity still fades in
    gently rather than snapping.
- **Variants memoised with `useMemo`.** Ideally variant objects live at module
  scope, but these depend on `shouldReduceMotion`, so we memoise on that. The
  result is stable across renders that don't flip the OS setting.
- **`"use client"`.** `whileInView` and `useReducedMotion` both need the
  browser. If you want to keep the section itself server-rendered, extract just
  the `<motion.ul>` grid into a client subcomponent and render the heading from
  the parent RSC — but for a marketing section this is usually overkill.
- **Stable `key={feature.id}`, not array index.** The skill is emphatic about
  this for `AnimatePresence`, and it's a good habit for variant-driven lists
  too — keeps React's reconciliation aligned with the animation identity.
- **`role="list"`** on the `<motion.ul>`. Some CSS resets (and Tailwind's
  Preflight on `<ul>` without list-style) strip the implicit list semantics in
  Safari; adding the role back keeps screen readers happy.

## Tweaks you might want

- Bigger travel: bump `y: 24` to `y: 40` and soften the spring
  (`stiffness: 180, damping: 22`).
- Snappier: swap the spring for `{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }`.
- Row-by-row (instead of card-by-card): wrap each row in its own
  `motion.div variants={listVariants}` and stagger the rows; or switch to
  `stagger(0.08, { from: "center" })` for a center-out cascade.
- Not a grid: the same pattern works for `<motion.ol>` vertical lists — just
  drop the grid classes.
