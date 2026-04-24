---
title: "CSS spring"
source: "https://motion.dev/tutorials/react-css-spring?platform=react"
author:
published:
created: 2026-04-24
description: "330+ examples for Motion (formerly Framer Motion). Full source code for React, JS, and Vue animations."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "css-animation"
  - "motion-ui"
  - "physics-animation"
  - "developer-tutorial"
---
# Official Motion Examples | React, JS & Vue Animations

## Summary
This tutorial demonstrates how to create CSS spring animations in React using the Motion library. It covers implementing these animations client-side, server-side, and even through AI generation. The guide emphasizes the benefits of physics-based animations for creating natural and engaging user interfaces.

## Key points
- Motion's `spring` function can create physics-based CSS animations.
- It can be integrated client-side, server-side, or via AI generation.
- The `spring` function parameters control perceived duration and bounciness.
- Spring animations result in more natural and responsive UI transitions.

---

Matt Perry

In this tutorial, we're going to build the CSS spring example step-by-step.

This tutorial is rated beginner difficulty, which means we'll spend some time explaining the Motion APIs that we've chosen to use (and why), and also any browser APIs we encounter that might be unfamiliar to beginners.

Here's a live demo of the example we're going to be creating:

## Introduction

The CSS spring example shows how to create natural-feeling CSS-only transitions using spring physics in React.

In this tutorial, we'll learn to use the `spring` function from Motion to generate a `linear()` easing spring.

We'll do so in three ways:

1. Client-side (easiest)
2. Server-only
3. AI generation

## Get started

Let's start with the basic structure and functionality of our component:

"use client"

import { useState } from "react"

export default function SpringBox() {

const \[state, setState\] = useState(false)

return (

<div className="example-container">

<div className="box" data-state={state} />

<button onClick={() => setState(!state)}>Toggle position</button>

<style>{\`/\* Copy from example source code \*/\`}</style>

</div>

)

}

We're using React's `useState` to create a state that moves the box between two positions. This state is toggled when the button is clicked.

If you try this code, you'll see that the box moves smoothly between the two positions. However, the animation uses a basic easing curve, which doesn't feel as natural as a spring-based animation would.

## Let's animate!

Now we'll transform this basic animation into a spring animation.

### Import from Motion

First, let's import the `spring` function from Motion:

import { spring } from "motion"

### Animation

Now let's replace the standard CSS transition with a spring animation:

.example-container.box {

width: 100px;

height: 100px;

background-color: #0055ff;

border-radius: 10px;

transition: transform ${spring(0.5, 0.8)};

transform: translateX(-100%);

}

We've replaced `transition: transform 0.3s ease` with `transition: transform ${spring(0.5, 0.8)}`.

`spring` accepts two parameters:

- The first parameter (`0.5`) controls the perceived duration of the spring, in seconds.
- The second parameter (`0.8`) controls the bounciness of the spring. `0` is no bounce, `1` is maximum bounce.

`spring` can be used to sample points on a string, but by passing it into a string it returns a calculated duration and [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear) `linear()` [easing function](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear).

The reason why duration is considered a **perceived duration** is because this is roughly the amount of time it takes for the animation to complete, disregarding the bounciness of the spring.

This makes it easier to reason about the animation and synchronize it with other animations. If you want to make the spring bouncier, you can simply change the second parameter, while leaving the duration the same.

## Server components

By importing `spring` in this way, we're still including `spring()` in the bundle shipped to users.

It's also possible to generate a spring purely on the server. By passing our generated spring in from a server component (a React Server Component without the `"use client"` declaration) we can pass the generated duration and ease in as a string:

<Box spring={spring(0.5, 0.8)} />

Then back in our CSS:

.example-container.box {

width: 100px;

height: 100px;

background-color: #0055ff;

border-radius: 10px;

transition: transform ${spring};

transform: translateX(-100%);

}

## AI generation

Finally, it's also possible to generate a spring without including Motion at all. Using Motion for AI's [spring generation](https://motion.dev/docs/ai-generate-css-springs-and-easings-llm) we can simply describe a spring to our LLM and it'll use Motion's `spring` function to generate a duration and `linear()` easing curve directly into your code.

## Conclusion

In this tutorial, we've learned how to:

- Use the `spring` function to create physics-based animations in CSS.
- Apply spring animations to CSS transitions.
- Control spring behavior by adjusting duration and bounciness values.

Spring animations are perfect for creating more natural, engaging UIs. They're especially useful for transitional actions, like the one in this example, where elements need to physically move between defined states in a way that feels responsive.