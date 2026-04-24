---
title: "Parallax"
source: "https://motion.dev/tutorials/react-parallax?platform=react"
author:
published:
created: 2026-04-24
description: "Explore the official library of Motion (prev Framer Motion) tutorials for React, JavaScript, and Vue. Learn step-by-step from the creator of Motion and master web animation."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "animation"
  - "parallax"
  - "scroll-animation"
  - "motion-dev"
---
# React animation tutorials

## Summary
This tutorial demonstrates how to create a parallax scrolling effect using Motion for React. It covers using hooks like `useScroll`, `useTransform`, and `useSpring` to link animations to scroll progress. The final result is a visually engaging and performant scroll-based animation.

## Key points
- Utilize `useScroll` to track scroll progress for the entire page or specific elements.
- Employ `useTransform` within a custom hook (`useParallax`) to map scroll progress to element position.
- Enhance animations with `useSpring` for smoother, physics-based movement.
- Apply animations to DOM elements using the `motion` component.
- Combine scroll-snapping CSS with Motion animations for a polished user experience.

---

Matt Perry

In this tutorial, we're going to build the Parallax example step-by-step.

This example is rated intermediate difficulty, which means we'll spend some time explaining the Motion APIs we've chosen to use, but it assumes familiarity with JavaScript as a language.

Here's a live demo of the example we're going to be creating:

## Introduction

The Parallax example shows how to create a scroll-linked animation where elements move at different speeds based on scroll position. It uses several features from Motion for React to create a dynamic, scroll-based UI:

- The `useScroll` hook to track scroll progress
- The `useTransform` hook to convert scroll progress into position values
- The `useSpring` hook to add physics-based smoothing
- The `motion` component to apply these animations to DOM elements

Parallax effects are a popular technique for adding depth and visual interest to websites, and with Motion for React, implementing them becomes straightforward and performant.

## Get started

Let's begin with the basic structure of our example:

```
"use client"

import { motion } from "motion/react"
import { useRef } from "react"

function Image({ id }: { id: number }) {
    return (
        <section className="img-container">
            <div>
                <img
                    src={\`/photos/cityscape/${id}.jpg\`}
                    alt="A London skyscraper"
                />
            </div>
            <h2>{\`#00${id}\`}</h2>
        </section>
    )
}

export default function Parallax() {
    return (
        <div id="example">
            {[1, 2, 3, 4, 5].map((image) => (
                <Image key={image} id={image} />
            ))}
            <div className="progress" />
            <StyleSheet />
        </div>
    )
}

/** Copy styles from source */
```

This setup creates a scrollable page with five images stacked vertically. Each image takes up the full viewport height, and we're using CSS scroll snapping to ensure that each section aligns nicely with the viewport when scrolling.

```
html {
    scroll-snap-type: y mandatory;
}
```

## Let's animate!

Now, let's add the animation logic that will create the parallax effect.

### Import from Motion

First, let's update our imports to include all the Motion hooks we'll need:

```
import {
    motion,
    MotionValue,
    useScroll,
    useSpring,
    useTransform,
} from "motion/react"
import { useRef } from "react"
```

### Creating the parallax effect

Let's create a custom hook that will generate our parallax effect. This hook will take a `MotionValue` representing scroll progress and a distance value to determine how far the element should move:

```
function useParallax(value: MotionValue<number>, distance: number) {
```

This hook uses `useTransform` to map the scroll progress (which ranges from 0 to 1) to a position value that ranges from `-distance` to `distance`.

### Tracking scroll for each image

Now, let's update our `Image` component to track scroll progress:

```
function Image({ id }: { id: number }) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({ target: ref })
```

By setting `target` to the component's `ref`, this will track the progress of the element through the viewport.

We can then link that progress to `y` with our `useParallax` hook from before:

```
const { scrollYProgress } = useScroll({ target: ref })
    const y = useParallax(scrollYProgress, 300)

    return (
        <section className="img-container">
            <div ref={ref}>
                <img
                    src={\`/photos/cityscape/${id}.jpg\`}
                    alt="A London skyscraper"
                />
            </div>
            <motion.h2
                // Hide until scroll progress is measured
                initial=
                animate=
                style=
            >{\`#00${id}\`}</motion.h2>
        </section>
    )
}
```

### Creating a smooth progress indicator

Finally, let's update our `Parallax` component to add a progress bar that tracks overall scroll progress:

```
export default function Parallax() {
    const { scrollYProgress } = useScroll()

    return (
        <div id="example">
            {[1, 2, 3, 4, 5].map((image) => (
                <Image key={image} id={image} />
            ))}
            <motion.div
                className="progress"
                style=
            />
            <StyleSheet />
        </div>
    )
}
```

`useScroll` without any arguments will track the progress of the scroll of the entire page.

By passing this straight to the `"progress"`, we get an animation that is linked very directly to scroll. We can smooth this with the `useSpring` motion value, passing this new motion value to `"progress"` instead:

```
const { scrollYProgress } = useScroll()
const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
})
```

By default, elements have a `transform-origin` that's in the center of the element. This means our progress bar will grow out from the center. We can grow out from (for instance) the left by setting `originX` to `0`:

```
<motion.div className="progress" style= />
```

## Conclusion

In this tutorial, we've learned how to create a parallax scrolling effect using Motion for React. The key concepts we've covered include:

1. Using `useScroll` to track scroll progress both for the entire page and for individual elements
2. Creating a custom `useParallax` hook with `useTransform` to map scroll progress to position values
3. Applying spring physics to scroll animations with `useSpring` for a more natural feel
4. Using the `motion` component to apply dynamic styles based on scroll position

The combination of CSS scroll-snapping and Motion's scroll-based animations creates a modern, interactive experience that adds depth and visual interest to what would otherwise be a simple scrolling gallery.