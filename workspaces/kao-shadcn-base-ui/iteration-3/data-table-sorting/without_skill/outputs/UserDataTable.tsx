"use client";

import React, { useState, useMemo } from "react";
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

// Types
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

// Sample data
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

// Status badge variant mapping
const statusVariant: Record<UserStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "destructive",
  pending: "secondary",
};

export default function UserDataTable() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
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

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return sampleUsers;

    const key = sortConfig.key;
    const direction = sortConfig.direction;

    return [...sampleUsers].sort((a, b) => {
      const aVal = a[key].toLowerCase();
      const bVal = b[key].toLowerCase();
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortConfig]);

  const handleAction = (action: string, user: User) => {
    console.log(`${action} user:`, user);
  };

  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: SortableKey }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(sortKey)}
      className="flex items-center gap-1 -ml-4"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortableHeader label="Name" sortKey="name" />
            </TableHead>
            <TableHead>
              <SortableHeader label="Email" sortKey="email" />
            </TableHead>
            <TableHead>
              <SortableHeader label="Role" sortKey="role" />
            </TableHead>
            <TableHead>
              <SortableHeader label="Status" sortKey="status" />
            </TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[user.status]} className="capitalize">
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
                      className="text-destructive"
                      onClick={() => handleAction("Delete", user)}
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
