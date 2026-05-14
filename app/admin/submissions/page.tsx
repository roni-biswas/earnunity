"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Image Modal State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Pagination State
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchSubmissions = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/submissions?page=${page}&limit=${pagination.limit}`,
      );
      const result = await res.json();
      if (result.success) {
        setSubmissions(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(pagination.page);
  }, [pagination.page]);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status.toLowerCase() }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`Submission ${status}!`);

        setSubmissions((prev) => prev.filter((s: any) => s._id !== id));

        if (submissions.length === 1 && pagination.page > 1) {
          setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        } else {
          fetchSubmissions(pagination.page);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && submissions.length === 0) {
    return (
      <div className="flex justify-center items-center h-full p-10">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Review Submissions
        </h1>
        <p className="text-slate-600 mt-2 text-lg">
          Approve or reject user work proofs to complete the task.
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-slate-100/50">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                User
              </th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Task Details
              </th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Proof Text
              </th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Screenshot
              </th>
              <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.map((sub: any) => (
              <tr
                key={sub._id}
                className="hover:bg-slate-50 transition duration-150"
              >
                <td className="p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    {sub.userId?.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {sub.userId?.email}
                  </p>
                </td>
                <td className="p-5">
                  <p className="text-sm font-medium text-slate-800">
                    {sub.jobId?.title}
                  </p>
                  <p className="text-xs font-bold text-green-600 mt-1">
                    ${sub.jobId?.reward}
                  </p>
                </td>
                <td className="p-5">
                  <div
                    className="max-w-62.5 text-sm text-slate-600 truncate"
                    title={sub.proofText}
                  >
                    {sub.proofText}
                  </div>
                </td>
                <td className="p-5">
                  {sub.proofImage ? (
                    <button
                      onClick={() => setSelectedImage(sub.proofImage)}
                      className="flex items-center gap-2 text-blue-600 text-xs font-semibold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Screenshot
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">No Image</span>
                  )}
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2.5">
                    <button
                      disabled={processingId === sub._id}
                      onClick={() => handleAction(sub._id, "approved")}
                      className="p-2.5 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition disabled:opacity-50"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      disabled={processingId === sub._id}
                      onClick={() => handleAction(sub._id, "rejected")}
                      className="p-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition disabled:opacity-50"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🛑 Empty State */}
        {submissions.length === 0 && !loading && (
          <div className="py-16 text-center text-slate-500 flex flex-col items-center gap-4">
            <CheckCircle className="w-12 h-12 text-slate-300" />
            No pending submissions found.
          </div>
        )}

        {/* 📄 Pagination UI */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Page{" "}
            <span className="font-semibold text-slate-900">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {pagination.totalPages}
            </span>{" "}
            ({pagination.total} total items)
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              title="pagination"
              type="button"
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              title="pagination"
              type="button"
              disabled={pagination.page === pagination.totalPages}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 🖼️ Image Modal Popup */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-999 p-4 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl p-3 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              title="Close Modal"
              type="button"
              className="absolute top-4 right-4 z-10 p-2.5 bg-slate-100 rounded-full text-slate-600 hover:bg-red-100 hover:text-red-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Container - Ekhane 'relative' ebong 'h-full' ba fixed height lagbe */}
            <div className="relative flex-1 w-full min-h-75 md:min-h-125 mt-10 overflow-hidden">
              <Image
                src={selectedImage}
                alt="Proof Screenshot"
                fill
                className="rounded-xl object-contain" // 'w-full h-auto' dorkar nai fill thakle
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
