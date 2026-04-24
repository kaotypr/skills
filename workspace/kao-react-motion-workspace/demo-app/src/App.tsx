import { Component, useState, type ReactNode } from "react"
import { features, projects, caseStudies, initialTodos } from "./data"

// ---- Imports from the generated eval outputs (iteration-1) --------------
// Features — with-skill uses a named export, baseline uses default export
import { Features as FeaturesWith } from "../../iteration-1/eval-1-scroll-staggered-reveal/with_skill/run-1/outputs/Features"
import FeaturesWithout from "../../iteration-1/eval-1-scroll-staggered-reveal/without_skill/run-1/outputs/Features"

// Gallery — both use named exports; CardModal is imported internally
import { Gallery as GalleryWith } from "../../iteration-1/eval-2-shared-element-card-to-modal/with_skill/run-1/outputs/Gallery"
import { Gallery as GalleryWithout } from "../../iteration-1/eval-2-shared-element-card-to-modal/without_skill/run-1/outputs/Gallery"

// HorizontalCaseStudies — with-skill: named + takes prop; baseline: default + reads its own module
import { HorizontalCaseStudies as HorizontalCaseStudiesWith } from "../../iteration-1/eval-3-horizontal-scroll-section/with_skill/run-1/outputs/HorizontalCaseStudies"
import HorizontalCaseStudiesWithout from "../../iteration-1/eval-3-horizontal-scroll-section/without_skill/run-1/outputs/HorizontalCaseStudies"

// TodoList — with-skill prop is initialTodos; baseline prop is initialItems
import { TodoList as TodoListWith } from "../../iteration-1/eval-4-reorderable-todo-list/with_skill/run-1/outputs/TodoList"
import { TodoList as TodoListWithout } from "../../iteration-1/eval-4-reorderable-todo-list/without_skill/run-1/outputs/TodoList"

// AnimatedCounter — identical API, named export
import { AnimatedCounter as AnimatedCounterWith } from "../../iteration-1/eval-5-animated-counter/with_skill/run-1/outputs/AnimatedCounter"
import { AnimatedCounter as AnimatedCounterWithout } from "../../iteration-1/eval-5-animated-counter/without_skill/run-1/outputs/AnimatedCounter"

// -------------------------------------------------------------------------
// Error boundary — so a broken component in one pane doesn't crash the whole page

class Boundary extends Component<{ children: ReactNode; label: string }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error) { console.error(this.props.label, error) }
  render() {
    if (this.state.error) {
      return <div className="error-boundary">{this.props.label} crashed:{"\n\n"}{this.state.error.message}</div>
    }
    return this.props.children
  }
}

const Pane = ({ variant, children }: { variant: "with" | "without"; children: ReactNode }) => (
  <div className="pane">
    <div className={`pane-header ${variant === "with" ? "with-skill" : "without-skill"}`}>
      {variant === "with" ? "With Skill" : "Without Skill (baseline)"}
    </div>
    <div className="pane-body">
      <Boundary label={variant === "with" ? "With-skill pane" : "Baseline pane"}>{children}</Boundary>
    </div>
  </div>
)

// -------------------------------------------------------------------------
// Eval views

function Eval1() {
  return (
    <>
      <div className="eval-desc">
        <strong>Prompt:</strong> Staggered fade/slide of 6 feature cards on scroll-into-view, respects prefers-reduced-motion, first-time-only.
      </div>
      <div className="split">
        <Pane variant="with"><FeaturesWith features={features as any} /></Pane>
        <Pane variant="without"><FeaturesWithout features={features as any} /></Pane>
      </div>
    </>
  )
}

function Eval2() {
  return (
    <>
      <div className="eval-desc">
        <strong>Prompt:</strong> Grid of project cards that animate into a full-screen modal via shared-element transition. Esc / click-outside to close.
      </div>
      <div className="split">
        <Pane variant="with"><GalleryWith projects={projects} /></Pane>
        <Pane variant="without"><GalleryWithout projects={projects} /></Pane>
      </div>
    </>
  )
}

function Eval3() {
  return (
    <>
      <div className="eval-desc">
        <strong>Prompt:</strong> Vertical scroll drives horizontal translation of 5 full-viewport cards, slower than 1:1.
        <br/><em>Note: scroll inside each pane to drive the animation.</em>
      </div>
      <div className="split">
        <Pane variant="with"><HorizontalCaseStudiesWith caseStudies={caseStudies} /></Pane>
        <Pane variant="without"><HorizontalCaseStudiesWithout /></Pane>
      </div>
    </>
  )
}

function Eval4() {
  return (
    <>
      <div className="eval-desc">
        <strong>Prompt:</strong> Drag-to-reorder list with left-side drag handle, swipe-to-delete, and slide-in enter animation.
      </div>
      <div className="split">
        <Pane variant="with"><TodoListWith initialTodos={initialTodos} /></Pane>
        <Pane variant="without"><TodoListWithout initialItems={initialTodos} /></Pane>
      </div>
    </>
  )
}

function Eval5() {
  const [target, setTarget] = useState(1234)
  return (
    <>
      <div className="eval-desc">
        <strong>Prompt:</strong> AnimatedCounter ticks from 0 to target over ~1s on each change. Integer-only. Refuses to use Motion+ AnimateNumber.
      </div>
      <div className="controls">
        <button onClick={() => setTarget(Math.floor(Math.random() * 10000))}>Random target</button>
        <button onClick={() => setTarget(0)}>Set 0</button>
        <button onClick={() => setTarget(42)}>42</button>
        <button onClick={() => setTarget(9999)}>9999</button>
        <button onClick={() => setTarget(100)}>100 (decrease)</button>
        <span style={{ alignSelf: "center", color: "#666", fontSize: 13 }}>target: {target}</span>
      </div>
      <div className="split">
        <Pane variant="with">
          <div style={{ fontSize: 64, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#0d6031" }}>
            <AnimatedCounterWith target={target} />
          </div>
        </Pane>
        <Pane variant="without">
          <div style={{ fontSize: 64, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: "#894b00" }}>
            <AnimatedCounterWithout target={target} />
          </div>
        </Pane>
      </div>
    </>
  )
}

// -------------------------------------------------------------------------

type EvalDef = { id: number; name: string; label: string; Component: () => JSX.Element }

const EVALS: EvalDef[] = [
  { id: 1, name: "scroll-staggered-reveal",      label: "1 · Stagger scroll reveal",    Component: Eval1 },
  { id: 2, name: "shared-element-card-to-modal", label: "2 · Shared-element modal",     Component: Eval2 },
  { id: 3, name: "horizontal-scroll-section",    label: "3 · Horizontal scroll",        Component: Eval3 },
  { id: 4, name: "reorderable-todo-list",        label: "4 · Reorderable todo list",    Component: Eval4 },
  { id: 5, name: "animated-counter",             label: "5 · Animated counter",         Component: Eval5 },
]

export default function App() {
  const [active, setActive] = useState(1)
  const current = EVALS.find(e => e.id === active)!

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>kao-react-motion · iter 1</h1>
        <nav>
          {EVALS.map(e => (
            <button
              key={e.id}
              className={e.id === active ? "active" : ""}
              onClick={() => setActive(e.id)}
            >
              {e.label}
            </button>
          ))}
        </nav>
        <div className="hint">
          Each eval renders both with-skill and baseline side-by-side so you can see differences in behaviour, not just in diff form.
        </div>
      </aside>
      <main className="main">
        <h2>{current.label}</h2>
        <current.Component />
      </main>
    </div>
  )
}
