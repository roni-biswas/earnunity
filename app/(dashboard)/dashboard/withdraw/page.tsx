import { Metadata } from "next";
import { getWithdrawPageData } from "@/lib/data-fetch";
import WithdrawForm from "@/components/dashboard/WithdrawForm";
import WithdrawHistory from "@/components/dashboard/WithdrawHistory";
import { Wallet, History, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Withdraw Funds | EarnUnity",
};

export default async function WithdrawPage() {
  // Fetching balance and previous withdraw records
  const data = await getWithdrawPageData();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-3xl bg-Linear-to-br from-slate-900 to-indigo-950/20 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2 italic">
              Cash Out
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-medium">
              Manage your earnings and payout requests.
            </p>
          </div>

          {/* Stat Cards Container */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Available Balance */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center gap-4 w-full sm:min-w-50">
              <div className="p-3 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Available
                </p>
                <h2 className="text-xl font-black text-white italic">
                  ৳{data?.balance.toFixed(2)}
                </h2>
              </div>
            </div>

            {/* Pending Balance */}
            <div className="bg-amber-500/5 backdrop-blur-md border border-amber-500/10 p-5 rounded-2xl flex items-center gap-4 w-full sm:min-w-50">
              <div className="p-3 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/20 shrink-0">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-amber-500/60 tracking-widest">
                  Pending
                </p>
                <h2 className="text-xl font-black text-white italic">
                  ৳{data?.pendingBalance.toFixed(2)}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form (Takes 5 columns) */}
        <div className="lg:col-span-5">
          <WithdrawForm currentBalance={data?.balance || 0} />

          {/* Minimum Limit Notice */}
          <div className="mt-6 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              The minimum withdrawal amount is{" "}
              <span className="text-indigo-400 font-bold">100 BDT</span>.
              Requests are usually processed within 24 hours.
            </p>
          </div>
        </div>

        {/* Right Side: History (Takes 7 columns) */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 rounded-2xl">
                <History className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white italic uppercase leading-none">
                  Withdrawal History
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  Track your payouts
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/withdraw/history"
              className="text-[10px] font-black uppercase text-indigo-400 border-b border-indigo-400/30 hover:border-indigo-400 transition-all pb-0.5"
            >
              View All
            </Link>
          </div>

          <WithdrawHistory records={data?.history || []} />
        </div>
      </div>
    </div>
  );
}
