# Integrating Motion with shadcn/ui (Radix)

This file is the mental model for combining Motion with the shadcn/Radix stack that this skill is scoped to. Short by design — the pattern generalises.

## The core pattern: `asChild` + Radix Slot

Every shadcn primitive that accepts `asChild` uses Radix's `<Slot>` under the hood. What `<Slot>` does: instead of rendering its own element, it **merges its props onto its single child**. Event handlers, refs, `data-*` attributes, `aria-*` attributes, and className all combine.

This lets you make a motion component the *actual rendered element* while keeping the shadcn primitive as a **behaviour/accessibility wrapper**:

```tsx
<ShadcnPrimitive asChild>
  <motion.div {...motionProps}>
    …
  </motion.div>
</ShadcnPrimitive>
```

Three things to remember:

1. **One child only.** `Slot` requires a single React element child. Wrap multiple children in a Fragment or a motion container.
2. **`className` merges.** The primitive's internal className is concatenated with yours — you rarely need to duplicate it. When in doubt, read the shadcn component source (it's in `components/ui/`).
3. **Refs forward automatically.** Motion components already forward refs, so Radix can attach its listeners.

## Patterns by primitive type

The pattern works on any Radix primitive with `asChild`. Concrete shapes:

```tsx
// Trigger-style primitives (Dialog, Popover, Tooltip, HoverCard, Sheet, DropdownMenu, Select, …)
<DialogTrigger asChild>
  <motion.button whileTap={{ scale: 0.97 }}>Open</motion.button>
</DialogTrigger>

// Content-style primitives (when you want a custom Motion-driven open/close instead of tw-animate-css)
<DialogContent asChild>
  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
    …
  </motion.div>
</DialogContent>

// Items in a list (NavigationMenu, ContextMenu, RadioGroup, …)
<NavigationMenuLink asChild>
  <motion.a href="/blog" whileHover={{ x: 4 }}>
    Blog
  </motion.a>
</NavigationMenuLink>

// Buttons that need gesture micro-animations beyond Tailwind's reach
<Button asChild>
  <motion.a
    href="/signup"
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
  >
    Get started
  </motion.a>
</Button>
```

## When `asChild` is the right tool vs. when it isn't

- **Use `asChild`**: the primitive's behaviour matters (accessibility, keyboard, focus management, data-state) AND you need Motion features the Tailwind defaults can't do.
- **Skip `asChild`, use Tailwind on the primitive directly**: you only need a simple hover/press state, or you only need the default open/close animation shadcn ships with.
- **Skip the primitive entirely, just use Motion**: you're building a new bespoke element that doesn't need the accessibility/behaviour of a shadcn primitive (custom scroll section, hero mask, parallax layer).

## Interop with default shadcn animations

shadcn ships open/close animations via `tw-animate-css` classes on the component itself (e.g. `DialogContent` has `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95`).

You have two choices:

1. **Accept the default** — don't touch it. This is the right answer 80% of the time.
2. **Replace with Motion** — `asChild` the content with a motion component, strip the `tw-animate-css` classes from the className, and let Motion control the animation. Use this when you need a spring, a layout animation, orchestrated children, or a non-standard enter/exit shape.

Mixing the two (keeping the `animate-in` classes AND adding a motion `animate` prop) produces stuttery results because both are driving the transform/opacity at once. Pick one.

## Theme tokens — use them, don't override them

Every surface/text colour in the shadcn ecosystem lives behind a CSS variable. Animations you write should reference the same tokens as the rest of the UI:

- `bg-background`, `bg-card`, `bg-popover`, `bg-muted`
- `text-foreground`, `text-muted-foreground`, `text-card-foreground`
- `bg-primary`, `text-primary`, `text-primary-foreground`
- `border-border`, `ring-ring`

For dark mode, this "just works" — the tokens resolve differently under `.dark`. Don't hardcode `bg-neutral-900` because the user added a dark theme; the tokens handle it.

## Radix state + Motion

When you want Motion's `animate` prop to react to Radix state (e.g. a Popover open/close), you can pass the state as a `data-state` attribute or use variants driven by a prop. But usually the simpler path is:

```tsx
// Read Radix state via the `data-state` attribute, animate via variants on open/close
<PopoverContent asChild>
  <motion.div
    variants={{
      open:   { opacity: 1, y: 0 },
      closed: { opacity: 0, y: -4 },
    }}
    initial="closed"
    animate="open"
    exit="closed"
  >
    …
  </motion.div>
</PopoverContent>
```

Radix drives mount/unmount; Motion drives the animation. `AnimatePresence` isn't needed here because Radix already manages presence — its `forceMount` prop is the escape hatch if you need it.

## Checklist before you Motion-fy a shadcn primitive

- [ ] Is the default `tw-animate-css` animation not good enough? If yes, proceed. If no, stop.
- [ ] Is the user explicitly asking for a custom animation, or is this me adding flair? Err on the side of letting the shadcn default stand.
- [ ] Am I using `asChild` to avoid recreating the primitive's behaviour?
- [ ] Am I stripping the conflicting `tw-animate-css` / `transition-*` classes that would fight Motion?
- [ ] Am I still using theme tokens, not hardcoded colours?
