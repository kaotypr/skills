"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export default function DeleteAccountDialog() {
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete your account?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-sm text-muted-foreground">
              <p>
                This action cannot be undone. This will permanently delete your
                account and remove all associated data from our servers.
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span>Need more details?</span>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label="More information about account deletion"
                      onMouseEnter={() => setPopoverOpen(true)}
                      onMouseLeave={() => setPopoverOpen(false)}
                      onFocus={() => setPopoverOpen(true)}
                      onBlur={() => setPopoverOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80"
                    side="top"
                    align="start"
                    onMouseEnter={() => setPopoverOpen(true)}
                    onMouseLeave={() => setPopoverOpen(false)}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">What happens when you delete your account?</h4>
                      <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                        <li>All personal data (name, email, profile) will be permanently erased.</li>
                        <li>Your posts, comments, and uploaded files will be removed.</li>
                        <li>Active subscriptions will be cancelled immediately with no refund.</li>
                        <li>You will lose access to any shared workspaces or teams.</li>
                        <li>This action is irreversible and cannot be recovered.</li>
                      </ul>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive">Confirm</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
