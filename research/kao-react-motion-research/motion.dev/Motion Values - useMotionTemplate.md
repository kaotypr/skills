# useMotionTemplate

useMotionTemplate creates a new motion value from a string template containing other motion values.

```javascript
const x = useMotionValue(100)
const transform = useMotionTemplate`transform(${x}px)`
```

Whenever a motion value within the string template updates, the returned motion value will update with the latest value.

## Usage

Import from Motion:

```javascript
import { useMotionTemplate } from "motion/react"
```

useMotionTemplate is a "tagged template", so rather than being called like a normal function, it's called as a string template:

```javascript
useMotionValue``
```

This string template can accept both text and other motion values:

```javascript
const blur = useMotionValue(10)
const saturate = useMotionValue(50)
const filter = useMotionTemplate`blur(${10}px) saturate(${saturate}%)`


return <motion.div style={{ filter }} />
```

The latest value of the returned motion value will be the string template with each provided motion value replaced with its latest value.

```javascript
const shadowX = useSpring(0)
const shadowY = useMotionValue(0)


const filter = useMotionTemplate`drop-shadow(${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.3))`


return <motion.div style={{ filter }} />
```

