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
                  className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="More information about account deletion"
                >
                  <Info className="h-4 w-4" weight="bold" />
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Positioner side="top" sideOffset={8} align="center">
                    <Popover.Popup className="z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md">
                      <Popover.Arrow className="fill-popover stroke-border" />
                      <Popover.Title className="mb-1 text-sm font-semibold">
                        What happens when you delete your account
                      </Popover.Title>
                      <Popover.Description className="text-sm text-muted-foreground">
                        Deleting your account will permanently erase all your
                        personal data, projects, settings, and billing history.
                        Any active subscriptions will be cancelled immediately.
                        This action cannot be reversed, and you will need to
                        create a new account if you wish to use our services
                        again.
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
          <AlertDialogAction render={<Button variant="destructive" />}>
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
