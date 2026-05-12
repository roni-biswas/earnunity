"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Briefcase, Loader2 } from "lucide-react";

interface AuditData {
  totalDisbursed: number;
  totalWithdrawn: number;
}

export default function AdminOverview() {
  const [audit, setAudit] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetching dynamic data from the backend API
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/admin/transactions/all");
        const result = await response.json();

        if (result.success) {
          // Setting audit data from the backend API response
          setAudit(result.audit);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-slate-500 font-medium">
          Loading Stats...
        </span>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Disbursed",
      amount: `৳ ${audit?.totalDisbursed || 0}`,
      description: "Total earnings distributed to users",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Actual Withdrawals",
      amount: `৳ ${audit?.totalWithdrawn || 0}`,
      description: "Amount users have successfully cashed out",
      icon: CreditCard,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Platform Liability",
      amount: `৳ ${(audit?.totalDisbursed || 0) - (audit?.totalWithdrawn || 0)}`,
      description: "Remaining balance in users' wallets",
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="border-none shadow-sm outline outline-slate-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-slate-500">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.amount}</div>
              <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for more detailed reports or charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 border-dashed border-2 flex flex-col items-center justify-center text-center">
          <h4 className="font-semibold text-slate-700">Earnings Report</h4>
          <p className="text-sm text-slate-400">
            Detailed earning analytics will appear here.
          </p>
        </Card>
        <Card className="p-6 border-dashed border-2 flex flex-col items-center justify-center text-center">
          <h4 className="font-semibold text-slate-700">Withdrawal Trends</h4>
          <p className="text-sm text-slate-400">
            Visualization of cash-out requests over time.
          </p>
        </Card>
      </div>
    </div>
  );
}
