import { Link } from "react-router-dom"

const evals = [
  {
    id: 1,
    name: "landing-hero-stagger-counter",
    description: "Marketing hero with staggered reveal + animated stat counter. Tests shadcn tokens, stagger() helper, AnimateNumber-as-Motion+ refusal, useReducedMotion.",
  },
  {
    id: 2,
    name: "shared-element-portfolio-morph",
    description: "Grid card → fullscreen morph via layoutId. Tests Shape A/B, visibility:hidden source hide, flicker/overlap avoidance.",
  },
  {
    id: 3,
    name: "aschild-magnetic-cta",
    description: "Magnetic CTA button via <Button asChild><motion.a>. Tests the signature shadcn integration pattern.",
  },
  {
    id: 4,
    name: "horizontal-scroll-case-studies",
    description: "Vertical→horizontal scroll with 5 cards. Tests scroll-linked pacing, not-using-useSpring on scrub values.",
  },
  {
    id: 5,
    name: "shadcn-dialog-motion-override",
    description: "Custom Motion override of shadcn Dialog's default tw-animate-css animation.",
  },
]

export default function Index() {
  return (
    <div className="index-shell">
      <h1>kao-react-motion · iteration-2 demos</h1>
      <p>
        Each page renders the raw output tsx file from iteration-2 in isolation — with-skill and without-skill side by
        side on their own pages (no mixing). Click through to see the behaviour.
      </p>

      <h2>Evals</h2>
      {evals.map(e => (
        <div key={e.id} className="eval-group">
          <div className="eval-title">
            {e.id}. {e.name}
            <div style={{ fontSize: 12, fontWeight: 400, color: "var(--muted-foreground)", marginTop: 4 }}>
              {e.description}
            </div>
          </div>
          <Link to={`/eval-${e.id}/with-skill`} className="variant-link with-skill">
            <strong>With Skill</strong>
            render the with-skill output
          </Link>
          <Link to={`/eval-${e.id}/without-skill`} className="variant-link without-skill">
            <strong>Without Skill (baseline)</strong>
            render the baseline output
          </Link>
        </div>
      ))}
    </div>
  )
}
