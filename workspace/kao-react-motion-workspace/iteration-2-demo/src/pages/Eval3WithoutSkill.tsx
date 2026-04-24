import MagneticCTA from "../../../iteration-2/eval-3-aschild-magnetic-cta/without_skill/run-1/outputs/MagneticCTA"
import { PageHeader } from "./PageHeader"

export default function Eval3WithoutSkill() {
  return (
    <>
      <PageHeader evalId={3} evalName="aschild-magnetic-cta" variant="without-skill" />
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-background">
        <h1 className="text-3xl font-semibold text-foreground">Hover near the button</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Baseline output. Note: this version wraps the anchor in a <code>motion.span</code> rather than using{" "}
          <code>motion.a</code> as the direct child of <code>Button asChild</code>.
        </p>
        <MagneticCTA>Get started</MagneticCTA>
      </div>
    </>
  )
}
