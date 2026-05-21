"use client";

import React, { useState, useEffect } from "react";
import {
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Loader2,
  Coins,
  TrendingUp,
  Wallet,
  Zap,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ITransaction {
  _id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

interface ISummary {
  totalEarned: number;
  totalWithdrawn: number;
  taskEarnings: number;
  referralEarnings: number;
  netBalance: number;
}

export default function TransactionsClientView() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [summary, setSummary] = useState<ISummary | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // Pagination & Filter States
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("all"); // 'all' | 'income' | 'expense'

  const LIMIT = 10;

  // 1. Fetch Summary Data
  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch("/api/transactions/summary");
      const data = await res.json();

      if (data.success && data.data) {
        setSummary(data.data);
      } else {
        console.error("Summary fetch unsuccessful:", data.message);
        toast.error(data.message || "Summary data format mismatch");
      }
    } catch (error) {
      console.error("Summary API Crash:", error);
      toast.error("Failed to connect to Summary API");
    } finally {
      setLoadingSummary(false);
    }
  };

  // 2. Fetch Paginated History Data
  const fetchTransactions = async (
    pageNumber: number,
    filterType: string,
    append = false,
  ) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(
        `/api/transactions/my-history?page=${pageNumber}&limit=${LIMIT}`,
      );
      const data = await res.json();

      if (data.success) {
        let fetchedData = data.data || [];

        // Client-side filtering based on tab selection
        if (filterType !== "all") {
          fetchedData = fetchedData.filter(
            (tx: ITransaction) => tx.type === filterType,
          );
        }

        if (append) {
          setTransactions((prev) => [...prev, ...fetchedData]);
        } else {
          setTransactions(fetchedData);
        }

        if (data.pagination) {
          setHasMore(pageNumber < data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error("Transaction fetch failed:", error);
      toast.error("Failed to sync transaction logs");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load and filter sync
  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    setPage(1);
    fetchTransactions(1, activeTab, false);
  }, [activeTab]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage, activeTab, true);
  };

  return (
    <div className="w-full mx-auto text-slate-100 space-y-6">
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" /> Transaction Ledger
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Monitor your summary statistics and granular asset history.
          </p>
        </div>

        {/* --- Tab Filters --- */}
        <div className="flex bg-[#0b0f1a] border border-slate-800 p-1 rounded-xl self-start sm:self-center overflow-x-auto max-w-full scrollbar-none">
          {["all", "income", "expense"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 whitespace-nowrap",
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200",
              )}
            >
              {tab === "expense" ? "Payouts" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- Summary Cards Grid --- */}
      {loadingSummary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="h-24 bg-slate-900/40 border border-slate-800 rounded-xl"
            />
          ))}
        </div>
      ) : (
        summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Earned */}
            <div className="p-4 rounded-xl border border-slate-900 bg-[#0b0f1a]/30 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">Total Earned</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xl md:text-2xl font-bold tracking-tight text-white">
                ৳{summary.totalEarned}
              </p>
            </div>

            {/* Total Payouts */}
            <div className="p-4 rounded-xl border border-slate-900 bg-[#0b0f1a]/30 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">Total Paid Out</span>
                <Wallet className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-xl md:text-2xl font-bold tracking-tight text-white">
                ৳{summary.totalWithdrawn}
              </p>
            </div>

            {/* Task Earnings */}
            <div className="p-4 rounded-xl border border-slate-900 bg-[#0b0f1a]/30 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">Task Earnings</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl md:text-2xl font-bold tracking-tight text-white">
                ৳{summary.taskEarnings}
              </p>
            </div>

            {/* Referral Commissions */}
            <div className="p-4 rounded-xl border border-slate-900 bg-[#0b0f1a]/30 space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">
                  Referral Commissions
                </span>
                <Users className="w-4 h-4 text-cyan-500" />
              </div>
              <p className="text-xl md:text-2xl font-bold tracking-tight text-white">
                ৳{summary.referralEarnings}
              </p>
            </div>
          </div>
        )
      )}

      {/* --- History Feed Section --- */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-xs text-slate-500 animate-pulse">
            Syncing ledger records...
          </p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/20 border border-slate-800/60 rounded-xl p-6">
          <Coins className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400 font-medium">
            No transactions logged
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Activities matching the selected scope will display here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const isIncome = tx.type === "income";
            return (
              <div
                key={tx._id}
                className="p-4 rounded-xl border border-slate-900 bg-[#0b0f1a]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-all hover:border-slate-800 hover:bg-slate-900/20"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div
                    className={cn(
                      "p-2.5 rounded-xl border shrink-0 mt-0.5 sm:mt-0",
                      isIncome
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/20 text-rose-400",
                    )}
                  >
                    {isIncome ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-md">
                        {tx.category || "General"}
                      </span>
                      <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(tx.createdAt).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-200 wrap-break-word sm:truncate max-w-full sm:max-w-xs md:max-w-xl">
                      {tx.description}
                    </p>
                  </div>
                </div>

                {/* Amount and Balance Grid */}
                <div className="flex items-center justify-between border-t border-slate-800/50 pt-2 sm:pt-0 sm:border-none sm:block text-left sm:text-right shrink-0 pl-14 sm:pl-0 space-y-0.5">
                  <span className="text-xs text-slate-500 sm:hidden">
                    Amount / Balance
                  </span>
                  <div className="sm:text-right">
                    <p
                      className={cn(
                        "text-base sm:text-sm font-bold tracking-tight",
                        isIncome ? "text-emerald-400" : "text-rose-400",
                      )}
                    >
                      {isIncome ? "+" : "-"} ৳{tx.amount}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Balance: ৳{tx.balanceAfter}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* --- Pagination Load More --- */}
          {hasMore && (
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full sm:w-auto px-5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    Loading transactions...
                  </>
                ) : (
                  "Load more history"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
