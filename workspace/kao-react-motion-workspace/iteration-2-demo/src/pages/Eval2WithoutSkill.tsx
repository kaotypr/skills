import ProjectGallery from "../../../iteration-2/eval-2-shared-element-portfolio-morph/without_skill/run-1/outputs/ProjectGallery"
import { PageHeader } from "./PageHeader"
import { projects } from "../data"

export default function Eval2WithoutSkill() {
  return (
    <>
      <PageHeader evalId={2} evalName="shared-element-portfolio-morph" variant="without-skill" />
      <div className="p-8 mx-auto max-w-6xl">
        <ProjectGallery projects={projects} />
      </div>
    </>
  )
}
