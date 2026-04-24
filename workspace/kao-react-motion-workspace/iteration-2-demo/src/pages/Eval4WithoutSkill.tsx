import HorizontalCaseStudies from "../../../iteration-2/eval-4-horizontal-scroll-case-studies/without_skill/run-1/outputs/HorizontalCaseStudies"
import { PageHeader } from "./PageHeader"
import { caseStudies } from "../data"

export default function Eval4WithoutSkill() {
  return (
    <>
      <PageHeader evalId={4} evalName="horizontal-scroll-case-studies" variant="without-skill" />
      <HorizontalCaseStudies caseStudies={caseStudies} />
    </>
  )
}
