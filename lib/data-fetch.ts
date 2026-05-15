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
