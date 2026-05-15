import { Metadata } from "next";
import Link from "next/link";
import {
  Wallet,
  CheckSquare,
  Users,
  CreditCard,
  ArrowUpRight,
  Zap,
  Clock,
} from "lucide-react";
import { getOverviewData } from "@/lib/data-fetch";
import ReferralCard from "@/components/dashboard/ReferralCard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard Overview | EarnUnity",
};

export default async function OverviewPage() {
  const data = await getOverviewData();

  const stats = [
    {
      label: "Current Balance",
      value: `$${data?.stats.balance.toFixed(2) || "0.00"}`,
      icon: Wallet,
      color: "from-blue-600 to-indigo-600",
    },
    {
      label: "Tasks Done",
      value: data?.stats.completedTasks || 0,
      icon: CheckSquare,
      color: "from-emerald-600 to-teal-600",
    },
    {
      label: "Referral Earn",
      value: `$${data?.stats.referrals || 0}`,
      icon: Users,
      color: "from-purple-600 to-violet-600",
    },
    {
      label: "Total Withdraw",
      value: `$${data?.stats.totalWithdraw.toFixed(2) || "0.00"}`,
      icon: CreditCard,
      color: "from-rose-600 to-orange-600",
    },
  ];

  const referralLink = `earnunity.com/ref/${data?.stats.referralCode || "user"}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 p-8 md:p-10 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
            Welcome Back!
          </h1>
          <p className="text-slate-400 text-sm md:text-base mb-6 font-medium">
            You have{" "}
            <span className="text-indigo-400 font-bold">
              {data?.stats.todayAvailableTasks || 0}
            </span>{" "}
            tasks available today.
          </p>
          <Link
            href="/dashboard/tasks"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg text-sm"
          >
            <Zap className="w-4 h-4 fill-current" /> Explore Missions
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/30 transition-all"
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                item.color,
              )}
            >
              <item.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              {item.label}
            </p>
            <h3 className="text-2xl font-black text-white mt-1">
              {item.value}
            </h3>
          </div>
        ))}
      </section>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activities */}
        <div className="lg:col-span-2 bg-slate-900/20 border border-slate-800 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" /> Recent Activities
            </h4>
            <Link
              href="/dashboard/transactions"
              className="text-xs font-bold text-indigo-400 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {data?.activities && data.activities.length > 0 ? (
              data.activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-slate-800/50"
                >
                  <div className="flex items-center gap-4">
                    <ArrowUpRight className="w-4 h-4 text-indigo-400" />
                    <div>
                      <p className="text-sm font-bold text-white">
                        {activity.title}
                      </p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-400">
                      +${activity.amount.toFixed(2)}
                    </p>
                    <p className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">
                      {activity.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-slate-600 text-sm font-bold italic">
                No activity yet.
              </p>
            )}
          </div>
        </div>

        {/* Client Component */}
        <ReferralCard link={referralLink} />
      </div>
    </div>
  );
}
