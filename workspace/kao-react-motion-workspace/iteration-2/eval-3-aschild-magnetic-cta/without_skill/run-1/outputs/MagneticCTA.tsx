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
