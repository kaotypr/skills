"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface WarningConfirmationDialogProps {
  /** Text displayed on the trigger button. */
  triggerLabel?: string
  /** Dialog title shown in the header. */
  title?: string
  /** Descriptive text explaining the consequences of the action. */
  description?: string
  /** Label for the cancel button. */
  cancelLabel?: string
  /** Label for the confirm/action button. */
  confirmLabel?: string
  /** Callback invoked when the user confirms the action. */
  onConfirm?: () => void
  /** Optional children rendered as the trigger instead of the default button. */
  children?: React.ReactNode
}

export function WarningConfirmationDialog({
  triggerLabel = "Proceed",
  title = "Are you sure?",
  description = "This action may have consequences. Please confirm you want to proceed.",
  cancelLabel = "Cancel",
  confirmLabel = "Continue",
  onConfirm,
  children,
}: WarningConfirmationDialogProps) {
  return (
    <AlertDialog>
      {children ? (
        <AlertDialogTrigger render={<>{children}</>} />
      ) : (
        <AlertDialogTrigger render={<Button variant="warning" />}>
          {triggerLabel}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            render={<Button variant="warning" />}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
