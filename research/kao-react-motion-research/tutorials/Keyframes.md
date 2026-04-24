---
title: "Keyframes"
source: "https://motion.dev/tutorials/react-keyframes?platform=react"
author:
published:
created: 2026-04-24
description: "Explore the official library of Motion (prev Framer Motion) tutorials for React, JavaScript, and Vue. Learn step-by-step from the creator of Motion and master web animation."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "animation"
  - "keyframes"
  - "motion"
  - "tutorial"
---
# React animation tutorials

## Summary
This tutorial guides beginners through creating complex, multi-step animations in React using Motion's keyframes feature. It explains how to define sequences of values for properties like scale and rotation, customize animation timing, and create looping effects. The article concludes by highlighting the benefits of Motion+ for accessing more advanced features and examples.

## Key points
- Motion's `keyframes` feature allows for complex, multi-step animations by defining arrays of values for CSS properties.
- You can animate multiple properties simultaneously within a single `motion.div` component.
- The `transition` prop, specifically the `times` array, enables fine-grained control over the timing of each keyframe.
- The `repeat` and `repeatDelay` properties can be used to create looping animations with pauses between cycles.
- Motion+ offers access to a larger library of examples, premium APIs, and tools for advanced animation development.

---

Matt Perry

In this tutorial, we're going to build the Keyframes example step-by-step.

This tutorial is rated beginner difficulty, which means we'll spend some time explaining the Motion APIs that we've chosen to use (and why), and also any browser APIs we encounter that might be unfamiliar to beginners.

Here's a live demo of the example we're going to be creating:

## Introduction

The Keyframes example shows how to create complex multi-step animations in React using Motion's keyframes feature. With keyframes, you can define a sequence of values that your animation will progress through, creating rich and engaging animations.

Keyframes are simple to define, with an array syntax:

x: \[0, 100, 100, 50\]

This will animate the `x` property from `0` to `100`, then back to `50`.

## Get started

Let's start with a basic square component:

export default function Keyframes() {

return (

<div

style=

/>

)

}

## Let's animate!

### Import from Motion

First, we'll import Motion:

```
import * as motion from "motion/react-client"
```

Now we can convert our square to a `motion.div`:

```
<motion.div style={box} />
```

### Creating the keyframe animation

To create our complex animation, we'll use the `animate` prop to define arrays of values for different properties:

```
<motion.div
    animate=
    style={box}
/>
```

We can customise the animation by adding a `transition` prop:

```
transition=
```

The `times` array here adjusts when the timing of each keyframe occurs in the animation, where `0` is the start of the animation and `1` is the end. By default, keyframes are evenly spaced throughout the duration of the animation.

The `repeat` property makes the animation loop forever, and the `repeatDelay` property adds a 1-second pause between each loop.

## Conclusion

In this tutorial, we learned how to:

- Create multi-step animations using keyframe arrays
- Animate multiple properties simultaneously
- Control the timing of keyframes using the `times` array
- Create infinite animation loops with delays