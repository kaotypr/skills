---
title: "React's AnimatePresence modes explained"
source: "https://motion.dev/tutorials/react-animate-presence-modes?platform=react"
author:
published:
created: 2026-04-24
description: "Explore the official library of Motion (prev Framer Motion) tutorials for React, JavaScript, and Vue. Learn step-by-step from the creator of Motion and master web animation."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "animation"
  - "animatepresence"
  - "transitions"
  - "ui-design"
---
# React animation tutorials

## Summary
This tutorial explains the three modes of Motion's AnimatePresence component: sync, wait, and popLayout. Each mode dictates how elements animate when entering or leaving the DOM, offering different synchronization behaviors. Understanding these modes helps developers create smoother and more intuitive user interfaces.

## Key points
- **sync mode:** Animates entering and exiting elements simultaneously, ideal for cross-fades or overlapping elements where simultaneous animation is desired.
- **wait mode:** The entering element waits for the exiting element to finish animating before starting its own animation, suitable for sequential steps like wizards or tab content.
- **popLayout mode:** The exiting element is immediately removed from the document flow, allowing surrounding elements to reflow while the exit animation plays, perfect for dynamic lists or grids where immediate reflow is important.
- Choosing the right mode depends on the desired user experience and the nature of the UI transition.

---

Matt Perry

In this tutorial, we're going to build the AnimatePresence modes example step-by-step.

This tutorial is rated beginner difficulty, which means we'll spend some time explaining the Motion APIs that we've chosen to use (and why), and also any browser APIs we encounter that might be unfamiliar to beginners.

Here's a live demo of the example we're going to be creating:

## Understanding AnimatePresence

When elements enter or leave the DOM in React, they typically just appear or disappear instantly. The `AnimatePresence` component from Motion gives you the power to animate these transitions, and the `mode` prop determines *how* those animations coordinate with each other.

Think of it this way: when you're swapping one element for another, should they animate at the same time? Should one wait for the other? Should the old element get out of the way immediately? Each scenario calls for a different mode.

Let's take a look at each and find out.

### sync: Simultaneous animations

The default mode, `"sync"`, animates elements in and out at the same time. There's no sequencing - as soon as an element is added or removed, its animation begins.

<AnimatePresence>

<motion.div

key={currentItem}

initial=

animate=

exit=

/>

</AnimatePresence>

#### When to use sync mode

- Cross-fade transitions where both elements should be visible simultaneously
- Overlapping elements with `position: absolute` that don't affect each other's layout
- Background images or full-screen transitions
- Any situation where you want both animations happening at once

The catch with `"sync"` is that if your elements occupy the same space in the document flow, you'll see layout conflicts, with elements stacking or jumping. You'll need to handle positioning yourself, typically with `position: absolute`.

### wait: Sequential animations

In `"wait"` mode, the entering element waits until the exiting element has fully animated out before it begins its entrance animation.

<AnimatePresence mode="wait">

<motion.div

key={step}

initial=

animate=

exit=

/>

</AnimatePresence>

#### When to use wait mode

- Multi-step wizards or onboarding flows
- Tab content that should transition one at a time
- Modal or dialog content changes
- Any UI where you want to present information sequentially

A useful pattern with `"wait"` mode is using complementary easing functions. Set `ease: "easeIn"` on the exit animation and `ease: "easeOut"` on the enter animation - this creates an overall `easeInOut` feel across the combined transition.

<motion.div

initial=

animate=

exit=

/>

Note that `"wait"` mode only supports one child at a time. If you need to animate multiple children, consider `"sync"` or `"popLayout"`.

### popLayout: Instant reflow

The `"popLayout"` mode removes the exiting element from document flow immediately, allowing surrounding elements to reflow while the exit animation plays. The exiting element animates out from its "popped" position.

<AnimatePresence mode="popLayout">

{items.map((item) => (

<motion.li

key={item.id}

layout

initial=

animate=

exit=

/>

))}

</AnimatePresence>

#### When to use popLayout mode

- Lists where items can be added or removed
- Grid layouts with dynamic content
- Any situation where remaining elements should immediately take their new positions
- Interfaces where responsive reflow matters more than exit animation positioning

The `"popLayout"` mode pairs especially well with the `layout` prop. When you remove an item from a list, the remaining items smoothly animate to their new positions while the removed item fades out in place.

One important detail: when using `"popLayout"`, any custom component that's an immediate child of `AnimatePresence` must be wrapped in React's `forwardRef`, forwarding the ref to the DOM element you want to pop from the layout.

const ListItem = forwardRef(function ListItem({ children }, ref) {

return (

<motion.li ref={ref} layout exit=>

{children}

</motion.li>

)

})

## Choosing the right mode

Here's a quick decision guide:

| Scenario | Recommended mode |
| --- | --- |
| Full-screen page transitions | `sync` with absolute positioning |
| Step-by-step wizard | `wait` |
| Tab content switching | `wait` |
| Dynamic list items | `popLayout` with `layout` |
| Image gallery with captions | `sync` for images, `wait` for captions |
| Notification toasts | `popLayout` |

## See it in action

The example above demonstrates all three modes side by side. Click the "Switch" button and observe how each mode handles the transition differently:

- **sync**: Both circles animate simultaneously, briefly overlapping
- **wait**: The old circle exits completely before the new one enters
- **popLayout**: The exiting circle pops out of flow while animating out

Experiment with different animation properties and durations to see how each mode affects the overall feel of your transitions.