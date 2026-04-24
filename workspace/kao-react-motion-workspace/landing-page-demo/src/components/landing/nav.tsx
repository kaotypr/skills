import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { useState } from "react"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/data"
import { cn } from "@/lib/utils"

export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(latest > 16)
    if (latest > prev && latest > 200) setHidden(true)
    else setHidden(false)
  })

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
    >
      <div
        className={cn(
          "flex w-full max-w-5xl items-center justify-between gap-6 rounded-full border border-border/70 px-3 py-2 backdrop-blur-xl transition-colors",
          scrolled ? "bg-card/80 shadow-lg shadow-black/20" : "bg-card/40",
        )}
      >
        <a href="#" className="flex items-center gap-2 pl-3 pr-1">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="relative grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-1 via-brand-2 to-brand-3 text-black"
          >
            <Sparkles className="size-4" strokeWidth={2.5} />
          </motion.div>
          <span className="font-semibold tracking-tight">Nebula</span>
        </a>

        <NavigationMenu.Root className="hidden md:block">
          <NavigationMenu.List className="flex items-center gap-1">
            {navLinks.map((l) => (
              <NavigationMenu.Item key={l.href}>
                <NavigationMenu.Link asChild>
                  <a
                    href={l.href}
                    className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}
          </NavigationMenu.List>
        </NavigationMenu.Root>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button asChild variant="glow" size="sm">
            <motion.a href="#pricing" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              Get started
              <ArrowRight className="size-4" />
            </motion.a>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
