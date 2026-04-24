import { Sparkles, Github, Twitter } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-1 via-brand-2 to-brand-3 text-black">
                <Sparkles className="size-4" strokeWidth={2.5} />
              </div>
              <span className="font-semibold tracking-tight">Nebula</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              A universe of primitives for the modern web. Built in Lisbon, shipped everywhere.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a className="grid size-9 place-items-center rounded-full border border-border/60 bg-background/50 transition-colors hover:bg-muted" href="#">
                <Twitter className="size-4" />
              </a>
              <a className="grid size-9 place-items-center rounded-full border border-border/60 bg-background/50 transition-colors hover:bg-muted" href="#">
                <Github className="size-4" />
              </a>
            </div>
          </div>

          {[
            { title: "Product",    links: ["Primitives", "Showcase", "Changelog", "Roadmap"] },
            { title: "Developers", links: ["Docs", "Examples", "Integrations", "CLI"] },
            { title: "Company",    links: ["About", "Blog", "Careers", "Press kit"] },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{col.title}</div>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-foreground/80 transition-colors hover:text-foreground">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-border/60" />

        <div className="flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} Nebula Systems, Inc. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
