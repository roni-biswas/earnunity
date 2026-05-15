import { z } from "zod";

export const DashboardOverviewSchema = z.object({
  stats: z.object({
    balance: z.number(),
    completedTasks: z.number(),
    referrals: z.number(),
    totalWithdraw: z.number(),
    todayAvailableTasks: z.number(),
    referralCode: z.string(),
  }),
  activities: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      amount: z.number(),
      status: z.string(),
      date: z.string(),
    }),
  ),
});

export type DashboardOverviewData = z.infer<typeof DashboardOverviewSchema>;
