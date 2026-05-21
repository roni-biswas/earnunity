import NotificationsClientView from "@/components/dashboard/notifications/NotificationsClientView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
  description:
    "Stay updated with real-time system alerts, task approvals, rejection logs, and referral network updates on EarnUnity.",
  // User Security notification page, so prevent Google indexing if required
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotificationsPage() {
  return <NotificationsClientView />;
}
