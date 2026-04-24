---
title: "Gestures"
source: "https://motion.dev/tutorials/react-gestures?platform=react"
author:
published:
created: 2026-04-24
description: "330+ examples for Motion (formerly Framer Motion). Full source code for React, JS, and Vue animations."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "animation"
  - "gestures"
  - "tutorial"
  - "interactive-elements"
---
# Official Motion Examples | React, JS & Vue Animations

## Summary
This page is a beginner-friendly tutorial on creating interactive animations using Motion for React. It explains how to use `whileHover` and `whileTap` props to add responsive effects like scaling and rotation to UI elements. The tutorial covers basic implementation, customization with transitions, and highlights the benefits of Motion's pointer filtering and keyboard accessibility.

## Key points
- Use `whileHover` and `whileTap` props from Motion for React to create interactive animations in response to user hovering and tapping.
- Motion's gesture props offer advantages like pointer filtering and automatic keyboard accessibility.
- Customize animations by adding multiple properties (scale, rotate, color) and defining transitions, including spring animations.
- Motion makes it easy to add engaging, responsive animations with minimal code.

---

Matt Perry

In this tutorial, we're going to build the Gestures example step-by-step.

This tutorial is rated beginner difficulty, which means we'll spend some time explaining the Motion APIs that we've chosen to use (and why), and also any browser APIs we encounter that might be unfamiliar to beginners.

Here's a live demo of the example we're going to be creating:

## Introduction

The Gestures example shows how to animate an element in response to user interactions like hovering and tapping. It uses the `whileHover` and `whileTap` props from Motion for React to create intuitive interactive animations.

Motion's `whileHover` and `whileTap` functions provide a couple of key advantages over traditional event listeners, beyond the power of Motion's spring animations and independent transform animations:

#### Pointer filtering

Normal pointer events fire for all pointers, whereas `whileHover` will filter out touch events and `whileTap` will filter out secondary pointers (right-click, secondary touch, etc.).

#### Keyboard accessibility

When `whileTap` is attached to an element, it will automatically become keyboard accessible. This means it can receive focus, and be pressed via the enter key. This ensures that keyboard users get the same great experience as pointer users.

## Get started

Let's start by creating a simple colored box without any animations:

```
export default function Gestures() {
    return <div style={box} />
}

/**
 * ==============   Styles   ================
 */

const box = {
    width: 100,
    height: 100,
    backgroundColor: "#46CF76",
    borderRadius: 5,
}
```

This creates a green square on the page, but it doesn't respond to any user interactions yet.

## Let's animate!

### Import from Motion

To add gesture animations to our box, we first need to import the `motion` component from Motion for React:

```
import * as motion from "motion/react-client"
```

### Basic functionality

Now we can replace the standard `div` with a `motion.div`:

```
export default function Gestures() {
    return <motion.div style={box} />
}
```

To create gesture animations, we use the `whileHover` and `whileTap` props. These define values to animate to while the gestures are active.

```
export default function Gestures() {
    return (
        <motion.div
            whileHover=
            whileTap=
            style={box}
        />
    )
}
```

With these props:

- `whileHover`: When the user hovers over the box, it will scale up to 1.2 times its original size
- `whileTap`: When the user clicks or taps the box, it will scale down to 0.8 times its original size

These animations happen automatically when the respective gestures are detected, and they smoothly reverse when the gesture ends.

### Customizing gesture animations

You can customize gesture animations further by adding more properties or providing a `transition` prop:

```
export default function Gestures() {
    return (
        <motion.div
            whileHover=
            whileTap=
            transition=
            style={box}
        />
    )
}
```

This version adds rotation and color changes to the gesture animations, and uses a default spring transition for more natural movement. `whileHover` receives a specific `transition` that will trigger when the gesture starts.

Motion has several other convenient props for gesture animations, like `whileDrag`, `whileInView`, and `whileFocus`.

## Conclusion

In this tutorial, we learned how to:

- Create hover animations with the `whileHover` prop
- Create tap/click animations with the `whileTap` prop
- Define animation states using JavaScript objects
- Combine multiple animation properties for richer interactions

Motion for React makes it easy to add engaging, interactive animations to your UI elements, creating a more dynamic and responsive user experience with minimal code.