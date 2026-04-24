"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"

import { Button } from "@/components/ui/button"
import type { ButtonProps } from "@/components/ui/button"

type MagneticCTAProps = {
  /** Anchor target. Defaults to "/signup". */
  href?: string
  /** Label (or any renderable content) inside the Button. */
  children: React.ReactNode
  /** How strongly the button tracks the pointer. 0 = no tracking, 1 = 1:1. */
  strength?: number
  /** Extra padding (px) around the bounds that still counts as "near". */
  radius?: number
  /** Pass-through shadcn Button variant / size / className props. */
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  className?: string
  /** Optional override for external link behaviour. */
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"]
  rel?: React.AnchorHTMLAttributes<HTMLAnchorElement>["rel"]
}

/**
 * MagneticCTA — a shadcn <Button> that subtly follows the cursor with a spring
 * and pops on hover/tap. Renders as an <a> via Radix `asChild`, preserving all
 * of shadcn's variant styling, focus ring, and accessibility.
 *
 * - Pointer tracking uses `useMotionValue` + `useSpring` (no React re-renders).
 * - Respects `prefers-reduced-motion`: disables the follow + scale when set.
 * - Uses pointer events so it works for mouse AND touch/stylus.
 */
export function MagneticCTA({
  href = "/signup",
  children,
  strength = 0.3,
  radius = 48,
  variant,
  size,
  className,
  target,
  rel,
}: MagneticCTAProps) {
  const shouldReduceMotion = useReducedMotion()

  // Raw pointer-offset motion values (no React re-renders).
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smoothed, springy values that the element actually renders from.
  const springConfig = { stiffness: 350, damping: 28, mass: 0.6 }
  const sx = useSpring(x, springConfig)
  const sy = useSpring(y, springConfig)

  const anchorRef = React.useRef<HTMLAnchorElement>(null)

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLAnchorElement>) => {
      if (shouldReduceMotion) return
      const el = anchorRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2

      // How far the pointer is from the button's centre.
      const dx = event.clientX - cx
      const dy = event.clientY - cy

      // Only engage when the pointer is within `radius` of the button's bounds.
      // (Mouseenter alone fires too late; pointermove across the whole button
      // area is the normal "hover" case.)
      const halfW = rect.width / 2 + radius
      const halfH = rect.height / 2 + radius
      if (Math.abs(dx) > halfW || Math.abs(dy) > halfH) {
        x.set(0)
        y.set(0)
        return
      }

      x.set(dx * strength)
      y.set(dy * strength)
    },
    [radius, shouldReduceMotion, strength, x, y],
  )

  const handlePointerLeave = React.useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  // Disable the pop on reduced motion; keep it subtle otherwise.
  const whileHover = shouldReduceMotion ? undefined : { scale: 1.06 }
  const whileTap = shouldReduceMotion ? undefined : { scale: 0.96 }

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <motion.a
        ref={anchorRef}
        href={href}
        target={target}
        rel={rel}
        // Motion drives x / y / scale via transforms (GPU-friendly).
        style={{ x: sx, y: sy }}
        whileHover={whileHover}
        whileTap={whileTap}
        // Scale uses a spring so hover-in and release feel alive.
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        // `will-change` hints the browser for smoother compositing.
        // `touch-none` isn't needed because we aren't using drag.
      >
        {children}
      </motion.a>
    </Button>
  )
}

export default MagneticCTA
