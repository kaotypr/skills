# AnimatedDialog — a Motion-powered shadcn Dialog override

This is a drop-in wrapper for shadcn's Dialog that replaces the default `tw-animate-css` open/close animation with a spring-based entrance from Motion, plus staggered header/body/footer reveal. Everything else (Radix primitives, focus trap, escape to close, portal, overlay dismiss) works identically to shadcn's stock dialog because we re-export Radix directly — we just swap the animation layer.

## The decision: override `tw-animate-css`, don't fight it

shadcn's `dialog.tsx` relies on `data-[state=open]:animate-in / data-[state=closed]:animate-out` utility classes (the `tw-animate-css` plugin) on both `DialogOverlay` and `DialogContent`. Those classes run CSS keyframes tied to Radix's `data-state` attribute.

If you leave those classes in place and layer Motion on top, you get two animation systems fighting over `transform` and `opacity` on the same element — you'll see a snap, a double-bounce, or the CSS animation winning the first frame before Motion takes over. That's the wrong tree to bark up.

The correct move is to **not render shadcn's `DialogContent` / `DialogOverlay` at all for this dialog.** We build a parallel component (`AnimatedDialog`) that:

1. Uses `@radix-ui/react-dialog` primitives directly (same base as shadcn, so behavior is identical).
2. Wraps `Overlay` and `Content` with `motion.create(...)` so Motion owns `transform`/`opacity`.
3. Omits every `data-[state=...]:animate-*` / `fade-*` / `zoom-*` / `slide-*` class. Those are the `tw-animate-css` hooks — stripping them guarantees no double-animation.
4. Uses `forceMount` on Portal + Overlay + Content and gates them with `AnimatePresence` so the **exit** animation actually runs (Radix otherwise unmounts instantly when `open` flips to `false`, which kills the exit).

Your other dialogs keep using shadcn's default `Dialog` from `@/components/ui/dialog` — this override is scoped to the one dialog that imports `AnimatedDialog`. Nothing global changes.

## The animation recipe

- **Overlay**: opacity tween 0 → 1 over 200ms with a shadcn-ish ease-out. Springs on opacity can overshoot above 1 and look flickery, so a tween is deliberate here.
- **Container**: spring from `{ opacity: 0, scale: 0.8, y: 20 }` → `{ opacity: 1, scale: 1, y: 0 }`. Stiffness 380 / damping 32 / mass 0.9 — lively without feeling toy-like.
- **Stagger**: `delayChildren: 0.08` so sections wait for the container to mostly settle, then `staggerChildren: 0.05` between header → body → footer. Each section is a short spring from `y: 8, opacity: 0`.
- **Exit**: `when: "afterChildren"` + `staggerDirection: -1` reverses the stagger — footer leaves first, then body, then header, then the container shrinks to `scale: 0.96, y: 10` and fades over 150ms. Short and crisp, because long exits feel laggy on dismissal.

## Usage

```tsx
import { AnimatedDialog } from "@/components/ui/animated-dialog";

export function Example() {
  const [open, setOpen] = React.useState(false);
  return (
    <AnimatedDialog open={open} onOpenChange={setOpen}>
      <AnimatedDialog.Trigger asChild>
        <Button>Open</Button>
      </AnimatedDialog.Trigger>
      <AnimatedDialog.Content>
        <AnimatedDialog.Header>
          <AnimatedDialog.Title>Delete project</AnimatedDialog.Title>
          <AnimatedDialog.Description>
            This action cannot be undone.
          </AnimatedDialog.Description>
        </AnimatedDialog.Header>
        <AnimatedDialog.Body>
          Type the project name to confirm.
        </AnimatedDialog.Body>
        <AnimatedDialog.Footer>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive">Delete</Button>
        </AnimatedDialog.Footer>
      </AnimatedDialog.Content>
    </AnimatedDialog>
  );
}
```

Controlled and uncontrolled both work — the root mirrors Radix's `open` / `defaultOpen` / `onOpenChange` API exactly.

## Install

```bash
pnpm add motion
# or: npm i motion / yarn add motion
```

`motion` is the new package name for Framer Motion 11+. Imports are `from "motion/react"`. If you're still on `framer-motion`, swap the import to `from "framer-motion"` and everything else works unchanged.

You already have `@radix-ui/react-dialog` and `lucide-react` from shadcn's dialog install — no new Radix deps.

## The component

```tsx
"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------------------------------
 * Motion tokens
 * -----------------------------------------------------------------------------------------------*/

// Spring used for the container pop-in. Tuned to feel lively but not bouncy enough
// to feel like a toy — stiffness dominates, damping keeps it from oscillating.
const containerSpring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 0.9,
};

// Tween used for the overlay fade. Springs on opacity look weird because
// they can overshoot >1 and flicker — a short ease is the right call here.
const overlayTween: Transition = {
  duration: 0.2,
  ease: [0.32, 0.72, 0, 1], // shadcn-ish ease-out
};

// Stagger timing for header/body/footer. Small enough to feel like one gesture,
// large enough to be legible.
const SECTION_STAGGER = 0.05;
const SECTION_DELAY = 0.08; // wait until the container is mostly settled

const sectionTransition: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
};

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: overlayTween },
  exit: { opacity: 0, transition: overlayTween },
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...containerSpring,
      when: "beforeChildren",
      delayChildren: SECTION_DELAY,
      staggerChildren: SECTION_STAGGER,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
      // Stagger children out in reverse on close so they feel like they leave
      // before the container collapses.
      when: "afterChildren",
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: sectionTransition },
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: 0.12, ease: [0.4, 0, 1, 1] },
  },
};

/* -------------------------------------------------------------------------------------------------
 * Root / Trigger / Portal / Close — thin re-exports so this file is a drop-in
 * -----------------------------------------------------------------------------------------------*/

const AnimatedDialogTrigger = DialogPrimitive.Trigger;
const AnimatedDialogPortal = DialogPrimitive.Portal;
const AnimatedDialogClose = DialogPrimitive.Close;

/* -------------------------------------------------------------------------------------------------
 * Overlay (animated)
 * -----------------------------------------------------------------------------------------------*/

const MotionOverlay = motion.create(DialogPrimitive.Overlay);

function AnimatedDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <MotionOverlay
      // IMPORTANT: no `data-[state=...]` tw-animate-css classes here. Motion owns the animation.
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        className,
      )}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------------------------------
 * Content (animated container + staggered sections)
 * -----------------------------------------------------------------------------------------------*/

const MotionContent = motion.create(DialogPrimitive.Content);

type AnimatedDialogContentProps = React.ComponentProps<
  typeof DialogPrimitive.Content
> & {
  /** Show the built-in close (X) button in the top-right. Defaults to true. */
  showCloseButton?: boolean;
};

function AnimatedDialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: AnimatedDialogContentProps) {
  return (
    <MotionContent
      // We strip shadcn's default data-[state=...] animate-in/out classes and rely on Motion.
      className={cn(
        "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg",
        className,
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        // Ensure will-change for smoother first-frame on the spring.
        willChange: "transform, opacity",
      }}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </MotionContent>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Header / Body / Footer — each a staggered section
 * -----------------------------------------------------------------------------------------------*/

function AnimatedDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <motion.div
      variants={sectionVariants}
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AnimatedDialogBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <motion.div
      variants={sectionVariants}
      className={cn("text-sm", className)}
      {...props}
    />
  );
}

function AnimatedDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <motion.div
      variants={sectionVariants}
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function AnimatedDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  );
}

function AnimatedDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------------------------------
 * Root — wraps Radix Dialog.Root with AnimatePresence so exit animations run.
 * -----------------------------------------------------------------------------------------------*/

type AnimatedDialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;

function AnimatedDialogRoot({
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: AnimatedDialogProps) {
  // Mirror Radix controlled/uncontrolled so AnimatePresence has a reliable
  // boolean. We gate Portal+Overlay+Content on this so exit animations run.
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  return (
    <DialogPrimitive.Root
      open={actualOpen}
      onOpenChange={handleOpenChange}
      {...props}
    >
      <AnimatePresence>
        {actualOpen && (
          <DialogPrimitive.Portal forceMount>
            <AnimatedDialogOverlay forceMount />
            {extractContent(children)}
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
      {extractNonContent(children)}
    </DialogPrimitive.Root>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Child-splitting helpers: pull Content out of children so we can forceMount it
 * inside the Portal, while Trigger etc. render normally at the Root level.
 * -----------------------------------------------------------------------------------------------*/

function isContentChild(child: React.ReactNode): boolean {
  return (
    React.isValidElement(child) &&
    (child.type === AnimatedDialogContent ||
      child.type === DialogPrimitive.Content)
  );
}

function extractContent(children: React.ReactNode): React.ReactNode {
  const arr = React.Children.toArray(children);
  const content = arr.find(isContentChild);
  if (!content || !React.isValidElement(content)) return null;
  return React.cloneElement(content as React.ReactElement<any>, {
    forceMount: true,
  });
}

function extractNonContent(children: React.ReactNode): React.ReactNode {
  return React.Children.toArray(children).filter((c) => !isContentChild(c));
}

/* -------------------------------------------------------------------------------------------------
 * Public API — compound component
 * -----------------------------------------------------------------------------------------------*/

type AnimatedDialogComponent = typeof AnimatedDialogRoot & {
  Trigger: typeof AnimatedDialogTrigger;
  Portal: typeof AnimatedDialogPortal;
  Close: typeof AnimatedDialogClose;
  Overlay: typeof AnimatedDialogOverlay;
  Content: typeof AnimatedDialogContent;
  Header: typeof AnimatedDialogHeader;
  Body: typeof AnimatedDialogBody;
  Footer: typeof AnimatedDialogFooter;
  Title: typeof AnimatedDialogTitle;
  Description: typeof AnimatedDialogDescription;
};

const AnimatedDialog = AnimatedDialogRoot as AnimatedDialogComponent;
AnimatedDialog.Trigger = AnimatedDialogTrigger;
AnimatedDialog.Portal = AnimatedDialogPortal;
AnimatedDialog.Close = AnimatedDialogClose;
AnimatedDialog.Overlay = AnimatedDialogOverlay;
AnimatedDialog.Content = AnimatedDialogContent;
AnimatedDialog.Header = AnimatedDialogHeader;
AnimatedDialog.Body = AnimatedDialogBody;
AnimatedDialog.Footer = AnimatedDialogFooter;
AnimatedDialog.Title = AnimatedDialogTitle;
AnimatedDialog.Description = AnimatedDialogDescription;

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
};
```

## Notes and gotchas

- **`motion.create` vs legacy `motion(Component)`** — Motion 11+ deprecated the callable form in favor of `motion.create(...)`. I used `create` so this stays future-proof. On older Framer Motion you'd write `motion(DialogPrimitive.Content)` — same semantics.
- **`forceMount` is load-bearing** — without it Radix unmounts `Overlay` and `Content` the moment `open` flips to `false`, which kills the exit animation. `AnimatePresence` + `forceMount` on both Overlay and Content is the standard Radix-plus-Motion pattern.
- **The translate math** — Radix positions `Content` with `translate-x-[-50%] translate-y-[-50%]`. Motion writes `transform` directly, but in v11 it composes with Tailwind's `--tw-translate-*` variables via the unified `transform` string. If you notice the dialog drifting off-center on mount, replace the Tailwind translate classes with `style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}` and use Motion's `x`/`y` — the spring `y: 20 → 0` then becomes `y: "calc(-50% + 20px)" → "-50%"`. For most apps the Tailwind approach works fine.
- **Reduced motion** — Motion auto-respects `prefers-reduced-motion` when you set `MotionConfig reducedMotion="user"` at your app root. If you don't have that yet, wrap your app once and this dialog (plus every other Motion component) will short-circuit the spring for users who've opted out.
- **Scoped, not global** — import `Dialog` from `@/components/ui/dialog` for every other dialog in the app. Only the one dialog that needs the elaborate animation imports `AnimatedDialog`. No global side effects, no Tailwind config changes, no CSS overrides.
- **Accessibility is unchanged** — we still render `DialogPrimitive.Title` and `DialogPrimitive.Description`, so Radix's ARIA wiring, focus trap, return-focus, and escape-to-close all work exactly as shadcn ships them.
