"use client";

import React, { useEffect, useState } from "react";
import {
  PlayCircle,
  AppWindow,
  FileText,
  ChevronRight,
  Clock,
  SquareFunction,
} from "lucide-react";
import { toast } from "sonner";

export default function TasksPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        const result = await res.json();
        if (result.success) setJobs(result.data);
      } catch (error) {
        toast.error("Error loading tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "YouTube":
        return <PlayCircle className="text-red-500" />;
      case "Facebook":
        return <SquareFunction className="text-blue-600" />;
      case "App":
        return <AppWindow className="text-purple-600" />;
      default:
        return <FileText className="text-slate-500" />;
    }
  };

  if (loading)
    return <div className="p-8 text-center font-medium">Loading Tasks...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Available Tasks
        </h1>
        <p className="text-slate-500 text-sm">
          Complete simple tasks and earn money instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.length > 0 ? (
          jobs.map((job: any) => (
            <div
              key={job._id}
              className="bg-white p-5 rounded-2xl border border-slate-100 hover:shadow-md transition group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                    {getCategoryIcon(job.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> 2 mins
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        {job.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-emerald-600">
                    ৳{job.reward}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                    Per Task
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-4 border-slate-50">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mr-10">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{
                      width: `${(job.completedCount / job.totalVacancies) * 100}%`,
                    }}
                  ></div>
                </div>
                <button className="flex items-center gap-1 text-sm font-bold text-blue-600 whitespace-nowrap">
                  Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-dashed text-slate-400">
            No tasks available at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
