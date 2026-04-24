import {
  Sparkles, Zap, Shield, Layers, Workflow, GitBranch,
  Palette, Terminal, Globe, Rocket, LineChart, Lock,
} from "lucide-react"

export const navLinks = [
  { label: "Product", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#faq" },
]

export const features = [
  {
    icon: Sparkles,
    title: "Primitives, not pages",
    body: "Every Nebula block is a headless primitive. Wire it into any framework — React, Solid, Svelte, Vue — without rewriting.",
    span: "col-span-2",
    accent: "from-brand-1 to-brand-2",
  },
  {
    icon: Zap,
    title: "Ships at 60 fps",
    body: "GPU-accelerated transforms out of the box. Your layout work runs on the compositor, not the main thread.",
    span: "",
    accent: "from-brand-2 to-brand-3",
  },
  {
    icon: Shield,
    title: "Accessible by default",
    body: "WAI-ARIA patterns, keyboard nav, focus management, screen-reader states — all batteries included.",
    span: "",
    accent: "from-brand-3 to-brand-4",
  },
  {
    icon: Workflow,
    title: "Composable orchestration",
    body: "One source of animation truth flows through variants — no prop drilling, no duplicated easings.",
    span: "col-span-2",
    accent: "from-brand-4 to-brand-1",
  },
] as const

export const capabilities = [
  { icon: Layers,   title: "Layout animations",   body: "Morph size, position and shared elements without reaching for width/height tweens." },
  { icon: GitBranch,title: "Scroll timelines",    body: "Tie any transform to any scroll range with useScroll + useTransform." },
  { icon: Palette,  title: "Design tokens",       body: "Pulls shadcn theme variables automatically. Brand it with two lines of CSS." },
  { icon: Terminal, title: "CLI generator",       body: "`nebula add hero bento` drops typed, lint-clean code into your repo." },
  { icon: Globe,    title: "Works everywhere",    body: "RSC friendly. Edge friendly. It's just JS and CSS." },
  { icon: Lock,     title: "Private by design",   body: "Zero telemetry, zero runtime analytics, zero external fetches." },
] as const

export const stats = [
  { value: 99.99, suffix: "%",  label: "Uptime last 12 months" },
  { value: 24,    suffix: "ms", label: "p95 interaction latency" },
  { value: 4200,  suffix: "+",  label: "Teams shipping on Nebula" },
  { value: 1.0,   suffix: "kb", label: "Runtime gzipped (core)" },
] as const

export const showcase = [
  { id: "dash",     title: "Dashboard kit",      description: "Live metrics, timelines, and alerts wired to your data model.",       color: "from-brand-1 via-brand-2 to-brand-3" },
  { id: "pay",      title: "Checkout flow",      description: "Pixel-perfect payment steps with Stripe and Adyen adapters built-in.", color: "from-brand-2 via-brand-3 to-brand-4" },
  { id: "editor",   title: "Collaborative doc",  description: "CRDT-backed doc editor with presence cursors and comments.",           color: "from-brand-3 via-brand-4 to-brand-1" },
  { id: "schedule", title: "Calendar",           description: "Drag-to-reschedule, timezone-aware, with recurrence rules.",            color: "from-brand-4 via-brand-1 to-brand-2" },
  { id: "analytics",title: "Insights",           description: "Funnel analysis, cohort retention, and anomaly alerts in minutes.",    color: "from-brand-1 via-brand-3 to-brand-2" },
] as const

export const pricing = [
  {
    name: "Solo", price: 0, cadence: "forever",
    blurb: "Everything you need to ship a side project this weekend.",
    features: ["All primitives", "Community support", "MIT-licensed code", "1 seat"],
    cta: "Start building", highlight: false,
  },
  {
    name: "Team", price: 24, cadence: "per seat / month",
    blurb: "Collaboration, governance, and the bits that keep design and engineering in lockstep.",
    features: ["Figma → code sync", "Shared component registry", "Priority Slack support", "Unlimited projects"],
    cta: "Start 14-day trial", highlight: true,
  },
  {
    name: "Enterprise", price: null, cadence: "custom",
    blurb: "SOC-2, dedicated infrastructure, and a design engineer on call.",
    features: ["SSO + SAML", "SOC-2 Type II", "Dedicated CSM", "Design engineer hours"],
    cta: "Talk to sales", highlight: false,
  },
] as const

export const testimonials = [
  { quote: "We shipped our whole marketing site in a weekend. This is what the web was supposed to feel like.", name: "Priya Shankar",  role: "Founder, Ember",       column: 0 },
  { quote: "Our PRs used to be 800 lines of CSS. Nebula collapsed them to 40.",                                name: "Marcus Lee",     role: "Staff Eng, Northstar", column: 0 },
  { quote: "The design tokens pipeline is chef's-kiss. Our brand refresh took three hours, not three weeks.",  name: "Aria Bennett",   role: "Design lead, Kite",    column: 1 },
  { quote: "I stopped reaching for framer-motion and just use Nebula's built-in primitives now.",              name: "Ola Hansson",    role: "Principal, Fjord",     column: 1 },
  { quote: "Accessibility audits went from a quarter-long project to a lint rule.",                           name: "Ken Watanabe",   role: "Eng manager, Orbit",   column: 2 },
  { quote: "The horizontal-scroll section alone saved us two months of custom canvas work.",                   name: "Lena Park",      role: "CTO, Finchly",          column: 2 },
] as const

export const faqs = [
  { q: "How is Nebula different from a component library?",
    a: "Component libraries ship markup. Nebula ships motion, interaction and layout primitives that wrap your existing markup. Drop it onto shadcn, Radix, your own styles — anything." },
  { q: "Is the runtime really 1kb?",
    a: "The core (motion values, transform utilities, gesture dispatch) is 1.0kb gzipped. Tree-shakeable features — layout animations, scroll timelines, drag — ship separately and you only pay for what you use." },
  { q: "Does it work with React Server Components?",
    a: "Yes. Every primitive has an RSC-safe import path under `nebula/rsc`. The client parts re-hydrate cleanly without layout flash." },
  { q: "What about other frameworks?",
    a: "Solid, Svelte and Vue adapters live in the same monorepo. The core math and timing engine is framework-agnostic." },
  { q: "How do licensing and pricing work?",
    a: "The library is MIT-licensed. You never pay for the library itself. Team and Enterprise plans cover the design system bridge, governance, and support." },
  { q: "Can I self-host the CLI?",
    a: "Yes, the CLI is open source. The registry you pull from can be the public one, your own Git repo, or a private Nebula Cloud workspace." },
] as const

export const logoCompanies = [
  "Northstar", "Ember", "Kite", "Fjord", "Orbit", "Finchly", "Loop", "Helix",
] as const

export { Rocket, LineChart }
