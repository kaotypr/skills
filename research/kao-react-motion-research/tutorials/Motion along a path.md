---
title: "Motion along a path"
source: "https://motion.dev/tutorials/react-motion-path?platform=react"
author:
published:
created: 2026-04-24
description: "Explore the official library of Motion (prev Framer Motion) tutorials for React, JavaScript, and Vue. Learn step-by-step from the creator of Motion and master web animation."
tags:
  - "clippings"
  - "docs"
  - "react"
  - "motion"
  - "svg-animation"
  - "css-animations"
  - "path-animation"
---
# React animation tutorials

## Summary
This tutorial demonstrates how to animate elements along an SVG path using Motion for React. It covers animating the drawing of the SVG path itself and simultaneously moving an element along that path. The process involves using Motion's `pathLength` style for drawing and CSS `offset-path` with `offset-distance` for movement, synchronized via a shared transition.

## Key points
- Animate SVG path drawing using `pathLength` with values from 0 to 1.
- Move elements along an SVG path using CSS `offset-path` and animating `offset-distance`.
- Synchronize path drawing and element movement animations using a shared `transition` object.
- Understand browser quirks with `pathLength` and line caps, using `0.001` instead of `0`.

---

Matt Perry

In this tutorial, we're going to build the Motion along a path example step-by-step.

This example is rated intermediate difficulty, which means we'll spend some time explaining the Motion APIs we've chosen to use, but it assumes familiarity with JavaScript as a language.

Here's a live demo of the example we're going to be creating:

## Introduction

The Motion Path example shows how to animate elements along a pre-defined path using Motion for React.

In this tutorial, we'll learn how to use the `animate` prop to animate both the drawing of an SVG path using Motion's convenient `pathLength` style, and move an element along that same path.

## Get started

Let's start by creating the basic structure of our example:

```
export default function MotionPath() {
    return (
        <div style=>
            <svg xmlns="http://www.w3.org/2000/svg" width="451" height="437">
                {/* Our SVG path will go here */}
            </svg>

            {/* Our moving box will go here */}
        </div>
    )
}

/**
 * ==============   Styles   ================
 */

const box = {
    width: 50,
    height: 50,
    backgroundColor: "#4a9df8",
    borderRadius: 10,
    position: "absolute",
    top: 0,
    left: 0,
}
```

Here we've created a container that holds both an SVG element and will eventually contain our animated box.

## Let's animate!

### Import from Motion

First, let's import the motion components we need:

```
import * as motion from "motion/react-client"
```

### Creating the drawing animation

Now, let's define our SVG path and animate it. We'll create a spiral-like path:

```
const transition = { duration: 4, yoyo: Infinity, ease: "easeInOut" }

<svg xmlns="http://www.w3.org/2000/svg" width="451" height="437">
  <motion.path
    d="M 239 17 C 142 17 48.5 103 48.5 213.5 C 48.5 324 126 408 244 408 C 362 408 412 319 412 213.5 C 412 108 334 68.5 244 68.5 C 154 68.5 102.68 135.079 99 213.5 C 95.32 291.921 157 350 231 345.5 C 305 341 357.5 290 357.5 219.5 C 357.5 149 314 121 244 121 C 174 121 151.5 167 151.5 213.5 C 151.5 260 176 286.5 224.5 286.5 C 273 286.5 296.5 253 296.5 218.5 C 296.5 184 270 177 244 177 C 218 177 197 198 197 218.5 C 197 239 206 250.5 225.5 250.5 C 245 250.5 253 242 253 218.5"
    fill="transparent"
    strokeWidth="12"
    stroke="#4a9df866"
    strokeLinecap="round"
    transition={transition}
  />
</svg>
```

This will render a `path` with a spiral design, and by adding these props:

```
initial=
animate=
```

The path will appear to draw in. This `pathLength` property is a special Motion style that makes it easy to create these kind of drawing effects, where `0` is none of the line drawn in, and `1` is the full line.

In this example we've used `0.001` instead of `0`. This is because when setting `0` with this path, in combination with the "rounded" line cap, the browser will render a little circle at the **end** of the line at the start of the animation, which is a little browser quirk we're working around here.

### Animating along the path

Now, let's add our box element and make it move along the same path:

```
<motion.div
    style={box}
    initial=
    animate=
    transition={transition}
/>
```

Here we're animating `offsetDistance`, a [CSS style](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-distance) that determines how far along the defined `offsetPath` an element will be rendered.

To see this in action, need to update our box styles to include the `offsetPath` property:

```
const box = {
    width: 50,
    height: 50,
    backgroundColor: "#4a9df8",
    borderRadius: 10,
    position: "absolute",
    top: 0,
    left: 0,
    offsetPath: \`path("M 239 17 C 142 17 48.5 103 48.5 213.5 C 48.5 324 126 408 244 408 C 362 408 412 319 412 213.5 C 412 108 334 68.5 244 68.5 C 154 68.5 102.68 135.079 99 213.5 C 95.32 291.921 157 350 231 345.5 C 305 341 357.5 290 357.5 219.5 C 357.5 149 314 121 244 121 C 174 121 151.5 167 151.5 213.5 C 151.5 260 176 286.5 224.5 286.5 C 273 286.5 296.5 253 296.5 218.5 C 296.5 184 270 177 244 177 C 218 177 197 198 197 218.5 C 197 239 206 250.5 225.5 250.5 C 245 250.5 253 242 253 218.5")\`,
}
```

This is the same path definition in our drawing animation above. Now this is set, and we're driving `offsetDistance` using `animate`, the element will physically move through this path in tandem with the drawing effect.

## Conclusion

In this tutorial, we've learned how to create animations along SVG paths with Motion for React. This technique combines two powerful features:

1. SVG path drawing animation with the `pathLength` property.
2. Element movement along a path using CSS `offsetPath` and `offsetDistance` properties.

By combining these animations with a synchronized transition, we create an animation where a path draws itself while an element travels along it.