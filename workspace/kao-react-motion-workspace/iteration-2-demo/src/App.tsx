import { Component, type ReactNode } from "react"
import { Routes, Route } from "react-router-dom"
import Index from "./pages/Index"

// Each eval × config gets its own page. We do NOT mix outputs on a page.
import Eval1WithSkill from "./pages/Eval1WithSkill"
import Eval1WithoutSkill from "./pages/Eval1WithoutSkill"
import Eval2WithSkill from "./pages/Eval2WithSkill"
import Eval2WithoutSkill from "./pages/Eval2WithoutSkill"
import Eval3WithSkill from "./pages/Eval3WithSkill"
import Eval3WithoutSkill from "./pages/Eval3WithoutSkill"
import Eval4WithSkill from "./pages/Eval4WithSkill"
import Eval4WithoutSkill from "./pages/Eval4WithoutSkill"
import Eval5WithSkill from "./pages/Eval5WithSkill"
import Eval5WithoutSkill from "./pages/Eval5WithoutSkill"

// Page-level error boundary so one broken output doesn't crash the whole app.
class Boundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return <div className="error-boundary">{this.state.error.stack ?? this.state.error.message}</div>
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/eval-1/with-skill" element={<Boundary><Eval1WithSkill /></Boundary>} />
      <Route path="/eval-1/without-skill" element={<Boundary><Eval1WithoutSkill /></Boundary>} />
      <Route path="/eval-2/with-skill" element={<Boundary><Eval2WithSkill /></Boundary>} />
      <Route path="/eval-2/without-skill" element={<Boundary><Eval2WithoutSkill /></Boundary>} />
      <Route path="/eval-3/with-skill" element={<Boundary><Eval3WithSkill /></Boundary>} />
      <Route path="/eval-3/without-skill" element={<Boundary><Eval3WithoutSkill /></Boundary>} />
      <Route path="/eval-4/with-skill" element={<Boundary><Eval4WithSkill /></Boundary>} />
      <Route path="/eval-4/without-skill" element={<Boundary><Eval4WithoutSkill /></Boundary>} />
      <Route path="/eval-5/with-skill" element={<Boundary><Eval5WithSkill /></Boundary>} />
      <Route path="/eval-5/without-skill" element={<Boundary><Eval5WithoutSkill /></Boundary>} />
    </Routes>
  )
}
