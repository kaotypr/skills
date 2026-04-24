import { useEffect } from "react"
import { animate, useMotionValue, useTransform } from "motion/react"

export function useCounter(target: number, play: boolean, opts?: { decimals?: number; duration?: number }) {
  const decimals = opts?.decimals ?? 0
  const duration = opts?.duration ?? 1.6
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (latest) =>
    decimals > 0
      ? latest.toFixed(decimals)
      : Math.round(latest).toLocaleString(),
  )

  useEffect(() => {
    if (!play) return
    const controls = animate(mv, target, { duration, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [play, target, duration, mv])

  return rounded
}
