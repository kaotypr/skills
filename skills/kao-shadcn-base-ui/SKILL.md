---
name: kao-shadcn-base-ui
description: >
  Guide for using styled, accessible React components with shadcn/ui's Base UI variant, which uses
  @base-ui/react as its primitive layer instead of Radix UI. Covers component installation,
  theming with Tailwind CSS and CSS variables, forms with React Hook Form and Zod, and UI patterns
  like buttons, dialogs, dropdowns, data tables, and cards. Use this skill whenever the user is
  working with shadcn/ui backed by @base-ui/react, importing from @/components/ui/, or building
  styled React components in a project using this Base UI-based shadcn setup. Also trigger when the
  user mentions shadcn with Base UI, uses the render prop instead of asChild, or references
  data-slot attributes. Even if the user does not explicitly mention shadcn/ui, use this skill when
  they are building React UI in a project that has both shadcn/ui and @base-ui/react installed.
license: MIT
metadata:
  author: kaotypr
  version: "1.0.0"
---

# shadcn/ui Component Patterns

## Overview

Expert guide for building accessible, customizable UI components with shadcn/ui, Base UI (`@base-ui/react`), and Tailwind CSS.

**Important**: shadcn/ui wraps Base UI primitives into styled, themed components under `@/components/ui/`. When building with shadcn/ui, always import from `@/components/ui/*` — never import directly from `@base-ui/react`. Even if you also have a Base UI skill available, the shadcn wrappers are the correct abstraction layer for shadcn/ui projects.

## When to Use

- Setting up a new project with shadcn/ui
- Building forms with React Hook Form and Zod validation
- Creating accessible UI components (buttons, dialogs, dropdowns, sheets)
- Customizing component styling with Tailwind CSS
- Building Next.js applications with TypeScript

## Constraints and Warnings

- **Always import from `@/components/ui/`**: Never import directly from `@base-ui/react` in application code. The shadcn wrappers handle styling, theming, and Base UI composition internally.
- **Not an NPM Package**: Components are copied to your project; you own the code
- **Registry Security**: Verify the registry source is trusted before installation; review generated component code before production use
- **Client Components**: Most components require `"use client"` directive
- **Base UI Dependency**: Single `@base-ui/react` package provides all primitives, but you interact through shadcn wrappers in `@/components/ui/`
- **Never use `asChild`**: Use the `render` prop instead (Base UI, not Radix)
- **`render` prop with Button**: When using `render` to replace the underlying `<button>` with a non-button element (e.g., `<Link>`, `<a>`), pass `nativeButton={false}`. This applies to Button and components built on it: `AlertDialogAction`, `AlertDialogTrigger`, `DialogTrigger`, etc.
- **Floating components**: `Portal > Positioner > Popup` pattern is handled internally by shadcn wrappers — you don't compose these layers yourself
- **Tailwind Required**: Components rely on Tailwind CSS utilities
- **Path Aliases**: Configure `@` alias in tsconfig.json for imports

## Quick Start

```bash
# New project
npx create-next-app@latest my-app --typescript --tailwind --eslint --app
cd my-app
npx shadcn@latest init

# Install components
npx shadcn@latest add button input form card dialog select
```

For existing projects:

```bash
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge
npx shadcn@latest init
```

### Required Dependencies

```json
{
  "dependencies": {
    "@base-ui/react": "^1.2.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "@phosphor-icons/react": "^2.1.7",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

### CSS Variables

Configure theme colors in `globals.css` using HSL variables: `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`. Add `.dark` class overrides for dark mode. See `references/ui-reference.md` for full variable list.

## Core Components

### Button

```bash
npx shadcn@latest add button
```

```tsx
import { Button } from "@/components/ui/button";

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon
<Button variant="destructive" size="sm">Delete</Button>
```

Button as a link — must pass `nativeButton={false}` when rendering a non-button element:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

<Button nativeButton={false} render={<Link href="/signup" />}>
  Get Started
</Button>
```

This also applies to `AlertDialogAction`, `AlertDialogTrigger`, `DialogTrigger`, etc.:

```tsx
<AlertDialogAction nativeButton={false} render={<Link href="/next-step" />}>
  Continue
</AlertDialogAction>
```

### Input & Label

```bash
npx shadcn@latest add input label
```

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
</div>
```

### Forms with Validation

```bash
npx shadcn@latest add form
```

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "" },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>Your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

**Select in form** — use `onValueChange` and `defaultValue`:

```tsx
<FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Checkbox in form** — use `checked` and `onCheckedChange`:

```tsx
<FormField
  control={form.control}
  name="notifications"
  render={({ field }) => (
    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
      <FormControl>
        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
      <div className="space-y-1 leading-none">
        <FormLabel>Email notifications</FormLabel>
      </div>
    </FormItem>
  )}
/>
```

**Switch in form** — use `checked` and `onCheckedChange`:

```tsx
<FormField
  control={form.control}
  name="emailNotifications"
  render={({ field }) => (
    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
      <div className="space-y-0.5">
        <FormLabel className="text-base">Email Notifications</FormLabel>
        <FormDescription>Receive emails about account activity.</FormDescription>
      </div>
      <FormControl>
        <Switch checked={field.value} onCheckedChange={field.onChange} />
      </FormControl>
    </FormItem>
  )}
/>
```

### Card

```bash
npx shadcn@latest add card
```

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent><p>Card Content</p></CardContent>
  <CardFooter><p>Card Footer</p></CardFooter>
</Card>
```

### AlertDialog (Modal)

The project uses **AlertDialog** as its modal component:

```tsx
"use client"

import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
  AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

<AlertDialog>
  <AlertDialogTrigger render={<Button variant="outline" />}>
    Delete Item
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Popover

```tsx
"use client"

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>
    Open Popover
  </PopoverTrigger>
  <PopoverContent side="top" align="center">
    <p className="text-sm">Popover content here.</p>
  </PopoverContent>
</Popover>
```

### DropdownMenu

```tsx
"use client"

import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>
    Open Menu
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

For submenus, checkboxes, and radio items, use `DropdownMenuSub`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`.

### Select

```bash
npx shadcn@latest add select
```

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectContent>
</Select>
```

### Table

```bash
npx shadcn@latest add table
```

```tsx
import {
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

<Table>
  <TableCaption>A list of recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Charts

Built on **Recharts** with `ChartContainer` and `ChartConfig` for consistent theming. See `references/chart.md` for full chart examples (bar, line, area, pie).

```tsx
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
} satisfies import("@/components/ui/chart").ChartConfig

<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <ChartTooltip content={<ChartTooltipContent />} />
  </BarChart>
</ChartContainer>
```

### Sheet, Toast, Menubar

These do not have pre-styled wrappers yet. To build them, use the raw Base UI primitives — consult the **kao-base-ui** skill for the component APIs.

## Customizing Components

Since you own the code, customize directly. Components use `cva` (class-variance-authority) for variant styling and `cn()` for class merging. Example `button.tsx`:

```tsx
"use client"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/ui-utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "border border-input bg-background hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-2.5",
        sm: "h-8 gap-1 px-2.5 text-sm",
        lg: "h-10 gap-1.5 px-2.5",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({ className, variant = "default", size = "default", ...props }:
  ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
}
export { Button, buttonVariants }
```

## Next.js Integration

- Add `"use client"` to interactive components
- Add `<Toaster />` to root layout
- Use `cn()` from `@/lib/utils` for class merging
- Wrap interactive shadcn components in Client Components when used in Server Components

## Key Differences from Standard shadcn/ui

| Standard shadcn/ui | This Project |
|---|---|
| Multiple `@radix-ui/*` packages | Single `@base-ui/react` package |
| `asChild` prop | `render` prop |
| `data-[state=open]` | `data-open` |
| `data-[state=active]` (tabs) | `data-[active]` (tabs) |
| Direct Portal usage | `Portal > Positioner > Popup` (handled by wrappers) |
| `Slot` from `@radix-ui/react-slot` | `render={<Component />}` prop |
| No `data-slot` convention | `data-slot` attributes on all wrappers |
| `lucide-react` icons | `@phosphor-icons/react` icons |

For detailed Base UI primitive API and patterns, consult the `kao-base-ui` skill.

## References

For detailed examples and API docs, see:
- `references/chart.md` — Chart component examples
- `references/ui-reference.md` — Full component API reference
- `references/reference.md` — Additional component patterns
