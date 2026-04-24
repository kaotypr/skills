---
title: "Transition options"
source: "https://motion.dev/tutorials/react-transition?platform=react"
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
  - "tutorial"
  - "transition-options"
---
# React animation tutorials

## Summary
This tutorial guides beginners through using Motion's transition options to create engaging entrance animations for a circle component. It covers controlling animation duration, adding delays, and implementing custom easing for a more dynamic effect. By following the step-by-step examples, users can learn to enhance their UI interactions with polished and responsive animations.

## Key points
- Motion's `transition` prop allows fine-grained control over animation timing, duration, and delay.
- The `duration` option sets the animation's length in seconds.
- The `delay` option introduces a pause before the animation begins.
- Custom easing curves can be defined using an array of numbers, creating unique motion effects.

---

Matt Perry

In this tutorial, we're going to build the Transition options example step-by-step.

This tutorial is rated beginner difficulty, which means we'll spend some time explaining the Motion APIs that we've chosen to use (and why), and also any browser APIs we encounter that might be unfamiliar to beginners.

Here's a live demo of the example we're going to be creating:

## Introduction

The Transition example shows how to adjust animations using Motion's transition options. With Motion, you can precisely control the timing, easing, and delay of your animations to create polished UI interactions.

## Get started

Let's start with a basic circle component:

export default function TransitionOptions() {

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

### Creating the entrance animation

Let's start with a simple fade and scale animation:

```
<motion.div
    style={ball}
    initial=
    animate=
/>
```

This creates a basic animation where our circle:

- Starts invisible (`opacity: 0`) and at half size (`scale: 0.5`)
- Animates to fully visible (`opacity: 1`) and full size (`scale: 1`)

### Adding duration

We can control how long the animation takes using the `duration` option:

```
<motion.div
    style={ball}
    initial=
    animate=
    transition=
/>
```

Now our animation takes exactly `0.8` seconds to complete.

### Adding a delay

We can make the animation start after a short pause using the `delay` option:

```
<motion.div
    style={ball}
    initial=
    animate=
    transition=
/>
```

The animation now waits `0.5` seconds before starting.

### Custom easing

Finally, let's add a custom easing curve to make the animation more dynamic:

```
<motion.div
    style={ball}
    initial=
    animate=
    transition=
/>
```

The `ease` array `[0, 0.71, 0.2, 1.01]` creates a custom "bounce" effect:

- The animation starts fast
- Overshoots slightly
- Settles back to its final position

This creates a more playful and engaging entrance animation than a linear transition would.

## Conclusion

In this tutorial, we learned how to:

- Create basic entrance animations with `initial` and `animate`
- Control animation duration for precise timing
- Add delays to stagger animation starts
- Create custom easing curves for more dynamic motion