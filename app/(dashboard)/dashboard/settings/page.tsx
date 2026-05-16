export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import SecuritySettings from "@/components/dashboard/SecuritySettings";
import DeviceStatus from "@/components/dashboard/DeviceStatus";

export const metadata: Metadata = {
  title: "Account Settings | EarnUnity",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect("/login");
  }

  await connectDB();
  const user = await User.findById(session.user.id);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-black uppercase italic text-white tracking-tight">
          Account System Settings
        </h2>
        <p className="text-xs text-slate-500">
          Manage your profile updates, secure assets, and verify authorization
          metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 space-y-6">
          <ProfileSettings initialName={user.name} initialImage={user.image} />
          <DeviceStatus deviceId={user.deviceId} />
        </div>

        <div className="lg:col-span-6">
          <SecuritySettings />
        </div>
      </div>
    </div>
  );
}
