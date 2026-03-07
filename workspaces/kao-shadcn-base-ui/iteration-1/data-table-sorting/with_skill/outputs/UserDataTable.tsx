"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UserRole = "Admin" | "Editor" | "Viewer"
type UserStatus = "Active" | "Inactive" | "Pending"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

type SortField = keyof Pick<User, "name" | "email" | "role" | "status">
type SortDirection = "asc" | "desc"

interface SortConfig {
  field: SortField
  direction: SortDirection
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const sampleUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
  { id: "3", name: "Carol White", email: "carol@example.com", role: "Viewer", status: "Inactive" },
  { id: "4", name: "David Brown", email: "david@example.com", role: "Editor", status: "Pending" },
  { id: "5", name: "Eva Martinez", email: "eva@example.com", role: "Admin", status: "Active" },
  { id: "6", name: "Frank Lee", email: "frank@example.com", role: "Viewer", status: "Inactive" },
  { id: "7", name: "Grace Kim", email: "grace@example.com", role: "Editor", status: "Active" },
  { id: "8", name: "Henry Davis", email: "henry@example.com", role: "Viewer", status: "Pending" },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function SortIcon({ field, sortConfig }: { field: SortField; sortConfig: SortConfig | null }) {
  if (sortConfig?.field !== field) {
    return <span className="ml-1 text-muted-foreground/40">&#8597;</span>
  }
  return (
    <span className="ml-1">
      {sortConfig.direction === "asc" ? "\u2191" : "\u2193"}
    </span>
  )
}

function StatusBadge({ status }: { status: UserStatus }) {
  const colors: Record<UserStatus, string> = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UserDataTable() {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => {
      if (prev?.field === field) {
        return prev.direction === "asc"
          ? { field, direction: "desc" }
          : null
      }
      return { field, direction: "asc" }
    })
  }

  const sortedUsers = useMemo(() => {
    if (!sortConfig) return sampleUsers

    return [...sampleUsers].sort((a, b) => {
      const aVal = a[sortConfig.field]
      const bVal = b[sortConfig.field]
      const cmp = aVal.localeCompare(bVal)
      return sortConfig.direction === "asc" ? cmp : -cmp
    })
  }, [sortConfig])

  const handleAction = (action: string, user: User) => {
    // Replace with real logic as needed
    console.log(`${action}: ${user.name} (${user.id})`)
  }

  const sortableHeaders: { label: string; field: SortField }[] = [
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Role", field: "role" },
    { label: "Status", field: "status" },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>A list of registered users.</TableCaption>
        <TableHeader>
          <TableRow>
            {sortableHeaders.map(({ label, field }) => (
              <TableHead key={field}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
                  onClick={() => handleSort(field)}
                >
                  {label}
                  <SortIcon field={field} sortConfig={sortConfig} />
                </button>
              </TableHead>
            ))}
            <TableHead className="w-[70px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <StatusBadge status={user.status} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                    <span className="sr-only">Open menu</span>
                    &#8943;
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => handleAction("View Profile", user)}>
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAction("Edit", user)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => handleAction("Delete", user)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
