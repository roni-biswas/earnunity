import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WithdrawRecord {
  id: string;
  amount: number;
  method: string;
  accountNumber: string;
  status: "pending" | "completed" | "rejected";
  date: string;
}

export default function WithdrawHistory({
  records,
}: {
  records: WithdrawRecord[];
}) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-600">
        <p className="text-sm font-bold italic">No withdrawal history found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((item) => (
        <div
          key={item.id}
          className="group flex items-center justify-between p-5 bg-slate-800/20 border border-slate-800/50 rounded-2xl hover:border-slate-700 transition-all"
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "p-3 rounded-xl",
                item.status === "completed"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : item.status === "rejected"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-amber-500/10 text-amber-500",
              )}
            >
              {item.status === "completed" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : item.status === "rejected" ? (
                <XCircle className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-tight">
                {item.method} Payout
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {item.accountNumber} • {item.date}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-white italic">
              ৳{item.amount}
            </p>
            <span
              className={cn(
                "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                item.status === "completed"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : item.status === "rejected"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-amber-500/10 text-amber-400",
              )}
            >
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
