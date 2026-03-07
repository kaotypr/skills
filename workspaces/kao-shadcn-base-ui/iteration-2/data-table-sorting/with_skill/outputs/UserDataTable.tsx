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

// --- Types ---

type UserRole = "Admin" | "Editor" | "Viewer" | "Moderator"
type UserStatus = "Active" | "Inactive" | "Pending"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

type SortKey = keyof Pick<User, "name" | "email" | "role" | "status">
type SortDirection = "asc" | "desc"

interface SortConfig {
  key: SortKey
  direction: SortDirection
}

// --- Sample Data ---

const sampleUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Moderator", status: "Active" },
  { id: "5", name: "Edward Norton", email: "edward@example.com", role: "Viewer", status: "Pending" },
  { id: "6", name: "Fiona Apple", email: "fiona@example.com", role: "Editor", status: "Active" },
  { id: "7", name: "George Martin", email: "george@example.com", role: "Admin", status: "Inactive" },
  { id: "8", name: "Hannah Lee", email: "hannah@example.com", role: "Viewer", status: "Pending" },
]

// --- Status Badge ---

function StatusBadge({ status }: { status: UserStatus }) {
  const colorMap: Record<UserStatus, string> = {
    Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[status]}`}
    >
      {status}
    </span>
  )
}

// --- Sort Icon ---

function SortIcon({ direction }: { direction: SortDirection | null }) {
  if (direction === "asc") {
    return <span className="ml-1 inline-block text-xs" aria-label="sorted ascending">&#9650;</span>
  }
  if (direction === "desc") {
    return <span className="ml-1 inline-block text-xs" aria-label="sorted descending">&#9660;</span>
  }
  return <span className="ml-1 inline-block text-xs text-muted-foreground/40">&#9650;&#9660;</span>
}

// --- Main Component ---

export function UserDataTable() {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === "asc"
          ? { key, direction: "desc" }
          : null
      }
      return { key, direction: "asc" }
    })
  }

  const sortedUsers = useMemo(() => {
    if (!sortConfig) return sampleUsers

    const { key, direction } = sortConfig
    return [...sampleUsers].sort((a, b) => {
      const aVal = a[key].toLowerCase()
      const bVal = b[key].toLowerCase()
      if (aVal < bVal) return direction === "asc" ? -1 : 1
      if (aVal > bVal) return direction === "asc" ? 1 : -1
      return 0
    })
  }, [sortConfig])

  const getSortDirection = (key: SortKey): SortDirection | null => {
    if (sortConfig?.key === key) return sortConfig.direction
    return null
  }

  const handleAction = (action: string, user: User) => {
    // Replace with real logic as needed
    console.log(`${action} user:`, user)
  }

  const sortableHeaders: { key: SortKey; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>A list of registered users.</TableCaption>
        <TableHeader>
          <TableRow>
            {sortableHeaders.map(({ key, label }) => (
              <TableHead key={key}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors font-medium"
                  onClick={() => handleSort(key)}
                  aria-sort={
                    getSortDirection(key) === "asc"
                      ? "ascending"
                      : getSortDirection(key) === "desc"
                        ? "descending"
                        : "none"
                  }
                >
                  {label}
                  <SortIcon direction={getSortDirection(key)} />
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
                    <span aria-hidden="true" className="text-lg leading-none">&#8943;</span>
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

export default UserDataTable
