# Features.tsx — scroll-triggered staggered reveal

Below is a complete `Features.tsx` component for a Next.js 15 App Router project using TypeScript, Tailwind, and **Motion for React** (`motion/react`). It fades each card up and in, staggered, the first time the section scrolls into view, and respects `prefers-reduced-motion`.

```tsx
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
```

## Why it's built this way

**`"use client"` directive.** `motion/react` ships hooks and effects that run in the browser (`useReducedMotion`, IntersectionObserver via `whileInView`), so the component must opt into the client boundary in the App Router.

**Import path is `motion/react`.** The `motion` package (the successor to `framer-motion`) exposes its React bindings at `motion/react`. `import { motion } from "motion/react"` is the canonical entry — don't mix it with `framer-motion` imports.

**Stagger via parent/child variants.** Setting `variants` on the `motion.ul` parent and using `staggerChildren` in its `visible` transition automatically cascades the `"hidden"` / `"visible"` states to each `motion.li`. Each child only needs to declare its own `hidden` and `visible` shapes (`opacity: 0, y: 24` → `opacity: 1, y: 0`) and will inherit the sequencing. `delayChildren: 0.05` adds a small breather before the first card animates so the trigger doesn't feel instantaneous.

**First-time-only reveal via `whileInView` + `viewport.once`.** `whileInView="visible"` tells Motion to drive the parent to its `visible` state when the element intersects the viewport. `viewport={{ once: true }}` ensures the animation is not replayed on subsequent scrolls — exactly the "no re-animating if the user scrolls up and back down" requirement. `amount: 0.2` triggers when 20% of the list is in view (prevents firing on a sliver of overlap), and `margin: "0px 0px -10% 0px"` pulls the trigger line up slightly so the reveal starts a touch before the section is fully centered — a common polish trick for hero-adjacent sections.

**`prefers-reduced-motion` handling.** `useReducedMotion()` returns `true` when the user's OS-level setting requests reduced motion. When true, I swap in variant objects whose `hidden` and `visible` states are identical end-state (`opacity: 1, y: 0`) — so the cards simply appear in place with no transform or fade. I kept the overall structure identical to avoid any layout shift between motion/no-motion paths. (An alternative is to skip `motion.*` entirely and render plain `<ul>`/`<li>`, but keeping the `motion` components means variants still type-check and the code path is simpler to maintain.)

**Easing.** `[0.22, 1, 0.36, 1]` is a standard "ease-out-expo-ish" cubic bezier that feels snappy at the start and settles softly — a good default for content reveals. `duration: 0.5` is in the sweet spot: long enough to feel intentional, short enough not to block the reader.

**Typing the `icon` prop.** `ComponentType<SVGProps<SVGSVGElement>>` lets you pass any SVG-returning component (lucide-react icons, Heroicons, a custom SVG component) and still forward `className` / `aria-hidden`. I render it as `const Icon = feature.icon; <Icon …/>` so JSX treats it as a component rather than a prop.

## Usage

```tsx
// app/page.tsx
import { Rocket, ShieldCheck, Zap, Layers, Sparkles, Gauge } from "lucide-react";
import Features, { type Feature } from "@/components/Features";

const features: Feature[] = [
  { id: "fast",      icon: Zap,         title: "Blazing fast",     description: "…" },
  { id: "secure",    icon: ShieldCheck, title: "Secure by default",description: "…" },
  { id: "scalable",  icon: Layers,      title: "Scales with you",  description: "…" },
  { id: "launch",    icon: Rocket,      title: "Ship in minutes",  description: "…" },
  { id: "delight",   icon: Sparkles,    title: "Delightful UX",    description: "…" },
  { id: "observable",icon: Gauge,       title: "Observable",       description: "…" },
];

export default function Page() {
  return <Features features={features} />;
}
```

## Notes and tweaks you might want

- **Tune stagger timing.** `staggerChildren: 0.12` across 6 cards gives ~0.6s from first to last card starting. Drop to `0.08` for snappier, bump to `0.15` for more theatrical.
- **Trigger earlier/later.** Adjust `amount` (0.0–1.0) to control how much of the list must be in-view, or tweak the viewport `margin` (CSS-margin-string) to offset the trigger line.
- **Initial render above the fold.** If the Features section can be visible on initial page load, `whileInView` still fires correctly on mount; no extra handling needed.
- **SSR safety.** `useReducedMotion` returns `null` on the server then resolves on the client; since we only use it to pick between two variant objects, there's no hydration mismatch — both render the same DOM, only the transition differs.
