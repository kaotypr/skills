"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
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

export function DeleteAccountDialog() {
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete your account?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>
                This action cannot be undone. This will permanently delete your
                account and remove all associated data from our servers.
              </p>
              <div className="mt-3 flex items-center gap-1">
                <span className="text-sm text-muted-foreground">
                  Need more info?
                </span>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      aria-label="More information about account deletion"
                      onMouseEnter={() => setPopoverOpen(true)}
                      onMouseLeave={() => setPopoverOpen(false)}
                      onFocus={() => setPopoverOpen(true)}
                      onBlur={() => setPopoverOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4" />
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
                      <h4 className="font-medium leading-none">
                        What happens when you delete your account?
                      </h4>
                      <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                        <li>
                          All your personal data, including profile information,
                          will be permanently erased.
                        </li>
                        <li>
                          Any active subscriptions will be cancelled immediately
                          without a refund.
                        </li>
                        <li>
                          Your content, posts, and comments will be removed and
                          cannot be recovered.
                        </li>
                        <li>
                          You will lose access to any purchased items or
                          services.
                        </li>
                        <li>
                          This action is irreversible. You would need to create a
                          new account to use our services again.
                        </li>
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
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
