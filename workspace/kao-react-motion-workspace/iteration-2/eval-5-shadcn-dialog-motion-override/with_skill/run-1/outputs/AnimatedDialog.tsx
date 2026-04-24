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

/**
 * Motion-driven drop-in replacement for a single shadcn Dialog.
 *
 * Enter: container springs from { opacity: 0, scale: 0.8, y: 20 } → identity.
 *        Header / Body / Footer stagger in after the container starts.
 * Exit:  reversed — children animate out first (`when: "afterChildren"`),
 *        then the container springs back down.
 *
 * Usage:
 *
 *   <AnimatedDialog open={open} onOpenChange={setOpen}>
 *     <AnimatedDialogContent>
 *       <AnimatedDialogHeader>
 *         <AnimatedDialogTitle>Title</AnimatedDialogTitle>
 *         <AnimatedDialogDescription>Description</AnimatedDialogDescription>
 *       </AnimatedDialogHeader>
 *       <AnimatedDialogBody>Body content…</AnimatedDialogBody>
 *       <AnimatedDialogFooter>
 *         <Button>Confirm</Button>
 *       </AnimatedDialogFooter>
 *     </AnimatedDialogContent>
 *   </AnimatedDialog>
 */
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
