import MagneticCTA from "../../../iteration-2/eval-3-aschild-magnetic-cta/with_skill/run-1/outputs/MagneticCTA"
import { PageHeader } from "./PageHeader"

export default function Eval3WithSkill() {
  return (
    <>
      <PageHeader evalId={3} evalName="aschild-magnetic-cta" variant="with-skill" />
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-background">
        <h1 className="text-3xl font-semibold text-foreground">Hover near the button</h1>
        <p className="text-muted-foreground text-center max-w-md">
          The CTA is a shadcn Button rendered <code>asChild</code> wrapping a <code>motion.a</code>. Move your cursor
          toward it — it should follow, with a spring.
        </p>
        <MagneticCTA>Get started</MagneticCTA>
      </div>
    </>
  )
}
