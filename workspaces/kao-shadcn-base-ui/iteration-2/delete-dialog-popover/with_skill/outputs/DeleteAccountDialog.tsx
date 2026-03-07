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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Question } from "@phosphor-icons/react"

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
            This action is permanent and cannot be undone.{" "}
            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full align-middle text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Learn more about account deletion"
                  />
                }
              >
                <Question className="h-4 w-4" aria-hidden="true" />
              </PopoverTrigger>
              <PopoverContent side="top" align="center" sideOffset={8}>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    What happens when you delete your account?
                  </p>
                  <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                    <li>All personal data will be permanently erased.</li>
                    <li>Your subscriptions and billing history will be removed.</li>
                    <li>Any content you created will be deleted.</li>
                    <li>This action cannot be reversed after confirmation.</li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
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
