import HorizontalCaseStudies from "../../../iteration-2/eval-4-horizontal-scroll-case-studies/with_skill/run-1/outputs/HorizontalCaseStudies"
import { PageHeader } from "./PageHeader"
import { caseStudies } from "../data"

export default function Eval4WithSkill() {
  return (
    <>
      <PageHeader evalId={4} evalName="horizontal-scroll-case-studies" variant="with-skill" />
      <HorizontalCaseStudies caseStudies={caseStudies} />
    </>
  )
}
