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

// ── Types ───────────────────────────────────────────────────────────────

type Role = "Admin" | "Editor" | "Viewer";
type Status = "Active" | "Inactive" | "Pending";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
}

type SortKey = keyof Pick<User, "name" | "email" | "role" | "status">;
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

// ── Sample data ─────────────────────────────────────────────────────────

const sampleUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
  { id: "3", name: "Carol White", email: "carol@example.com", role: "Viewer", status: "Inactive" },
  { id: "4", name: "David Brown", email: "david@example.com", role: "Editor", status: "Pending" },
  { id: "5", name: "Eve Davis", email: "eve@example.com", role: "Admin", status: "Active" },
  { id: "6", name: "Frank Miller", email: "frank@example.com", role: "Viewer", status: "Inactive" },
  { id: "7", name: "Grace Lee", email: "grace@example.com", role: "Editor", status: "Active" },
  { id: "8", name: "Hank Wilson", email: "hank@example.com", role: "Viewer", status: "Pending" },
];

// ── Helpers ─────────────────────────────────────────────────────────────

function statusVariant(status: Status): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "Active":
      return "default";
    case "Inactive":
      return "destructive";
    case "Pending":
      return "secondary";
  }
}

// ── Component ───────────────────────────────────────────────────────────

export default function UserDataTable() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "name", direction: "asc" });

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedUsers = useMemo(() => {
    const sorted = [...sampleUsers];
    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key].toLowerCase();
      const bVal = b[sortConfig.key].toLowerCase();
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [sortConfig]);

  const handleAction = (action: string, user: User) => {
    // Replace with real logic as needed.
    console.log(`${action} user:`, user);
  };

  const columns: { label: string; key: SortKey }[] = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Status", key: "status" },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
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
                <Badge variant={statusVariant(user.status)}>{user.status}</Badge>
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
