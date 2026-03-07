"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  ArrowUp,
  ArrowDown,
  ArrowsDownUp,
  DotsThree,
  PencilSimple,
  Trash,
  User,
} from "@phosphor-icons/react"

// ---------- Types ----------

type UserRole = "Admin" | "Editor" | "Viewer"
type UserStatus = "Active" | "Inactive" | "Pending"

interface UserRecord {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

type SortDirection = "asc" | "desc" | null
type SortableKey = keyof Pick<UserRecord, "name" | "email" | "role" | "status">

interface SortConfig {
  key: SortableKey
  direction: SortDirection
}

// ---------- Sample Data ----------

const sampleUsers: UserRecord[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
  { id: "3", name: "Carol Williams", email: "carol@example.com", role: "Viewer", status: "Inactive" },
  { id: "4", name: "David Brown", email: "david@example.com", role: "Editor", status: "Pending" },
  { id: "5", name: "Eva Martinez", email: "eva@example.com", role: "Admin", status: "Active" },
  { id: "6", name: "Frank Lee", email: "frank@example.com", role: "Viewer", status: "Inactive" },
  { id: "7", name: "Grace Kim", email: "grace@example.com", role: "Editor", status: "Active" },
  { id: "8", name: "Henry Davis", email: "henry@example.com", role: "Viewer", status: "Pending" },
]

// ---------- Helpers ----------

const statusStyles: Record<UserStatus, string> = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-400",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
}

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc") return <ArrowUp className="ml-1 inline size-4" />
  if (direction === "desc") return <ArrowDown className="ml-1 inline size-4" />
  return <ArrowsDownUp className="ml-1 inline size-4 opacity-40" />
}

// ---------- Component ----------

export function UserDataTable() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "name",
    direction: null,
  })

  function handleSort(key: SortableKey) {
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: "asc" }
      if (prev.direction === "asc") return { key, direction: "desc" }
      if (prev.direction === "desc") return { key, direction: null }
      return { key, direction: "asc" }
    })
  }

  const sortedUsers = useMemo(() => {
    if (!sortConfig.direction) return sampleUsers

    const sorted = [...sampleUsers].sort((a, b) => {
      const aVal = a[sortConfig.key].toLowerCase()
      const bVal = b[sortConfig.key].toLowerCase()
      if (aVal < bVal) return -1
      if (aVal > bVal) return 1
      return 0
    })

    return sortConfig.direction === "desc" ? sorted.reverse() : sorted
  }, [sortConfig])

  function handleAction(action: string, user: UserRecord) {
    // Replace with real logic
    console.log(`${action}:`, user)
  }

  const columns: { key: SortableKey; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ]

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>
                <button
                  type="button"
                  className="inline-flex items-center font-medium hover:text-foreground"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  <SortIcon
                    direction={sortConfig.key === col.key ? sortConfig.direction : null}
                  />
                </button>
              </TableHead>
            ))}
            <TableHead className="w-12">
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
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[user.status]}`}
                >
                  {user.status}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                    <DotsThree className="size-5" weight="bold" />
                    <span className="sr-only">Open menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleAction("view", user)}>
                      <User className="mr-2 size-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("edit", user)}>
                      <PencilSimple className="mr-2 size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => handleAction("delete", user)}
                    >
                      <Trash className="mr-2 size-4" />
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
