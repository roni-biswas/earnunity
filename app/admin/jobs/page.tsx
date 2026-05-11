"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    const res = await fetch("/api/admin/jobs");
    const result = await res.json();
    if (result.success) setJobs(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    const res = await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Job deleted successfully");
      setJobs(jobs.filter((job: any) => job._id !== id));
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job: any) => (
          <div
            key={job._id}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${job.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
              >
                {job.status}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(job._id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">
              {job.title}
            </h3>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Users size={14} /> {job.completedCount}/{job.totalVacancies}
              </div>
              <div className="flex items-center gap-1 font-bold text-blue-600">
                <DollarSign size={14} /> {job.reward}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                ID: {job._id.slice(-6)}
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

      {jobs.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed text-gray-400">
          No jobs found. Start by posting one!
        </div>
      )}
    </div>
  );
}
