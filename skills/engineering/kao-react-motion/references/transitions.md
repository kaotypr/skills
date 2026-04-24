# Transitions — tween, spring, inertia

A transition describes *how* to get from one value to another. Motion picks a reasonable default based on value type (spring for physical, tween for visual). Override when you have an intention.

## Where to set

```tsx
// On the component (default for all its animations)
<motion.div animate={{ x: 100 }} transition={{ type: "spring" }} />

// On a specific animation prop
<motion.div
  animate={{ x: 100 }}
  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
  transition={{ duration: 0.5 }}
/>

// Per-value (in transition)
<motion.div
  animate={{ x: 100, opacity: 1 }}
  transition={{ default: { type: "spring" }, opacity: { ease: "linear" } }}
/>

// Per-value (inside target)
<motion.div animate={{ x: 100, transition: { type: "spring" } }} />

// For a tree via MotionConfig
<MotionConfig transition={{ duration: 0.4, ease: "easeInOut" }}>
  <App />
</MotionConfig>
```

## Inheritance

Higher-specificity transitions **replace** lower — they do NOT merge. Opt into merging with `inherit: true`:

```tsx
<MotionConfig transition={{ duration: 1, ease: "linear" }}>
  <motion.div animate={{ x: 100 }} transition={{ inherit: true, ease: "easeInOut" }} />
</MotionConfig>
```
Now duration 1 is inherited but ease is overridden.

## `type`

- `"tween"` — duration + easing curve. Good for opacity, color, visual changes.
- `"spring"` — physics-based or duration-based. Good for x/y/scale/rotate/position.
- `"inertia"` — decelerates from initial velocity; used by `dragTransition`.

Omit `type` to let Motion pick (spring for physical, tween for visual).

## Tween

```ts
{
  type: "tween",
  duration: 0.3,       // default 0.3 (or 0.8 for keyframe arrays)
  ease: "easeOut",     // or array for keyframes: ["easeIn", "easeOut"]
  times: [0, 0.3, 1],  // keyframe positions (match keyframe count)
  delay: 0,
}
```

Easing names:
- `"linear"`, `"easeIn"`, `"easeOut"`, `"easeInOut"`
- `"circIn"`, `"circOut"`, `"circInOut"`
- `"backIn"`, `"backOut"`, `"backInOut"`
- `"anticipate"`

Also accepted: cubic-bezier array `[x1, y1, x2, y2]`, or a JS easing function `(t: number) => number`.

## Spring — two styles

### Duration-based (easier to reason about)
```ts
{ type: "spring", duration: 0.5, bounce: 0.25 }
```
- `bounce` 0 → no bounce, 1 → very bouncy. Default 0.25.
- `visualDuration` — the time by which the animation *visually appears* to reach the target. Overrides `duration`. The bouncy tail continues after.

### Physics-based (better with gestures)
```ts
{ type: "spring", stiffness: 200, damping: 20, mass: 1 }
```
- `stiffness` (default 1, higher → snappier).
- `damping` (default 10; 0 = oscillates forever).
- `mass` (default 1; higher = heavier/lazier).
- `velocity` — override initial velocity.
- `restSpeed` / `restDelta` — end thresholds (defaults 0.1 / 0.01).

If you set `stiffness`/`damping`/`mass`, they override `duration`/`bounce`.

**Rule of thumb**: use physics-based in drag/gesture contexts (velocity feeds in); use duration-based for static UI transitions (easier to coordinate with other time-based animations).

## Inertia (for drag release)

```ts
dragTransition: {
  power: 0.8,           // target distance multiplier
  timeConstant: 700,    // deceleration time constant (ms)
  modifyTarget: t => Math.round(t / 50) * 50,  // snap, grids
  min: 0, max: 100,     // bounds
  bounceStiffness: 500,
  bounceDamping: 10,
}
```

`modifyTarget` receives the auto-calculated target and returns a new one — useful for snap-to-grid.

## Keyframes

Any animation value can be an array — Motion animates through each value in order.

```tsx
<motion.div animate={{ x: [0, 100, 0] }} transition={{ duration: 2, times: [0, 0.2, 1] }} />
```

- `times` positions each keyframe as a 0–1 progress (same length as keyframes). Default is even spacing.
- Use `null` for a **wildcard** — "keep the previous value":
  ```tsx
  animate={{ x: [0, 100, null, 0] }}
  // same as [0, 100, 100, 0] — hold at 100 mid-animation
  ```
- Per-segment easing: `ease: ["easeIn", "easeOut", ...]` (one fewer element than keyframes; or one per, your choice — Motion handles both).

## Orchestration (for variants)

These only apply when the transition sits on a parent variant:

```ts
{
  when: "beforeChildren" | "afterChildren",
  delayChildren: 0.2,     // number OR stagger(step, opts)
  staggerChildren: 0.05,  // legacy alternative; prefer stagger()
}
```

`stagger(step, { startDelay, from })`:
- `step` — seconds per child.
- `startDelay` — delay before the first child.
- `from` — `"first" | "last" | "center" | number` (index).

## Repeat

```ts
{
  repeat: Infinity,
  repeatType: "loop" | "reverse" | "mirror",
  repeatDelay: 0,
}
```
- `loop` — restart from the beginning.
- `reverse` — alternate forward/backward.
- `mirror` — reverse origin and target per iteration.

## Negative delay

`delay: -1` starts the animation 1s in, a neat way to desynchronise loops across siblings.

## Animation types — what spring looks like

Motion defaults to spring for `x`, `y`, `z`, `scale`, `rotate`, `skew`, layout. It defaults to tween for `opacity`, `color`, `backgroundColor`, `filter`. If you want a color to feel bouncy, set `type: "spring"` explicitly.

## Common shapes (copy-paste)

```ts
// Snappy UI pop
{ type: "spring", stiffness: 400, damping: 30 }

// Soft bounce
{ type: "spring", duration: 0.6, bounce: 0.4 }

// Whole-app default
{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }  // "easeOut"-ish power curve

// Gesture release
{ type: "spring", stiffness: 600, damping: 30 }

// Gentle loop
{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }
```
