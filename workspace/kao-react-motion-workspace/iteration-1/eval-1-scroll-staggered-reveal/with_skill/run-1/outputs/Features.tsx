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
