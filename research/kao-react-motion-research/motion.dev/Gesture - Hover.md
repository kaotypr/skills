# Hover animation

Hover animations are the most common form of gesture animation.

Motion improves on the CSS :hover psuedo-class, which can cause frustrating "sticky" states on touch devices, where hover styles can persist after a user lifts their finger.

Motion provides three powerful methods to tap into hover gestures to create reliable, cross-device hover interactions that filter out these unwanted emulated events:

* The whileHover animation prop
The whileHover animation prop

* onHover events
onHover events

* hover() gesture recogniser
hover() gesture recogniser

In this guide, we'll take a look at how (and when) to use each.

## The whileHover prop

The simplest and most common way to add a hover animation with Motion is with the motion component's whileHover prop.

It's a declarative way to define a target animation state - when a hover gesture starts, the component will animate to the values defined in it, and when the gesture ends, it'll animate back to its previous state.

```javascript
<motion.button whileHover={{ scale: 1.1 }} />
```

### Customise the animation

Transitions can be defined for when we enter a hover gesture state by setting transition within the whileHover definition.

```javascript
<motion.button
  whileHover={{
    scale: 1.1,
    // Will be used when gesture starts
    transition: { duration: 0.1 }
  }}
  // Will be used when gesture ends
  transition={{ duration: 0.5 }}
/>
```

## Event handlers

You can also listen for when a hover gesture starts and ends with the onHoverStart and onHoverEnd events.

```javascript
<motion.a
  onHoverStart={() => console.log('Hover starts')}
  onHoverEnd={() => console.log('Hover ends')}
/>
```

These events differ from the browser's native pointer event handling by only firing on devices where hover is truly possible. They explicitly won't fire as the result of a touch event.

## hover() gesture recogniser

To use onHoverStart and onHoverEnd, you need to import the full motion component. For lightweight hover gesture handling, you can import the tiny (<1kb) hover() function.

Because it returns a cleanup function, it's straightforward to integrate with useEffect:

```javascript
import { hover } from "motion"
import { useRef, useEffect } from "react"


function Component() {
  const ref = useRef(null)


  useEffect(() => {
    return hover(ref.current, () => {
      console.log("on hover start")


      return () => console.log("on hover end")
    })
  }, [])


  return <button ref={ref} />
}
```

