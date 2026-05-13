"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  AlertTriangle,
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

export default function AdminJobsList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Wrapped in useCallback to prevent unnecessary re-renders
  const fetchJobs = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        // Ensure the API URL matches your backend route exactly
        const res = await fetch(`/api/admin/jobs?page=${page}&limit=${limit}`);
        const result = await res.json();

        if (result.success) {
          setJobs(result.data);
          // Correctly mapping pagination data from your API structure
          setTotalPages(result.pagination?.totalPages || 1);
          setCurrentPage(result.pagination?.currentPage || 1);
        }
      } catch (error) {
        toast.error("Failed to load jobs");
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, fetchJobs]);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        toast.success("Job deleted successfully");
        // If current page becomes empty after delete, go back a page
        if (jobs.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          fetchJobs(currentPage);
        }
      } else {
        toast.error(result.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Error deleting job");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Job Management</h1>
          <p className="text-sm text-muted-foreground">
            Total Pages: {totalPages}
          </p>
        </div>
        <Link href="/admin/jobs/create">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Post New Job
          </Button>
        </Link>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Job Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Reward</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="animate-spin mr-2 text-indigo-600" />
                    <span>Loading jobs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : jobs.length > 0 ? (
              jobs.map((job: any) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{job.category}</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-indigo-600">
                    ৳ {job.reward}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        job.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100"
                      }
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* shadcn AlertDialog for Delete */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <div className="flex items-center gap-2 text-rose-600">
                            <AlertTriangle size={20} />
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                          </div>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the job &quot;
                            <span className="font-semibold text-slate-900">
                              {job.title}
                            </span>
                            &quot; and remove all related data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(job._id)}
                            className="bg-rose-600 hover:bg-rose-700"
                          >
                            {isDeleting ? "Deleting..." : "Delete Job"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-40 text-center text-slate-400"
                >
                  No jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
          <p className="text-sm text-slate-500 font-medium">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages || loading}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
