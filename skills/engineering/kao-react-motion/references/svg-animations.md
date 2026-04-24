# SVG animations

Every SVG tag has a motion counterpart:

```tsx
<motion.svg>
  <motion.g>
    <motion.path />
    <motion.circle />
    <motion.rect />
    <motion.feTurbulence />
    <motion.feDisplacementMap />
  </motion.g>
</motion.svg>
```

## What you can animate

- Style (CSS) — `opacity`, `fill`, `stroke`, `filter`, CSS transforms.
- Presentation attributes — `cx`, `cy`, `r`, `x`, `y`, `width`, `height`, `stroke-dasharray`, …
- `d` (path data) — morphs when the two paths are structurally similar.
- `viewBox` on `motion.svg` — for pan and zoom.
- Filter attributes — `stdDeviation`, `baseFrequency`, `scale` on feDisplacementMap, etc.

## Transforms — different from HTML

By default, SVG `transform-origin` is the top-left of the viewBox. Motion changes this so SVG elements rotate/scale around their own center, matching HTML expectations.

```tsx
<motion.rect style={{ rotate: 90 }} />       // rotates around rect center
<motion.rect style={{ rotate: 90, transformBox: "view-box" }} />  // restores native SVG behaviour
```

Transform shorthands (`x`, `y`, `scale`) apply via the `style` tag. To animate the SVG `x`/`y`/`scale` **attributes** instead of style transforms, use `attrX`, `attrY`, `attrScale`:

```tsx
<motion.rect attrX={0} animate={{ attrX: 100 }} />
```

## Passing motion values

Via `style` for styles, via attribute props for attributes:

```tsx
const cx = useMotionValue(100)
const opacity = useMotionValue(1)
<motion.rect cx={cx} style={{ opacity }} />
```

## Line drawing — `pathLength`, `pathSpacing`, `pathOffset`

Three special values (0–1 progress) that work on `path`, `circle`, `ellipse`, `line`, `polygon`, `polyline`, `rect`.

```tsx
<motion.path
  d={d}
  initial={{ pathLength: 0 }}
  animate={{ pathLength: 1 }}
  transition={{ duration: 2, ease: "easeInOut" }}
/>
```

- `pathLength`: drawn fraction of the stroke (0 = not drawn, 1 = fully drawn).
- `pathSpacing`: fraction between segments.
- `pathOffset`: where the segment starts.

Tip: pair with `strokeLinecap="round"` for a hand-drawn feel.

Checkmark:
```tsx
<motion.svg viewBox="0 0 24 24" initial="hidden" animate="visible">
  <motion.path
    d="M5 13l4 4L19 7"
    stroke="green" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="transparent"
    variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
    transition={{ duration: 0.6 }}
  />
</motion.svg>
```

## Path morphing

Animate the `d` attribute — works natively when the two paths have the **same number and type of commands**:

```tsx
<motion.path
  d="M 0,0 l 0,10 l 10,10"
  animate={{ d: "M 0,0 l 10,0 l 10,10" }}
/>
```

For structurally different paths, plug in a mixer like Flubber via `useTransform`:

```tsx
import { interpolate } from "flubber"

const progress = useMotionValue(0)
const d = useTransform(progress, [0, 1], [pathA, pathB], {
  mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 1 }),
})
<motion.path d={d} />
```

## `viewBox` — pan and zoom

```tsx
<motion.svg
  viewBox="0 0 200 200"
  animate={{ viewBox: "100 0 200 200" }}   // pan 100px right
/>
<motion.svg
  viewBox="0 0 200 200"
  animate={{ viewBox: "-100 -100 300 300" }}  // zoom out
/>
```

## Gestures on SVGs

Most gestures work the same as HTML. Exceptions:

- Filter elements (`feGaussianBlur`, `feTurbulence`, …) have no physical presence — gestures don't recognise on them directly. Instead, put `whileHover` on a parent `motion.svg` and use variants to animate the filter:
  ```tsx
  <motion.svg whileHover="hover">
    <filter id="blur">
      <motion.feGaussianBlur stdDeviation={0} variants={{ hover: { stdDeviation: 2 } }} />
    </filter>
  </motion.svg>
  ```

## Drag on SVG elements

Works, with one caveat: if the SVG's `viewBox` doesn't match its rendered pixel size, pointer coordinates need scaling.

```tsx
import { motion, MotionConfig, transformViewBoxPoint } from "motion/react"

function Component() {
  const ref = useRef<SVGSVGElement>(null)
  return (
    <MotionConfig transformPagePoint={transformViewBoxPoint(ref)}>
      <svg ref={ref} viewBox="0 0 100 100" style={{ width: 200, height: 200 }}>
        <motion.circle drag r="10" />
      </svg>
    </MotionConfig>
  )
}
```

## Layout animations and SVG

Motion's layout engine **does not support SVG** (SVG has no CSS layout). Animate attributes directly (`cx`, `cy`, `width`, `height`, `x`, `y`, `d`).

## Keep strokes crisp during scale

If you `scale` an SVG, browsers scale its stroke too. Combat with `vector-effect="non-scaling-stroke"`:

```tsx
<motion.path d={d} vectorEffect="non-scaling-stroke" stroke="black" strokeWidth={2} />
```

## Common patterns

- Line drawing on scroll: pair `pathLength` with `useScroll` + `useTransform` (see `scroll-animations.md`).
- Morphing icons: two paths with matching command counts, `animate={{ d: isOn ? pathA : pathB }}`.
- Chart reveal: keyframe `pathLength` with `times` + per-segment easing.
- Animated gradient: animate `offset` on `motion.stop` elements.
