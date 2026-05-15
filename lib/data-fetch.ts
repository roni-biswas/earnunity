import { JobItem } from "@/types/jobs";
import {
  DashboardOverviewSchema,
  DashboardOverviewData,
} from "./validations/dashboard";

export async function getOverviewData(): Promise<DashboardOverviewData | null> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/user/overview`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) return null;

    const rawData = await response.json();
    const validatedData = DashboardOverviewSchema.safeParse(rawData);

    if (!validatedData.success) return null;
    return validatedData.data;
  } catch (error) {
    return null;
  }
}

// get available jobs

export async function getJobs(page: number = 1, limit: number = 6) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/jobs?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Fetch Jobs Error:", error);
    return null;
  }
}
