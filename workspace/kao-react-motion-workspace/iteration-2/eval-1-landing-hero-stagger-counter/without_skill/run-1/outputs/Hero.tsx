"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  BarChart3,
  Rocket,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

type Stat = {
  label: string;
  value: number;
  /** Optional suffix appended after the number, e.g. "%". */
  suffix?: string;
  /** Whether to format with thousands separators. */
  format?: boolean;
};

const STATS: Stat[] = [
  { label: "users", value: 1234, format: true },
  { label: "growth", value: 42, suffix: "%" },
  { label: "reviews", value: 356, format: true },
];

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Lightning fast",
    description: "Ship features in minutes, not days, with our optimized stack.",
  },
  {
    icon: Shield,
    title: "Enterprise-grade security",
    description: "SOC 2 Type II certified with end-to-end encryption by default.",
  },
  {
    icon: BarChart3,
    title: "Actionable analytics",
    description: "Understand your users with real-time dashboards and insights.",
  },
  {
    icon: Users,
    title: "Built for teams",
    description: "Collaborate seamlessly with granular roles and permissions.",
  },
  {
    icon: Rocket,
    title: "Scale without limits",
    description: "From your first user to your millionth, we grow with you.",
  },
  {
    icon: Sparkles,
    title: "AI-powered workflows",
    description: "Automate the boring parts so you can focus on what matters.",
  },
];

/* -------------------------------------------------------------------------- */
/*                               AnimatedNumber                               */
/* -------------------------------------------------------------------------- */

type AnimatedNumberProps = {
  /** Target value to count up to. */
  value: number;
  /** Whether the animation should play. */
  play: boolean;
  /** Whether to use thousands separators. */
  format?: boolean;
  /** Suffix appended after the number. */
  suffix?: string;
};

/**
 * A lightweight counter that springs from 0 to `value` when `play` flips true.
 * Uses Framer Motion's useSpring for a natural easing curve and respects
 * prefers-reduced-motion by snapping straight to the final value.
 */
function AnimatedNumber({ value, play, format, suffix }: AnimatedNumberProps) {
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 80,
    damping: 20,
    mass: 1,
  });
  const rounded = useTransform(spring, (latest) => {
    const n = Math.round(latest);
    return format ? n.toLocaleString() : String(n);
  });
  const [display, setDisplay] = useState(() =>
    format ? (0).toLocaleString() : "0",
  );

  useEffect(() => {
    if (!play) return;
    if (shouldReduceMotion) {
      setDisplay(format ? value.toLocaleString() : String(value));
      return;
    }
    motionValue.set(value);
  }, [play, value, shouldReduceMotion, format, motionValue]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => unsubscribe();
  }, [rounded]);

  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Motion variants                              */
/* -------------------------------------------------------------------------- */

const heroContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const featureGrid: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const featureItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/* -------------------------------------------------------------------------- */
/*                                    Hero                                    */
/* -------------------------------------------------------------------------- */

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();

  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // `once: true` ensures each section animates only the first time it enters
  // the viewport — subsequent scrolls past it do nothing.
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.6 });
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });

  // When reduced motion is preferred, we force everything into the "show"
  // state immediately so content is visible without transitions.
  const heroAnimate = shouldReduceMotion || heroInView ? "show" : "hidden";
  const featuresAnimate =
    shouldReduceMotion || featuresInView ? "show" : "hidden";
  const statsPlay = shouldReduceMotion || statsInView;

  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_theme(colors.primary/10),_transparent_60%)]"
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        {/* Headline + CTA */}
        <motion.div
          ref={heroRef}
          variants={heroContainer}
          initial="hidden"
          animate={heroAnimate}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h1
            variants={heroItem}
            className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Build faster. Ship smarter. Grow together.
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            The all-in-one platform teams use to launch delightful products —
            without the operational overhead.
          </motion.p>

          <motion.div variants={heroItem} className="mt-10">
            <Button size="lg" className="px-8">
              Get started
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <div
          ref={statsRef}
          className="mx-auto mt-16 flex max-w-3xl flex-col items-center justify-center gap-4 text-center text-muted-foreground sm:flex-row sm:gap-8 sm:text-lg"
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="font-semibold text-foreground">
                <AnimatedNumber
                  value={stat.value}
                  play={statsPlay}
                  format={stat.format}
                  suffix={stat.suffix}
                />
              </span>
              <span>{stat.label}</span>
              {i < STATS.length - 1 && (
                <span
                  aria-hidden
                  className="hidden text-muted-foreground/60 sm:inline"
                >
                  ·
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <motion.div
          ref={featuresRef}
          variants={featureGrid}
          initial="hidden"
          animate={featuresAnimate}
          className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={featureItem}>
                <Card className="h-full border-border/60 bg-card/60 backdrop-blur transition-colors hover:border-border">
                  <CardHeader>
                    <div className="mb-3 inline-flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg text-foreground">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
