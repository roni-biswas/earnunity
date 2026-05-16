export interface ReferredUser {
  name: string;
  image?: string;
  createdAt: string;
}

export interface ReferralLogItem {
  _id: string;
  referredUserId: ReferredUser | null;
  bonusAmount: number;
  status: "active" | "pending";
  createdAt: string;
}

export interface ReferralStatsData {
  totalJoined: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingReferrals: number;
}
