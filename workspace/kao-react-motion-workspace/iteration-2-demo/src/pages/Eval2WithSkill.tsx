// NOTE: we render a *patched* version of the with-skill output here, not the
// raw eval output. Two bugs in the original (layout="position" on a shared
// layoutId element, plus a non-motion modal wrapper that left a ghost card
// during the close-morph) have been fixed in the patch and in the skill's
// recipe. The original output file at
//   iteration-2/eval-2-shared-element-portfolio-morph/with_skill/run-1/outputs/ProjectGallery.tsx
// is preserved unchanged as eval evidence.

import ProjectGallery from "../patches/ProjectGalleryPatched"
import { PageHeader } from "./PageHeader"
import { projects } from "../data"

export default function Eval2WithSkill() {
  return (
    <>
      <PageHeader evalId={2} evalName="shared-element-portfolio-morph (patched)" variant="with-skill" />
      <div className="p-8 mx-auto max-w-6xl">
        <div className="mb-4 rounded-md border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
          <strong className="text-foreground">Patched:</strong> the iter-2 with-skill output had two bugs — a{" "}
          <code>layout="position"</code> on a shared-layoutId image, and a plain{" "}
          <code>&lt;div&gt;</code> modal wrapper that lingered as a ghost card during close. Both have been fixed in the
          skill and in this demo. The original (broken) file is still on disk as eval evidence.
        </div>
        <ProjectGallery projects={projects} />
      </div>
    </>
  )
}
