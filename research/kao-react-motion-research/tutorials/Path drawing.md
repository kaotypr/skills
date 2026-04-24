---
title: "Path drawing"
source: "https://motion.dev/tutorials/react-path-drawing?platform=react"
author:
published:
created: 2026-04-24
description: "Explore the official library of Motion (prev Framer Motion) tutorials for React, JavaScript, and Vue. Learn step-by-step from the creator of Motion and master web animation."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "svg-animation"
  - "motion"
  - "path-drawing"
  - "javascript"
---
# React animation tutorials

## Summary
This tutorial guides users through creating a path drawing animation effect using Motion for React and SVGs. It explains how to utilize variants and the motion component to animate SVG paths, focusing on the `pathLength` property for a drawing effect. The lesson covers setting up SVG elements, defining animation variants, and applying them to achieve staggered and visually appealing animations.

## Key points
- Use the `motion` component from Motion for React to animate SVG elements.
- Leverage the `pathLength` property to create a drawing animation effect for SVG paths.
- Implement staggered animations using variants and the `custom` prop to control animation delays.
- Coordinate multiple SVG animations to produce a sophisticated drawing effect.

---

Matt Perry

In this tutorial, we're going to build the Path drawing example step-by-step.

This example is rated intermediate difficulty, which means we'll spend some time explaining the Motion APIs we've chosen to use, but it assumes familiarity with JavaScript as a language.

Here's a live demo of the example we're going to be creating:

## Introduction

The Path Drawing example shows how to create a drawing animation effect using SVGs and Motion for React.

In this tutorial, we'll use the `variants` and `motion` component from Motion for React to create a staggered animation effect across multiple SVG elements.

## Get started

Let's start by setting up our SVG container and shapes without animation:

```
import React from "react"

export default function PathDrawing() {
    return (
        <svg
            width="600"
            height="600"
            viewBox="0 0 600 600"
            style=
        >
            <circle
                cx="100"
                cy="100"
                r="80"
                stroke="#FF0055"
                style=
            />
            <line
                x1="220"
                y1="30"
                x2="360"
                y2="170"
                stroke="#7700FF"
                style=
            />
            {/* More shapes would go here */}
        </svg>
    )
}
```

This creates a basic SVG with circle, cross and square shapes.

## Let's animate!

Now let's bring our SVG to life by adding animations.

### Import from Motion

First, import the `motion` component from Motion for React:

```
import { motion } from "motion/react"
```

### Creating the animation variants

Next, we'll define how our paths should animate. We'll create variants that control the `pathLength` property, which determines how much of the path is drawn (`0` = none, `1` = all):

```
const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
        const delay = i * 0.5
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay, duration: 0.01 },
            },
        }
    },
}
```

Let's break down what's happening:

- The `hidden` state sets `pathLength: 0` (nothing drawn) and `opacity: 0` (invisible).
- The `visible` state is a function that accepts a custom index parameter (`i`). We'll pass this in to each `motion.path` via its `custom` prop.
- The delay is calculated based on this index, creating a staggered effect.

### Applying the animation

Now, let's convert our SVG elements to `motion` components and apply our animation:

```
export default function PathDrawing() {
    return (
        <motion.svg
            width="600"
            height="600"
            viewBox="0 0 600 600"
            initial="hidden"
            animate="visible"
            style=
        >
            <motion.circle
                cx="100"
                cy="100"
                r="80"
                stroke="#FF0055"
                variants={draw}
                custom={1}
                style=
            />
            <motion.line
                x1="220"
                y1="30"
                x2="360"
                y2="170"
                stroke="#7700FF"
                variants={draw}
                custom={2}
                style=
            />
            {/* More shapes would go here */}
        </motion.svg>
    )
}
```

You can see each `path` gets its own `index`, which we use to calculate a staggered delay. The container switches the variant for all its children from `"hidden"` to `"visible"`.

## Conclusion

In this tutorial, we learned how to:

1. Animate SVG paths using the `pathLength` property
2. Create staggered animations using `variants` and the `custom` prop
3. Coordinate multiple animations to create a complex drawing effect

The `pathLength` property is especially powerful for SVG animations, as it gives the appearance of drawing each shape stroke by stroke. Combined with Motion's animation capabilities, it creates visually appealing drawing effects that would be difficult to achieve with CSS alone.

This technique works with any SVG element that has a stroke, including circles, lines, rectangles, and complex paths. Try experimenting with different timing values, transition types, and SVG shapes to create your own unique drawing animations!