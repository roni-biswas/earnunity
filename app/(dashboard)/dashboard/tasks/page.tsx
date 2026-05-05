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
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
              onClick={() => router.push(`/dashboard/tasks/${job._id}`)} // Full card click logic
              className="bg-white p-5 rounded-2xl border border-slate-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 group cursor-pointer relative overflow-hidden"
            >
              {/* Hover Shine Effect (Optional - adds premium feel) */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-indigo-50/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="flex items-start justify-between relative z-10">
                <div className="flex gap-4">
                  {/* Icon Container */}
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/50 transition-colors">
                    {getCategoryIcon(job.category)}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className="flex items-center gap-1 font-semibold text-slate-400">
                        <Clock className="w-3 h-3" /> 2 mins
                      </span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase">
                        {job.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reward Section */}
                <div className="text-right">
                  <p className="text-xl font-black text-emerald-600">
                    ৳{job.reward}
                  </p>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">
                    Per Task
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t pt-5 border-slate-50 relative z-10">
                {/* Progress Labels */}
                <div className="flex justify-between items-end mb-2.5">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Availability
                    </p>
                    <p className="text-sm font-black text-slate-700">
                      {job.totalVacancies - (job.completedCount || 0)}{" "}
                      <span className="text-slate-400 font-medium text-xs">
                        Left
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg inline-block">
                      {Math.round(
                        ((job.completedCount || 0) / job.totalVacancies) * 100,
                      )}
                      % Filled
                    </p>
                  </div>
                </div>

                {/* Progress Bar & CTA */}
                <div className="flex items-center gap-5">
                  <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-linear-to-r from-indigo-500 to-blue-400 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(99,102,241,0.3)]"
                      style={{
                        width: `${((job.completedCount || 0) / job.totalVacancies) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1 text-sm font-black text-indigo-600 group-hover:gap-2 transition-all">
                    Details
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </div>
                </div>
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
