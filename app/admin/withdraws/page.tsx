"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Types ---
interface WithdrawRequest {
  _id: string;
  userId: { name: string; email: string } | any;
  amount: number;
  method: string;
  accountNumber: string;
  status: "pending" | "completed" | "rejected";
  createdAt: string;
}

export default function AdminWithdrawals() {
  const [data, setData] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch withdrawals from API
  const fetchWithdrawals = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/withdraw?page=${page}&limit=10`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Failed to load withdrawal requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWithdrawals(currentPage);
  }, [currentPage, fetchWithdrawals]);

  // Handle status update (Complete / Reject)
  const handleUpdate = async (id: string, status: "completed" | "rejected") => {
    const toastId = toast.loading(`Processing ${status}...`);
    try {
      const res = await fetch(`/api/admin/withdraw/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message, { id: toastId });
        fetchWithdrawals(currentPage);
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (err) {
      toast.error("An error occurred", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Withdrawal Management</h1>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount & Method</TableHead>
              <TableHead>Payment Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <Loader2 className="animate-spin mx-auto text-indigo-600" />
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="font-semibold">
                      {item.userId?.name || "N/A"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-indigo-600">
                      ৳ {item.amount}
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {item.method}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone size={12} /> {item.accountNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : item.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {item.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-emerald-600 h-8 px-2"
                          onClick={() => handleUpdate(item._id, "completed")}
                        >
                          <CheckCircle size={16} className="mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-rose-600 h-8 px-2"
                          onClick={() => handleUpdate(item._id, "rejected")}
                        >
                          <XCircle size={16} className="mr-1" /> Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-40 text-center text-slate-400"
                >
                  No requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={14} /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
