"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Users,
  DollarSign,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async (currentPage: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/jobs?page=${currentPage}&limit=6`);
      const result = await res.json();

      if (res.ok && result.success) {
        setJobs(result.data);
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        toast.error(result.message || "Failed to load jobs");
      }
    } catch (error) {
      toast.error("Network error: Could not fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Job deleted successfully");
        if (jobs.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchJobs(page);
        }
      } else {
        toast.error(result.message || "Delete failed");
      }
    } catch (error) {
      toast.error("An error occurred during deletion");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Job Management</h1>
        <Link
          href="/admin/jobs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <Plus size={18} /> Post New Job
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: any) => (
              <div
                key={job._id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      job.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {job.status}
                  </span>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="text-gray-400 hover:text-red-500 transition">
                        <Trash2 size={18} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the job "<strong>{job.title}</strong>".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(job._id)}
                          className="bg-red-500 hover:bg-red-600 rounded-xl"
                        >
                          Delete Job
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
                  {job.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Users size={14} /> {job.completedCount}/
                    {job.totalVacancies}
                  </div>
                  <div className="flex items-center gap-1 font-bold text-blue-600">
                    <DollarSign size={14} /> {job.reward}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    ID: {job._id?.slice(-6)}
                  </span>
                  <Link
                    href={`/admin/jobs/edit/${job._id}`}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Edit Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 pt-10 pb-10">
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-50 transition shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        page === i + 1
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-white text-gray-600 hover:bg-gray-100 border border-transparent"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-50 transition shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && jobs.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-gray-400">
          No jobs found.
        </div>
      )}
    </div>
  );
}
