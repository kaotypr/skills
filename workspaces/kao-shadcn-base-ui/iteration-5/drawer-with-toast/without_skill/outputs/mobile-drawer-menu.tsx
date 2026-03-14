"use client";

import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Menu, Settings, User, LogOut, Bell, HelpCircle } from "lucide-react";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  action: string;
  destructive?: boolean;
}

const menuItems: MenuItem[] = [
  { label: "Profile", icon: <User className="h-5 w-5" />, action: "profile" },
  {
    label: "Notifications",
    icon: <Bell className="h-5 w-5" />,
    action: "notifications",
  },
  {
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    action: "settings",
  },
  {
    label: "Help & Support",
    icon: <HelpCircle className="h-5 w-5" />,
    action: "help",
  },
  {
    label: "Sign Out",
    icon: <LogOut className="h-5 w-5" />,
    action: "sign-out",
    destructive: true,
  },
];

export default function MobileDrawerMenu() {
  const [open, setOpen] = React.useState(false);

  function handleMenuAction(item: MenuItem) {
    setOpen(false);

    if (item.destructive) {
      toast.warning(`${item.label}`, {
        description: `You selected "${item.label}". Are you sure?`,
      });
    } else {
      toast.success(`${item.label}`, {
        description: `Navigating to ${item.label}.`,
      });
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerDescription>Choose an action below.</DrawerDescription>
        </DrawerHeader>

        <nav className="flex flex-col gap-1 px-4 pb-2">
          {menuItems.map((item) => (
            <button
              key={item.action}
              onClick={() => handleMenuAction(item)}
              className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors
                ${
                  item.destructive
                    ? "text-destructive hover:bg-destructive/10"
                    : "text-foreground hover:bg-accent"
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
