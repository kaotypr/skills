---
title: "Exit animation"
source: "https://motion.dev/tutorials/react-exit-animation?platform=react"
author:
published:
created: 2026-04-24
description: "Explore the official library of Motion (prev Framer Motion) tutorials for React, JavaScript, and Vue. Learn step-by-step from the creator of Motion and master web animation."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "animation"
  - "exit-animation"
  - "motion"
  - "animatepresence"
---
# React animation tutorials

## Summary
This tutorial demonstrates how to implement exit animations in React using Motion's AnimatePresence component. It covers setting up initial, animate, and exit states for smooth transitions when elements are removed from the DOM. The guide also touches upon adding tactile feedback to buttons with the whileTap prop.

## Key points
* Use `AnimatePresence` to animate elements as they are removed from the DOM.
* Define entry and exit animations using `initial`, `animate`, and `exit` props on `motion` components.
* A `key` prop is required on `motion` components within `AnimatePresence` for proper tracking.
* The `whileTap` prop can add interactive feedback to elements like buttons.

---

Matt Perry

In this tutorial, we're going to build the Exit animation example step-by-step.

This tutorial is rated beginner difficulty, which means we'll spend some time explaining the Motion APIs that we've chosen to use (and why), and also any browser APIs we encounter that might be unfamiliar to beginners.

Here's a live demo of the example we're going to be creating:

## Introduction

The Exit animation example shows how to animate an element before it's removed from the DOM. It uses the `AnimatePresence` component and `exit` prop from Motion for React to create smooth transitions when elements are removed.

CSS animations can only handle when elements appear, and even then only with the modern `@starting-style` [rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style). They can't handle when elements leave.

Whereas JS animations need careful orchestration to handle when elements leave.

`AnimatePresence` is a React component that makes it easy to animate elements when they exit.

## Get started

Let's start by creating a component with a box that can be toggled on and off:

```
"use client"

import { useState } from "react"

export default function ExitAnimation() {
    const [isVisible, setIsVisible] = useState(true)

    return (
        <div style={container}>
            {isVisible ? <div style={box} /> : null}
            <button style={button} onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? "Hide" : "Show"}
            </button>
        </div>
    )
}

/**
 * ==============   Styles   ================
 */

const container: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: 100,
    height: 160,
    position: "relative",
}

const box: React.CSSProperties = {
    width: 100,
    height: 100,
    backgroundColor: "#FF5449",
    borderRadius: "10px",
}

const button: React.CSSProperties = {
    backgroundColor: "#FF5449",
    borderRadius: "10px",
    padding: "10px 20px",
    color: "#000000",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
}
```

This creates a simple component with a red box and a button that toggles the box's visibility. Currently, the box just instantly appears and disappears when toggled.

## Let's animate!

### Import from Motion

To animate our box as it enters and exits, we need to import the necessary components from Motion for React:

```
import { AnimatePresence, motion } from "motion/react"
```

Let's replace our standard `div` with a `motion.div`:

```
{
    isVisible ? <motion.div style={box} /> : null
}
```

This alone won't give us exit animations. For that, we need to wrap our conditionally rendered element in `AnimatePresence`:

```
<AnimatePresence>
    {isVisible ? <motion.div style={box} /> : null}
</AnimatePresence>
```

### Animations

Now we can add our animation properties. We'll need:

1. An `initial` state for when the element first appears.
2. An `animate` state for its normal visible state.
3. An `exit` state for how it should animate out before being removed from the DOM by `AnimatePresence`.

```
<AnimatePresence initial={false}>
    {isVisible ? (
        <motion.div
            initial=
            animate=
            exit=
            style={box}
            key="box"
        />
    ) : null}
</AnimatePresence>
```

With these props:

- The box starts invisible and scaled down to nothing
- It animates to fully visible and full size when it appears
- When toggled off, it animates back to invisible and scaled down before being removed from the DOM

A couple important details:

- We set `initial={false}` on `AnimatePresence` to prevent the initial animation when the component first loads
- We added a `key` to our motion component, which is required for `AnimatePresence` to track elements properly

### Adding button animation

Let's also add a small animation to the button when it's pressed:

```
<motion.button
    style={button}
    onClick={() => setIsVisible(!isVisible)}
    whileTap=
>
    {isVisible ? "Hide" : "Show"}
</motion.button>
```

The `whileTap` prop moves the button down slightly when pressed, creating a satisfying tactile feel.

## Conclusion

In this tutorial, we learned how to:

- Create exit animations using the `AnimatePresence` component
- Define enter and exit animations with the `initial`, `animate`, and `exit` props
- Create a toggle effect with state and conditional rendering
- Add tactile feedback to interactive elements with `whileTap`

Motion for React makes it easy to add these polished transitions to your UI, improving the user experience by maintaining visual continuity when elements are added or removed.