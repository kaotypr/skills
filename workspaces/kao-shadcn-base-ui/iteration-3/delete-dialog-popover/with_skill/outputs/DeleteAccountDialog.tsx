"use client"

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
import { Popover } from "@base-ui/react/popover"
import { Info } from "@phosphor-icons/react"

export function DeleteAccountDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete Account
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent and cannot be undone. All of your data will
            be removed from our servers.
            <span className="ml-1 inline-flex align-middle">
              <Popover.Root>
                <Popover.Trigger
                  openOnHover
                  delay={200}
                  closeDelay={100}
                  className="inline-flex cursor-help items-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  aria-label="More information about account deletion"
                >
                  <Info size={16} weight="bold" aria-hidden="true" />
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Positioner side="top" sideOffset={8} align="center">
                    <Popover.Popup className="z-50 w-72 rounded-md border bg-popover p-4 text-sm text-popover-foreground shadow-md">
                      <Popover.Arrow className="fill-popover stroke-border" />
                      <Popover.Title className="mb-1 font-semibold">
                        What happens when you delete?
                      </Popover.Title>
                      <Popover.Description className="text-muted-foreground">
                        Deleting your account will permanently erase all your
                        personal data, project history, billing records, and API
                        keys. Active subscriptions will be cancelled immediately
                        with no refund. This cannot be reversed.
                      </Popover.Description>
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            render={<Button variant="destructive" />}
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
