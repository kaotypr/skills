import Hero from "../../../iteration-2/eval-1-landing-hero-stagger-counter/with_skill/run-1/outputs/Hero"
import { PageHeader } from "./PageHeader"

export default function Eval1WithSkill() {
  return (
    <>
      <PageHeader evalId={1} evalName="landing-hero-stagger-counter" variant="with-skill" />
      <Hero />
    </>
  )
}
