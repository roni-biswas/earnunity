"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner"; // Assuming you use sonner or similar for notifications

interface WithdrawalRequest {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  method: string;
  accountNumber: string;
  status: "pending" | "completed" | "rejected";
  createdAt: string;
}

export default function AdminWithdrawals() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch all withdrawal requests
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/withdraw/history");
      const result = await res.json();
      if (result.success) {
        setRequests(result.data);
      } else {
        toast.error(result.message || "Failed to load data");
      }
    } catch (error) {
      toast.error("Failed to load withdrawal requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Handle Approve/Reject Action
  const handleAction = async (id: string, status: "completed" | "rejected") => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/withdraw/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`Request ${status} successfully`);
        fetchRequests(); // Refresh data
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">
          Withdrawal Requests
        </h1>
        <Badge variant="outline" className="text-slate-500">
          Total: {requests.length}
        </Badge>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Account No</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((req) => (
              <TableRow key={req._id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-900">
                      {req.userId?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {req.userId?.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{req.method}</TableCell>
                <TableCell className="font-bold text-slate-900">
                  ৳ {req.amount}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {req.accountNumber}
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      req.status === "pending"
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        : req.status === "completed"
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "bg-rose-100 text-rose-700 hover:bg-rose-100"
                    }
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {req.status === "pending" ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        disabled={!!actionLoading}
                        onClick={() => handleAction(req._id, "completed")}
                      >
                        {actionLoading === req._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle size={14} className="mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-rose-600 border-rose-200 hover:bg-rose-50"
                        disabled={!!actionLoading}
                        onClick={() => handleAction(req._id, "rejected")}
                      >
                        <XCircle size={14} className="mr-1" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Processed</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {requests.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-slate-400"
                >
                  No withdrawal requests found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
