// Demo fixture — injected so the baseline HorizontalCaseStudies.tsx can resolve
// its `./caseStudies` import when rendered in the demo app. Not part of the
// original eval output.

export const caseStudies = [
  {
    id: "cs-1",
    title: "Orbital — 0 to 10k users in a month",
    client: "Orbital",
    description: "Rebuilt onboarding so activation time dropped from 14 minutes to 90 seconds.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=60",
    tags: ["onboarding", "growth"],
  },
  {
    id: "cs-2",
    title: "Meridian — checkout conversion up 32%",
    client: "Meridian Retail",
    description: "Replaced a 6-step checkout with a single-page shared-element flow.",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1600&q=60",
    tags: ["e-commerce", "ux"],
  },
  {
    id: "cs-3",
    title: "Helix — animation system rollout",
    client: "Helix Health",
    description: "Cut animation code from 4,200 lines to 600 with a central motion primitive library.",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&q=60",
    tags: ["design-system"],
  },
  {
    id: "cs-4",
    title: "Luma — interactive data storytelling",
    client: "Luma Insights",
    description: "Scroll-linked charts walk a non-technical reader through 8 years of customer data.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=60",
    tags: ["data-viz", "scroll"],
  },
  {
    id: "cs-5",
    title: "Atlas — mobile app gesture overhaul",
    client: "Atlas Travel",
    description: "Native-feeling swipe, drag-to-reorder, and pull-to-refresh shipped in 3 weeks.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=60",
    tags: ["mobile", "gestures"],
  },
] as const
