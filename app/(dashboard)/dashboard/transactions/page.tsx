import TransactionsClientView from "@/components/dashboard/transactions/TransactionsClientView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaction Ledger",
  description:
    "Monitor your micro-task income statement, referral commissions, and withdrawal payouts logs in real-time on EarnUnity.",

  robots: {
    index: false,
    follow: false,
  },
};

export default function TransactionsPage() {
  return <TransactionsClientView />;
}
