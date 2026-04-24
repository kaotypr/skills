---
title: "Drag"
source: "https://motion.dev/tutorials/react-drag?platform=react"
author:
published:
created: 2026-04-24
description: "330+ examples for Motion (formerly Framer Motion). Full source code for React, JS, and Vue animations."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "motion"
  - "drag-and-drop"
  - "animation"
  - "frontend"
---
# Official Motion Examples | React, JS & Vue Animations

## Summary
This page is a beginner-level tutorial on how to implement draggable elements in React using the Motion library. It covers the basic `drag` prop and various customization options like axis constraints, momentum control, and visual feedback. The tutorial highlights Motion's advantages over raw browser APIs for creating interactive UIs.

## Key points
- The `drag` prop in Motion for React allows for easy implementation of draggable elements.
- Customization options include constraining movement to specific axes (`drag=\\"x\\"` or `drag=\\"y\\"`), setting boundaries (`dragConstraints`), controlling momentum (`dragMomentum`), and adding visual feedback (`whileDrag`).
- Motion simplifies drag-and-drop functionality compared to manual event handling, offering built-in features like momentum and boundary support.
- The tutorial is aimed at beginners and explains the APIs used in detail.

---

Matt Perry

In this tutorial, we're going to build the Drag example step-by-step.

This tutorial is rated beginner difficulty, which means we'll spend some time explaining the Motion APIs that we've chosen to use (and why), and also any browser APIs we encounter that might be unfamiliar to beginners.

Here's a live demo of the example we're going to be creating:

## Introduction

The Drag example shows how to make an element draggable with Motion for React. It uses the `drag` prop, which allows users to move elements around the page with mouse or touch input.

Compared to implementing draggable elements with raw browser APIs, Motion's `drag` prop provides several advantages:

- No need to manually track mouse/touch events
- Built-in momentum and boundaries
- Works seamlessly across desktop and mobile devices
- Automatically handles accessibility concerns

## Get started

Let's start by creating a simple box that we'll make draggable:

```
"use client"

export default function Drag() {
    return <div style={box} />
}

/**
 * ==============   Styles   ================
 */

const box = {
    width: 100,
    height: 100,
    backgroundColor: "#2f7cf8",
    borderRadius: 10,
}
```

This creates a blue square on the page, but it doesn't do anything yet.

## Let's animate!

### Import from Motion

To make our box draggable, we first need to import the `motion` component from Motion for React:

```
import { motion } from "motion/react"
```

### Basic functionality

Now we can replace the standard `div` with a `motion.div` and add the `drag` prop:

```
export default function Drag() {
    return <motion.div drag style={box} />
}
```

That's it! With that single `drag` prop, our box is now fully draggable. Users can click or touch the element and move it around the page.

By default, the draggable element will:

- Be movable in any direction (both horizontal and vertical)
- Have a natural momentum when released
- Return to its initial position when the component re-renders

### Customizing the drag behavior

While the basic drag functionality is powerful, you can customize it in many ways:

#### Constraining to an axis

If you want to restrict movement to just horizontal or vertical:

```
// Only horizontal dragging
<motion.div drag="x" style={box} />

// Only vertical dragging
<motion.div drag="y" style={box}
```

#### Adding constraints

You can limit how far the element can be dragged:

```
<motion.div
    drag
    dragConstraints=
    style={box}
/>
```

This keeps the element within 50 pixels of its starting position in all directions.

#### Controlling momentum

By default, elements have a natural momentum when released. You can disable this:

```
<motion.div drag dragMomentum={false} style={box} />
```

#### Visual feedback during drag

You can also add visual effects while the element is being dragged:

```
<motion.div drag whileDrag= style={box} />
```

This makes the element grow slightly while being dragged.

## Conclusion

In this tutorial, we learned how to:

- Make elements draggable with the `drag` prop
- Constrain movement to specific axes
- Set boundaries for how far elements can be dragged
- Control momentum behavior
- Add visual feedback during dragging

Motion for React makes creating draggable UIs much simpler than traditional methods, requiring minimal code while providing a polished, natural-feeling user experience.