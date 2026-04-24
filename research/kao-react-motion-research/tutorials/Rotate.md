---
title: "Rotate"
source: "https://motion.dev/tutorials/react-rotate?platform=react"
author:
published:
created: 2026-04-24
description: "Explore the official library of Motion (prev Framer Motion) tutorials for React, JavaScript, and Vue. Learn step-by-step from the creator of Motion and master web animation."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "motion"
  - "animation"
  - "tutorial"
  - "javascript"
---
# React animation tutorials

## Summary
This page is a beginner-level tutorial on creating a rotation animation in React using the Motion library. It guides users step-by-step through animating a square component, explaining the use of `animate` and `transition` props. The tutorial emphasizes Motion's declarative API for handling transform properties and concludes by offering a premium subscription for more content.

## Key points
- Learn to create basic rotation animations in React using Motion.
- Understand how to use the `animate` prop for target values and the `transition` prop for timing.
- Discover how Motion simplifies complex transform animations.
- Explore options for upgrading to Motion+ for additional tutorials and features.

---

Matt Perry

In this tutorial, we're going to build the Rotate example step-by-step.

This tutorial is rated beginner difficulty, which means we'll spend some time explaining the Motion APIs that we've chosen to use (and why), and also any browser APIs we encounter that might be unfamiliar to beginners.

Here's a live demo of the example we're going to be creating:

## Introduction

The Rotate example shows how to create a simple rotation animation in React using Motion. This example demonstrates the basics of animating independent transform properties with Motion's declarative API.

## Get started

Let's start with a basic square component:

export default function Rotate() {

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

### Creating the rotation animation

First, let's change our square to a `motion.div`:

```
<motion.div style={box} />
```

This will allow us to animate the `div` 's `rotate` property via the `animate` prop.

```
<motion.div
    style={box}
    animate=
    transition=
/>
```

By default, `rotate` is animated using a `spring` easing function.

We can change this by passing a `transition` prop:

```
transition=
```

This will animate the `rotate` property using a linear easing function, or Motion's other [transition options](https://motion.dev/docs/react-transitions).

## Conclusion

In this tutorial, we learned how to:

- Create a basic rotation animation using Motion
- Use the `animate` prop to declare our target values
- Control animation timing with the `transition` prop
- Let Motion handle complex transform calculations automatically