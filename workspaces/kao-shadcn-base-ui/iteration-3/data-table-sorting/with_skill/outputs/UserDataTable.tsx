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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  CaretUp,
  CaretDown,
  DotsThreeVertical,
  Pencil,
  Trash,
  User,
} from "@phosphor-icons/react"

// --- Types ---

type UserRole = "Admin" | "Editor" | "Viewer"
type UserStatus = "Active" | "Inactive" | "Pending"

interface UserRecord {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

type SortField = keyof Pick<UserRecord, "name" | "email" | "role" | "status">
type SortDirection = "asc" | "desc"

interface SortConfig {
  field: SortField
  direction: SortDirection
}

// --- Sample Data ---

const sampleUsers: UserRecord[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Admin", status: "Active" },
  { id: "5", name: "Ethan Hunt", email: "ethan@example.com", role: "Editor", status: "Pending" },
  { id: "6", name: "Fiona Green", email: "fiona@example.com", role: "Viewer", status: "Active" },
  { id: "7", name: "George Miller", email: "george@example.com", role: "Editor", status: "Inactive" },
  { id: "8", name: "Hannah Lee", email: "hannah@example.com", role: "Admin", status: "Pending" },
]

// --- Status Badge ---

const statusStyles: Record<UserStatus, string> = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
}

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  )
}

// --- Sortable Header ---

function SortableHeader({
  label,
  field,
  sortConfig,
  onSort,
}: {
  label: string
  field: SortField
  sortConfig: SortConfig | null
  onSort: (field: SortField) => void
}) {
  const isActive = sortConfig?.field === field
  const direction = isActive ? sortConfig.direction : null

  return (
    <TableHead>
      <button
        type="button"
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors -ml-2 px-2 py-1 rounded-md hover:bg-muted"
        onClick={() => onSort(field)}
      >
        {label}
        <span className="flex flex-col">
          <CaretUp
            size={12}
            weight={direction === "asc" ? "bold" : "regular"}
            className={direction === "asc" ? "text-foreground" : "text-muted-foreground/40"}
          />
          <CaretDown
            size={12}
            weight={direction === "desc" ? "bold" : "regular"}
            className={direction === "desc" ? "text-foreground" : "text-muted-foreground/40"}
          />
        </span>
      </button>
    </TableHead>
  )
}

// --- Row Actions ---

function RowActions({
  user,
  onEdit,
  onDelete,
  onViewProfile,
}: {
  user: UserRecord
  onEdit: (user: UserRecord) => void
  onDelete: (user: UserRecord) => void
  onViewProfile: (user: UserRecord) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
        <DotsThreeVertical size={18} />
        <span className="sr-only">Actions for {user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onViewProfile(user)}>
          <User size={16} className="mr-2" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <Pencil size={16} className="mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(user)}>
          <Trash size={16} className="mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// --- Main Component ---

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

      const comparison = aVal.localeCompare(bVal)
      return sortConfig.direction === "asc" ? comparison : -comparison
    })
  }, [sortConfig])

  const handleEdit = (user: UserRecord) => {
    console.log("Edit user:", user.id, user.name)
  }

  const handleDelete = (user: UserRecord) => {
    console.log("Delete user:", user.id, user.name)
  }

  const handleViewProfile = (user: UserRecord) => {
    console.log("View profile:", user.id, user.name)
  }

  return (
    <div className="w-full rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHeader label="Name" field="name" sortConfig={sortConfig} onSort={handleSort} />
            <SortableHeader label="Email" field="email" sortConfig={sortConfig} onSort={handleSort} />
            <SortableHeader label="Role" field="role" sortConfig={sortConfig} onSort={handleSort} />
            <SortableHeader label="Status" field="status" sortConfig={sortConfig} onSort={handleSort} />
            <TableHead className="w-[60px]">
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
                <RowActions
                  user={user}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewProfile={handleViewProfile}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
