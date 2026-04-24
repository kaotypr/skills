"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ComponentType, SVGProps } from "react";

export type Feature = {
  id: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

type FeaturesProps = {
  features: Feature[];
};

const SECTION_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const REDUCED_SECTION_VARIANTS: Variants = {
  hidden: {},
  visible: {},
};

const REDUCED_CARD_VARIANTS: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export default function Features({ features }: FeaturesProps) {
  const prefersReducedMotion = useReducedMotion();

  const sectionVariants = prefersReducedMotion
    ? REDUCED_SECTION_VARIANTS
    : SECTION_VARIANTS;
  const cardVariants = prefersReducedMotion
    ? REDUCED_CARD_VARIANTS
    : CARD_VARIANTS;

  return (
    <section
      id="features"
      className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32"
    >
      <motion.ul
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.li
              key={feature.id}
              variants={cardVariants}
              className="group relative flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}
