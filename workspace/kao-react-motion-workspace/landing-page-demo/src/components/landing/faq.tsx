import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { faqs } from "@/data"

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge variant="subtle" className="px-3 py-1 text-[11px] uppercase tracking-widest">
            FAQ
          </Badge>
          <h2 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Questions, answered <span className="text-gradient">honestly.</span>
          </h2>
        </motion.div>

        <div className="mt-14 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card/40 backdrop-blur">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <motion.div key={i} layout>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-6 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium">{f.q}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 22 }}
                    className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-border bg-background/50"
                  >
                    <Plus className="size-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { type: "spring", stiffness: 260, damping: 26 },
                        opacity: { duration: 0.2 },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pr-14 text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
