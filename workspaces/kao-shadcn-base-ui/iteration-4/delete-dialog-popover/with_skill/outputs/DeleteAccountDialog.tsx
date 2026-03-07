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
import { Info } from "@phosphor-icons/react"

export function DeleteAccountDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete Account
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="flex items-center gap-2">
              Delete your account?
              <Popover>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      aria-label="Learn more about account deletion"
                      className="inline-flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  }
                >
                  <Info size={18} weight="regular" />
                </PopoverTrigger>
                <PopoverContent side="top" align="center" className="w-72">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">What happens when you delete your account?</p>
                    <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                      <li>All personal data will be permanently erased.</li>
                      <li>Your subscription and billing history will be removed.</li>
                      <li>Any content you created will be deleted.</li>
                      <li>This action cannot be reversed after the 30-day grace period.</li>
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your account and remove all associated
            data from our servers. This action cannot be undone.
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
