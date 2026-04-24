---
title: "Scroll Direction: Hide Header"
source: "https://motion.dev/tutorials/react-scroll-hide-header?platform=react"
author:
published:
created: 2026-04-24
description: "Explore the official library of Motion (prev Framer Motion) tutorials for React, JavaScript, and Vue. Learn step-by-step from the creator of Motion and master web animation."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "animation"
  - "scroll-direction"
  - "motion-ui"
  - "ux-pattern"
---
# React animation tutorials

## Summary
This tutorial explains how to build a \\"Scroll Direction: Hide Header\\" feature using Motion UI for React. It details using the `useScroll` hook and `useMotionValueEvent` to track scroll direction and conditionally hide/show the header. The guide covers the logic, animation implementation, performance considerations, and accessibility.

## Key points
- Use `useScroll` and `useMotionValueEvent` to track scroll direction and update header visibility.
- Animate header's `y` property between `-100%` and `0%` based on scroll direction.
- `useMotionValueEvent` is more performant than `useEffect` for scroll-based updates.
- Implement `prefers-reduced-motion` for accessibility.
- Explore variations like spring animations and different show/hide thresholds.

---

Matt Perry

In this tutorial, we're going to build the Scroll Direction: Hide Header example step-by-step.

This example is rated intermediate difficulty, which means we'll spend some time explaining the Motion APIs we've chosen to use, but it assumes familiarity with JavaScript as a language.

Here's a live demo of the example we're going to be creating:

A common UX pattern: hide the header when scrolling down to maximize content space, then reveal it when scrolling up so navigation is always accessible.

## How it works

The `useScroll` hook provides a `scrollY` motion value that tracks the current scroll position. We use `useMotionValueEvent` to listen for changes and compare the current position to the previous one.

const { scrollY } = useScroll()

const \[hidden, setHidden\] = useState(false)

useMotionValueEvent(scrollY, "change", (current) => {

const previous = scrollY.getPrevious()?? 0

if (current > previous && current > 150) {

setHidden(true)

} else {

setHidden(false)

}

})

### The logic

- `current > previous` — user is scrolling down
- `current > 150` — only hide after scrolling past 150px (so it doesn't hide immediately)
- Otherwise, show the header (user scrolling up or at top)

## Animating the header

The header animates between visible and hidden using the `animate` prop:

```
<motion.header
    animate=
    transition=
>
```

Using `-100%` moves the header up by its own height, completely hiding it above the viewport.

## Why useMotionValueEvent?

You might be tempted to use `useEffect` with `scrollY.get()`, but that would cause unnecessary re-renders. `useMotionValueEvent` subscribes directly to the motion value and only triggers when the value changes, making it more performant.

## Accessibility

Consider adding `prefers-reduced-motion` support to disable the animation for users who prefer reduced motion:

```
@media (prefers-reduced-motion: reduce) {
    .header {
        transition: none;
    }
}
```

## Variations

### Show on scroll up only after threshold

```
if (current > previous && current > 150) {
    setHidden(true)
} else if (current < previous) {
    setHidden(false)
}
// Header stays hidden if user stops scrolling
```

### Smooth spring animation

```
<motion.header
    animate=
    transition=
>
```