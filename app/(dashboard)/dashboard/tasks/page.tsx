import TasksClientView from "@/components/dashboard/tasks/TasksClientView";
import { Metadata } from "next";

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
  return <TasksClientView />;
}
