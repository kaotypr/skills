import { Link } from "react-router-dom"

type Variant = "with-skill" | "without-skill"

export function PageHeader({
  evalId,
  evalName,
  variant,
}: {
  evalId: number
  evalName: string
  variant: Variant
}) {
  return (
    <div className="page-header">
      <Link to="/">← all demos</Link>
      <span className={`badge ${variant}`}>{variant === "with-skill" ? "with skill" : "baseline"}</span>
      <span className="meta">
        eval-{evalId}-{evalName}
      </span>
    </div>
  )
}
