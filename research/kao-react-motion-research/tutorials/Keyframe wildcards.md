---
title: "Keyframe wildcards"
source: "https://motion.dev/tutorials/react-keyframes-wildcards?platform=react"
author:
published:
created: 2026-04-24
description: "Explore the official library of Motion (prev Framer Motion) tutorials for React, JavaScript, and Vue. Learn step-by-step from the creator of Motion and master web animation."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "animation"
  - "motion"
  - "keyframes"
  - "tutorial"
  - "hover-animations"
---
# React animation tutorials

## Summary
This tutorial explains how to use Motion's wildcard keyframes to create interruptible hover animations. By setting the initial keyframe to `null`, the animation starts from the element's current state, allowing for smoother interactions. The guide also covers controlling keyframe timing and easing for more precise animation control.

## Key points
- Wildcard keyframes (`null`) allow animations to start from the element's current property value, making them interruptible.
- The `times` array enables precise control over when each keyframe is reached within the animation duration.
- Different easing functions can be applied to individual segments of a keyframe animation.
- Wildcard keyframes enhance user experience by creating smoother, more responsive hover effects.

---

Matt Perry

In this tutorial, we're going to build the Keyframe wildcards example step-by-step.

This tutorial is rated beginner difficulty, which means we'll spend some time explaining the Motion APIs that we've chosen to use (and why), and also any browser APIs we encounter that might be unfamiliar to beginners.

Here's a live demo of the example we're going to be creating:

## Introduction

The Wildcard Keyframes example shows how to create interruptible hover animations using Motion's wildcard keyframe feature.

A "wildcard" keyframe is any keyframe that is `null`.

When the initial keyframe is `null`, Motion will use the current value of the property as the starting point. This allows even keyframe animations to be interruptible, unlike CSS keyframes.

## Get started

Let's start with a basic component:

export default function WildcardKeyframes() {

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

### Creating the wildcard animation

First, let's create a basic hover animation with wildcard keyframes:

```
<motion.div
    style={box}
    whileHover=
    transition=
/>
```

The `scale` array starts with `null`, which means "use whatever the current scale value is". The animation then progresses through two stages: first from the current value to `1.1`, then from `1.1` to `1.6`.

### Controlling keyframe timing

Now, let's add precise control over **when** each keyframe occurs. By default, keyframes are evenly spaced throughout the duration of the animation.

By adding a `times` array, we can control the exact timing of each keyframe:

```
<motion.div
    style={box}
    whileHover=
    transition=
/>
```

The `times` array gives us fine-grained control:

- `0`: Start from the current scale (our `null` value)
- `0.6`: Reach scale of `1.1` at 60% of the animation
- `1`: Finish at scale `1.6` at the end of the animation

We can also specify different easing functions for each segment:

- `"easeInOut"` for the first segment (current scale to `1.1`)
- `"easeOut"` for the second segment (`1.1` to `1.6`)

## Conclusion

In this tutorial, we learned how to:

- Create interruptible hover animations using wildcard keyframes
- Define multi-step animations with precise timing control
- Use different easing functions for different segments of an animation
- Create smooth transitions back to the initial state