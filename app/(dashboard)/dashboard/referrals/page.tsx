export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Metadata } from "next";
import { headers } from "next/headers";
import { getOverviewData } from "@/lib/data-fetch";
import ReferralCard from "@/components/dashboard/ReferralCard";
import PaginationControl from "@/components/dashboard/PaginationControl";
import { Users, Coins, Clock, UserCheck, Calendar } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Network Referrals | EarnUnity",
};

interface PopulatedUser {
  _id: string;
  name: string;
  image?: string;
  createdAt: string;
}

interface ReferralLogItem {
  _id: string;
  referredUserId: PopulatedUser | null;
  rewardAmount: number;
  status: "active" | "inactive";
}

interface ReferralStatsData {
  totalJoined: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingReferrals: number;
}

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ReferralsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  const overviewData = await getOverviewData();
  const dynamicUserCode = overviewData?.stats.referralCode || "user";

  const requestHeaders = await headers();
  const host = requestHeaders.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;
  const cookie = requestHeaders.get("cookie") || "";

  const [statsRes, listRes] = await Promise.all([
    fetch(`${baseUrl}/api/referrals/stats`, {
      cache: "no-store",
      headers: { cookie },
    }),
    fetch(`${baseUrl}/api/referrals/list?page=${currentPage}&limit=10`, {
      cache: "no-store",
      headers: { cookie },
    }),
  ]);

  const statsJson = await statsRes.json();
  const listJson = await listRes.json();

  const stats: ReferralStatsData = statsJson.success
    ? statsJson.data
    : {
        totalJoined: 0,
        activeReferrals: 0,
        totalEarnings: 0,
        pendingReferrals: 0,
      };

  const logs: ReferralLogItem[] = listJson.success ? listJson.data : [];
  const totalPages = listJson.success ? listJson.pagination.totalPages : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6">
          <ReferralCard referralCode={dynamicUserCode} />
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <Users className="w-5 h-5 text-indigo-400" />
            <div className="mt-4">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                Total Invited
              </p>
              <h3 className="text-2xl font-black text-white italic">
                {stats.totalJoined}
              </h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <div className="mt-4">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                Active Members
              </p>
              <h3 className="text-2xl font-black text-white italic">
                {stats.activeReferrals}
              </h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <Clock className="w-5 h-5 text-amber-500" />
            <div className="mt-4">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                Pending Sync
              </p>
              <h3 className="text-2xl font-black text-white italic">
                {stats.pendingReferrals}
              </h3>
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <Coins className="w-5 h-5 text-indigo-500" />
            <div className="mt-4">
              <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
                Bonus Royalties
              </p>
              <h3 className="text-2xl font-black text-white italic">
                ৳{stats.totalEarnings.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
        <h3 className="text-lg font-black text-white uppercase italic mb-6">
          User Network Logs
        </h3>

        {logs.length === 0 ? (
          <p className="text-center py-12 text-xs font-bold text-slate-600 italic">
            No network logs found.
          </p>
        ) : (
          <div className="space-y-4">
            {logs.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-5 bg-slate-800/10 border border-slate-800/50 rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center">
                    {item.referredUserId?.image ? (
                      <Image
                        src={item.referredUserId.image}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Calendar className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {item.referredUserId?.name || "Network User"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-black">
                      {item.referredUserId?.createdAt
                        ? new Date(
                            item.referredUserId.createdAt,
                          ).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">
                    +৳{item.rewardAmount}
                  </p>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      item.status === "active"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8">
            <PaginationControl
              totalPages={totalPages}
              currentPage={currentPage}
              baseUrl="/dashboard/referrals"
            />
          </div>
        )}
      </div>
    </div>
  );
}
