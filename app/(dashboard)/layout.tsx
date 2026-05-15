import { DashboardNavbar } from "@/components/dashboard/Navbar";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNavbar />
      <div className="flex">
        {/* Desktop Sidebar (Always Visible on PC) */}
        <aside className="hidden md:block w-64 bg-white border-r fixed h-[calc(100vh-64px)] overflow-y-auto">
          <DashboardSidebar />
        </aside>

        {/* Main Content (Shifted on PC to make room for Sidebar) */}
        <main className="flex-1 md:pl-72 p-6 md:p-10 pb-24 md:pb-12 bg-[#020617] min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
