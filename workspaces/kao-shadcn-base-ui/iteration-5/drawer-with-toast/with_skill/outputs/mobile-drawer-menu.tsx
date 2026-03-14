"use client"

import * as React from "react"
import { toast } from "sonner"
import { List, User, Gear, SignOut, Bell, Moon, Info } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Separator } from "@/components/ui/separator"

interface MenuItem {
  label: string
  icon: React.ReactNode
  description?: string
  variant?: "default" | "destructive"
  action: () => void
}

function MenuItemButton({
  item,
  onClose,
}: {
  item: MenuItem
  onClose: () => void
}) {
  const handleClick = () => {
    item.action()
    onClose()
  }

  return (
    <button
      onClick={handleClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors hover:bg-muted active:bg-muted/80 ${
        item.variant === "destructive"
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground"
      }`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {item.icon}
      </span>
      <div className="flex flex-col">
        <span className="font-medium">{item.label}</span>
        {item.description && (
          <span className="text-xs text-muted-foreground">
            {item.description}
          </span>
        )}
      </div>
    </button>
  )
}

export function MobileDrawerMenu() {
  const [open, setOpen] = React.useState(false)

  const handleClose = () => setOpen(false)

  const menuItems: MenuItem[] = [
    {
      label: "Profile",
      icon: <User size={18} />,
      description: "View and edit your profile",
      action: () =>
        toast("Profile opened", {
          description: "Navigating to your profile settings.",
        }),
    },
    {
      label: "Notifications",
      icon: <Bell size={18} />,
      description: "Manage your notifications",
      action: () =>
        toast("Notifications", {
          description: "You have 3 unread notifications.",
          action: {
            label: "View all",
            onClick: () => toast.info("Showing all notifications"),
          },
        }),
    },
    {
      label: "Settings",
      icon: <Gear size={18} />,
      description: "App preferences and configuration",
      action: () =>
        toast.success("Settings opened", {
          description: "Your preferences have been loaded.",
        }),
    },
    {
      label: "Dark Mode",
      icon: <Moon size={18} />,
      description: "Toggle dark mode appearance",
      action: () =>
        toast("Theme toggled", {
          description: "Dark mode preference has been updated.",
        }),
    },
    {
      label: "About",
      icon: <Info size={18} />,
      description: "App version and info",
      action: () =>
        toast.info("App v1.0.0", {
          description: "Built with shadcn/ui and Base UI.",
        }),
    },
  ]

  const destructiveItem: MenuItem = {
    label: "Sign Out",
    icon: <SignOut size={18} />,
    description: "Log out of your account",
    variant: "destructive",
    action: () =>
      toast.warning("Signed out", {
        description: "You have been logged out successfully.",
      }),
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={<Button variant="outline" size="icon" />}>
        <List size={20} />
        <span className="sr-only">Open menu</span>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerDescription>
              Choose an action from the list below.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-2">
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <MenuItemButton
                  key={item.label}
                  item={item}
                  onClose={handleClose}
                />
              ))}
            </nav>

            <Separator className="my-2" />

            <MenuItemButton item={destructiveItem} onClose={handleClose} />
          </div>

          <DrawerFooter>
            <DrawerClose render={<Button variant="outline" />}>
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
