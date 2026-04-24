import type { ReactNode } from "react"

// ---- Eval 1: features ---------------------------------------------------
// Icons are inline SVG strings to sidestep the typing differences between
// the two Features.tsx files (one expects ComponentType<SVGProps>, the other
// ComponentType|ReactNode). We pass a small ReactNode/function component.

const makeIcon = (d: string) =>
  function Icon({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <path d={d} />
      </svg>
    )
  }

export const features = [
  { id: "f1", title: "Fast by default",      description: "Runs on the browser's native animation pipeline for 120fps UI.",      icon: makeIcon("M13 2 3 14h9l-1 8 10-12h-9l1-8z") },
  { id: "f2", title: "Springs without pain", description: "Physics-based motion that incorporates your gesture velocity.",       icon: makeIcon("M12 2v20M5 12h14") },
  { id: "f3", title: "Layout animations",    description: "Auto-animate any size/position change — accordions, grids, modals.",  icon: makeIcon("M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z") },
  { id: "f4", title: "Scroll-linked",        description: "Parallax, progress bars, reveal effects tied directly to scroll.",    icon: makeIcon("M12 4v16M6 10l6-6 6 6M6 14l6 6 6-6") },
  { id: "f5", title: "Gestures",             description: "Hover, tap, focus, pan, drag — all with rich while-props.",           icon: makeIcon("M9 11V6a3 3 0 0 1 6 0v5M5 14v3a7 7 0 0 0 14 0v-3") },
  { id: "f6", title: "Tree-shakable",        description: "Only ship what you import. Core is under 5kb.",                         icon: makeIcon("M12 2 3 7l9 5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5") },
]

// ---- Eval 2: projects ---------------------------------------------------
export const projects = [
  { id: "p1", title: "Orbital",  description: "Onboarding rebuild — activation in 90 seconds.",    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=60", imageAlt: "Aurora over city" },
  { id: "p2", title: "Meridian", description: "Checkout conversion up 32%.",                        image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&q=60", imageAlt: "Shopping street" },
  { id: "p3", title: "Helix",    description: "4,200 lines of animation code → 600.",              image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=60", imageAlt: "Code on screen" },
  { id: "p4", title: "Luma",     description: "Interactive data storytelling.",                     image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=60", imageAlt: "Data dashboard" },
  { id: "p5", title: "Atlas",    description: "Mobile gesture overhaul in 3 weeks.",               image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=60", imageAlt: "Mobile device" },
  { id: "p6", title: "Ember",    description: "Real-time collaborative canvas.",                    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=60", imageAlt: "Canvas on wall" },
]

// ---- Eval 3: case studies (with-skill shape, has both summary & description) ---
export const caseStudies = [
  { id: "cs-1", title: "Orbital — 0 to 10k users in a month",    client: "Orbital",        summary: "Rebuilt onboarding so activation time dropped from 14m to 90s.",       description: "Rebuilt onboarding so activation time dropped from 14m to 90s.",       image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=60" },
  { id: "cs-2", title: "Meridian — checkout conversion up 32%", client: "Meridian Retail",summary: "Replaced a 6-step checkout with a single-page shared-element flow.",    description: "Replaced a 6-step checkout with a single-page shared-element flow.",    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1600&q=60" },
  { id: "cs-3", title: "Helix — animation system rollout",      client: "Helix Health",   summary: "4,200 lines of animation code → 600 with a central primitive library.", description: "4,200 lines of animation code → 600 with a central primitive library.", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=60" },
  { id: "cs-4", title: "Luma — interactive data storytelling",  client: "Luma Insights",  summary: "Scroll-linked charts walk readers through 8 years of customer data.",   description: "Scroll-linked charts walk readers through 8 years of customer data.",   image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=60" },
  { id: "cs-5", title: "Atlas — mobile app gesture overhaul",   client: "Atlas Travel",   summary: "Native-feeling swipe, drag-to-reorder, pull-to-refresh in 3 weeks.",    description: "Native-feeling swipe, drag-to-reorder, pull-to-refresh in 3 weeks.",    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=60" },
]

// ---- Eval 4: todos ------------------------------------------------------
export const initialTodos = [
  { id: "t1", text: "Drag the handle on the left to reorder me", done: false },
  { id: "t2", text: "Swipe me left to delete",                   done: false },
  { id: "t3", text: "Check this one off",                        done: true  },
  { id: "t4", text: "Add a new item below",                      done: false },
]
