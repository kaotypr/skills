---
title: "HTML content"
source: "https://motion.dev/tutorials/react-html-content?platform=react"
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
  - "numerical-animation"
---
# React animation tutorials

## Summary
This page is a tutorial on creating animated numerical content in React using Motion's `useMotionValue` and `useTransform` hooks. It demonstrates how to bypass React's state updates for better performance by directly animating DOM nodes. The tutorial guides beginners through importing necessary functions, creating motion values, transforming them, and displaying the animated content.

## Key points
- Use `useMotionValue` to track numerical data that can be animated.
- Employ `useTransform` to derive new values from existing motion values, like rounding.
- Leverage Motion's `animate` function for performant animations that bypass React's diffing algorithm.
- Utilize `useEffect` to manage the animation's lifecycle (start and cleanup).
- Display animated values directly within a `motion` component for optimal performance.

---

Matt Perry

In this tutorial, we're going to build the HTML content example step-by-step.

This tutorial is rated beginner difficulty, which means we'll spend some time explaining the Motion APIs that we've chosen to use (and why), and also any browser APIs we encounter that might be unfamiliar to beginners.

Here's a live demo of the example we're going to be creating:

## Introduction

The HTML Content example shows how to animate numerical content in React without animating React state. This is much better for performance.

The magic is in the `motion` [component's](https://motion.dev/docs/react-motion-component) ability to render [motion values](https://motion.dev/docs/react-motion-value). This bypasses React's diffing algorithm, and assigns the value of the motion value to the DOM node directly.

## Get started

Let's start with a basic component structure:

export default function HTMLContent() {

return <pre style=>0</pre>

}

## Let's animate!

### Import from Motion

First, we'll import the necessary hooks and functions from Motion:

import { animate, motion, useMotionValue, useTransform } from "motion/react"

### Creating the animation

1. Create a motion value to track our counter:

const count = useMotionValue(0)

2. Use `useTransform` to round the number as it animates:

const rounded = useTransform(() => Math.round(count.get()))

3. Start the animation when the component mounts using Motion's `animate` function:

useEffect(() => {

const controls = animate(count, 100, { duration: 5 })

return () => controls.stop()

}, \[\])

4. Display the animated value using a `motion.pre` component:

return <motion.pre style={text}>{rounded}</motion.pre>

## Conclusion

In this tutorial, we learned how to:

- Create an animated counter using `useMotionValue`
- Transform motion values into new values with `useTransform`
- Start and clean up animations with `useEffect`
- Display animated numerical content in a React component