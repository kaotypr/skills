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
      // The Radix Content component sets `transform: translate(-50%, -50%)`
      // in its positioning classes. Motion's `scale`/`y` need to compose on top
      // of that, which works because Framer Motion writes to the `transform`
      // style property and Tailwind's `translate-*` here are actually
      // CSS custom props — they stack fine. If you remove the tw translate
      // classes and do your own, adjust accordingly.
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
 *
 * Usage:
 *   <AnimatedDialog open={open} onOpenChange={setOpen}>
 *     <AnimatedDialog.Trigger asChild>...</AnimatedDialog.Trigger>
 *     <AnimatedDialog.Content>
 *       <AnimatedDialog.Header>
 *         <AnimatedDialog.Title>Title</AnimatedDialog.Title>
 *         <AnimatedDialog.Description>...</AnimatedDialog.Description>
 *       </AnimatedDialog.Header>
 *       <AnimatedDialog.Body>Content</AnimatedDialog.Body>
 *       <AnimatedDialog.Footer>
 *         <button>Cancel</button>
 *         <button>Save</button>
 *       </AnimatedDialog.Footer>
 *     </AnimatedDialog.Content>
 *   </AnimatedDialog>
 *
 * If you want the simplest drop-in, pass children directly — any <AnimatedDialog.Content>
 * inside will be wrapped in AnimatePresence automatically.
 * -----------------------------------------------------------------------------------------------*/

type AnimatedDialogProps = React.ComponentProps<typeof DialogPrimitive.Root>;

function AnimatedDialogRoot({
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: AnimatedDialogProps) {
  // We mirror Radix's controlled/uncontrolled behavior so AnimatePresence
  // has a reliable boolean to key off of. This is the cleanest way to make
  // exit animations work — rendering Portal/Overlay/Content conditionally
  // based on `open` rather than letting Radix unmount them.
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
      {/*
        We split children into "trigger-ish" nodes (render always) and the content
        subtree (render only when open). The cleanest way is to let consumers
        put the Trigger outside Content and let AnimatePresence gate Content.
        But to keep the drop-in ergonomics, we render all children and rely on
        forceMount + AnimatePresence gating inside the Portal below.
      */}
      <AnimatePresence>
        {actualOpen && (
          <DialogPrimitive.Portal forceMount>
            {/*
              forceMount keeps Radix from unmounting Overlay/Content as soon as
              open flips to false — AnimatePresence then controls the lifetime
              so the exit animation can play.
            */}
            <AnimatedDialogOverlay forceMount />
            {/*
              Pull the Content child out of `children` so we can pass forceMount
              and let the rest of the subtree (trigger, etc.) render normally.
            */}
            {extractContent(children)}
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
      {extractNonContent(children)}
    </DialogPrimitive.Root>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Child-splitting helpers
 * -----------------------------------------------------------------------------------------------*/

function isContentChild(child: React.ReactNode): boolean {
  return (
    React.isValidElement(child) &&
    (child.type === AnimatedDialogContent ||
      // If someone passes a direct Radix Content, handle that too.
      child.type === DialogPrimitive.Content)
  );
}

function extractContent(children: React.ReactNode): React.ReactNode {
  const arr = React.Children.toArray(children);
  const content = arr.find(isContentChild);
  if (!content || !React.isValidElement(content)) return null;
  // Inject forceMount so Radix doesn't unmount under us.
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
