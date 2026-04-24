# AnimatedDialog — Motion-driven shadcn Dialog (single-dialog override)

A drop-in wrapper around shadcn's Dialog where **Motion** owns the open/close animation instead of the default `tw-animate-css` classes. Spring-in from `scale: 0.8` + `y: 20`; the header, body, and footer stagger in after the container starts; everything reverses on close (children first, then container). Scoped to this file only — your other dialogs keep the shadcn default.

## The decision: override `tw-animate-css`, don't mix

shadcn's `DialogContent` ships `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-...` (and the closed counterparts). Those classes drive `opacity` and `transform` on the same element Motion wants to drive — keeping them alongside a Motion `animate`/`exit` produces stutter because **two systems fight over the same transform matrix**.

So the trade I'm making explicitly:

- **Stripped** every `tw-animate-css` / `data-[state=*]:*` class from the content and overlay — only layout/theme classes remain (`bg-background`, `border`, `rounded-lg`, `shadow-lg`, positioning, shadcn theme tokens).
- **Kept** Radix's behaviour (focus trap, `Escape` to close, scroll lock, portal, `aria-*`, close button, etc.) via `asChild` + `forceMount`.
- **Motion** owns opacity and transform exclusively.

This is only applied inside `AnimatedDialog*`. The stock `Dialog` from `@/components/ui/dialog` is untouched, so every other dialog in the app keeps the default tw-animate-css behaviour. That was the brief.

## Why `AnimatePresence` + mirrored open state (and not `forceMount` + `data-state`)

Two reasonable paths exist:

1. `forceMount` the content and let Motion read Radix's `data-state="open"|"closed"` attribute via variants.
2. Wrap in `AnimatePresence` and conditionally render based on `open`.

Path 2 plays better with variants + stagger: `exit` variants propagate cleanly from the parent to the header/body/footer children, and `when: "afterChildren"` genuinely delays the container's exit until the children finish. With path 1, the content stays mounted and `exit` never fires (because the element never unmounts), so you'd need to drive everything off `data-state` and lose the one-line `exit="exit"` ergonomics.

Radix's `Dialog.Root` doesn't expose its open state via public context, so `AnimatedDialog` mirrors the `open` prop into its own `AnimatedDialogOpenContext` and `AnimatedDialogContent` reads that to gate its `AnimatePresence` child. Works in both controlled (`open` + `onOpenChange`) and uncontrolled (`defaultOpen`) modes.

## Stagger orchestration

The container's `visible` transition uses `delayChildren: stagger(0.07, { startDelay: 0.12 })`. Because the three section components (`Header`, `Body`, `Footer`) each set `variants={sectionVariants}` without naming a state, Motion's **variant propagation** kicks in: the parent's `animate="visible"` is picked up by every descendant motion component that has a `visible` variant. `stagger()` on the parent spaces their start times. Same story for `exit`, reversed (`from: "last"`, `when: "afterChildren"`).

Why expose variants through `SectionVariantsContext` instead of importing them directly? So `AnimatedDialogContent` can swap to the reduced-motion variant set (`useReducedMotion()`) in one place and the sections follow — no coupling between consumer and the reduced-motion choice.

## Other skill-guided choices

- **Spring for physical values** (`scale`, `y`, container position) — tuned with `stiffness: 260, damping: 24, mass: 0.9` for a perceptible but not bouncy landing. **Tween (`duration` + `ease`)** for pure `opacity` (overlay + exit fades), per the skill's guidance on spring-vs-tween.
- **`useReducedMotion()`** — falls back to opacity-only fades so `prefers-reduced-motion: reduce` users don't get thrown around. Overlay fade stays because a 0→1 opacity change isn't "motion" in the vestibular sense.
- **Variants defined at module scope** — not recreated per render.
- **`motion` not `framer-motion`** — imports from `motion/react`.
- **`"use client"`** at the top — motion APIs are client-only (safe in Next.js RSC trees too).
- **shadcn theme tokens** (`bg-background`, `text-muted-foreground`, `ring-ring`, `border`) — no hardcoded colors.
- **Portal uses `forceMount`** — otherwise Radix unmounts the portal before the exit animation can play.

## Usage

```tsx
import {
  AnimatedDialog,
  AnimatedDialogContent,
  AnimatedDialogHeader,
  AnimatedDialogTitle,
  AnimatedDialogDescription,
  AnimatedDialogBody,
  AnimatedDialogFooter,
} from "@/components/animated-dialog"

export function Example() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <AnimatedDialog open={open} onOpenChange={setOpen}>
        <AnimatedDialogContent>
          <AnimatedDialogHeader>
            <AnimatedDialogTitle>Are you sure?</AnimatedDialogTitle>
            <AnimatedDialogDescription>
              This action cannot be undone.
            </AnimatedDialogDescription>
          </AnimatedDialogHeader>
          <AnimatedDialogBody>
            You will lose access to the workspace and all of its contents.
          </AnimatedDialogBody>
          <AnimatedDialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Delete</Button>
          </AnimatedDialogFooter>
        </AnimatedDialogContent>
      </AnimatedDialog>
    </>
  )
}
```

`AnimatedDialogTrigger` is also exported if you prefer the declarative trigger pattern over a controlled `open` prop.

## The component

```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import {
  AnimatePresence,
  motion,
  stagger,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react"

import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Variants (module scope — no re-creation per render)                        */
/* -------------------------------------------------------------------------- */

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
}

const containerSpring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.9,
}

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...containerSpring,
      // Orchestrate the children once the container starts springing in.
      delayChildren: stagger(0.07, { startDelay: 0.12 }),
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      // Reverse on close: children animate out first, container follows.
      when: "afterChildren",
      duration: 0.2,
      ease: "easeIn",
      delayChildren: stagger(0.04, { from: "last" }),
    },
  },
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.15, ease: "easeIn" },
  },
}

const reducedContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15, delayChildren: stagger(0.03) },
  },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

const reducedSectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

/* -------------------------------------------------------------------------- */
/*  Open-state context                                                         */
/*                                                                             */
/*  Radix's Dialog.Root manages its own open state but doesn't expose it via   */
/*  a public context. Because AnimatePresence needs to see the mount/unmount   */
/*  boundary, we mirror `open` into our own context so the Content component   */
/*  can gate its AnimatePresence child without forceMount gymnastics.          */
/* -------------------------------------------------------------------------- */

const AnimatedDialogOpenContext = React.createContext<boolean>(false)
const SectionVariantsContext = React.createContext<Variants>(sectionVariants)

/* -------------------------------------------------------------------------- */
/*  Root                                                                        */
/* -------------------------------------------------------------------------- */

type AnimatedDialogProps = React.ComponentProps<typeof DialogPrimitive.Root>

function AnimatedDialog({
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: AnimatedDialogProps) {
  // Track open state for context (supports both controlled and uncontrolled).
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const isControlled = open !== undefined
  const currentOpen = isControlled ? !!open : internalOpen

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  return (
    <AnimatedDialogOpenContext.Provider value={currentOpen}>
      <DialogPrimitive.Root
        data-slot="animated-dialog"
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </DialogPrimitive.Root>
    </AnimatedDialogOpenContext.Provider>
  )
}

function AnimatedDialogTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>,
) {
  return (
    <DialogPrimitive.Trigger data-slot="animated-dialog-trigger" {...props} />
  )
}

function AnimatedDialogPortal(
  props: React.ComponentProps<typeof DialogPrimitive.Portal>,
) {
  return (
    <DialogPrimitive.Portal
      data-slot="animated-dialog-portal"
      forceMount
      {...props}
    />
  )
}

function AnimatedDialogClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>,
) {
  return <DialogPrimitive.Close data-slot="animated-dialog-close" {...props} />
}

/* -------------------------------------------------------------------------- */
/*  Overlay — Motion-controlled fade (NO tw-animate-css classes)              */
/* -------------------------------------------------------------------------- */

function AnimatedDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  return (
    <DialogPrimitive.Overlay asChild forceMount>
      <motion.div
        key="animated-dialog-overlay"
        data-slot="animated-dialog-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={cn("fixed inset-0 z-50 bg-black/50", className)}
        {...props}
      />
    </DialogPrimitive.Overlay>
  )
}

/* -------------------------------------------------------------------------- */
/*  Content — spring in from scale 0.8 + y 20, children stagger after          */
/* -------------------------------------------------------------------------- */

type AnimatedDialogContentProps = React.ComponentProps<
  typeof DialogPrimitive.Content
> & {
  /** Hide the default close (X) button in the top-right. */
  showCloseButton?: boolean
  /** Extra className on the Motion container. */
  motionClassName?: string
}

function AnimatedDialogContent({
  className,
  motionClassName,
  children,
  showCloseButton = true,
  ...props
}: AnimatedDialogContentProps) {
  const open = React.useContext(AnimatedDialogOpenContext)
  const reduce = useReducedMotion()

  const chosenContainer = reduce
    ? reducedContainerVariants
    : containerVariants
  const chosenSection = reduce ? reducedSectionVariants : sectionVariants

  return (
    <AnimatedDialogPortal>
      <AnimatePresence>
        {open ? (
          <React.Fragment key="animated-dialog-frame">
            <AnimatedDialogOverlay />
            <DialogPrimitive.Content asChild forceMount {...props}>
              <motion.div
                key="animated-dialog-content"
                data-slot="animated-dialog-content"
                variants={chosenContainer}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  // Positioning + theme tokens, mirroring shadcn's DialogContent.
                  // Deliberately stripped: every tw-animate-css class (animate-in,
                  // zoom-in-95, slide-in-from-*, fade-in-0, data-[state=*]:*)
                  // so Motion owns opacity/transform without a fight.
                  "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg",
                  className,
                  motionClassName,
                )}
              >
                <SectionVariantsContext.Provider value={chosenSection}>
                  {children}
                </SectionVariantsContext.Provider>

                {showCloseButton ? (
                  <DialogPrimitive.Close
                    data-slot="animated-dialog-close-button"
                    className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                  >
                    <XIcon />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                ) : null}
              </motion.div>
            </DialogPrimitive.Content>
          </React.Fragment>
        ) : null}
      </AnimatePresence>
    </AnimatedDialogPortal>
  )
}

/* -------------------------------------------------------------------------- */
/*  Header / Body / Footer                                                     */
/*                                                                             */
/*  These declare `variants={...}` without naming states — the parent          */
/*  Content's `animate="visible"` / `exit="exit"` propagates and each section  */
/*  picks the matching named variant. `stagger()` in the parent orchestrates.  */
/* -------------------------------------------------------------------------- */

function AnimatedDialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  const variants = React.useContext(SectionVariantsContext)
  return (
    <motion.div
      data-slot="animated-dialog-header"
      variants={variants}
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function AnimatedDialogBody({
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  const variants = React.useContext(SectionVariantsContext)
  return (
    <motion.div
      data-slot="animated-dialog-body"
      variants={variants}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function AnimatedDialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof motion.div>) {
  const variants = React.useContext(SectionVariantsContext)
  return (
    <motion.div
      data-slot="animated-dialog-footer"
      variants={variants}
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  )
}

function AnimatedDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="animated-dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function AnimatedDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="animated-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------- */
/*  Exports                                                                    */
/* -------------------------------------------------------------------------- */

export {
  AnimatedDialog,
  AnimatedDialogTrigger,
  AnimatedDialogPortal,
  AnimatedDialogClose,
  AnimatedDialogOverlay,
  AnimatedDialogContent,
  AnimatedDialogHeader,
  AnimatedDialogBody,
  AnimatedDialogFooter,
  AnimatedDialogTitle,
  AnimatedDialogDescription,
}
```

## Tweaking

- **Feel the bounce**: lower `damping` (18–20) or raise `stiffness` (320+) on `containerSpring` for punchier entrance.
- **Slower/faster stagger**: adjust `stagger(0.07)` in `containerVariants.visible.transition.delayChildren`. Skill advises 0.05–0.1 for list items; 0.07 feels right for 3 sections.
- **More sections**: anything you put inside the Content can be a `motion.div variants={...}` child — either declare your own variant object with matching `hidden`/`visible`/`exit` keys, or import `SectionVariantsContext` (if you export it) and consume it.
- **No scale, just y**: change `containerVariants.hidden` to `{ opacity: 0, y: 24 }` and drop the `scale` property — keeps the spring honest.

## What you're giving up

The shadcn default has one subtle thing this override loses: the CSS-based animations keep working even if Motion's JS bundle hasn't hydrated yet (e.g. during a hard refresh race). With Motion-driven animation, the first frame is rendered by React. In practice this is a non-issue for an interaction-triggered dialog (it's opened after hydration), but worth knowing if you ever open the dialog immediately on mount.
