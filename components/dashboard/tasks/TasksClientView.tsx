"use client";

import React, { useEffect, useState } from "react";
import {
  PlayCircle,
  AppWindow,
  FileText,
  ChevronRight,
  Clock,
  SquareFunction,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export default function TasksClientView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1");
  const limit = 6;

  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/jobs?page=${currentPage}&limit=${limit}`);
        const result = await res.json();
        if (result.success) setData(result);
      } catch (error) {
        toast.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchAllJobs();
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/tasks?page=${newPage}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "YouTube":
        return <PlayCircle className="text-rose-500" />;
      case "Facebook":
        return <SquareFunction className="text-blue-500" />;
      case "App":
        return <AppWindow className="text-violet-500" />;
      default:
        return <FileText className="text-slate-400" />;
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tight">
            Missions
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Complete tasks to unlock instant rewards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.data?.length > 0 ? (
          data.data.map((job: any) => (
            <div
              key={job._id}
              onClick={() => router.push(`/dashboard/tasks/${job._id}`)}
              className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 hover:border-indigo-500/50 transition-all duration-300 group cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/50 transition-all">
                    {getCategoryIcon(job.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors text-lg">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-[11px] font-bold">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" /> 2 MINS
                      </span>
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] uppercase">
                        {job.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-400">
                    ৳{job.reward}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                    Reward
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-slate-800 pt-6">
                <div className="flex justify-between items-end mb-3">
                  <p className="text-sm font-bold text-slate-300">
                    {job.totalVacancies - job.completedCount}{" "}
                    <span className="text-slate-500 font-medium text-xs tracking-tight uppercase">
                      Spots Left
                    </span>
                  </p>
                  <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">
                    {Math.round(
                      (job.completedCount / job.totalVacancies) * 100,
                    )}
                    % FILLED
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${(job.completedCount / job.totalVacancies) * 100}%`,
                      }}
                    />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-900/20 border border-dashed border-slate-800 rounded-[2.5rem]">
            <p className="text-slate-500 font-bold italic">
              No active missions available.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Nav */}
      {data?.pagination?.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            title="Next button"
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 disabled:opacity-20 hover:text-white transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {[...Array(data.pagination.totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-900/50 border border-slate-800 text-slate-500 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === data.pagination.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            title="Increase page"
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 disabled:opacity-20 hover:text-white transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
