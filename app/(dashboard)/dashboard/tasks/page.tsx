import TasksClientView from "@/components/dashboard/tasks/TasksClientView";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Missions & Tasks",
  description:
    "Browse and complete active micro-tasks on EarnUnity. Unlock instant rewards by completing YouTube, Facebook, and App verification missions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-xs font-black uppercase tracking-widest text-slate-500 animate-pulse">
          Loading Tasks Engine...
        </div>
      }
    >
      <TasksClientView />
    </Suspense>
  );
}
