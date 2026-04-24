import Hero from "../../../iteration-2/eval-1-landing-hero-stagger-counter/without_skill/run-1/outputs/Hero"
import { PageHeader } from "./PageHeader"

export default function Eval1WithoutSkill() {
  return (
    <>
      <PageHeader evalId={1} evalName="landing-hero-stagger-counter" variant="without-skill" />
      <Hero />
    </>
  )
}
