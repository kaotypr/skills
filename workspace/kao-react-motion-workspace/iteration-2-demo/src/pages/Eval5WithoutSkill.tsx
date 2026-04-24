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
} from "../../../iteration-2/eval-5-shadcn-dialog-motion-override/without_skill/run-1/outputs/AnimatedDialog"
import { Button } from "@/components/ui/button"
import { PageHeader } from "./PageHeader"

export default function Eval5WithoutSkill() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <PageHeader evalId={5} evalName="shadcn-dialog-motion-override" variant="without-skill" />
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-background">
        <h1 className="text-3xl font-semibold text-foreground">Custom-animated Dialog (baseline)</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Baseline output. Same compound-component API, different internals.
        </p>
        <AnimatedDialog open={open} onOpenChange={setOpen}>
          <AnimatedDialogTrigger asChild>
            <Button>Open animated dialog</Button>
          </AnimatedDialogTrigger>
          <AnimatedDialogContent>
            <AnimatedDialogHeader>
              <AnimatedDialogTitle>Animated header</AnimatedDialogTitle>
              <AnimatedDialogDescription>
                This is the baseline (without-skill) version of the custom-animated dialog.
              </AnimatedDialogDescription>
            </AnimatedDialogHeader>
            <AnimatedDialogBody>
              <p className="text-sm text-muted-foreground">
                Header, body, and footer stagger in sequentially. On close, reverse.
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
