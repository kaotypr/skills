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

type UserStatus = "active" | "inactive" | "pending";
type UserRole = "admin" | "editor" | "viewer";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

type SortKey = keyof Pick<User, "name" | "email" | "role" | "status">;
type SortDirection = "asc" | "desc";

const sampleUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "admin", status: "active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "editor", status: "active" },
  { id: "3", name: "Carol Williams", email: "carol@example.com", role: "viewer", status: "inactive" },
  { id: "4", name: "David Brown", email: "david@example.com", role: "editor", status: "pending" },
  { id: "5", name: "Eva Martinez", email: "eva@example.com", role: "admin", status: "active" },
  { id: "6", name: "Frank Lee", email: "frank@example.com", role: "viewer", status: "inactive" },
  { id: "7", name: "Grace Kim", email: "grace@example.com", role: "editor", status: "active" },
  { id: "8", name: "Henry Davis", email: "henry@example.com", role: "viewer", status: "pending" },
];

const statusVariant: Record<UserStatus, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  inactive: "destructive",
  pending: "outline",
};

export default function UserDataTable() {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedUsers = useMemo(() => {
    return [...sampleUsers].sort((a, b) => {
      const aVal = a[sortKey].toLowerCase();
      const bVal = b[sortKey].toLowerCase();
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortKey, sortDirection]);

  const handleAction = (action: string, user: User) => {
    console.log(`${action} user:`, user);
  };

  const SortableHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(sortKeyName)}
      className="flex items-center gap-1 p-0 hover:bg-transparent"
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
              <SortableHeader label="Name" sortKeyName="name" />
            </TableHead>
            <TableHead>
              <SortableHeader label="Email" sortKeyName="email" />
            </TableHead>
            <TableHead>
              <SortableHeader label="Role" sortKeyName="role" />
            </TableHead>
            <TableHead>
              <SortableHeader label="Status" sortKeyName="status" />
            </TableHead>
            <TableHead className="w-[60px]">Actions</TableHead>
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
                      onClick={() => handleAction("Delete", user)}
                      className="text-red-600"
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
