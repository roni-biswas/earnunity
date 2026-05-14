"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  Wallet,
  CheckCircle,
  Users,
  ArrowUpRight,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";

// Define the interface for dashboard stats
interface DashboardStats {
  balance: number;
  completedTasks: number;
  referrals: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dynamic stats from backend API
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("/api/user/stats"); // Your actual API endpoint
        const data = await response.json();
        if (data.success) {
          setStatsData(data.stats);
        }
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    {
      label: "Current Balance",
      value: loading ? "..." : `৳ ${statsData?.balance?.toFixed(2) || "0.00"}`,
      icon: Wallet,
      textColor: "text-blue-600",
      lightColor: "bg-blue-50",
    },
    {
      label: "Tasks Completed",
      value: loading ? "..." : statsData?.completedTasks || "0",
      icon: CheckCircle,
      textColor: "text-emerald-600",
      lightColor: "bg-emerald-50",
    },
    {
      label: "Total Referrals",
      value: loading ? "..." : statsData?.referrals || "0",
      icon: Users,
      textColor: "text-purple-600",
      lightColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. Header Section - Personalized & Accessible */}
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back,{" "}
          <span className="text-blue-600 capitalize">
            {session?.user?.name?.split(" ")[0] || "User"}
          </span>
          !
        </h1>
        <p className="text-slate-500 font-medium">
          Ready to boost your earnings today?
        </p>
      </header>

      {/* 2. Stats Grid - Responsive & Polished */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
          >
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black text-slate-800">
                {stat.value}
              </h3>
            </div>
            <div
              className={`${stat.lightColor} p-4 rounded-2xl group-hover:scale-110 transition-transform`}
            >
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Hero Action Card - High Conversion Design */}
      <div className="relative overflow-hidden bg-linear-to-br from-indigo-600 via-blue-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-200">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
              Limited Offer
            </span>
            <h2 className="text-2xl md:text-4xl font-black">
              Earn by Watching Videos
            </h2>
            <p className="text-blue-100 max-w-md">
              Watch premium ads and get instant{" "}
              <span className="font-bold text-white underline decoration-yellow-400">
                ৳ 5.00
              </span>{" "}
              added to your wallet.
            </p>
          </div>
          <Link href="/dashboard/tasks/video">
            <button className="bg-white text-blue-700 font-bold px-10 py-5 rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-3 shadow-lg hover:scale-105 active:scale-95">
              Start Earning <ArrowUpRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* 4. Task List - Clean & Functional */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 uppercase tracking-tight">
            High-Paying Tasks
          </h3>
          <Link
            href="/dashboard/tasks"
            className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-4 py-2 rounded-xl transition"
          >
            See All Tasks
          </Link>
        </div>
        <div className="divide-y divide-slate-50">
          {/* Dynamic mapping would happen here */}
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition group"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <PlayCircle className="text-red-500 w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition">
                    Subscribe to YouTube Channel
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">
                      2 MINS
                    </span>
                    <span className="text-[10px] bg-green-100 px-2 py-0.5 rounded text-green-600 font-bold">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-emerald-600 font-black text-xl tracking-tighter">
                  ৳ 3.50
                </p>
                <button className="text-xs bg-blue-600 text-white px-5 py-2 rounded-xl font-bold shadow-md shadow-blue-100 opacity-0 group-hover:opacity-100 transition-all">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
