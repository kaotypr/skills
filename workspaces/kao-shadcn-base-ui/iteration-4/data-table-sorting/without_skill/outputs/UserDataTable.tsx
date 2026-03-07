"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

type UserStatus = "active" | "inactive" | "pending";
type UserRole = "admin" | "editor" | "viewer";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

type SortDirection = "asc" | "desc" | null;
type SortableKey = keyof Pick<User, "name" | "email" | "role" | "status">;

interface SortConfig {
  key: SortableKey | null;
  direction: SortDirection;
}

const sampleUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "admin", status: "active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "editor", status: "active" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "viewer", status: "inactive" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "editor", status: "pending" },
  { id: "5", name: "Edward Norton", email: "edward@example.com", role: "viewer", status: "active" },
  { id: "6", name: "Fiona Apple", email: "fiona@example.com", role: "admin", status: "active" },
  { id: "7", name: "George Lucas", email: "george@example.com", role: "viewer", status: "inactive" },
  { id: "8", name: "Hannah Montana", email: "hannah@example.com", role: "editor", status: "pending" },
];

const statusVariantMap: Record<UserStatus, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  inactive: "destructive",
  pending: "secondary",
};

function getStatusVariant(status: UserStatus) {
  return statusVariantMap[status];
}

export default function UserDataTable() {
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    key: null,
    direction: null,
  });

  const handleSort = (key: SortableKey) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return sampleUsers;
    }

    const sorted = [...sampleUsers].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [sortConfig]);

  const handleAction = (action: string, user: User) => {
    console.log(`${action} user:`, user);
  };

  const columns: { key: SortableKey; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>
                <Button
                  variant="ghost"
                  onClick={() => handleSort(column.key)}
                  className="flex items-center gap-1 p-0 hover:bg-transparent font-medium"
                >
                  {column.label}
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
            ))}
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(user.status)} className="capitalize">
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleAction("View Profile", user)}>
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("Edit", user)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction("Delete", user)}
                      className="text-destructive"
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
  );
}
