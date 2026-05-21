import { Metadata } from "next";
import { getAllWithdrawHistory } from "@/lib/data-fetch";
import WithdrawHistory from "@/components/dashboard/WithdrawHistory";
import PaginationControl from "@/components/dashboard/PaginationControl";
import { ArrowLeft, ReceiptText } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Withdrawal History",
  description:
    "View and track all your past payout requests on EarnUnity. Monitor the status of your bKash, Nagad, or Rocket withdrawal transactions in real-time.",
  // Private Dashboard page, so prevent Google indexing if required
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Page to display all withdrawal requests with pagination
 */
export default async function AllWithdrawHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Await searchParams for compatibility with latest Next.js
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const itemsPerPage = 10;

  const { history, totalPages, totalCount } = await getAllWithdrawHistory(
    currentPage,
    itemsPerPage,
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header section with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/withdraw"
            className="p-3 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-700 transition-all text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white italic uppercase tracking-tight">
              Transaction History
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Showing {history.length} of {totalCount} total requests
            </p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-500/10 rounded-2xl">
            <ReceiptText className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase italic">
              Payout Logs
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Historical Data
            </p>
          </div>
        </div>

        {/* The List Component */}
        <WithdrawHistory records={history} />

        {/* Pagination Section */}
        <PaginationControl
          totalPages={totalPages}
          currentPage={currentPage}
          baseUrl="/dashboard/withdraw/history"
        />
      </div>
    </div>
  );
}
