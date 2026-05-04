"use client";

import { useSession } from "next-auth/react";
import {
  Wallet,
  CheckCircle,
  Users,
  ArrowUpRight,
  PlayCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  const stats = [
    {
      label: "Current Balance",
      value: "৳ 250.00",
      icon: Wallet,
      color: "bg-blue-600",
      textColor: "text-blue-600",
      lightColor: "bg-blue-50",
    },
    {
      label: "Tasks Completed",
      value: "12",
      icon: CheckCircle,
      color: "bg-emerald-600",
      textColor: "text-emerald-600",
      lightColor: "bg-emerald-50",
    },
    {
      label: "Total Referrals",
      value: "08",
      icon: Users,
      color: "bg-purple-600",
      textColor: "text-purple-600",
      lightColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back,{" "}
          <span className="text-blue-600">{session?.user?.name || "User"}</span>
          !
        </h1>
        <p className="text-slate-500">Ready to earn some extra cash today?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {stat.value}
              </h3>
            </div>
            <div className={`${stat.lightColor} p-4 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action: Start Working */}
      <div className="bg-linear-to-r from-indigo-600 to-blue-700 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg shadow-blue-200">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold font-poppins">
            Earn by Watching Videos
          </h2>
          <p className="text-blue-100">
            Get ৳ 5.00 for every video you watch completely.
          </p>
        </div>
        <button className="mt-6 md:mt-0 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all flex items-center gap-2">
          Start Earning Now <ArrowUpRight className="w-5 h-5" />
        </button>
      </div>

      {/* Recent Activity or Tasks Preview */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">
            Available High-Paying Tasks
          </h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">
            View All
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {/* Example Task Row */}
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-6 flex items-center justify-between hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                  <PlayCircle className="text-red-500 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm md:text-base">
                    Subscribe to YouTube Channel
                  </h4>
                  <p className="text-xs text-slate-400">
                    Takes 2 minutes • Verified Client
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-600 font-bold text-lg">৳ 3.50</p>
                <button className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
