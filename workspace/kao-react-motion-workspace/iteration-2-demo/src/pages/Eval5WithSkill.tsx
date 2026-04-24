import { useState } from "react"
import {
  AnimatedDialog,
  AnimatedDialogTrigger,
  AnimatedDialogContent,
  AnimatedDialogHeader,
  AnimatedDialogBody,
  AnimatedDialogFooter,
  AnimatedDialogTitle,
  AnimatedDialogDescription,
  AnimatedDialogClose,
} from "../../../iteration-2/eval-5-shadcn-dialog-motion-override/with_skill/run-1/outputs/AnimatedDialog"
import { Button } from "@/components/ui/button"
import { PageHeader } from "./PageHeader"

export default function Eval5WithSkill() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <PageHeader evalId={5} evalName="shadcn-dialog-motion-override" variant="with-skill" />
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-background">
        <h1 className="text-3xl font-semibold text-foreground">Custom-animated Dialog</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Click the button. The container springs in from scale 0.8 + y 20; header / body / footer stagger in after.
        </p>
        <AnimatedDialog open={open} onOpenChange={setOpen}>
          <AnimatedDialogTrigger asChild>
            <Button>Open animated dialog</Button>
          </AnimatedDialogTrigger>
          <AnimatedDialogContent>
            <AnimatedDialogHeader>
              <AnimatedDialogTitle>Animated header</AnimatedDialogTitle>
              <AnimatedDialogDescription>
                This dialog's open/close is driven by Motion, overriding the default tw-animate-css transition shadcn
                ships with.
              </AnimatedDialogDescription>
            </AnimatedDialogHeader>
            <AnimatedDialogBody>
              <p className="text-sm text-muted-foreground">
                Header, body, and footer stagger in sequentially after the container finishes its spring. On close, the
                sequence reverses.
              </p>
            </AnimatedDialogBody>
            <AnimatedDialogFooter>
              <AnimatedDialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </AnimatedDialogClose>
              <Button onClick={() => setOpen(false)}>Continue</Button>
            </AnimatedDialogFooter>
          </AnimatedDialogContent>
        </AnimatedDialog>
      </div>
    </>
  )
}
