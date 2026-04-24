---
title: "Enter animation"
source: "https://motion.dev/tutorials/react-enter-animation?platform=react"
author:
published:
created: 2026-04-24
description: "330+ examples for Motion (formerly Framer Motion). Full source code for React, JS, and Vue animations."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "animation"
  - "tutorial"
  - "motion"
  - "enter-animation"
---
# Official Motion Examples | React, JS & Vue Animations

## Summary
This tutorial guides you through creating an \\"Enter\\" animation using Motion for React. It explains how to use the `initial` and `animate` props to define element states and the `transition` prop to customize animation behavior, including spring effects. The lesson is beginner-friendly, focusing on core Motion APIs and leading to a smooth, animated entrance for UI elements.

## Key points
- Use `initial` and `animate` props to define the start and end states of an animation.
- Customize animation properties like duration, type, and bounce using the `transition` prop.
- Replace standard HTML elements with `motion` components (e.g., `motion.div`) to enable animation.
- Spring animations can create more natural and lively effects than standard easing curves.

---

Matt Perry

In this tutorial, we're going to build the Enter animation example step-by-step.

This tutorial is rated beginner difficulty, which means we'll spend some time explaining the Motion APIs that we've chosen to use (and why), and also any browser APIs we encounter that might be unfamiliar to beginners.

Here's a live demo of the example we're going to be creating:

## Introduction

The Enter animation example shows how to animate an element when it first appears on the page. It uses the `initial` and `animate` props from Motion for React to create a smooth entrance effect.

CSS animations can only handle when elements appear, and even then only with the modern `@starting-style` [rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style).

## Get started

Let's start by creating a simple ball component without any animations:

```
export default function EnterAnimation() {
    return <div style={ball} />
}

/**
 * ==============   Styles   ================
 */

const ball = {
    width: 100,
    height: 100,
    backgroundColor: "#5686F5",
    borderRadius: "50%",
}
```

This creates a blue circle on the page, but it just appears instantly without any animation.

## Let's animate!

### Import from Motion

To animate our ball, we first need to import the `motion` component from Motion for React:

```
import * as motion from "motion/react-client"
```

### Basic functionality

Now we can replace the standard `div` with a `motion.div`:

```
export default function EnterAnimation() {
    return <motion.div style={ball} />
}
```

To create an enter animation, we need to define:

1. An initial state for the element before animation starts
2. The final state we want it to animate to

We do this using the `initial` and `animate` props:

```
export default function EnterAnimation() {
    return (
        <motion.div
            initial=
            animate=
            style={ball}
        />
    )
}
```

### Customizing the animation

We can further customize how the animation behaves using the `transition` prop:

```
export default function EnterAnimation() {
    return (
        <motion.div
            initial=
            animate=
            transition=
            style={ball}
        />
    )
}
```

This creates a pleasant bouncy effect as the ball appears, making it feel more lively and natural than a typical CSS easing curve.

## Conclusion

In this tutorial, we learned how to:

- Create enter animations using the `initial` and `animate` props
- Define different animation states using JavaScript objects
- Customize animations with the `transition` prop
- Use spring animations for more natural movement

Motion for React makes creating entrance animations straightforward, allowing you to add polish to your UI with minimal code.