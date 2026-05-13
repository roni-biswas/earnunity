"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Search,
  MoreVertical,
  UserMinus,
  ShieldCheck,
  Edit3,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// --- Types & Interfaces ---
interface User {
  _id: string;
  name: string;
  email: string;
  balance: number;
  isBanned: boolean;
  createdAt: string;
}

interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface UserApiResponse {
  success: boolean;
  data: User[];
  pagination: PaginationData;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Edit Balance States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newBalance, setNewBalance] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchUsers = useCallback(async (page: number, query: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?page=${page}&limit=10&search=${query}`,
      );
      const result: UserApiResponse = await res.json();

      if (result.success) {
        setUsers(result.data);
        setTotalPages(result.pagination.totalPages);
        setCurrentPage(result.pagination.currentPage);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error("User Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(currentPage, search);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, search, fetchUsers]);

  const handleUpdateBalance = async () => {
    if (!selectedUser) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUser._id}/balance`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: newBalance }),
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Balance updated successfully");
        setSelectedUser(null);
        fetchUsers(currentPage, search);
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error) {
      toast.error("An error occurred during update");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <Badge variant="outline" className="bg-white">
          Total List: {users.length}
        </Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search by name or email..."
          className="pl-10 h-11 rounded-xl"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>User Details</TableHead>
              <TableHead>Wallet Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-indigo-600" />
                    <span className="text-slate-500">Loading Users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="font-semibold text-slate-800">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <Wallet size={14} className="text-emerald-500" />৳{" "}
                      {user.balance.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.isBanned ? "destructive" : "secondary"}
                      className={
                        !user.isBanned
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                          : ""
                      }
                    >
                      {user.isBanned ? "Banned" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setNewBalance(user.balance);
                          }}
                        >
                          <Edit3 size={14} className="mr-2 text-indigo-600" />{" "}
                          Edit Balance
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className={
                            user.isBanned ? "text-emerald-600" : "text-rose-600"
                          }
                        >
                          {user.isBanned ? (
                            <ShieldCheck size={14} className="mr-2" />
                          ) : (
                            <UserMinus size={14} className="mr-2" />
                          )}
                          {user.isBanned ? "Unban User" : "Ban User"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-40 text-center text-slate-400"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
          <p className="text-sm text-slate-500">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft size={16} /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || loading}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Balance Dialog */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Balance</DialogTitle>
            <p className="text-sm text-slate-500">
              Adjusting balance for {selectedUser?.name}
            </p>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="balance">Amount (৳)</Label>
              <Input
                id="balance"
                type="number"
                value={newBalance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewBalance(Number(e.target.value))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              onClick={handleUpdateBalance}
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
