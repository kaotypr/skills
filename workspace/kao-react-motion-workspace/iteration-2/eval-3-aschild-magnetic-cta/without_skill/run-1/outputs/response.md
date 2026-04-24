# MagneticCTA

A magnetic call-to-action that wraps the shadcn `Button` with a motion `span`. The wrapper listens to global `pointermove` events, and when the cursor enters a configurable radius it pulls the button toward the cursor via a spring. Hover and press drive a separate spring-scaled "pop" (scale up on hover, scale down on press, back up on release). It respects `prefers-reduced-motion`.

Key design choices:

- **Keeps shadcn styling & a11y**: the inner element is a real shadcn `Button` with `asChild`, so variants, focus rings, and keyboard behavior come from the Button primitive. The child is a native `<a href="/signup">`, which gives you correct semantics, middle-click, and right-click behavior for free.
- **Motion on the wrapper, not the Button**: we transform a `motion.span` around the Button so we don't have to re-implement `Button`'s styling with `motion(Button)`, and we don't interfere with `asChild` slotting.
- **Spring physics**: `useSpring` smooths both the magnetic translation and the scale. The magnetic pull uses an eased falloff (`1 - distance / radius`) so there's no jarring jump when the cursor crosses the radius boundary.
- **Global pointermove**: tracking at the `window` level means the button starts reacting *before* the cursor reaches it — that's what sells the "magnetic" feel. It still recenters cleanly when the pointer leaves the window.
- **Reduced motion**: when the user prefers reduced motion, the component renders as a static `Button` link — no translation, no scale, no listeners.
- **Tap support**: `onTapStart` / `onTap` give you the scale-pop on touch devices too.

Install prerequisites (if not already in the project):

```bash
pnpm add framer-motion
pnpm dlx shadcn@latest add button
```

```tsx
"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";

type MagneticCTAProps = Omit<ButtonProps, "asChild"> & {
  href?: string;
  /** Distance (px) from the button center within which the magnetic pull activates. */
  radius?: number;
  /** How strongly the button follows the cursor (0 = none, 1 = 1:1). */
  strength?: number;
  children: React.ReactNode;
};

export function MagneticCTA({
  href = "/signup",
  radius = 120,
  strength = 0.35,
  variant = "default",
  size = "lg",
  className,
  children,
  ...buttonProps
}: MagneticCTAProps) {
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Raw motion values that track the offset from the button's center.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring-smoothed values so the translation feels elastic, not linear.
  const springConfig = { stiffness: 180, damping: 15, mass: 0.25 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // Scale pop on hover/press — also spring-driven for a tactile feel.
  const scale = useMotionValue(1);
  const springScale = useSpring(scale, { stiffness: 300, damping: 18 });

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      const el = wrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      if (distance < radius) {
        // Ease the pull so movement is gentler at the edge of the radius.
        const pull = 1 - distance / radius;
        x.set(dx * strength * pull);
        y.set(dy * strength * pull);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handlePointerLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [prefersReducedMotion, radius, strength, x, y]);

  const handleHoverStart = () => {
    if (!prefersReducedMotion) scale.set(1.06);
  };
  const handleHoverEnd = () => {
    scale.set(1);
  };
  const handlePressStart = () => {
    if (!prefersReducedMotion) scale.set(0.96);
  };
  const handlePressEnd = () => {
    if (!prefersReducedMotion) scale.set(1.06);
  };

  return (
    <motion.span
      ref={wrapperRef}
      style={{
        x: prefersReducedMotion ? 0 : springX,
        y: prefersReducedMotion ? 0 : springY,
        scale: prefersReducedMotion ? 1 : springScale,
        display: "inline-block",
        // Ensures the magnetic wrapper doesn't capture taps meant for the link itself.
        willChange: "transform",
      }}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      onTapStart={handlePressStart}
      onTap={handlePressEnd}
      onTapCancel={handlePressEnd}
    >
      <Button
        asChild
        variant={variant}
        size={size}
        className={className}
        {...buttonProps}
      >
        <a href={href}>{children}</a>
      </Button>
    </motion.span>
  );
}

export default MagneticCTA;
```

## Usage

```tsx
import { MagneticCTA } from "@/components/magnetic-cta";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 py-24">
      <h1 className="text-5xl font-bold">Ship faster. Sleep better.</h1>
      <MagneticCTA>Get started free</MagneticCTA>
    </section>
  );
}
```

## Tuning notes

- **Too jumpy?** Lower `strength` (e.g. `0.2`) or increase `damping` in `springConfig`.
- **Too sluggish?** Raise `stiffness` and lower `mass`.
- **Larger hero buttons?** Bump `radius` to `160–200` so the pull starts earlier.
- **Next.js App Router**: swap `<a href={href}>` for `<Link href={href}>` from `next/link` — `asChild` will still forward the shadcn styles to it.
- **React Router**: swap for `<Link to={href}>` from `react-router-dom` the same way.

## Notes on React 19 / Next.js

- The `"use client"` directive is required — the component uses refs, effects, and pointer events.
- `ButtonProps` is exported by the default shadcn Button. If your generated `button.tsx` uses the newer `React.ComponentProps<"button"> & VariantProps<...>` inline type, import/export that type instead (or inline it). The rest of the component is unchanged.
- If you're on Framer Motion v11+, imports are identical. On Motion's newer package (`motion/react`), change the import to `from "motion/react"`.
