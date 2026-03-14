"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface WarningConfirmationDialogProps {
  /** The element that triggers the dialog (rendered inside DialogTrigger). */
  trigger?: React.ReactNode
  /** Dialog title. */
  title?: string
  /** Descriptive message shown in the dialog body. */
  description?: string
  /** Label for the confirm button. */
  confirmLabel?: string
  /** Label for the cancel button. */
  cancelLabel?: string
  /** Called when the user confirms the action. */
  onConfirm?: () => void | Promise<void>
  /** Called when the user cancels. */
  onCancel?: () => void
  /** Controlled open state. */
  open?: boolean
  /** Callback when the open state changes (controlled mode). */
  onOpenChange?: (open: boolean) => void
}

export function WarningConfirmationDialog({
  trigger,
  title = "Are you sure?",
  description = "This action may have unintended consequences. Please confirm you want to proceed.",
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  open,
  onOpenChange,
}: WarningConfirmationDialogProps) {
  const [loading, setLoading] = React.useState(false)
  const [internalOpen, setInternalOpen] = React.useState(false)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (isControlled) {
        onOpenChange?.(value)
      } else {
        setInternalOpen(value)
      }
    },
    [isControlled, onOpenChange]
  )

  const handleConfirm = async () => {
    if (!onConfirm) {
      setOpen(false)
      return
    }

    try {
      setLoading(true)
      await onConfirm()
      setOpen(false)
    } catch {
      // Let the caller handle errors; keep the dialog open.
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="mt-1">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            variant="warning"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Processing..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
